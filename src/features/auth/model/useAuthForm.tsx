import { useForm, type Resolver, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "./authStore";
import type { $ZodType } from "zod/v4/core";
import { useNavigate } from "react-router-dom";
import type { AuthResponse } from "@/shared/api/authApi";
import { withNotify } from "@/shared/lib/withNotify";

const isAuthResponse = (res: unknown): res is AuthResponse => {
  return !!res && typeof res === "object" && "data" in res;
};

type UseAuthFormOptions<T extends FieldValues, TResponse = AuthResponse> = {
  schema: $ZodType<T, FieldValues>;
  apiCall: (values: T) => Promise<TResponse>;
  redirectTo: string;
  checkEmailVerified?: boolean;
  successMessage?: string;
};

export const useAuthForm = <T extends FieldValues, TResponse = AuthResponse>({
  schema,
  apiCall,
  redirectTo,
  checkEmailVerified,
  successMessage,
}: UseAuthFormOptions<T, TResponse>) => {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const form = useForm<T>({
    resolver: zodResolver(schema) as Resolver<T>,
    mode: "onChange",
  });

  const onSubmit = async (values: T) => {
    try {
      const res = await withNotify(apiCall(values), {
        success: successMessage,
      });

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
    } catch {}
  };

  return {
    ...form,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
