import { z } from "zod";

export const emailAuthSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const phoneAuthSchema = z.object({
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?[1-9]\d{9,14}$/, "Please enter a valid phone number (e.g., +911234567890)"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type EmailAuthInput = z.infer<typeof emailAuthSchema>;
export type PhoneAuthInput = z.infer<typeof phoneAuthSchema>;
