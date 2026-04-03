import { forgotPassResetSchema, type ForgotPassResetValues } from "@/features/auth/model/shemas";
import { resetPassword } from "@/shared/api/authApi";
import { FormField } from "@/shared/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";

const resetPasswordFields = [
  {
    name: "password",
    label: "Пароль",
    placeholder: "Введіть пароль",
    type: "password",
    required: true,
  },
  {
    name: "confirm_password",
    label: "Повторіть пароль",
    placeholder: "Введіть пароль ще раз",
    type: "password",
    required: true,
  },
];

export const ResetPasswordForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigete = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPassResetSchema),
    mode: "onChange",
  });

  const handleOnSubmit = async (values: { password: string; confirm_password: string }) => {
    try {
      setError(null);

      if (!token) {
        setError("Токен відсутній або недійсний");
        return;
      }
      await resetPassword({ password: values.password, token });
      reset();
      navigete("/login");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Щось пішло не так");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)} className="flex flex-col gap-4">
      {resetPasswordFields.map((field) => (
        <FormField
          label={field.label}
          placeholder={field.placeholder}
          type={field.type}
          required={field.required}
          error={errors[field.name as keyof ForgotPassResetValues]?.message}
          {...register(field.name as keyof ForgotPassResetValues)}
        />
      ))}
      {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="mt-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 active:scale-95 disabled:opacity-80 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Завантаження..." : "Скинути пароль"}
      </button>
    </form>
  );
};
