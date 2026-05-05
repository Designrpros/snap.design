import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "ghost" | "subtle" | "solid" | "outlined";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  active?: boolean;
  href?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  ghost:
    "bg-transparent text-dark-charcoal hover:bg-ash-gray rounded-full",
  subtle:
    "bg-ash-gray text-dark-charcoal hover:bg-cool-gray rounded-full",
  solid:
    "bg-dark-charcoal text-canvas-white hover:bg-charcoal rounded-full",
  outlined:
    "bg-transparent text-dark-charcoal border border-steel-gray hover:border-dark-charcoal rounded-full",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-1.5 text-caption",
  md: "px-5 py-2 text-button-label",
  lg: "px-8 py-3 text-subheading",
};

export default function Button({
  variant = "ghost",
  size = "md",
  active = false,
  href,
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = cn(
    "inline-flex items-center justify-center font-af font-medium transition-all duration-200",
    variantStyles[variant],
    sizeStyles[size],
    active &&
      variant === "outlined" &&
      "bg-dark-charcoal text-canvas-white border-dark-charcoal hover:bg-charcoal",
    className
  );

  if (href) {
    return (
      <Link href={href} className={baseStyles}>
        {children}
      </Link>
    );
  }

  return (
    <button className={baseStyles} {...props}>
      {children}
    </button>
  );
}
