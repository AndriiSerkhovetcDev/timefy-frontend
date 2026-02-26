import type { NavVariant } from "../ui/NavItem";

export type NavItemType = {
  id: string;
  text: string;
  link: string;
  variant?: NavVariant;
};
