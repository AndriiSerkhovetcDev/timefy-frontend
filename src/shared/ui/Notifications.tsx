import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import { Toaster } from "sonner";

export const Notifications = () => {
  return (
    <Toaster
      position="top-right"
      richColors={false}
      icons={{
        success: <CheckCircle size={16} color="#4ecdc4" />,
        error: <XCircle size={16} color="#f87171" />,
        warning: <AlertTriangle size={16} color="#fbbf24" />,
        info: <Info size={16} color="#1a3c40" />,
      }}
      toastOptions={{
        style: {
          fontFamily: "Inter, sans-serif",
          borderRadius: "10px",
          fontSize: "14px",
          borderLeft: "3px solid",
        },
        classNames: {
          toast: "border border-gray-100 shadow-sm",
          title: "text-[#1a3c40] font-medium text-sm",
          description: "text-gray-500 text-xs",
        },
      }}
    />
  );
};
