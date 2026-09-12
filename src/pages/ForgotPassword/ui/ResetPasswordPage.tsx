import { ResetPasswordForm } from "@/features/forgot-password";
import { AlertTriangle, ArrowLeft, LockKeyhole } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { BookingIllustration } from "@/pages/Login/BookingIllustration";

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const hasToken = Boolean(searchParams.get("token"));

  return (
    <section className="mx-auto grid w-full max-w-7xl flex-1 items-stretch gap-12 py-8 sm:px-4 sm:py-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)] lg:gap-14 lg:py-10 xl:gap-20">
      <div className="flex min-w-0 items-center justify-center py-4 lg:justify-start">
        <div className="w-full max-w-[430px]">
          <div className="mb-8">
            <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-accent text-primary">
              <LockKeyhole className="size-5" aria-hidden="true" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Новий пароль
            </h1>
            <p className="mt-3 max-w-md text-base leading-7 text-muted-foreground">
              Створіть надійний пароль, який ви не використовуєте в інших сервісах.
            </p>
          </div>

          {hasToken ? (
            <ResetPasswordForm />
          ) : (
            <div className="rounded-2xl border border-warning/30 bg-warning-surface p-5">
              <div className="flex gap-3">
                <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden="true" />
                <div>
                  <h2 className="font-semibold text-text-main">Посилання недійсне</h2>
                  <p className="mt-1 text-sm leading-6 text-text-muted">
                    У посиланні немає токена відновлення. Запросіть новий лист і спробуйте ще раз.
                  </p>
                </div>
              </div>
              <Link
                to="/forgot-password"
                className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Запросити нове посилання
              </Link>
            </div>
          )}

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

export default ResetPasswordPage;
