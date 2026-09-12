import { CalendarCheck2, Check, Clock3, Sparkles, UserRound } from "lucide-react";

export const BookingIllustration = () => (
  <aside
    className="relative hidden min-h-[620px] overflow-hidden rounded-[2rem] border border-border/70 bg-linear-to-br from-accent/90 via-bg-surface to-secondary/15 lg:flex lg:items-center lg:justify-center"
    aria-hidden="true"
  >
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px] opacity-35 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_72%)]" />
    <div className="absolute -right-20 -top-20 size-72 rounded-full bg-secondary/20 blur-3xl" />
    <div className="absolute -bottom-20 -left-16 size-72 rounded-full bg-primary/15 blur-3xl" />

    <p className="absolute select-none text-[clamp(6.5rem,9vw,10rem)] font-extrabold tracking-[-0.08em] text-primary/[0.06]">
      TIMEFY
    </p>

    <div className="relative h-[460px] w-full max-w-[610px]">
      <div className="absolute left-[9%] top-[9%] w-64 -rotate-2 rounded-2xl border border-border/80 bg-card/90 p-5 shadow-xl shadow-primary/10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-primary">
            <CalendarCheck2 className="size-5" />
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Новий запис
            </p>
            <p className="mt-1 font-semibold text-foreground">Стрижка та укладка</p>
          </div>
        </div>
      </div>

      <div className="absolute right-[7%] top-[28%] w-72 rotate-2 rounded-2xl border border-border/80 bg-card/95 p-5 shadow-2xl shadow-primary/15 backdrop-blur-md">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Clock3 className="size-5" />
            </span>
            <div>
              <p className="text-sm text-muted-foreground">Сьогодні</p>
              <p className="text-lg font-bold text-foreground">10:30 — Стрижка</p>
            </div>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <span className="flex items-center gap-1.5 rounded-full bg-success-surface px-3 py-1 text-xs font-semibold text-success">
            <Check className="size-3.5" />
            Підтверджено
          </span>
          <span className="text-xs text-muted-foreground">45 хв</span>
        </div>
      </div>

      <div className="absolute bottom-[12%] left-[15%] w-64 -rotate-1 rounded-2xl border border-border/80 bg-card/90 p-4 shadow-xl shadow-primary/10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-secondary/20 text-primary">
            <UserRound className="size-5" />
          </span>
          <div>
            <p className="font-semibold text-foreground">Анна</p>
            <p className="text-sm text-muted-foreground">Новий клієнт</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-[5%] right-[8%] flex items-center gap-2 rounded-xl border border-border/80 bg-card/85 px-4 py-3 shadow-lg backdrop-blur-md">
        <Sparkles className="size-4 text-secondary" />
        <div>
          <p className="text-xs text-muted-foreground">Наступний запис</p>
          <p className="text-sm font-semibold text-foreground">через 25 хв</p>
        </div>
      </div>
    </div>
  </aside>
);
