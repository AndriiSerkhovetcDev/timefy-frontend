import { ForgotPasswordForm } from "@/features/forgot-password";
import { ArrowLeft, KeyRound } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { BookingIllustration } from "@/pages/Login/BookingIllustration";

export const ForgotPasswordPage = () => {
  const [isSuccess, setIsSuccess] = useState(false);

  return (
    <section className="mx-auto grid w-full max-w-7xl flex-1 items-stretch gap-12 py-8 sm:px-4 sm:py-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)] lg:gap-14 lg:py-10 xl:gap-20">
      <div className="flex min-w-0 items-center justify-center py-4 lg:justify-start">
        <div className="w-full max-w-[430px]">
          {!isSuccess && (
            <div className="mb-8">
              <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-accent text-primary">
                <KeyRound className="size-5" aria-hidden="true" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Відновлення пароля
              </h1>
              <p className="mt-3 max-w-md text-base leading-7 text-muted-foreground">
                Введіть email або логін — ми надішлемо посилання для створення нового пароля.
              </p>
            </div>
          )}

          <ForgotPasswordForm onSuccess={() => setIsSuccess(true)} />

          <Link
            to="/login"
            className="mt-6 inline-flex items-center gap-2 rounded-sm text-sm font-medium text-text-muted outline-none transition hover:text-text-main focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Повернутись до входу
          </Link>
        </div>
      </div>

      <BookingIllustration />
    </section>
  );
};

export default ForgotPasswordPage;
