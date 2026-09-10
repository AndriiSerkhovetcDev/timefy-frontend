import { z } from "zod";

export const passwordResetRequestSchema = z.object({
  email: z.email("Введіть коректний email").transform((value) => value.trim().toLowerCase()),
});

export type PasswordResetRequestValues = z.infer<typeof passwordResetRequestSchema>;
