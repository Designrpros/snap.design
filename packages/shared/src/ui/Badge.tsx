import React from "react";
import { cn } from "../utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 bg-eggshell border border-chalk rounded-full font-af text-[11px] text-gravel uppercase tracking-wider",
        className
      )}
    >
      {children}
    </span>
  );
}
