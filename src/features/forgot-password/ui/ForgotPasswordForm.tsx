import {
  forgotPassEmailStepSchema,
  type ForgotPassEmailStepValue,
} from "@/features/auth/model/shemas";
import { forgotPasswordEmailStep, type ForgotPassEmailStepPayload } from "@/shared/api/authApi";
import { withNotify } from "@/shared/lib/withNotify";
import { FormField } from "@/shared/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

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
  const [isSuccess, setIsSuccess] = useState(false);
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
    } catch {
      setSubmittedValues(null);
    }
  };

  const handleResend = async () => {
    if (!submittedValues) return;
    await withNotify(forgotPasswordEmailStep(submittedValues));
  };

  if (isSuccess) {
    return <SuccessSendEmail handleResend={handleResend} />;
  }

  return (
    <>
      {!isSuccess && (
        <h1 className="mb-5 text-2xl text-center font-bold text-primary">Відновлення паролю</h1>
      )}
      <form onSubmit={handleSubmit(handleOnSubmit)} className="flex flex-col gap-4">
        <FormField
          label={forgotPassEmailStepField.label}
          placeholder={forgotPassEmailStepField.placeholder}
          type={forgotPassEmailStepField.type}
          required={forgotPassEmailStepField.required}
          error={errors[forgotPassEmailStepField.name as keyof ForgotPassEmailStepValue]?.message}
          {...register(forgotPassEmailStepField.name as keyof ForgotPassEmailStepValue)}
        />

        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="mt-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 active:scale-95 disabled:opacity-80 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Завантаження..." : "Надіслати"}
        </button>
      </form>
    </>
  );
};

const SuccessSendEmail = ({ handleResend }: { handleResend: () => Promise<void> }) => {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center">
        <Mail className="w-5 h-5 text-teal-600" />
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Перевірте пошту</h1>
        <p className="text-gray-500 text-sm max-w-sm">
          Ми надіслали посилання для скидання паролю на{" "}
          <span className="font-medium text-gray-700">email</span>
        </p>
      </div>

      <p className="text-gray-400 text-xs max-w-sm">
        Не отримали листа? Перевірте папку "Спам" або{" "}
        <button onClick={handleResend} className="text-primary hover:underline">
          надішліть ще раз
        </button>
      </p>

      <Link
        to="/login"
        className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1.5 transition mt-2"
      >
        <ArrowLeft size={14} />
        Повернутись до входу
      </Link>
    </div>
  );
};
