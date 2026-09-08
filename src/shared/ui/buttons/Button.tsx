import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  variant: "primary" | "secondary" | "outlet";
  icon?: ReactNode;
  iconPosition?: "right" | "left";
  children: ReactNode;
};

const VARIANTS = {
  primary:
    "bg-primary text-primary-foreground shadow-xl shadow-primary/25 hover:shadow-2xl hover:-translate-y-1",
  secondary:
    "mt-10 bg-secondary text-secondary-foreground font-bold px-8 py-3 rounded-full hover:bg-bg-surface transition-colors shadow-lg shadow-secondary/20",
  outlet: "bg-bg-surface text-text-main border border-border hover:bg-bg-main",
};

const Button = ({
  href,
  variant = "primary",
  icon,
  iconPosition = "right",
  children,
}: ButtonProps) => {
  return (
    <a
      href={href}
      className={`px-8 py-4 rounded-full font-semibold transition-all flex items-center justify-center gap-2 ${VARIANTS[variant]}`}
    >
      {iconPosition === "left" && icon}
      {children}
      {iconPosition === "right" && icon}
    </a>
  );
};

export default Button;
