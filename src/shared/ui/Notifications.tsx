import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import { Toaster } from "sonner";
import { useThemeStore } from "@/shared/model/themeStore";

export const Notifications = () => {
  const isDark = useThemeStore((state) => state.isDark);

  return (
    <Toaster
      theme={isDark ? "dark" : "light"}
      position="top-right"
      richColors={false}
      closeButton={true}
      duration={3000}
      icons={{
        success: <CheckCircle size={18} className="text-success" />,
        error: <XCircle size={18} className="text-error" />,
        warning: <AlertTriangle size={18} className="text-warning" />,
        info: <Info size={18} className="text-primary" />,
      }}
      toastOptions={{
        style: {
          fontFamily: "Inter, sans-serif",
          borderRadius: "10px",
          fontSize: "14px",
          borderLeft: "3px solid",
        },
        classNames: {
          toast: `border border-border shadow-sm overflow-hidden relative
            after:content-[''] after:absolute after:bottom-0 after:left-0
            after:h-[2px] after:w-full after:animate-[shrink_3s_linear_forwards]`,
          title: "text-text-main font-medium text-sm",
          description: "text-text-muted text-xs",
          closeButton:
            "!top-[8px] !right-[-6px] !left-auto !translate-y-0 !bg-transparent !border-none !shadow-none !w-7 !h-7 !text-text-main !p-0 [&>svg]:!w-4 [&>svg]:!h-4",
        },
      }}
    />
  );
};
