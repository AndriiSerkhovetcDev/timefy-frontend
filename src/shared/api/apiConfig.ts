const API_V1_SUFFIX = /\/api\/v1\/?$/;

export const API_V1_BASE_URL = import.meta.env.VITE_API_URL;
export const API_V2_BASE_URL = API_V1_BASE_URL.replace(API_V1_SUFFIX, "/api/v2");

export const createApiUrl = (baseUrl: string, endpoint: string) => `${baseUrl}${endpoint}`;
