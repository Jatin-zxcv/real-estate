import { z } from "zod";

export const propertyCategorySchema = z.enum([
  "RESIDENTIAL",
  "COMMERCIAL",
  "LAND",
  "RENTAL",
]);

export const propertyStatusSchema = z.enum([
  "AVAILABLE",
  "SOLD",
  "UNDER_CONSTRUCTION",
  "RENTED",
]);

const optionalText = (max = 255) =>
  z.preprocess(
    (value) => {
      if (typeof value !== "string") return value;
      const trimmed = value.trim();
      return trimmed.length === 0 ? undefined : trimmed;
    },
    z.string().max(max).optional()
  );

const optionalUrl = z.preprocess(
  (value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed.length === 0 ? undefined : trimmed;
  },
  z.string().url().optional()
);

const propertyBaseSchema = z.object({
  title: z.string().trim().min(3).max(160),
  slug: optionalText(180),
  description: z.string().trim().min(20).max(5000),
  shortDescription: optionalText(240),
  price: z.coerce.number().positive(),
  category: propertyCategorySchema,
  subcategory: optionalText(120),
  status: propertyStatusSchema.optional().default("AVAILABLE"),
  address: z.string().trim().min(3).max(240),
  city: z.string().trim().max(120).optional().default("Hisar"),
  state: z.string().trim().max(120).optional().default("Haryana"),
  pincode: optionalText(20),
  area: z.coerce.number().positive(),
  bedrooms: z.coerce.number().int().positive().optional().nullable(),
  bathrooms: z.coerce.number().int().positive().optional().nullable(),
  amenities: z.array(z.string().trim().min(1).max(120)).optional().default([]),
  images: z.array(z.string().url()).optional().default([]),
  thumbnail: optionalUrl,
  featured: z.boolean().optional().default(false),
});

export const propertyCreateSchema = propertyBaseSchema;

export const propertyUpdateSchema = propertyBaseSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });
