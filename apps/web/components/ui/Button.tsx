import Link from "next/link";
import { Button as SharedButton } from "@snap/shared";

type ButtonVariant = "ghost" | "subtle" | "solid" | "outlined";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  active?: boolean;
  href?: string;
}

function isExternal(href: string) {
  return href.startsWith("http") || href.startsWith("//");
}

export default function Button({ href, ...props }: ButtonProps) {
  if (href) {
    if (isExternal(href)) {
      return (
        <SharedButton
          {...props}
          renderLink={({ href: linkHref, className, children }) => (
            <a href={linkHref} className={className} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          )}
          href={href}
        />
      );
    }

    return (
      <SharedButton
        {...props}
        renderLink={({ href: linkHref, className, children }) => (
          <Link href={linkHref} className={className}>
            {children}
          </Link>
        )}
        href={href}
      />
    );
  }

  return <SharedButton {...props} />;
}
