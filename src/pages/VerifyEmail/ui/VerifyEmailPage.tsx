import { selectUserEmail, useAuthStore } from "@/features/auth/model/authStore";
import { VerifyEmailForm } from "@/features/verify-email";
import { hideEmail } from "@/shared/lib/utils";

export const VerifyEmailPage = () => {
  const userEmail = useAuthStore(selectUserEmail);
  const userEmailMessage = userEmail ? hideEmail(userEmail) : "вашу пошту";

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-8 overflow-y-auto">
      <h1 className="text-2xl font-semibold">Підтвердження email</h1>
      <p className="text-text-muted text-center text-sm">
        Введіть код який ми надіслали на {userEmailMessage}
      </p>
      <VerifyEmailForm />
    </div>
  );
};
