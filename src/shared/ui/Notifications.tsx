import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { useThemeStore } from "@/shared/model/themeStore";

type StatusIconProps = {
  children: ReactNode;
  className: string;
};

const StatusIcon = ({ children, className }: StatusIconProps) => (
  <span
    aria-hidden="true"
    className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${className}`}
  >
    {children}
  </span>
);

export const Notifications = () => {
  const isDark = useThemeStore((state) => state.isDark);

  return (
    <Toaster
      theme={isDark ? "dark" : "light"}
      position="top-center"
      richColors={false}
      closeButton
      duration={2500}
      gap={10}
      visibleToasts={4}
      offset={{ top: 20 }}
      mobileOffset={{ top: 12, right: 12, left: 12 }}
      containerAriaLabel="Сповіщення"
      icons={{
        success: (
          <StatusIcon className="bg-success-surface text-success">
            <CheckCircle2 className="size-[18px]" />
          </StatusIcon>
        ),
        error: (
          <StatusIcon className="bg-error-surface text-error">
            <XCircle className="size-[18px]" />
          </StatusIcon>
        ),
        warning: (
          <StatusIcon className="bg-warning-surface text-warning">
            <AlertTriangle className="size-[18px]" />
          </StatusIcon>
        ),
        info: (
          <StatusIcon className="bg-info-surface text-primary">
            <Info className="size-[18px]" />
          </StatusIcon>
        ),
      }}
      toastOptions={{
        closeButtonAriaLabel: "Закрити сповіщення",
        classNames: {
          toast:
            "!w-[calc(100vw-1.5rem)] !max-w-[390px] !gap-3 !rounded-2xl !border !border-border/80 !bg-bg-surface !p-4 !pr-11 !font-sans !shadow-[0_16px_48px_-20px_rgba(15,35,37,0.38)]",
          content: "!gap-1",
          icon: "!m-0 !size-9 !self-start",
          title: "!text-sm !font-semibold !leading-5 !text-text-main",
          description: "!text-[13px] !leading-5 !text-text-muted",
          closeButton:
            "!top-3 !right-3 !left-auto !size-7 !translate-x-0 !translate-y-0 !border-0 !bg-transparent !text-text-muted !shadow-none transition-colors hover:!bg-muted hover:!text-text-main focus-visible:!ring-2 focus-visible:!ring-ring [&>svg]:!size-4",
          actionButton:
            "!h-8 !rounded-lg !bg-primary !px-3 !text-xs !font-semibold !text-primary-foreground hover:!bg-primary/90",
          cancelButton:
            "!h-8 !rounded-lg !bg-muted !px-3 !text-xs !font-semibold !text-text-main hover:!bg-accent",
        },
      }}
    />
  );
};
