import { auth } from "@/lib/auth";
import { fail } from "@/lib/api-response";

const ADMIN_ROLES = new Set(["ADMIN", "SUPER_ADMIN"]);

export async function getRequestSession(request) {
  return auth.api.getSession({
    headers: request.headers,
  });
}

export async function requireAdmin(request) {
  const session = await getRequestSession(request);

  if (!session?.user) {
    return {
      error: fail("Authentication required", 401),
    };
  }

  if (!ADMIN_ROLES.has(session.user.role)) {
    return {
      error: fail("Admin role required", 403),
    };
  }

  return { session };
}

export async function requireSuperAdmin(request) {
  const session = await getRequestSession(request);

  if (!session?.user) {
    return {
      error: fail("Authentication required", 401),
    };
  }

  if (session.user.role !== "SUPER_ADMIN") {
    return {
      error: fail("Super admin role required", 403),
    };
  }

  return { session };
}
