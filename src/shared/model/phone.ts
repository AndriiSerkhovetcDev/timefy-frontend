import { z } from "zod";

export const normalizePhone = (value: string) => `+${value.replace(/\D/g, "")}`;

export const ukrainianPhoneSchema = z
  .string()
  .transform(normalizePhone)
  .pipe(z.string().regex(/^\+380\d{9}$/, "Введіть повний номер у форматі +38 (0XX) XXX-XX-XX"));
