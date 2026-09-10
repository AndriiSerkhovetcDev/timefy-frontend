import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/model/authStore";
import {
  EXTERNAL_AUTH_PROVIDERS,
  isEnabledExternalAuthProvider,
  isExternalAuthProvider,
  startExternalAuthorization,
} from "@/features/auth/model/externalAuth";
import {
  clearOAuthCallback,
  consumeOAuthCallback,
  parseLegacyOAuthCallback,
} from "@/features/auth/model/oauthCallback";
import { exchangeExternalAuthCode, type ExternalAuthExchangeResponse } from "@/shared/api/authApi";
import { PageLoader } from "@/shared/ui";

const exchangeRequests = new Map<string, Promise<ExternalAuthExchangeResponse>>();

const exchangeCodeOnce = (exchangeCode: string) => {
  const activeRequest = exchangeRequests.get(exchangeCode);

  if (activeRequest) {
    return activeRequest;
  }

  const request = exchangeExternalAuthCode(exchangeCode);
  exchangeRequests.set(exchangeCode, request);
  return request;
};

type CallbackStatus = "loading" | "error";

export const AuthCallbackPage = () => {
  const [callback] = useState(consumeOAuthCallback);
  const [status, setStatus] = useState<CallbackStatus>("loading");
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  useEffect(() => {
    let isActive = true;

    const failSafely = () => {
      clearOAuthCallback();
      if (isActive) {
        setStatus("error");
      }
    };

    const authenticate = async () => {
      if (callback.error) {
        failSafely();
        return;
      }

      if (callback.exchangeCode) {
        try {
          const response = await exchangeCodeOnce(callback.exchangeCode);
          const { provider, token, user } = response.data;

          if (!isExternalAuthProvider(provider) || !isEnabledExternalAuthProvider(provider)) {
            failSafely();
            return;
          }

          if (!isActive) {
            return;
          }

          clearOAuthCallback();
          login(user, token);
          navigate("/", { replace: true });
        } catch {
          failSafely();
        }
        return;
      }

      const legacyAuth = parseLegacyOAuthCallback(callback.legacyToken, callback.legacyUser);

      if (!legacyAuth) {
        failSafely();
        return;
      }

      clearOAuthCallback();
      login(legacyAuth.user, legacyAuth.token);
      navigate("/", { replace: true });
    };

    void authenticate();

    return () => {
      isActive = false;
    };
  }, [callback, login, navigate]);

  if (status === "loading") {
    return <PageLoader />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-main px-4">
      <section className="w-full max-w-md rounded-2xl border border-border bg-bg-surface p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-primary">Не вдалося завершити авторизацію</h1>
        <p className="mt-3 text-sm text-text-muted">
          Спробуйте ще раз. Якщо проблема повториться, поверніться на сторінку входу.
        </p>
        <button
          type="button"
          onClick={() => startExternalAuthorization("GOOGLE")}
          className="mt-6 w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 active:scale-95"
        >
          Спробувати через {EXTERNAL_AUTH_PROVIDERS.GOOGLE.label} ще раз
        </button>
        <button
          type="button"
          onClick={() => navigate("/login", { replace: true })}
          className="mt-3 w-full rounded-lg border border-border py-2.5 text-sm font-medium text-text-main transition hover:bg-bg-main"
        >
          Повернутися до входу
        </button>
      </section>
    </main>
  );
};
