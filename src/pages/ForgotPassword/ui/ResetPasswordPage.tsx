import { ResetPasswordForm } from "@/features/forgot-password";

export const ResetPasswordPage = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-bg-main">
      <div className="w-full max-w-md rounded-2xl bg-bg-surface p-8 shadow-sm ring-1 ring-border">
        <h1 className="mb-5 text-2xl text-center font-bold text-primary">Скидання паролю</h1>
        <ResetPasswordForm />
      </div>
    </div>
  );
};

export default ResetPasswordPage;
