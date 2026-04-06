import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import { Toaster } from "sonner";

export const Notifications = () => {
  return (
    <Toaster
      position="top-right"
      richColors={false}
      closeButton={true}
      duration={3000}
      icons={{
        success: <CheckCircle size={18} color="#4ecdc4" />,
        error: <XCircle size={18} fill="#f87171" color="white" />,
        warning: <AlertTriangle size={18} color="#fbbf24" />,
        info: <Info size={18} color="#1a3c40" />,
      }}
      toastOptions={{
        style: {
          fontFamily: "Inter, sans-serif",
          borderRadius: "10px",
          fontSize: "14px",
          borderLeft: "3px solid",
        },
        classNames: {
          toast: `border border-gray-100 shadow-sm overflow-hidden relative
            after:content-[''] after:absolute after:bottom-0 after:left-0
            after:h-[2px] after:w-full after:animate-[shrink_3s_linear_forwards]`,
          title: "text-[#1a3c40] font-medium text-sm",
          description: "text-gray-500 text-xs",
          closeButton:
            "!top-[8px] !right-[-6px] !left-auto !translate-y-0 !bg-transparent !border-none !shadow-none !w-7 !h-7 !text-gray-900 !p-0 [&>svg]:!w-4 [&>svg]:!h-4",
        },
      }}
    />
  );
};
