import { GoogleAuth } from "@/features/auth/ui/GoogleAuth";
import { LoginForm } from "@/features/auth/ui/LoginForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MailCheck } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { BookingIllustration } from "./BookingIllustration";

export const LoginPage = () => {
  const location = useLocation();
  const emailChanged = (location.state as { reason?: string } | null)?.reason === "EMAIL_CHANGED";

  return (
    <section className="mx-auto grid w-full max-w-7xl flex-1 items-stretch gap-12 py-8 sm:px-4 sm:py-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)] lg:gap-14 lg:py-10 xl:gap-20">
      <div className="flex min-w-0 items-center justify-center py-4 lg:justify-start">
        <div className="w-full max-w-[430px]">
          <div className="mb-8">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
              Ваш робочий простір
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              З поверненням
            </h1>
            <p className="mt-3 max-w-md text-base leading-7 text-muted-foreground">
              Увійдіть у свій акаунт Timefy та продовжуйте керувати записами.
            </p>
          </div>

          {emailChanged && (
            <Alert className="mb-6 bg-success-surface/60">
              <MailCheck aria-hidden="true" className="text-success" />
              <AlertTitle>Email змінено</AlertTitle>
              <AlertDescription>
                Увійдіть повторно та підтвердьте нову електронну адресу.
              </AlertDescription>
            </Alert>
          )}

          <LoginForm />

          <div className="mt-3 flex justify-end">
            <Link
              to="/forgot-password"
              className="rounded-sm text-sm font-medium text-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
            >
              Забули пароль?
            </Link>
          </div>

          <div className="my-6 flex items-center gap-4" aria-hidden="true">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-text-muted">
              або
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <GoogleAuth className="h-12 bg-bg-surface shadow-sm" />

          <p className="mt-7 text-center text-sm text-text-muted">
            Немає акаунту?{" "}
            <Link
              to="/register"
              className="rounded-sm font-semibold text-secondary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
            >
              Зареєструватися
            </Link>
          </p>
        </div>
      </div>

      <BookingIllustration />
    </section>
  );
};

export default LoginPage;
