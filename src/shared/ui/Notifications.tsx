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
    className={`flex size-7 shrink-0 items-center justify-center rounded-lg ${className}`}
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
      duration={2500}
      gap={8}
      visibleToasts={3}
      offset={{ top: 16 }}
      mobileOffset={{ top: 10, right: 16, left: 16 }}
      containerAriaLabel="Сповіщення"
      icons={{
        success: (
          <StatusIcon className="bg-success-surface text-success">
            <CheckCircle2 className="size-4" />
          </StatusIcon>
        ),
        error: (
          <StatusIcon className="bg-error-surface text-error">
            <XCircle className="size-4" />
          </StatusIcon>
        ),
        warning: (
          <StatusIcon className="bg-warning-surface text-warning">
            <AlertTriangle className="size-4" />
          </StatusIcon>
        ),
        info: (
          <StatusIcon className="bg-info-surface text-primary">
            <Info className="size-4" />
          </StatusIcon>
        ),
      }}
      toastOptions={{
        classNames: {
          toast:
            "!w-[calc(100vw-2rem)] !max-w-[360px] !gap-2.5 !rounded-xl !border !border-border/80 !bg-bg-surface !p-3 !font-sans !shadow-[0_12px_36px_-18px_rgba(15,35,37,0.34)]",
          content: "!gap-0.5",
          icon: "!m-0 !size-7 !self-start",
          title: "!text-[13px] !font-semibold !leading-4 !text-text-main",
          description: "!text-xs !leading-4 !text-text-muted",
          actionButton:
            "!h-8 !rounded-lg !bg-primary !px-3 !text-xs !font-semibold !text-primary-foreground hover:!bg-primary/90",
          cancelButton:
            "!h-8 !rounded-lg !bg-muted !px-3 !text-xs !font-semibold !text-text-main hover:!bg-accent",
        },
      }}
    />
  );
};
