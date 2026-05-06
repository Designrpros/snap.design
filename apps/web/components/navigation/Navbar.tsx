"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { getDesignById } from "@/data/designs";

export default function Navbar() {
  const pathname = usePathname();

  let breadcrumb: React.ReactNode = (
    <span className="flex items-center gap-2">
      <span className="w-7 h-7 rounded-full bg-obsidian text-eggshell flex items-center justify-center font-bold text-sm tracking-tighter">R</span>
      <span className="text-slate mx-1">/</span>
      <span className="font-medium">Styles</span>
    </span>
  );

  if (pathname !== "/") {
    const segments = pathname.split("/").filter(Boolean);
    const id = segments[0];
    const design = id ? getDesignById(id) : null;

    breadcrumb = (
      <span className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="w-7 h-7 rounded-full bg-obsidian text-eggshell flex items-center justify-center font-bold text-sm tracking-tighter">R</span>
          <span className="text-slate mx-1">/</span>
          <span className="font-medium text-obsidian">Styles</span>
        </Link>
        <span className="text-slate mx-1">/</span>
        <span className="text-obsidian font-medium">
          {design?.title ?? "Not found"}
        </span>
      </span>
    );
  }

  return (
    <header className="border-b border-chalk bg-eggshell sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-14 flex items-center">
        <nav className="font-af text-[14px] text-obsidian flex items-center">
          {breadcrumb}
        </nav>
      </div>
    </header>
  );
}
