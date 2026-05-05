"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { getDesignById } from "@/data/designs";

export default function Navbar() {
  const pathname = usePathname();

  let breadcrumb: React.ReactNode = "Snap.Design";

  if (pathname !== "/") {
    const segments = pathname.split("/").filter(Boolean);
    const id = segments[0];
    const design = id ? getDesignById(id) : null;

    breadcrumb = (
      <span className="flex items-center gap-2">
        <Link href="/" className="hover:text-medium-gray transition-colors">
          Snap.Design
        </Link>
        <span className="text-steel-gray">/</span>
        <span className="text-dark-charcoal">
          {design?.title ?? "Not found"}
        </span>
      </span>
    );
  }

  return (
    <header className="border-b border-steel-gray bg-warm-beige">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-14 flex items-center">
        <nav className="font-af text-subheading text-dark-charcoal">
          {breadcrumb}
        </nav>
      </div>
    </header>
  );
}
