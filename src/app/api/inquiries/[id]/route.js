import { prisma } from "@/lib/db";
import { fail, ok } from "@/lib/api-response";
import { requireAdmin } from "@/lib/server-auth";
import { inquiryStatusSchema } from "@/lib/validators/inquiry";

export const runtime = "nodejs";

export async function PATCH(request, { params }) {
  const adminCheck = await requireAdmin(request);
  if (adminCheck.error) return adminCheck.error;

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = inquiryStatusSchema.safeParse(body);

    if (!parsed.success) {
      return fail("Invalid inquiry update payload", 422, parsed.error.flatten());
    }

    const existing = await prisma.inquiry.findUnique({ where: { id } });

    if (!existing) {
      return fail("Inquiry not found", 404);
    }

    const updated = await prisma.inquiry.update({
      where: { id },
      data: {
        status: parsed.data.status,
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    return ok(updated);
  } catch (error) {
    return fail("Failed to update inquiry", 500, error?.message);
  }
}
