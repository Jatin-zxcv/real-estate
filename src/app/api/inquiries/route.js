import { prisma } from "@/lib/db";
import { fail, getPagination, ok } from "@/lib/api-response";
import { isRateLimited } from "@/lib/rate-limit";
import { requireAdmin } from "@/lib/server-auth";
import { inquiryCreateSchema } from "@/lib/validators/inquiry";

export const runtime = "nodejs";

function getRequestIp(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request) {
  try {
    const ipAddress = getRequestIp(request);
    const isBlocked = isRateLimited({
      key: `inquiry:${ipAddress}`,
      max: 8,
      windowMs: 60 * 60 * 1000,
    });

    if (isBlocked) {
      return fail("Too many inquiries submitted. Please try again later.", 429);
    }

    const body = await request.json();
    const parsed = inquiryCreateSchema.safeParse(body);

    if (!parsed.success) {
      return fail("Invalid inquiry payload", 422, parsed.error.flatten());
    }

    const { propertyId, ...payload } = parsed.data;

    let resolvedPropertyId = null;
    let propertyReference = null;

    if (propertyId) {
      const property = await prisma.property.findFirst({
        where: {
          OR: [{ id: propertyId }, { slug: propertyId }],
        },
        select: { id: true },
      });

      if (property) {
        resolvedPropertyId = property.id;
      } else {
        propertyReference = propertyId;
      }
    }

    const created = await prisma.inquiry.create({
      data: {
        ...payload,
        propertyId: resolvedPropertyId,
        propertyReference,
        subject: payload.subject || null,
        message: payload.message || null,
        ipAddress,
        userAgent: request.headers.get("user-agent") || null,
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

    return ok(created, 201);
  } catch (error) {
    return fail("Failed to submit inquiry", 500, error?.message);
  }
}

export async function GET(request) {
  const adminCheck = await requireAdmin(request);
  if (adminCheck.error) return adminCheck.error;

  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = getPagination(searchParams, {
      defaultLimit: 20,
      maxLimit: 100,
    });

    const status = searchParams.get("status") || undefined;
    const source = searchParams.get("source") || undefined;

    const where = {
      ...(status ? { status } : {}),
      ...(source ? { source } : {}),
    };

    const [items, total] = await prisma.$transaction([
      prisma.inquiry.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          property: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
      }),
      prisma.inquiry.count({ where }),
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
    return fail("Failed to fetch inquiries", 500, error?.message);
  }
}
