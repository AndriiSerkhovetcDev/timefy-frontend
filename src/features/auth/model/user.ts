import type { User } from "./types";

export const getUserDisplayName = (user: User) => {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
  return fullName || user.login;
};

export const getUserInitials = (user: User) => {
  const names = [user.firstName, user.lastName].filter(Boolean) as string[];
  const source = names.length ? names : [user.login];

  return source
    .map((value) => value[0]?.toUpperCase())
    .join("")
    .slice(0, 2);
};
