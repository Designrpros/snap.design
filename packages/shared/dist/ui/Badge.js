import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "../utils";
export function Badge({ children, className }) {
    return (_jsx("span", { className: cn("inline-flex items-center px-2 py-0.5 bg-off-white border border-steel-gray rounded-buttons font-af text-caption text-slate-gray", className), children: children }));
}
