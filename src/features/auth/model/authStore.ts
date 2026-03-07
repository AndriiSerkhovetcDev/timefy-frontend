import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { AuthState } from "./types";

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
        logout: () =>
          set({
            user: null,
            token: null,
          }),
      }),
      {
        name: "auth-storage",
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
