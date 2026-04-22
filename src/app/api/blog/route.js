import { prisma } from "@/lib/db";
import { fail, getPagination, ok } from "@/lib/api-response";
import { requireAdmin } from "@/lib/server-auth";
import { slugify } from "@/lib/slugify";
import { blogCreateSchema } from "@/lib/validators/blog";

export const runtime = "nodejs";

function toCreateData(input) {
  return {
    title: input.title,
    slug: input.slug || slugify(input.title),
    content: input.content,
    excerpt: input.excerpt,
    thumbnail: input.thumbnail,
    author: input.author || "Sharma Real Estates",
    category: input.category,
    readTime: input.readTime,
    published: input.published,
    publishedAt: input.published ? input.publishedAt || new Date() : null,
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeDrafts = searchParams.get("includeDrafts") === "true";

    if (includeDrafts) {
      const adminCheck = await requireAdmin(request);
      if (adminCheck.error) return adminCheck.error;
    }

    const { page, limit, skip } = getPagination(searchParams, {
      defaultLimit: 9,
      maxLimit: 50,
    });

    const category = searchParams.get("category") || undefined;
    const query = searchParams.get("q") || undefined;

    const where = {
      ...(includeDrafts ? {} : { published: true }),
      ...(category ? { category } : {}),
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { excerpt: { contains: query, mode: "insensitive" } },
              { category: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [items, total] = await prisma.$transaction([
      prisma.blogPost.findMany({
        where,
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
    ]);

    return ok({
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    return fail("Failed to fetch blog posts", 500, error?.message);
  }
}

export async function POST(request) {
  const adminCheck = await requireAdmin(request);
  if (adminCheck.error) return adminCheck.error;

  try {
    const body = await request.json();
    const parsed = blogCreateSchema.safeParse(body);

    if (!parsed.success) {
      return fail("Invalid blog payload", 422, parsed.error.flatten());
    }

    const created = await prisma.blogPost.create({
      data: toCreateData(parsed.data),
    });

    return ok(created, 201);
  } catch (error) {
    if (error?.code === "P2002") {
      return fail("Blog slug already exists", 409);
    }

    return fail("Failed to create blog post", 500, error?.message);
  }
}
