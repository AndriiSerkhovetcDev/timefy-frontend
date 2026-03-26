import { useState } from "react";
import { useForm, type Resolver, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "./authStore";
import type { $ZodType } from "zod/v4/core";
import { useNavigate } from "react-router-dom";
import type { AuthResponse } from "@/shared/api/authApi";

type UseAuthFormOptions<T extends FieldValues, TResponse = AuthResponse, TPayload = T> = {
  schema: $ZodType<T, FieldValues>;
  apiCall: (values: TPayload) => Promise<TResponse>;
  redirectTo: string;
  transformValues?: (values: T) => TPayload;
  checkEmailVerified?: boolean;
};

const isAuthResponse = (res: unknown): res is AuthResponse => {
  return !!res && typeof res === "object" && "data" in res;
};

export const useAuthForm = <T extends FieldValues, TResponse = AuthResponse, TPayload = T>({
  schema,
  apiCall,
  redirectTo,
  transformValues,
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
      const submitValues = transformValues
        ? transformValues(values)
        : (values as unknown as TPayload);

      const res = await apiCall(submitValues as T);

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
