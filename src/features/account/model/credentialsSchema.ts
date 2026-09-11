import { z } from "zod";

const MAX_PASSWORD_BYTES = 72;

const hasValidByteLength = (value: string) =>
  new TextEncoder().encode(value).length <= MAX_PASSWORD_BYTES;

const newPasswordSchema = z
  .string()
  .min(8, "Пароль має містити щонайменше 8 символів")
  .max(128, "Пароль має містити не більше 128 символів")
  .refine(hasValidByteLength, "Пароль має займати не більше 72 байтів UTF-8")
  .regex(/[A-Z]/, "Додайте щонайменше одну велику літеру")
  .regex(/[0-9]/, "Додайте щонайменше одну цифру")
  .regex(/[!@#$%^&*]/, "Додайте щонайменше один символ !@#$%^&*");

export const createPasswordSchema = z
  .object({
    login: z
      .string()
      .trim()
      .min(1, "Введіть login")
      .max(150, "Login має містити не більше 150 символів")
      .regex(/^[a-zA-Z0-9_]+$/, "Використовуйте лише латинські літери, цифри та _"),
    password: newPasswordSchema,
    confirmPassword: z.string().min(1, "Підтвердьте пароль"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Паролі не збігаються",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Введіть поточний пароль")
      .max(128, "Пароль має містити не більше 128 символів")
      .refine(hasValidByteLength, "Пароль має займати не більше 72 байтів UTF-8"),
    newPassword: newPasswordSchema,
    confirmPassword: z.string().min(1, "Підтвердьте новий пароль"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Паролі не збігаються",
    path: ["confirmPassword"],
  });

export type CreatePasswordValues = z.infer<typeof createPasswordSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
