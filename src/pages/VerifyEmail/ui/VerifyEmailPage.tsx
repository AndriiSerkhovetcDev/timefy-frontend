import { selectUserEmail, useAuthStore } from "@/features/auth/model/authStore";
import { VerifyEmailForm } from "@/features/verify-email";
import { BookingIllustration } from "@/pages/Login/BookingIllustration";
import { hideEmail } from "@/shared/lib/utils";
import { MailCheck } from "lucide-react";

export const VerifyEmailPage = () => {
  const userEmail = useAuthStore(selectUserEmail);
  const userEmailMessage = userEmail ? hideEmail(userEmail) : "вашу пошту";

  return (
    <section className="mx-auto grid w-full max-w-7xl flex-1 items-stretch gap-12 py-8 sm:px-4 sm:py-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)] lg:gap-14 lg:py-10 xl:gap-20">
      <div className="flex min-w-0 items-center justify-center py-4 lg:justify-start">
        <div className="w-full max-w-[430px]">
          <div className="mb-8">
            <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-accent text-primary">
              <MailCheck className="size-5" aria-hidden="true" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Підтвердження email
            </h1>
            <p className="mt-3 max-w-md text-base leading-7 text-muted-foreground">
              Введіть шестизначний код, який ми надіслали на{" "}
              <span className="font-medium text-foreground">{userEmailMessage}</span>.
            </p>
          </div>

          <VerifyEmailForm />
        </div>
      </div>

      <BookingIllustration />
    </section>
  );
};
