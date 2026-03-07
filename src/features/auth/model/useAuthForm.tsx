// features/auth/model/useAuthForm.ts
import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { type FieldValues } from "react-hook-form";
import { useAuthStore } from "./authStore";
import type { User } from "./types";
import type { $ZodType } from "node_modules/zod/v4/core/schemas";

type UseAuthFormOptions<T extends FieldValues> = {
  schema: $ZodType<T, FieldValues>;
  apiCall: (values: T) => Promise<{ token: string; user: User }>;
  redirectTo: string;
};

export const useAuthForm = <T extends FieldValues>({
  schema,
  apiCall,
  redirectTo,
}: UseAuthFormOptions<T>) => {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<T>({
    resolver: zodResolver(schema) as Resolver<T>,
    mode: "onBlur",
  });

  const onSubmit = async (values: T) => {
    try {
      const data = {
        user: {
          id: "1",
          role: "OWNER" as const,
          login: "testuser",
          email: "test@test.com",
          phone: "+380671234567",
        },
        token: "fake-token",
      };
      // setError(null);
      // const data = await apiCall(values);
      login(data.user, data.token);
      // navigate(redirectTo);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Щось пішло не так");
    }
  };

  return {
    ...form,
    error,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
