import { toast } from "sonner";

type NotifyOptions = {
  description?: string;
  duration?: number;
};

export const notify = {
  success: (message: string, options?: NotifyOptions) =>
    toast.success(message, {
      ...options,
      style: { borderLeft: "3px solid #4ecdc4", background: "#f0fdfb" },
    }),
  error: (message: string, options?: NotifyOptions) =>
    toast.error(message, {
      ...options,
      style: { borderLeft: "3px solid #f87171", background: "#fef2f2" },
    }),
  warning: (message: string, options?: NotifyOptions) =>
    toast.warning(message, {
      ...options,
      style: { borderLeft: "3px solid #fbbf24", background: "#fffbeb" },
    }),
  info: (message: string, options?: NotifyOptions) =>
    toast.info(message, {
      ...options,
      style: { borderLeft: "3px solid #1a3c40", background: "#f0f4f4" },
    }),

  promise: <T>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string },
  ) => toast.promise(promise, messages),
};
