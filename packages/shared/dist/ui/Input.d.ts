import React from "react";
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: boolean;
    /** Renders an inset action button inside the input on the right */
    insetAction?: React.ReactNode;
}
export declare function Input({ icon, insetAction, className, ...props }: InputProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=Input.d.ts.map