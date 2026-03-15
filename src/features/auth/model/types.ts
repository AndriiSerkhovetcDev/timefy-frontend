export type User = {
  id: string;
  login: string;
  role: "ADMIN" | "SUPPORT" | "OWNER";
  first_name?: string;
  last_name?: string;
  email: string;
  phone: string;
};

export type AuthState = {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
};
