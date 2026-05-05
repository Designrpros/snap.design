"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Category } from "@/types/design";
import Button from "@/components/ui/Button";

interface FilterBarProps {
  categories: Category[];
  activeCategory?: string;
}

export default function FilterBar({
  categories,
  activeCategory,
}: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleFilter(category: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (category === null) {
      params.delete("category");
    } else if (params.get("category") === category) {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    const query = params.toString();
    router.push(query ? `/?${query}` : "/");
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-2 mt-8">
      <Button
        variant="outlined"
        size="md"
        active={!activeCategory}
        onClick={() => handleFilter(null)}
      >
        All
      </Button>

      {categories.map((cat) => (
        <Button
          key={cat}
          variant="outlined"
          size="md"
          active={activeCategory === cat}
          onClick={() => handleFilter(cat)}
        >
          {cat}
        </Button>
      ))}
    </div>
  );
}
