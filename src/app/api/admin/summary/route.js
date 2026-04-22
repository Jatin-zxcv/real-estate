import { prisma } from "@/lib/db";
import { fail, ok } from "@/lib/api-response";
import { requireAdmin } from "@/lib/server-auth";

export const runtime = "nodejs";

export async function GET(request) {
  const adminCheck = await requireAdmin(request);
  if (adminCheck.error) return adminCheck.error;

  try {
    const [properties, inquiries, newInquiries, blogPosts, recentInquiries] = await Promise.all([
      prisma.property.count(),
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { status: "NEW" } }),
      prisma.blogPost.count(),
      prisma.inquiry.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          property: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      }),
    ]);

    return ok({
      counts: {
        properties,
        inquiries,
        newInquiries,
        blogPosts,
      },
      recentInquiries,
    });
  } catch (error) {
    return fail("Failed to load admin summary", 500, error?.message);
  }
}
