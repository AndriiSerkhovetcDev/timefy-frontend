import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { AuthState } from "./types";

const AUTH_STORAGE_KEY = "auth-storage";
const AUTH_CHANNEL_NAME = "timefy-auth";

type AuthChannelMessage = {
  type: "LOGOUT";
};

let authChannel: BroadcastChannel | null = null;
let isAuthSessionSyncInitialized = false;

const broadcastLogout = () => {
  if (typeof BroadcastChannel === "undefined") return;

  authChannel ??= new BroadcastChannel(AUTH_CHANNEL_NAME);
  authChannel.postMessage({ type: "LOGOUT" } satisfies AuthChannelMessage);
};

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        login: (user, token) =>
          set({
            user,
            token,
          }),
        setUser: (user) => set({ user }),
        logout: () => {
          set({
            user: null,
            token: null,
          });
          broadcastLogout();
        },
        setEmailVerified: (value) =>
          set((state) => ({
            user: state.user ? { ...state.user, emailVerified: value } : null,
          })),
      }),

      {
        name: AUTH_STORAGE_KEY,
        partialize: (state) => ({
          token: state.token,
          user: state.user,
        }),
      },
    ),
  ),
);

//selectors
export const selectIsAuthenticated = (state: AuthState) => !!state.token;
export const selectUser = (state: AuthState) => state.user;
export const selectToken = (state: AuthState) => state.token;
export const selectUserEmail = (state: AuthState) => state.user?.email;
export const selectUserLogin = (state: AuthState) => state.user?.login;
export const selectIsEmailVerified = (state: AuthState) => state.user?.emailVerified;

export const initializeAuthSessionSync = () => {
  if (isAuthSessionSyncInitialized) return;
  isAuthSessionSyncInitialized = true;

  const clearSession = () => useAuthStore.setState({ user: null, token: null });

  if (typeof BroadcastChannel !== "undefined") {
    authChannel ??= new BroadcastChannel(AUTH_CHANNEL_NAME);
    authChannel.addEventListener("message", (event: MessageEvent<AuthChannelMessage>) => {
      if (event.data?.type === "LOGOUT") clearSession();
    });
  }

  window.addEventListener("storage", (event) => {
    if (event.key !== AUTH_STORAGE_KEY) return;

    try {
      const persisted = event.newValue ? JSON.parse(event.newValue) : null;
      if (!persisted?.state?.token) clearSession();
    } catch {
      clearSession();
    }
  });
};
