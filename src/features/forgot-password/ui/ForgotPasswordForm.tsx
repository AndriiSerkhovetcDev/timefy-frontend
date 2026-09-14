import {
  forgotPassEmailStepSchema,
  type ForgotPassEmailStepValue,
} from "@/features/auth/model/shemas";
import { forgotPasswordEmailStep, type ForgotPassEmailStepPayload } from "@/shared/api/authApi";
import { withNotify } from "@/shared/lib/withNotify";
import { FormField } from "@/shared/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
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

type ForgotPasswordFormProps = {
  onSuccess?: () => void;
};

export const ForgotPasswordForm = ({ onSuccess }: ForgotPasswordFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPassEmailStepSchema),
    mode: "onChange",
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [submittedValues, setSubmittedValues] = useState<ForgotPassEmailStepPayload | null>(null);

  const transformValues = (value: string): ForgotPassEmailStepPayload => {
    return value.includes("@") ? { email: value } : { login: value };
  };

  const handleOnSubmit = async (values: ForgotPassEmailStepValue) => {
    const submitValues = transformValues(values.email_login);
    setSubmittedValues(submitValues);

    try {
      await withNotify(forgotPasswordEmailStep(submitValues));
      reset();
      setIsSuccess(true);
      onSuccess?.();
    } catch {
      setSubmittedValues(null);
    }
  };

  const handleResend = async () => {
    if (!submittedValues || isResending) return;

    setIsResending(true);
    try {
      await withNotify(forgotPasswordEmailStep(submittedValues), {
        success: "Лист надіслано повторно",
      });
    } catch {
      // withNotify already displays the API error.
    } finally {
      setIsResending(false);
    }
  };

  if (isSuccess) {
    return <SuccessSendEmail handleResend={handleResend} isResending={isResending} />;
  }

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)} className="flex flex-col gap-4">
      <FormField
        label={forgotPassEmailStepField.label}
        placeholder="Введіть email або логін"
        type={forgotPassEmailStepField.type}
        required={forgotPassEmailStepField.required}
        autoComplete="username"
        inputClassName="h-12 bg-bg-surface shadow-sm"
        error={errors[forgotPassEmailStepField.name as keyof ForgotPassEmailStepValue]?.message}
        {...register(forgotPassEmailStepField.name as keyof ForgotPassEmailStepValue)}
      />

      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="mt-2 h-12 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Надсилаємо..." : "Надіслати посилання"}
      </button>
    </form>
  );
};

type SuccessSendEmailProps = {
  handleResend: () => Promise<void>;
  isResending: boolean;
};

const SuccessSendEmail = ({ handleResend, isResending }: SuccessSendEmailProps) => {
  return (
    <div className="flex flex-col items-center gap-5 py-1 text-center">
      <div className="flex size-12 items-center justify-center rounded-xl bg-success-surface text-success">
        <Mail className="size-5" aria-hidden="true" />
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Перевірте пошту</h1>
        <p className="max-w-sm text-sm leading-6 text-text-muted">
          Якщо обліковий запис існує, ми надіслали посилання для створення нового пароля.
        </p>
      </div>

      <p className="max-w-sm text-xs leading-5 text-text-muted">
        Не отримали листа? Перевірте папку "Спам" або{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending}
          className="rounded-sm font-medium text-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isResending ? "надсилаємо..." : "надішліть ще раз"}
        </button>
      </p>
    </div>
  );
};
