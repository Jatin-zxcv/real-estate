import { z } from "zod";

const optionalText = (max = 255) =>
  z.preprocess(
    (value) => {
      if (typeof value !== "string") return value;
      const trimmed = value.trim();
      return trimmed.length === 0 ? undefined : trimmed;
    },
    z.string().max(max).optional()
  );

const optionalDate = z.preprocess(
  (value) => {
    if (value === "" || value === null || value === undefined) {
      return undefined;
    }
    return value;
  },
  z.coerce.date().optional()
);

const blogBaseSchema = z.object({
  title: z.string().trim().min(3).max(180),
  slug: optionalText(220),
  content: z.string().trim().min(20),
  excerpt: optionalText(300),
  thumbnail: z
    .preprocess(
      (value) => {
        if (typeof value !== "string") return value;
        const trimmed = value.trim();
        return trimmed.length === 0 ? undefined : trimmed;
      },
      z.string().url().optional()
    )
    .optional(),
  author: optionalText(120),
  category: optionalText(120),
  readTime: optionalText(40),
  published: z.boolean().optional().default(false),
  publishedAt: optionalDate,
});

export const blogCreateSchema = blogBaseSchema;

export const blogUpdateSchema = blogBaseSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });
