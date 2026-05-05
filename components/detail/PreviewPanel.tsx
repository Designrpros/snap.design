import type { DesignEntry } from "@/types/design";

interface PreviewPanelProps {
  design: DesignEntry;
}

export default function PreviewPanel({ design }: PreviewPanelProps) {
  const { designTokens } = design;

  return (
    <div className="flex flex-col gap-8">
      {/* Large screenshot / color preview */}
      {design.screenshot ? (
        <div className="rounded-3xl overflow-hidden border border-steel-gray h-[400px] md:h-[500px] relative">
          <img
            src={design.screenshot}
            alt={`Screenshot of ${design.title}`}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 flex items-end p-8 bg-gradient-to-t from-black/50 via-transparent to-transparent">
            <span className="font-ppmondwest text-[2.5rem] md:text-[3.5rem] leading-none tracking-[-0.02em] text-white drop-shadow-lg">
              {design.title}
            </span>
          </div>
        </div>
      ) : (
        <div
          className="rounded-3xl overflow-hidden border border-steel-gray flex items-end p-8 h-[400px] md:h-[500px]"
          style={{
            background: `linear-gradient(135deg, ${design.designTokens.colors.slice(0, 5).map((c, i) => `${c.hex.split(" →")[0]} ${(i / 4) * 100}%`).join(", ")})`,
          }}
        >
          <span className="font-ppmondwest text-[2.5rem] md:text-[3.5rem] leading-none tracking-[-0.02em] text-white drop-shadow-lg">
            {design.title}
          </span>
        </div>
      )}

      {/* Colors */}
      <section>
        <h3 className="font-ppmondwest text-h3 text-dark-charcoal mb-4">
          Colors
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {designTokens.colors.map((color) => (
            <div
              key={color.name}
              className="flex items-center gap-3 p-3 bg-off-white rounded-cardssmall border border-cool-gray"
            >
              <div
                className="w-8 h-8 rounded-md border border-steel-gray flex-shrink-0"
                style={{ backgroundColor: color.hex.split(" →")[0] }}
              />
              <div className="min-w-0">
                <p className="font-af text-caption font-semibold text-dark-charcoal truncate">
                  {color.name}
                </p>
                <p className="font-mono text-caption text-medium-gray">
                  {color.hex}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section>
        <h3 className="font-ppmondwest text-h3 text-dark-charcoal mb-4">
          Typography
        </h3>
        <div className="space-y-3">
          {designTokens.typography.map((t) => (
            <div
              key={t.name}
              className="p-4 bg-off-white rounded-cardssmall border border-cool-gray"
            >
              <p
                style={{
                  fontFamily: t.fontFamily,
                  fontSize: t.fontSize,
                  fontWeight: t.fontWeight,
                  lineHeight: t.lineHeight,
                  letterSpacing: t.letterSpacing,
                }}
                className="text-dark-charcoal"
              >
                {t.name}
              </p>
              <p className="font-mono text-caption text-medium-gray mt-1">
                {t.fontFamily} · {t.fontSize} · {t.fontWeight} ·{" "}
                {t.lineHeight}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Spacing */}
      <section>
        <h3 className="font-ppmondwest text-h3 text-dark-charcoal mb-4">
          Spacing
        </h3>
        <div className="space-y-2">
          {designTokens.spacing.map((s) => (
            <div key={s.name} className="flex items-center gap-3">
              <span className="font-mono text-caption text-medium-gray w-8 text-right">
                {s.name}
              </span>
              <div
                className="h-6 bg-cofounder-blue/20 rounded-sm"
                style={{ width: Math.max(s.px / 2, 4) }}
              />
              <span className="font-mono text-caption text-medium-gray">
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Shadows */}
      <section>
        <h3 className="font-ppmondwest text-h3 text-dark-charcoal mb-4">
          Shadows
        </h3>
        <div className="space-y-3">
          {designTokens.shadows.map((s) => (
            <div
              key={s.name}
              className="p-4 bg-canvas-white rounded-cardssmall"
              style={{ boxShadow: s.value }}
            >
              <p className="font-af text-caption font-semibold text-dark-charcoal">
                {s.name}
              </p>
              <p className="font-mono text-caption text-medium-gray mt-1 break-all">
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Radii */}
      <section>
        <h3 className="font-ppmondwest text-h3 text-dark-charcoal mb-4">
          Border Radius
        </h3>
        <div className="flex flex-wrap gap-3">
          {designTokens.radii.map((r) => (
            <div
              key={r.name}
              className="flex flex-col items-center gap-2"
            >
              <div
                className="w-12 h-12 bg-cofounder-blue/20 border border-cofounder-blue"
                style={{ borderRadius: r.value }}
              />
              <span className="font-mono text-caption text-medium-gray">
                {r.name}
              </span>
              <span className="font-mono text-caption text-slate-gray">
                {r.value}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
