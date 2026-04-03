import { ForgotPasswordForm } from "@/features/forgot-password";

export const ForgotPasswordPage = () => {
  return (
    <div className="flex flex-1 items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
