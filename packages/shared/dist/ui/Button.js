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
import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "../utils";
const variantStyles = {
    ghost: "bg-transparent text-dark-charcoal hover:bg-ash-gray rounded-full",
    subtle: "bg-ash-gray text-dark-charcoal hover:bg-cool-gray rounded-full",
    solid: "bg-dark-charcoal text-white hover:bg-charcoal rounded-full",
    outlined: "bg-transparent text-dark-charcoal border border-steel-gray hover:border-dark-charcoal rounded-full",
};
const sizeStyles = {
    sm: "px-4 py-1.5 text-caption",
    md: "px-5 py-2 text-button-label",
    lg: "px-8 py-3 text-subheading",
};
export function Button(_a) {
    var { variant = "ghost", size = "md", active = false, href, renderLink, className, children } = _a, props = __rest(_a, ["variant", "size", "active", "href", "renderLink", "className", "children"]);
    // twMerge conflates text-color classes (text-dark-charcoal) with font-size
    // classes (text-button-label) and strips the color. Split them.
    const merged = cn("inline-flex items-center justify-center font-af font-medium transition-all duration-200", variantStyles[variant], active &&
        variant === "outlined" &&
        "bg-dark-charcoal text-white border-dark-charcoal hover:bg-charcoal", className);
    const baseStyles = [merged, sizeStyles[size]].join(" ");
    if (href && renderLink) {
        return renderLink({ href, className: baseStyles, children });
    }
    return (_jsx("button", Object.assign({ className: baseStyles }, props, { children: children })));
}
