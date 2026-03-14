import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type FieldValues } from "react-hook-form";
import { useAuthStore } from "./authStore";
import type { $ZodType } from "node_modules/zod/v4/core/schemas";
import { useNavigate } from "react-router-dom";
import type { AuthResponse } from "@/shared/api/authApi";

type UseAuthFormOptions<T extends FieldValues> = {
  schema: $ZodType<T, FieldValues>;
  apiCall: (values: T) => Promise<AuthResponse>;
  redirectTo: string;
  transformValues?: (values: T) => Partial<T>;
};

export const useAuthForm = <T extends FieldValues>({
  schema,
  apiCall,
  redirectTo,
  transformValues,
}: UseAuthFormOptions<T>) => {
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
      const submitValues = transformValues ? transformValues(values) : values;
      const res = await apiCall(submitValues as T);
      const { data } = res;

      if (data?.user && data?.token) {
        login(data.user, data.token);
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
