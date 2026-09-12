import { GoogleAuth } from "@/features/auth/ui/GoogleAuth";
import { RegisterForm } from "@/features/auth/ui/RegisterForm";
import { Link } from "react-router-dom";
import { BookingIllustration } from "@/pages/Login/BookingIllustration";

const RegisterPage = () => {
  return (
    <section className="mx-auto grid w-full max-w-7xl flex-1 items-stretch gap-12 py-8 sm:px-4 sm:py-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)] lg:gap-14 lg:py-10 xl:gap-20">
      <div className="flex min-w-0 items-center justify-center py-4 lg:justify-start">
        <div className="w-full max-w-[430px]">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Створіть акаунт
            </h1>
            <p className="mt-3 max-w-md text-base leading-7 text-muted-foreground">
              Зареєструйтеся в Timefy, щоб упорядкувати записи та керувати своїм часом.
            </p>
          </div>

          <RegisterForm />

          <div className="my-6 flex items-center gap-4" aria-hidden="true">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-text-muted">
              або
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <GoogleAuth
            label="Зареєструватись через Google"
            className="h-12 bg-bg-surface shadow-sm"
          />

          <p className="mt-7 text-center text-sm text-text-muted">
            Є акаунт?{" "}
            <Link
              to="/login"
              className="rounded-sm font-semibold text-secondary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
            >
              Увійти
            </Link>
          </p>
        </div>
      </div>

      <BookingIllustration />
    </section>
  );
};

export default RegisterPage;
