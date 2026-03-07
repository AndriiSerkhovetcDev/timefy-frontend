import type { NavItemType } from "../model/types";

const variantClasses = {
  default:
    "block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50",
  outline: "text-center px-6 py-2 border border-gray-200 rounded-lg text-primary font-medium",
  primary: "text-center w-full py-2 bg-primary text-white rounded-lg font-medium shadow-md",
  desktop: "text-gray-500 hover:text-primary font-medium transition-colors",
  desktopOutline: "text-primary font-semibold hover:text-secondary transition-colors",
  desktopPrimary:
    "bg-primary hover:bg-opacity-90 text-white px-6 py-2.5 rounded-full font-medium shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-0.5",
};

export type NavVariant = keyof typeof variantClasses;

export const NavItem = ({ text, link, variant = "default" }: NavItemType) => {
  return (
    <a href={link} className={variantClasses[variant]}>
      {text}
    </a>
  );
};
