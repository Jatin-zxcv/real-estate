import { prisma } from "@/lib/db";
import { fail, ok } from "@/lib/api-response";
import { requireAdmin } from "@/lib/server-auth";
import { slugify } from "@/lib/slugify";
import { blogUpdateSchema } from "@/lib/validators/blog";

export const runtime = "nodejs";

async function findBlogBySlug(slug) {
  return prisma.blogPost.findUnique({ where: { slug } });
}

function toUpdateData(input) {
  const data = {};

  if (input.title !== undefined) data.title = input.title;
  if (input.slug !== undefined || input.title !== undefined) {
    data.slug = input.slug || slugify(input.title);
  }
  if (input.content !== undefined) data.content = input.content;
  if (input.excerpt !== undefined) data.excerpt = input.excerpt;
  if (input.thumbnail !== undefined) data.thumbnail = input.thumbnail;
  if (input.author !== undefined) data.author = input.author;
  if (input.category !== undefined) data.category = input.category;
  if (input.readTime !== undefined) data.readTime = input.readTime;

  if (input.published !== undefined) {
    data.published = input.published;
    data.publishedAt = input.published ? input.publishedAt || new Date() : null;
  } else if (input.publishedAt !== undefined) {
    data.publishedAt = input.publishedAt;
  }

  return data;
}

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const post = await findBlogBySlug(slug);

    if (!post) {
      return fail("Blog post not found", 404);
    }

    if (!post.published) {
      const adminCheck = await requireAdmin(request);
      if (adminCheck.error) return adminCheck.error;
    }

    return ok(post);
  } catch (error) {
    return fail("Failed to fetch blog post", 500, error?.message);
  }
}

export async function PUT(request, { params }) {
  const adminCheck = await requireAdmin(request);
  if (adminCheck.error) return adminCheck.error;

  try {
    const { slug } = await params;
    const existing = await findBlogBySlug(slug);

    if (!existing) {
      return fail("Blog post not found", 404);
    }

    const body = await request.json();
    const parsed = blogUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return fail("Invalid blog payload", 422, parsed.error.flatten());
    }

    const updated = await prisma.blogPost.update({
      where: { id: existing.id },
      data: toUpdateData(parsed.data),
    });

    return ok(updated);
  } catch (error) {
    if (error?.code === "P2002") {
      return fail("Blog slug already exists", 409);
    }

    return fail("Failed to update blog post", 500, error?.message);
  }
}

export async function DELETE(request, { params }) {
  const adminCheck = await requireAdmin(request);
  if (adminCheck.error) return adminCheck.error;

  try {
    const { slug } = await params;
    const existing = await findBlogBySlug(slug);

    if (!existing) {
      return fail("Blog post not found", 404);
    }

    await prisma.blogPost.delete({ where: { id: existing.id } });

    return ok({ slug, deleted: true });
  } catch (error) {
    return fail("Failed to delete blog post", 500, error?.message);
  }
}
