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
          error={errors[field.name as keyof ForgotPassResetValues]?.message}
          {...register(field.name as keyof ForgotPassResetValues)}
        />
      ))}

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
