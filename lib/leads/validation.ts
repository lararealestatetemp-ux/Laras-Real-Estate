import { z } from "zod";

const name = z.string().trim().min(1).max(80);
const email = z.string().trim().email().max(254);
const requiredPhone = z
  .string()
  .trim()
  .max(40)
  .refine((value) => value.replace(/\D/g, "").length >= 10, {
    message: "Phone number must contain at least 10 digits",
  });
const optionalPhone = z
  .string()
  .trim()
  .max(40)
  .refine(
    (value) =>
      value.length === 0 || value.replace(/\D/g, "").length >= 10,
    { message: "Phone number must contain at least 10 digits" },
  );
const message = z.string().trim().min(1).max(2000);
const company = z.string().max(200).default("");

export const sellerInputSchema = z.object({
  firstName: name,
  lastName: name,
  email,
  phone: requiredPhone,
  propertyAddress: z.string().trim().min(1).max(200),
  propertyType: z.enum(["house", "land", "commercial"]),
  askingPrice: z.string().trim().min(1).max(40),
  generalInfo: z.string().trim().min(1).max(2000),
  comments: z.string().trim().max(2000),
  company,
});

export const propertyInquiryInputSchema = z.object({
  firstName: name,
  lastName: name,
  email,
  phone: optionalPhone,
  message,
  company,
  propertySlug: z.string().regex(/^[a-z0-9-]+$/).max(200),
});

export const consultationInputSchema = z.object({
  firstName: name,
  lastName: name,
  email,
  phone: requiredPhone,
  message,
  company,
});

export const contactInputSchema = z.object({
  firstName: name,
  lastName: name,
  email,
  phone: optionalPhone,
  reason: z.enum(["sell", "property", "remodeling", "financing", "general"]),
  message,
  company,
});

export type SellerInput = z.infer<typeof sellerInputSchema>;
export type PropertyInquiryInput = z.infer<typeof propertyInquiryInputSchema>;
export type ConsultationInput = z.infer<typeof consultationInputSchema>;
export type ContactInput = z.infer<typeof contactInputSchema>;

export function validateSellerInput(input: unknown) {
  return sellerInputSchema.safeParse(input);
}

export function validatePropertyInquiryInput(input: unknown) {
  return propertyInquiryInputSchema.safeParse(input);
}

export function validateConsultationInput(input: unknown) {
  return consultationInputSchema.safeParse(input);
}

export function validateContactInput(input: unknown) {
  return contactInputSchema.safeParse(input);
}
