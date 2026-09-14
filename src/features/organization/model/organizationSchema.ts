import { z } from "zod";
import { ORGANIZATION_TYPES } from "./types";

export const MAX_ORGANIZATION_LOGO_SIZE_BYTES = 5 * 1024 * 1024;
export const ORGANIZATION_LOGO_TYPES = ["image/png", "image/jpeg", "image/webp"];
export const ORGANIZATION_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const organizationSchema = z
  .object({
    logo: z
      .instanceof(File)
      .nullable()
      .refine((file) => !file || file.size > 0, "Файл логотипа порожній")
      .refine(
        (file) => !file || ORGANIZATION_LOGO_TYPES.includes(file.type),
        "Оберіть PNG, JPG або WebP",
      )
      .refine(
        (file) => !file || file.size <= MAX_ORGANIZATION_LOGO_SIZE_BYTES,
        "Розмір логотипа не повинен перевищувати 5 МБ",
      ),
    displayName: z.string().trim().min(1, "Введіть назву компанії").max(200),
    slug: z
      .string()
      .trim()
      .min(3, "Коротка адреса має містити щонайменше 3 символи")
      .max(63, "Коротка адреса має містити не більше 63 символів")
      .regex(ORGANIZATION_SLUG_PATTERN, "Використовуйте малі латинські літери, цифри та дефіси"),
    organisationType: z.enum(ORGANIZATION_TYPES, { error: "Оберіть тип компанії" }),
    legalName: z.string().trim().max(255).optional(),
    taxId: z.string().trim().max(100).optional(),
  })
  .transform((values) => ({
    ...values,
    legalName: values.legalName || undefined,
    taxId: values.taxId || undefined,
  }));

export type OrganizationFormInput = z.input<typeof organizationSchema>;
export type OrganizationFormValues = z.output<typeof organizationSchema>;
