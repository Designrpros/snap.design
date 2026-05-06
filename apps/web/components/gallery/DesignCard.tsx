import Link from "next/link";
import type { DesignEntry } from "@snap/shared";
import { Card, Badge } from "@snap/shared";

interface DesignCardProps {
  design: DesignEntry;
}

function ScreenshotPreview({ design }: { design: DesignEntry }) {
  return (
    <div className="relative w-full h-full overflow-hidden group/screenshot">
      <img
        src={design.screenshot}
        alt={`Screenshot of ${design.title}`}
        className="w-full h-full object-cover object-top group-hover/screenshot:animate-scroll-card transition-all duration-500"
      />
    </div>
  );
}

function ColorPreview({ design }: { design: DesignEntry }) {
  const colors = design.designTokens.colors.slice(0, 5).map(
    (c) => c.hex.split(" →")[0]
  );

  return (
    <div className="relative w-full h-full overflow-hidden bg-eggshell p-6 flex flex-col justify-center">
      <div className="flex gap-2 mb-4">
        {colors.map((c, i) => (
          <div
            key={i}
            className="w-8 h-8 rounded-full border border-chalk shadow-sm"
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
      <span className="font-display text-[2rem] leading-none text-obsidian">
        {design.title}
      </span>
    </div>
  );
}

export default function DesignCard({ design }: DesignCardProps) {
  return (
    <Link href={`/${design.id}`} className="block group">
      <Card
        size="lg"
        hover
        className="overflow-hidden"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          {design.screenshot ? (
            <ScreenshotPreview design={design} />
          ) : (
            <ColorPreview design={design} />
          )}
        </div>
        <div className="px-5 py-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-display text-[1.5rem] leading-none text-obsidian truncate">
              {design.title}
            </h3>
            <Badge>{design.category}</Badge>
          </div>
          <p className="font-af text-[13px] text-gravel truncate leading-relaxed">
            {design.description}
          </p>
        </div>
      </Card>
    </Link>
  );
}
