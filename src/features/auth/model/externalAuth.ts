import { API_V2_BASE_URL, createApiUrl } from "@/shared/api/apiConfig";

export type ExternalAuthProvider = "GOOGLE" | "FACEBOOK" | "INSTAGRAM" | "APPLE";

type ExternalAuthProviderMetadata = {
  label: string;
  authorizationUrl: string;
  enabled: boolean;
};

export const EXTERNAL_AUTH_PROVIDERS: Record<ExternalAuthProvider, ExternalAuthProviderMetadata> = {
  GOOGLE: {
    label: "Google",
    authorizationUrl: createApiUrl(API_V2_BASE_URL, "/auth/oauth/google"),
    enabled: true,
  },
  FACEBOOK: {
    label: "Facebook",
    authorizationUrl: createApiUrl(API_V2_BASE_URL, "/auth/oauth/facebook"),
    enabled: false,
  },
  INSTAGRAM: {
    label: "Instagram",
    authorizationUrl: createApiUrl(API_V2_BASE_URL, "/auth/oauth/instagram"),
    enabled: false,
  },
  APPLE: {
    label: "Apple",
    authorizationUrl: createApiUrl(API_V2_BASE_URL, "/auth/oauth/apple"),
    enabled: false,
  },
};

export const isExternalAuthProvider = (value: string | null): value is ExternalAuthProvider =>
  value !== null && value in EXTERNAL_AUTH_PROVIDERS;

export const isEnabledExternalAuthProvider = (
  provider: ExternalAuthProvider,
): provider is "GOOGLE" => EXTERNAL_AUTH_PROVIDERS[provider].enabled;

export const startExternalAuthorization = (provider: ExternalAuthProvider) => {
  const metadata = EXTERNAL_AUTH_PROVIDERS[provider];

  if (metadata.enabled) {
    window.location.assign(metadata.authorizationUrl);
  }
};
