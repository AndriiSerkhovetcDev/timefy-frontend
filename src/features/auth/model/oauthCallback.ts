import type { User } from "./types";

export type OAuthCallbackPayload = {
  provider: string | null;
  exchangeCode: string | null;
  error: string | null;
  legacyToken: string | null;
  legacyUser: string | null;
};

let activeCallbackPayload: OAuthCallbackPayload | null = null;

export const consumeOAuthCallback = (): OAuthCallbackPayload => {
  if (window.location.search) {
    const params = new URLSearchParams(window.location.search);

    activeCallbackPayload = {
      provider: params.get("provider"),
      exchangeCode: params.get("exchangeCode"),
      error: params.get("error"),
      legacyToken: params.get("token"),
      legacyUser: params.get("user"),
    };

    window.history.replaceState({}, document.title, window.location.pathname);
  }

  return (
    activeCallbackPayload ?? {
      provider: null,
      exchangeCode: null,
      error: null,
      legacyToken: null,
      legacyUser: null,
    }
  );
};

export const clearOAuthCallback = () => {
  activeCallbackPayload = null;
};

/** @deprecated Remove only after the product owner ends OAuth v1 callback support. */
export const parseLegacyOAuthCallback = (
  token: string | null,
  serializedUser: string | null,
): { token: string; user: User } | null => {
  if (!token || !serializedUser) {
    return null;
  }

  try {
    const user: unknown = JSON.parse(decodeURIComponent(serializedUser));

    if (
      !user ||
      typeof user !== "object" ||
      !("login" in user) ||
      !("email" in user) ||
      !("role" in user)
    ) {
      return null;
    }

    return { token, user: user as User };
  } catch {
    return null;
  }
};
