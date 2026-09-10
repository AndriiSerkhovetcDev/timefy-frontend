import { cn } from "@/lib/utils";

type LogoProps = {
  showText?: boolean;
};

export const Logo = ({ showText = true }: LogoProps) => {
  return (
    <>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary to-secondary text-primary-foreground shadow-lg">
        <svg className="w-5 h-5 fill-current" viewBox="0 0 448 512" aria-hidden="true">
          <path d="M128 0c17.7 0 32 14.3 32 32V64H288V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v48H0V112C0 85.5 21.5 64 48 64H96V32c0-17.7 14.3-32 32-32zM0 192H448V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V192zM329 305c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-95 95-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 24.6 33.9 0L329 305z" />
        </svg>
      </div>

      <span
        className={cn(
          "overflow-hidden whitespace-nowrap text-2xl font-bold tracking-tight text-primary transition-[max-width,opacity] duration-300 ease-in-out",
          showText ? "max-w-30 opacity-100" : "max-w-0 opacity-0",
        )}
        aria-hidden={!showText}
      >
        Timefy
      </span>
    </>
  );
};
