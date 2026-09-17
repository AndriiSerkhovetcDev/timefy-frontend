export type OAuthCallbackPayload = {
  provider: string | null;
  code: string | null;
  error: string | null;
};

let activeCallbackPayload: OAuthCallbackPayload | null = null;

export const consumeOAuthCallback = (): OAuthCallbackPayload => {
  if (window.location.search || window.location.hash) {
    const callbackParameters = window.location.hash
      ? window.location.hash.slice(1)
      : window.location.search;
    const params = new URLSearchParams(callbackParameters);

    activeCallbackPayload = {
      provider: params.get("provider"),
      code: params.get("code"),
      error: params.get("error"),
    };

    window.history.replaceState({}, document.title, window.location.pathname);
  }

  return (
    activeCallbackPayload ?? {
      provider: null,
      code: null,
      error: null,
    }
  );
};

export const clearOAuthCallback = () => {
  activeCallbackPayload = null;
};
