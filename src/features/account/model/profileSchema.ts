import { z } from "zod";
import { emailSchema, normalizeEmail } from "@/shared/model/email";
import { ukrainianPhoneSchema } from "@/shared/model/phone";

export const profileSchema = z.object({
  firstName: z.string().trim().min(1, "Введіть ім’я"),
  lastName: z.string().trim().min(1, "Введіть прізвище"),
  email: emailSchema,
  phone: ukrainianPhoneSchema,
});

export type ProfileFormValues = z.input<typeof profileSchema>;
export type ProfileValues = z.output<typeof profileSchema>;

export const didEmailChange = (previousEmail: string, updatedEmail: string) =>
  normalizeEmail(previousEmail) !== normalizeEmail(updatedEmail);
