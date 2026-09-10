import { ArrowLeft, CalendarX2, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <section className="relative isolate flex flex-1 items-center justify-center overflow-hidden py-16 sm:py-24">
      <div
        aria-hidden="true"
        className="absolute -left-24 top-12 -z-10 h-64 w-64 rounded-full bg-secondary/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -right-24 bottom-8 -z-10 h-72 w-72 rounded-full bg-primary/15 blur-3xl"
      />

      <div className="w-full max-w-2xl text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-border bg-bg-surface shadow-lg shadow-primary/10 sm:h-24 sm:w-24">
          <CalendarX2 aria-hidden="true" className="h-10 w-10 text-secondary sm:h-12 sm:w-12" />
        </div>

        <p className="mt-8 bg-linear-to-r from-primary to-secondary bg-clip-text text-7xl font-black tracking-tight text-transparent sm:text-8xl">
          404
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-text-main sm:text-4xl">
          Сторінку не знайдено
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-text-muted sm:text-lg">
          Схоже, ця сторінка змінила адресу або більше не існує. Поверніться назад чи продовжте
          роботу з головної сторінки Timefy.
        </p>

        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Home aria-hidden="true" className="h-4 w-4" />
            На головну
          </Link>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border bg-bg-surface px-6 py-3 text-sm font-semibold text-text-main transition hover:-translate-y-0.5 hover:bg-bg-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Повернутися назад
          </button>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
