import {
  forgotPassEmailStepSchema,
  type ForgotPassEmailStepValue,
} from "@/features/auth/model/shemas";
import { forgotPasswordEmailStep } from "@/shared/api/authApi";
import { FormField } from "@/shared/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

const forgotPassEmailStepField = {
  name: "email_login",
  label: "Email або логін",
  placeholder: "",
  type: "text",
  required: true,
  checkExists: true,
};

export const ForgotPasswordForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPassEmailStepSchema),
    mode: "onChange",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const transformValues = (value: string) => {
    return value.includes("@") ? { email: value } : { login: value };
  };

  const handleOnSubmit = async (values: ForgotPassEmailStepValue) => {
    try {
      setError(null);
      const submitValues = transformValues(values.email_login);
      await forgotPasswordEmailStep(submitValues);
      reset();
      setIsSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Щось пішло не так");
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-semibold">Перевірте пошту</h1>
        <p className="text-gray-500 text-sm text-center max-w-sm">
          Ми надіслали посилання для скидання паролю на вашу електронну адресу
        </p>
        <a href="/login" className="text-blue-500 hover:underline text-sm">
          Повернутись до входу
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)} className="flex flex-col gap-4">
      <FormField
        label={forgotPassEmailStepField.label}
        placeholder={forgotPassEmailStepField.placeholder}
        type={forgotPassEmailStepField.type}
        required={forgotPassEmailStepField.required}
        error={errors[forgotPassEmailStepField.name as keyof ForgotPassEmailStepValue]?.message}
        {...register(forgotPassEmailStepField.name as keyof ForgotPassEmailStepValue)}
      />

      {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="mt-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 active:scale-95 disabled:opacity-80 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Завантаження..." : "Надіслати"}
      </button>
    </form>
  );
};
