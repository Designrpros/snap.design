import React from "react";
type ButtonVariant = "ghost" | "subtle" | "solid" | "outlined";
type ButtonSize = "sm" | "md" | "lg";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    active?: boolean;
    href?: string;
    /** Render prop for custom link component (e.g. next/link) */
    renderLink?: (props: {
        href: string;
        className: string;
        children: React.ReactNode;
    }) => React.ReactNode;
}
export declare function Button({ variant, size, active, href, renderLink, className, children, ...props }: ButtonProps): string | number | bigint | boolean | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | import("react/jsx-runtime").JSX.Element | null | undefined;
export {};
//# sourceMappingURL=Button.d.ts.map