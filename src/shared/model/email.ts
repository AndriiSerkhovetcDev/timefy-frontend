import { z } from "zod";

export const normalizeEmail = (value: string) => value.trim().toLowerCase();

export const emailSchema = z
  .string()
  .transform(normalizeEmail)
  .pipe(
    z
      .string()
      .min(1, "Введіть email")
      .max(254, "Email не повинен перевищувати 254 символи")
      .pipe(z.email("Введіть коректний email у форматі name@example.com")),
  );
