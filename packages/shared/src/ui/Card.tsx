import React from "react";
import { cn } from "../utils";

interface CardProps {
  children: React.ReactNode;
  size?: "md" | "lg";
  hover?: boolean;
  className?: string;
}

export function Card({
  children,
  size = "md",
  hover = false,
  className,
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-powder border border-chalk",
        size === "md" && "rounded-xl",
        size === "lg" && "rounded-2xl",
        hover && "transition-all duration-500 hover:shadow-subtle-4 hover:bg-eggshell",
        className
      )}
    >
      {children}
    </div>
  );
}
