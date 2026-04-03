import { toast } from "sonner";
import { notify } from "./notify";

export const withNotify = async <T>(
  promise: Promise<T>,
  messages?: { loading?: string; success?: string },
): Promise<T> => {
  let toastId: string | number | undefined;
  const LOADING_DELAY = 500; // показуємо loading тільки якщо > 500ms

  const loadingTimer = messages?.loading
    ? setTimeout(() => {
        toastId = toast.loading(messages.loading);
      }, LOADING_DELAY)
    : undefined;

  try {
    const result = await promise;
    clearTimeout(loadingTimer);
    if (toastId) toast.dismiss(toastId);
    if (messages?.success) notify.success(messages.success);
    return result;
  } catch (e) {
    clearTimeout(loadingTimer);
    if (toastId) toast.dismiss(toastId);
    notify.error(e instanceof Error ? e.message : "Щось пішло не так");
    throw e;
  }
};
