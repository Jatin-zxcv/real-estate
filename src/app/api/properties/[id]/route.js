import { prisma } from "@/lib/db";
import { fail, ok } from "@/lib/api-response";
import { requireAdmin } from "@/lib/server-auth";
import { slugify } from "@/lib/slugify";
import { propertyUpdateSchema } from "@/lib/validators/property";

export const runtime = "nodejs";

async function findPropertyByIdentifier(identifier) {
  return prisma.property.findFirst({
    where: {
      OR: [{ id: identifier }, { slug: identifier }],
    },
  });
}

function toPropertyUpdateData(input) {
  const data = {};

  if (input.title !== undefined) data.title = input.title;
  if (input.slug !== undefined || input.title !== undefined) {
    data.slug = input.slug || slugify(input.title);
  }
  if (input.description !== undefined) data.description = input.description;
  if (input.shortDescription !== undefined) data.shortDescription = input.shortDescription;
  if (input.price !== undefined) data.price = input.price;
  if (input.category !== undefined) data.category = input.category;
  if (input.subcategory !== undefined) data.subcategory = input.subcategory;
  if (input.status !== undefined) data.status = input.status;
  if (input.address !== undefined) data.address = input.address;
  if (input.city !== undefined) data.city = input.city;
  if (input.state !== undefined) data.state = input.state;
  if (input.pincode !== undefined) data.pincode = input.pincode;
  if (input.area !== undefined) data.area = input.area;
  if (input.bedrooms !== undefined) data.bedrooms = input.bedrooms;
  if (input.bathrooms !== undefined) data.bathrooms = input.bathrooms;
  if (input.amenities !== undefined) data.amenities = input.amenities;
  if (input.images !== undefined) data.images = input.images;
  if (input.thumbnail !== undefined) data.thumbnail = input.thumbnail;
  if (input.featured !== undefined) data.featured = input.featured;

  return data;
}

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const property = await findPropertyByIdentifier(id);

    if (!property) {
      return fail("Property not found", 404);
    }

    return ok(property);
  } catch (error) {
    return fail("Failed to fetch property", 500, error?.message);
  }
}

export async function PUT(request, { params }) {
  const adminCheck = await requireAdmin(request);
  if (adminCheck.error) return adminCheck.error;

  try {
    const { id } = await params;
    const existing = await findPropertyByIdentifier(id);

    if (!existing) {
      return fail("Property not found", 404);
    }

    const body = await request.json();
    const parsed = propertyUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return fail("Invalid property payload", 422, parsed.error.flatten());
    }

    const data = toPropertyUpdateData(parsed.data);

    const updated = await prisma.property.update({
      where: { id: existing.id },
      data,
    });

    return ok(updated);
  } catch (error) {
    if (error?.code === "P2002") {
      return fail("Property slug already exists", 409);
    }

    return fail("Failed to update property", 500, error?.message);
  }
}

export async function DELETE(request, { params }) {
  const adminCheck = await requireAdmin(request);
  if (adminCheck.error) return adminCheck.error;

  try {
    const { id } = await params;
    const existing = await findPropertyByIdentifier(id);

    if (!existing) {
      return fail("Property not found", 404);
    }

    await prisma.property.delete({ where: { id: existing.id } });

    return ok({ id: existing.id, deleted: true });
  } catch (error) {
    return fail("Failed to delete property", 500, error?.message);
  }
}
