import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { fail, ok } from "@/lib/api-response";
import { adminBootstrapSchema } from "@/lib/validators/admin";

export const runtime = "nodejs";

export async function POST(request) {
  const bootstrapToken = process.env.ADMIN_BOOTSTRAP_TOKEN;

  if (!bootstrapToken) {
    return fail("ADMIN_BOOTSTRAP_TOKEN is not configured", 500);
  }

  const providedToken =
    request.headers.get("x-bootstrap-token") || request.headers.get("x-admin-bootstrap-token");

  if (providedToken !== bootstrapToken) {
    return fail("Invalid bootstrap token", 401);
  }

  try {
    const body = await request.json();
    const parsed = adminBootstrapSchema.safeParse(body);

    if (!parsed.success) {
      return fail("Invalid bootstrap payload", 422, parsed.error.flatten());
    }

    const { name, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });

    if (!existing) {
      await auth.api.signUpEmail({
        body: {
          name,
          email,
          password,
        },
        headers: request.headers,
      });
    }

    const updated = await prisma.user.update({
      where: { email },
      data: {
        role: "SUPER_ADMIN",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return ok(
      {
        message: existing
          ? "Existing user promoted to SUPER_ADMIN"
          : "Bootstrap admin created successfully",
        user: updated,
      },
      existing ? 200 : 201
    );
  } catch (error) {
    return fail("Failed to bootstrap admin", 500, error?.message);
  }
}
