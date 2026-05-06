import React from "react";
import { cn } from "../utils";

type ButtonVariant = "ghost" | "subtle" | "solid" | "outlined";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  active?: boolean;
  href?: string;
  /** Render prop for custom link component (e.g. next/link) */
  renderLink?: (props: { href: string; className: string; children: React.ReactNode }) => React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  ghost: "bg-transparent text-obsidian hover:bg-powder rounded-full",
  subtle: "bg-powder text-obsidian hover:bg-chalk rounded-full",
  solid: "bg-obsidian text-eggshell hover:opacity-90 rounded-full shadow-subtle-2",
  outlined: "bg-transparent text-obsidian border border-chalk hover:border-obsidian rounded-full",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3.5 py-1.5 text-[13px]",
  md: "px-5 py-2 text-[14px]",
  lg: "px-8 py-3 text-[16px]",
};

export function Button({
  variant = "ghost",
  size = "md",
  active = false,
  href,
  renderLink,
  className,
  children,
  ...props
}: ButtonProps) {
  const merged = cn(
    "inline-flex items-center justify-center font-af font-medium transition-all duration-200",
    variantStyles[variant],
    active &&
      (variant === "outlined" || variant === "ghost") &&
      "bg-obsidian text-eggshell border-obsidian hover:opacity-90 shadow-subtle-2",
    className
  );

  const baseStyles = [merged, sizeStyles[size]].join(" ");

  if (href && renderLink) {
    return renderLink({ href, className: baseStyles, children });
  }

  return (
    <button className={baseStyles} {...props}>
      {children}
    </button>
  );
}
