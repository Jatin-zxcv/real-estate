import { prisma } from "@/lib/db";
import { fail, getPagination, ok } from "@/lib/api-response";
import { requireAdmin } from "@/lib/server-auth";
import { slugify } from "@/lib/slugify";
import { propertyCreateSchema } from "@/lib/validators/property";

export const runtime = "nodejs";

function toPropertyCreateData(input) {
  return {
    title: input.title,
    slug: input.slug || slugify(input.title),
    description: input.description,
    shortDescription: input.shortDescription,
    price: input.price,
    category: input.category,
    subcategory: input.subcategory,
    status: input.status,
    address: input.address,
    city: input.city,
    state: input.state,
    pincode: input.pincode,
    area: input.area,
    bedrooms: input.bedrooms ?? null,
    bathrooms: input.bathrooms ?? null,
    amenities: input.amenities || [],
    images: input.images || [],
    thumbnail: input.thumbnail || input.images?.[0] || null,
    featured: input.featured ?? false,
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = getPagination(searchParams, {
      defaultLimit: 9,
      maxLimit: 50,
    });

    const category = searchParams.get("category") || undefined;
    const status = searchParams.get("status") || undefined;
    const featured = searchParams.get("featured");
    const query = searchParams.get("q") || undefined;

    const where = {
      ...(category ? { category } : {}),
      ...(status ? { status } : {}),
      ...(featured === "true" ? { featured: true } : {}),
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { city: { contains: query, mode: "insensitive" } },
              { subcategory: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [items, total] = await prisma.$transaction([
      prisma.property.findMany({
        where,
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.property.count({ where }),
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
    return fail("Failed to fetch properties", 500, error?.message);
  }
}

export async function POST(request) {
  const adminCheck = await requireAdmin(request);
  if (adminCheck.error) return adminCheck.error;

  try {
    const body = await request.json();
    const parsed = propertyCreateSchema.safeParse(body);

    if (!parsed.success) {
      return fail("Invalid property payload", 422, parsed.error.flatten());
    }

    const data = toPropertyCreateData(parsed.data);

    const created = await prisma.property.create({
      data,
    });

    return ok(created, 201);
  } catch (error) {
    if (error?.code === "P2002") {
      return fail("Property slug already exists", 409);
    }

    return fail("Failed to create property", 500, error?.message);
  }
}
