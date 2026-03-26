import { ForgotPasswordForm } from "@/features/forgot-password/ui/ForgotPasswordForm";

export const ForgotPasswordPage = () => {
  return (
    <div className="flex flex-1 items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
        <h1 className="mb-5 text-2xl text-center font-bold text-primary">Відновлення паролю</h1>

        <ForgotPasswordForm />
      </div>
    </div>
  );
};
