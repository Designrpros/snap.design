import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: boolean;
}

export default function Input({ icon = false, className, ...props }: InputProps) {
  return (
    <div className="relative w-full max-w-xl">
      {icon && (
        <svg
          className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-gray"
          width="20"
          height="20"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.333 12.667A5.333 5.333 0 107.333 2a5.333 5.333 0 000 10.667zM14 14l-2.9-2.9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      <input
        className={cn(
          "w-full h-14 bg-canvas-white border-2 border-steel-gray text-dark-charcoal font-af text-lg px-6 placeholder:text-slate-gray focus:outline-none focus:border-dark-charcoal transition-colors rounded-full shadow-inner",
          icon && "pl-14",
          className
        )}
        {...props}
      />
    </div>
  );
}
