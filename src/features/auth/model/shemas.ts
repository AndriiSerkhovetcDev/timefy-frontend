import { z } from "zod";

export const loginSchema = z.object({
  login: z
    .string()
    .min(1, "Логін не може бути порожнім")
    .regex(/^[a-zA-Z0-9_]+$/, "Тільки літери, цифри та _")
    .transform((val) => val.trim()),
  password: z
    .string()
    .min(8, "Пароль має бути не менше 8 символів")
    .regex(/[A-Z]/, "Має містити велику літеру")
    .regex(/[0-9]/, "Має містити цифру")
    .regex(/[!@#$%^&*]/, "Має містити спеціальний символ")
    .transform((val) => val.trim()),
});

export const registerSchema = z
  .object({
    login: z
      .string()
      .min(1, "Логін не може бути порожнім")
      .regex(/^[a-zA-Z0-9_]+$/, "Тільки літери, цифри та _")
      .transform((val) => val.trim()),
    email: z.email("Неправильна електронна адреса").transform((val) => val.trim().toLowerCase()),
    phone: z
      .string()
      .min(10, "Введіть номер телефону")
      .transform((val) => "+" + val.replace(/\D/g, "")),
    password: z
      .string()
      .min(8, "Пароль має бути не менше 8 символів")
      .regex(/[A-Z]/, "Має містити велику літеру")
      .regex(/[0-9]/, "Має містити цифру")
      .regex(/[!@#$%^&*]/, "Має містити спеціальний символ")
      .transform((val) => val.trim()),
    confirm_password: z
      .string()
      .min(1, "Підтвердіть пароль")
      .transform((val) => val.trim()),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Паролі не співпадають",
    path: ["confirm_password"],
  });

//types
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
