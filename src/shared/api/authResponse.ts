import { z } from "zod";
import type { User } from "@/features/auth/model/types";

const authUserSchema = z.object({
  login: z.string(),
  role: z.enum(["USER", "ADMIN", "SUPPORT"]),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  email: z.string(),
  phone: z.string().nullable(),
  emailVerified: z.boolean(),
  avatar: z.string().nullable().optional(),
  authData: z
    .object({
      isWeb: z.boolean(),
      isGoogle: z.boolean(),
    })
    .optional(),
});

const authResponseSchema = z.object({
  data: z.object({
    token: z.string().min(1),
    user: authUserSchema,
  }),
});

export type ValidAuthResponse = {
  data: {
    token: string;
    user: User;
  };
};

export class InvalidAuthResponseError extends Error {
  constructor() {
    super("Сервер повернув некоректні дані авторизації");
    this.name = "InvalidAuthResponseError";
  }
}

export const parseAuthResponse = (response: unknown): ValidAuthResponse => {
  const result = authResponseSchema.safeParse(response);
  if (!result.success) throw new InvalidAuthResponseError();
  return result.data;
};
