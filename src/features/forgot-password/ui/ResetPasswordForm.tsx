import { forgotPassResetSchema, type ForgotPassResetValues } from "@/features/auth/model/shemas";
import { resetPassword } from "@/shared/api/authApi";
import { withNotify } from "@/shared/lib/withNotify";
import { notify } from "@/shared/lib/notify";
import { FormField } from "@/shared/ui";
import { zodResolver } from "@hookform/resolvers/zod";
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
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPassResetSchema),
    mode: "onBlur",
  });

  const handleOnSubmit = async (values: { password: string; confirm_password: string }) => {
    if (!token) {
      notify.error("Токен відсутній або недійсний");
      return;
    }

    await withNotify(resetPassword({ newPassword: values.password, token }), {
      loading: "Збереження...",
      success: "Пароль змінено",
    });

    reset();
    navigate("/login");
  };

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)} className="flex flex-col gap-4">
      {resetPasswordFields.map((field) => (
        <FormField
          label={field.label}
          placeholder={field.placeholder}
          type={field.type}
          required={field.required}
          watchValue={field.name === "password" ? watch("password") : undefined}
          showPasswordFeedback={field.name === "password"}
          autoComplete="new-password"
          inputClassName="h-12 bg-bg-surface pr-11 shadow-sm"
          error={errors[field.name as keyof ForgotPassResetValues]?.message}
          {...register(field.name as keyof ForgotPassResetValues)}
        />
      ))}

      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="mt-2 h-12 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Зберігаємо..." : "Зберегти новий пароль"}
      </button>
    </form>
  );
};
