import type { User } from "@/features/auth/model/types";
export { getUserDisplayName as getDisplayName, getUserInitials } from "@/features/auth/model/user";
import { Bell, CircleUserRound, LayoutDashboard, LockKeyhole, type LucideIcon } from "lucide-react";

export type AccountSection = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

export const ACCOUNT_SECTIONS: AccountSection[] = [
  {
    title: "Головна",
    description: "Стан профілю та важливі персональні дії",
    href: "/account",
    icon: LayoutDashboard,
  },
  {
    title: "Особисті дані",
    description: "Контактна інформація та налаштування профілю",
    href: "/account/personal",
    icon: CircleUserRound,
  },
  {
    title: "Безпека",
    description: "Пароль і способи входу до облікового запису",
    href: "/account/security",
    icon: LockKeyhole,
  },
  {
    title: "Сповіщення",
    description: "Доступні канали персональних повідомлень",
    href: "/account/notifications",
    icon: Bell,
  },
];

export const getAccountSection = (pathname: string) =>
  ACCOUNT_SECTIONS.find((section) => section.href === pathname) ?? ACCOUNT_SECTIONS[0];

export type ProfileAction = {
  label: string;
  href: string;
};

export const getProfileProgress = (user: User) => {
  const fields = [user.firstName, user.lastName, user.email, user.phone];
  const completedFields = fields.filter((value) => Boolean(value?.trim())).length;
  const actions: ProfileAction[] = [];

  if (!user.emailVerified) {
    actions.push({ label: "Підтвердити email", href: "/account/personal" });
  }
  if (!user.phone?.trim()) {
    actions.push({ label: "Додати номер телефону", href: "/account/personal" });
  }
  if (!user.firstName?.trim() || !user.lastName?.trim()) {
    actions.push({ label: "Заповнити ім’я та прізвище", href: "/account/personal" });
  }
  return {
    percentage: Math.round((completedFields / fields.length) * 100),
    actions,
  };
};
