import { CalendarDays, Check, Clock3, Sparkles, UserRound } from "lucide-react";

export const BookingIllustration = () => (
  <aside
    className="relative hidden min-h-[620px] overflow-hidden rounded-[2rem] border border-border/70 bg-[radial-gradient(circle_at_center,var(--color-accent)_0%,var(--color-card)_52%,var(--color-background)_100%)] lg:flex lg:items-center lg:justify-center"
    aria-hidden="true"
  >
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-border)_1px,transparent_1px)] bg-[size:22px_22px] opacity-35 [mask-image:radial-gradient(ellipse_at_center,black_15%,transparent_72%)]" />
    <div className="absolute left-1/2 top-1/2 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/20 blur-[80px]" />
    <div className="absolute -right-24 -top-20 size-72 rounded-full bg-primary/15 blur-3xl" />
    <div className="absolute -bottom-24 -left-16 size-72 rounded-full bg-secondary/15 blur-3xl" />

    <div className="relative h-[520px] w-full max-w-[620px]">
      <div className="absolute left-1/2 top-1/2 size-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/15 shadow-[0_0_70px_color-mix(in_srgb,var(--color-secondary)_15%,transparent)]" />
      <div className="absolute left-1/2 top-1/2 h-[290px] w-[500px] -translate-x-1/2 -translate-y-1/2 rotate-12 rounded-[50%] border border-secondary/25" />
      <div className="absolute left-1/2 top-1/2 h-[440px] w-[540px] -translate-x-1/2 -translate-y-1/2 -rotate-12 rounded-[50%] border border-dashed border-primary/15" />

      <div className="absolute left-1/2 top-1/2 size-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-border/70 bg-card/45 shadow-[inset_0_0_50px_color-mix(in_srgb,var(--color-secondary)_10%,transparent)] backdrop-blur-sm">
        <span className="absolute left-1/2 top-3 h-3 w-px -translate-x-1/2 bg-primary/35" />
        <span className="absolute bottom-3 left-1/2 h-3 w-px -translate-x-1/2 bg-primary/35" />
        <span className="absolute left-3 top-1/2 h-px w-3 -translate-y-1/2 bg-primary/35" />
        <span className="absolute right-3 top-1/2 h-px w-3 -translate-y-1/2 bg-primary/35" />
        <span className="absolute left-1/2 top-1/2 h-20 w-px -translate-x-1/2 -translate-y-full rotate-[32deg] origin-bottom bg-linear-to-t from-primary/70 to-secondary/20" />
        <span className="absolute left-1/2 top-1/2 h-14 w-px -translate-x-1/2 -translate-y-full -rotate-[58deg] origin-bottom bg-primary/45" />
        <span className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary shadow-[0_0_16px_var(--color-secondary)]" />
      </div>

      <p className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 select-none bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-[clamp(5.5rem,7vw,8rem)] font-extrabold tracking-[-0.075em] text-transparent drop-shadow-[0_0_22px_color-mix(in_srgb,var(--color-secondary)_28%,transparent)]">
        TIMEFY
      </p>

      <span className="absolute left-[10%] top-[42%] rounded-full border border-border/70 bg-card/80 px-2.5 py-1 text-[11px] font-medium text-muted-foreground shadow-sm backdrop-blur-md">
        09:00
      </span>
      <span className="absolute right-[8%] top-[48%] rounded-full border border-border/70 bg-card/80 px-2.5 py-1 text-[11px] font-medium text-muted-foreground shadow-sm backdrop-blur-md">
        14:30
      </span>
      <span className="absolute bottom-[8%] left-[45%] rounded-full border border-border/70 bg-card/80 px-2.5 py-1 text-[11px] font-medium text-muted-foreground shadow-sm backdrop-blur-md">
        18:00
      </span>

      <div className="absolute left-[4%] top-[5%] w-56 -rotate-2 rounded-2xl border border-border/80 bg-card/90 p-4 shadow-xl shadow-primary/10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-accent text-primary">
            <CalendarDays className="size-4.5" />
          </span>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Новий запис
            </p>
            <p className="mt-0.5 text-sm font-semibold text-foreground">Подію заплановано</p>
          </div>
        </div>
      </div>

      <div className="absolute right-[3%] top-[12%] w-60 rotate-2 rounded-2xl border border-border/80 bg-card/95 p-4 shadow-xl shadow-primary/10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Clock3 className="size-5" />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">Сьогодні</p>
            <p className="font-bold text-foreground">10:30 — Зустріч</p>
          </div>
        </div>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-success-surface px-2.5 py-1 text-xs font-semibold text-success">
          <Check className="size-3.5" />
          Підтверджено
        </span>
      </div>

      <div className="absolute bottom-[8%] left-[6%] w-52 rotate-1 rounded-2xl border border-border/80 bg-card/90 p-4 shadow-xl shadow-primary/10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-secondary/20 text-primary">
            <UserRound className="size-4.5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">Новий учасник</p>
            <p className="text-xs text-muted-foreground">Додано до події</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-[5%] right-[4%] flex items-center gap-2 rounded-xl border border-border/80 bg-card/90 px-4 py-3 shadow-lg backdrop-blur-md">
        <Sparkles className="size-4 text-secondary" />
        <div>
          <p className="text-[11px] text-muted-foreground">Наступна подія</p>
          <p className="text-sm font-semibold text-foreground">через 25 хв</p>
        </div>
      </div>

      <span className="absolute left-[13%] top-[31%] size-2 rounded-full bg-secondary shadow-[0_0_14px_var(--color-secondary)]" />
      <span className="absolute right-[14%] top-[67%] size-2.5 rounded-full border-2 border-card bg-primary shadow-[0_0_16px_var(--color-primary)]" />
      <span className="absolute bottom-[24%] left-[35%] size-1.5 rounded-full bg-secondary/80" />
    </div>
  </aside>
);
