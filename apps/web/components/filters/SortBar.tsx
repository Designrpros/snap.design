"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { SortOption } from "@snap/shared";
import Button from "@/components/ui/Button";

interface SortBarProps {
  options: SortOption[];
  activeSort?: string;
}

const labels: Record<SortOption, string> = {
  trending: "Trending",
  popular: "Popular",
  newest: "Newest",
};

export default function SortBar({ options, activeSort }: SortBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSort(sort: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (sort === null || params.get("sort") === sort) {
      params.delete("sort");
    } else {
      params.set("sort", sort);
    }
    const query = params.toString();
    router.push(query ? `/?${query}` : "/");
  }

  return (
    <div className="flex items-center gap-1 p-1 bg-powder rounded-full">
      {options.map((opt) => (
        <Button
          key={opt}
          variant="ghost"
          size="sm"
          active={activeSort === opt || (!activeSort && opt === "trending")}
          onClick={() => handleSort(opt)}
          className={`text-[13px] font-medium transition-all ${
            activeSort === opt || (!activeSort && opt === "trending")
              ? "bg-obsidian text-eggshell shadow-subtle-2"
              : "text-gravel hover:text-obsidian"
          }`}
        >
          {labels[opt]}
        </Button>
      ))}
    </div>
  );
}
