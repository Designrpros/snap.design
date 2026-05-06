var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../utils";
export function Input(_a) {
    var { icon = false, insetAction, className } = _a, props = __rest(_a, ["icon", "insetAction", "className"]);
    return (_jsxs("div", { className: "relative w-full max-w-xl", children: [icon && (_jsx("svg", { className: "absolute left-6 top-1/2 -translate-y-1/2 text-slate-gray pointer-events-none", width: "20", height: "20", viewBox: "0 0 16 16", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M7.333 12.667A5.333 5.333 0 107.333 2a5.333 5.333 0 000 10.667zM14 14l-2.9-2.9", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }) })), _jsx("input", Object.assign({ className: cn("w-full h-14 bg-canvas-white border-2 border-steel-gray text-dark-charcoal font-af text-lg px-6 placeholder:text-slate-gray focus:outline-none focus:border-dark-charcoal transition-colors rounded-full shadow-inner", icon && "pl-14", insetAction && "pr-20", className) }, props)), insetAction && (_jsx("div", { className: "absolute right-2 top-1/2 -translate-y-1/2", children: insetAction }))] }));
}
