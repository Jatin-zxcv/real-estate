import { blogPosts } from "@/data/blog";
import { prisma } from "@/lib/db";
import { getAbsoluteUrl } from "@/lib/site";

export const runtime = "nodejs";
export const revalidate = 86400;

const staticRoutes = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/properties", changeFrequency: "daily", priority: 0.9 },
  { path: "/advice", changeFrequency: "weekly", priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
];

export default async function sitemap() {
  const propertyEntries = await prisma.property
    .findMany({
      select: {
        id: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    })
    .catch(() => []);

  const now = new Date();

  const blogEntries = blogPosts.map((post) => ({
    url: getAbsoluteUrl(`/advice/${post.slug}`),
    lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    ...staticRoutes.map((route) => ({
      url: getAbsoluteUrl(route.path),
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...propertyEntries.map((property) => ({
      url: getAbsoluteUrl(`/properties/${property.id}`),
      lastModified: property.updatedAt || now,
      changeFrequency: "weekly",
      priority: 0.7,
    })),
    ...blogEntries,
  ];
}