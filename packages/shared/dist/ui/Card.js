import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "../utils";
export function Card({ children, size = "md", hover = false, className, }) {
    return (_jsx("div", { className: cn("bg-canvas-white border border-steel-gray", size === "md" && "rounded-2xl", size === "lg" && "rounded-3xl", hover && "transition-all duration-300 hover:border-slate-gray", className), children: children }));
}
