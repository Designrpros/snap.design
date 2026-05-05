import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  size?: "md" | "lg";
  hover?: boolean;
  className?: string;
}

export default function Card({
  children,
  size = "md",
  hover = false,
  className,
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-canvas-white border border-steel-gray",
        size === "md" && "rounded-2xl",
        size === "lg" && "rounded-3xl",
        hover && "transition-all duration-300 hover:border-slate-gray",
        className
      )}
    >
      {children}
    </div>
  );
}
