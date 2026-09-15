import { useForm, type Resolver, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "./authStore";
import type { $ZodType } from "zod/v4/core";
import { useNavigate } from "react-router-dom";
import type { AuthResponse } from "@/shared/api/authApi";
import { withNotify } from "@/shared/lib/withNotify";
import { consumePostAuthReturnPath } from "@/shared/lib/employeeInvitationSession";

const isAuthResponse = (res: unknown): res is AuthResponse => {
  return !!res && typeof res === "object" && "data" in res;
};

type UseAuthFormOptions<T extends FieldValues, TResponse = AuthResponse> = {
  schema: $ZodType<T, FieldValues>;
  apiCall: (values: T) => Promise<TResponse>;
  redirectTo: string;
  checkEmailVerified?: boolean;
  unverifiedRedirectTo?: string;
  successMessage?: string;
};

export const useAuthForm = <T extends FieldValues, TResponse = AuthResponse>({
  schema,
  apiCall,
  redirectTo,
  checkEmailVerified,
  unverifiedRedirectTo = "/verify-email",
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
        const postAuthReturnPath = consumePostAuthReturnPath();

        if (postAuthReturnPath) {
          navigate(postAuthReturnPath, { replace: true });
          return;
        }

        if (checkEmailVerified && !res.data.user.emailVerified) {
          navigate(unverifiedRedirectTo);
        } else {
          navigate(redirectTo);
        }
      } else {
        navigate(redirectTo);
      }
    } catch {
      // withNotify already presents request errors to the user.
    }
  };

  return {
    ...form,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
