import type { DesignEntry } from "@snap/shared";
import DesignCard from "@/components/gallery/DesignCard";

interface GalleryGridProps {
  designs: DesignEntry[];
}

export default function GalleryGrid({ designs }: GalleryGridProps) {
  if (designs.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="font-af text-subheading text-medium-gray">
          No designs found in this category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-4 md:px-8 max-w-7xl mx-auto">
      {designs.map((design) => (
        <DesignCard key={design.id} design={design} />
      ))}
    </div>
  );
}
