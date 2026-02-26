import type { NavItemType } from "./types";

export const navItems: NavItemType[] = [
  { id: "features", text: "Features", link: "#features" },
  { id: "howItWork", text: "How it Works", link: "#how-it-works" },
  { id: "pricing", text: "Pricing", link: "#pricing" },
];

export const modileNavBtns: NavItemType[] = [
  { id: "login", text: "Log In", link: "", variant: "outline" },
  { id: "trial", text: "Start Free Trial", link: "#", variant: "primary" },
];

export const desktopNavBtns: NavItemType[] = [
  { id: "login", text: "Log In", link: "", variant: "desktopOutline" },
  { id: "trial", text: "Start Free Trial", link: "#", variant: "desktopPrimary" },
];
