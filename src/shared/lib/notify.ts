import { toast } from "sonner";

type NotifyOptions = {
  description?: string;
  duration?: number;
};

export const notify = {
  success: (message: string, options?: NotifyOptions) =>
    toast.success(message, {
      ...options,
      style: { borderLeft: "3px solid var(--success)", background: "var(--success-surface)" },
      classNames: {
        toast: "after:bg-success",
      },
    }),
  error: (message: string, options?: NotifyOptions) =>
    toast.error(message, {
      ...options,
      style: { borderLeft: "3px solid var(--error)", background: "var(--error-surface)" },
      classNames: {
        toast: "after:bg-error",
      },
    }),
  warning: (message: string, options?: NotifyOptions) =>
    toast.warning(message, {
      ...options,
      style: { borderLeft: "3px solid var(--warning)", background: "var(--warning-surface)" },
      classNames: {
        toast: "after:bg-warning",
      },
    }),
  info: (message: string, options?: NotifyOptions) =>
    toast.info(message, {
      ...options,
      style: { borderLeft: "3px solid var(--primary)", background: "var(--info-surface)" },
      classNames: {
        toast: "after:bg-primary",
      },
    }),

  promise: <T>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string },
  ) => toast.promise(promise, messages),
};
