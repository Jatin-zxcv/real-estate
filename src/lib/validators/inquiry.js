import { z } from "zod";

const indianPhoneRegex = /^(\+?91[\s-]?)?[6-9]\d{9}$/;

const optionalText = (max = 255) =>
  z.preprocess(
    (value) => {
      if (typeof value !== "string") return value;
      const trimmed = value.trim();
      return trimmed.length === 0 ? undefined : trimmed;
    },
    z.string().max(max).optional()
  );

export const inquiryCreateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  phone: z
    .string()
    .trim()
    .min(10)
    .max(20)
    .refine((value) => indianPhoneRegex.test(value.replace(/\s+/g, "")), {
      message: "Please enter a valid Indian phone number",
    }),
  subject: optionalText(140),
  message: optionalText(3000),
  propertyId: optionalText(180),
  source: z.enum(["CONTACT_FORM", "PROPERTY_DETAIL"]).optional().default("CONTACT_FORM"),
});

export const inquiryStatusSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "FOLLOW_UP", "CLOSED", "CONVERTED"]),
});
