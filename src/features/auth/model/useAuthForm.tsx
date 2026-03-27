import { useState } from "react";
import { useForm, type Resolver, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "./authStore";
import type { $ZodType } from "zod/v4/core";
import { useNavigate } from "react-router-dom";
import type { AuthResponse } from "@/shared/api/authApi";

const isAuthResponse = (res: unknown): res is AuthResponse => {
  return !!res && typeof res === "object" && "data" in res;
};

type UseAuthFormOptions<T extends FieldValues, TResponse = AuthResponse> = {
  schema: $ZodType<T, FieldValues>;
  apiCall: (values: T) => Promise<TResponse>;
  redirectTo: string;
  checkEmailVerified?: boolean;
};

export const useAuthForm = <T extends FieldValues, TResponse = AuthResponse>({
  schema,
  apiCall,
  redirectTo,
  checkEmailVerified,
}: UseAuthFormOptions<T, TResponse>) => {
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const form = useForm<T>({
    resolver: zodResolver(schema) as Resolver<T>,
    mode: "onChange",
  });

  const onSubmit = async (values: T) => {
    try {
      setError(null);
      const res = await apiCall(values);

      if (isAuthResponse(res)) {
        login(res.data.user, res.data.token);

        if (checkEmailVerified && !res.data.user.emailVerified) {
          navigate("/verify-email");
        } else {
          navigate(redirectTo);
        }
      } else {
        navigate(redirectTo);
      }
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
