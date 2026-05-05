import Link from "next/link";
import type { DesignEntry } from "@/types/design";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface DesignCardProps {
  design: DesignEntry;
}

function ScreenshotPreview({ design }: { design: DesignEntry }) {
  return (
    <div className="relative w-full h-full overflow-hidden group/screenshot">
      <img
        src={design.screenshot}
        alt={`Screenshot of ${design.title}`}
        className="w-full h-full object-cover object-top group-hover/screenshot:animate-scroll-card"
      />

      {/* Gradient overlay at bottom for title readability */}
      <div className="absolute inset-0 flex items-end p-6 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none">
        <span className="font-ppmondwest text-[2rem] leading-none tracking-[-0.02em] text-white">
          {design.title}
        </span>
      </div>

      {/* Color count badge */}
      <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-black/20 backdrop-blur-sm border border-white/15 pointer-events-none">
        <span className="font-mono text-[0.65rem] text-white/80 tracking-wider uppercase">
          {design.designTokens.colors.length} colors
        </span>
      </div>
    </div>
  );
}

function ColorPreview({ design }: { design: DesignEntry }) {
  const colors = design.designTokens.colors.slice(0, 5).map(
    (c) => c.hex.split(" →")[0]
  );

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ background: colors[0] }}
    >
      {/* Floating color orbs */}
      <div
        className="absolute -top-8 -right-4 w-40 h-40 rounded-full opacity-40 blur-xl"
        style={{ background: colors[2] || colors[1] }}
      />
      <div
        className="absolute -bottom-12 -left-8 w-48 h-48 rounded-full opacity-30 blur-xl"
        style={{ background: colors[3] || colors[1] }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full opacity-25 blur-2xl"
        style={{ background: colors[4] || colors[1] }}
      />

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Title overlay with glass effect */}
      <div className="absolute inset-0 flex items-end p-6 bg-gradient-to-t from-black/40 via-transparent to-transparent">
        <span className="font-ppmondwest text-[2rem] leading-none tracking-[-0.02em] text-white">
          {design.title}
        </span>
      </div>

      {/* Color count badge */}
      <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15">
        <span className="font-mono text-[0.65rem] text-white/80 tracking-wider uppercase">
          {design.designTokens.colors.length} colors
        </span>
      </div>
    </div>
  );
}

export default function DesignCard({ design }: DesignCardProps) {
  return (
    <Link href={`/${design.id}`} className="block group">
      <Card
        size="lg"
        hover
        className="group-hover:border-dark-charcoal/30 transition-colors duration-500"
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-t-3xl">
          {design.screenshot ? (
            <ScreenshotPreview design={design} />
          ) : (
            <ColorPreview design={design} />
          )}
        </div>
        <div className="px-5 py-4 flex items-center justify-between gap-3 border-t border-steel-gray">
          <div className="min-w-0">
            <h3 className="font-af text-button-label font-semibold text-dark-charcoal truncate">
              {design.title}
            </h3>
            <p className="font-af text-caption text-medium-gray truncate mt-0.5">
              {design.description}
            </p>
          </div>
          <Badge className="shrink-0">{design.category}</Badge>
        </div>
      </Card>
    </Link>
  );
}
