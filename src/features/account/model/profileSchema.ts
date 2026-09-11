import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().trim().min(1, "Введіть ім’я"),
  lastName: z.string().trim().min(1, "Введіть прізвище"),
  email: z.email("Введіть коректний email").transform((value) => value.trim().toLowerCase()),
  phone: z
    .string()
    .min(10, "Введіть номер телефону")
    .transform((value) => `+${value.replace(/\D/g, "")}`),
});

export type ProfileFormValues = z.input<typeof profileSchema>;
export type ProfileValues = z.output<typeof profileSchema>;

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const didEmailChange = (previousEmail: string, updatedEmail: string) =>
  normalizeEmail(previousEmail) !== normalizeEmail(updatedEmail);
