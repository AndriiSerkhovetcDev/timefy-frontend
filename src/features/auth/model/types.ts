export type User = {
  login: string;
  role: "USER" | "ADMIN" | "SUPPORT" | "OWNER";
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  emailVerified: boolean;
  avatar?: string;
  authData?: {
    isWeb: boolean;
    isGoogle: boolean;
  };
};

export type AuthState = {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  setEmailVerified: (value: boolean) => void;
};
