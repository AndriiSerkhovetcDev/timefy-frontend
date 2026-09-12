import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/model/authStore";
import { ApiError, refreshSession } from "@/shared/api/httpClient";
import { PageLoader } from "@/shared/ui";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

type AuthBootstrapProps = {
  children: ReactNode;
};

type BootstrapStatus = "checking" | "ready" | "temporary-error";

const isProtectedPath = (pathname: string) =>
  pathname.startsWith("/account") ||
  pathname.startsWith("/organizations") ||
  pathname === "/verify-email";

export const AuthBootstrap = ({ children }: AuthBootstrapProps) => {
  const { pathname } = useLocation();
  const [status, setStatus] = useState<BootstrapStatus>(() =>
    useAuthStore.getState().token ? "ready" : "checking",
  );

  const restoreSession = useCallback(async () => {
    if (useAuthStore.getState().token) {
      setStatus("ready");
      return;
    }

    setStatus("checking");
    try {
      await refreshSession();
      setStatus("ready");
    } catch (error) {
      const sessionIsInvalid =
        error instanceof ApiError && error.errorCode === "AUTH_REFRESH_INVALID";

      if (sessionIsInvalid || !isProtectedPath(pathname)) {
        setStatus("ready");
        return;
      }

      setStatus("temporary-error");
    }
  }, [pathname]);

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  if (status === "checking") return <PageLoader />;

  if (status === "temporary-error") {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl border bg-card p-6 text-center shadow-sm">
          <AlertCircle className="mx-auto size-10 text-warning" aria-hidden="true" />
          <h1 className="mt-4 text-xl font-semibold">Не вдалося перевірити сесію</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Це може бути тимчасова проблема мережі. Спробуйте ще раз.
          </p>
          <Button type="button" className="mt-5 w-full" onClick={restoreSession}>
            <RefreshCw aria-hidden="true" />
            Повторити
          </Button>
        </div>
      </main>
    );
  }

  return children;
};
