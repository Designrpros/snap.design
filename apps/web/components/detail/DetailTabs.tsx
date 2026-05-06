"use client";

import { useState } from "react";
import type { DesignEntry } from "@snap/shared";
import { tokensToTailwind, tokensToCSS } from "@snap/shared";
import Button from "@/components/ui/Button";

type Tab = "preview" | "design-md" | "tailwind" | "css";

interface DetailTabsProps {
  design: DesignEntry;
  showOnly?: "preview" | "code";
  adaptive?: boolean;
}

const tabs: { id: Tab; label: string }[] = [
  { id: "preview", label: "Design Tokens" },
  { id: "design-md", label: "DESIGN.md" },
  { id: "tailwind", label: "Tailwind v4" },
  { id: "css", label: "CSS Variables" },
];

function CodeWindow({ code }: { code: string }) {
  return (
    <div className="bg-powder rounded-2xl border border-chalk overflow-hidden shadow-subtle">
      <pre className="p-6 font-mono text-[13px] text-obsidian leading-relaxed whitespace-pre-wrap">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function PreviewContent({ design }: { design: DesignEntry }) {
  const { designTokens } = design;

  return (
    <div className="flex flex-col gap-12">
      {/* Overview / Taste */}
      <section className="bg-powder p-8 rounded-3xl border border-chalk">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-obsidian animate-pulse" />
          <h3 className="font-af text-[13px] font-bold text-obsidian uppercase tracking-[0.2em]">Design Taste, Extracted</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="font-display text-[2.5rem] leading-[1.1] text-obsidian mb-6">
              {design.description}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-eggshell border border-chalk rounded-full text-[12px] font-medium text-gravel">Editorial</span>
              <span className="px-3 py-1 bg-eggshell border border-chalk rounded-full text-[12px] font-medium text-gravel">Achromatic</span>
              <span className="px-3 py-1 bg-eggshell border border-chalk rounded-full text-[12px] font-medium text-gravel">High Contrast</span>
              <span className="px-3 py-1 bg-eggshell border border-chalk rounded-full text-[12px] font-medium text-gravel">Type-Led</span>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h4 className="font-af text-[11px] font-bold text-slate uppercase tracking-widest mb-2">Visual Language</h4>
              <p className="text-[14px] text-gravel leading-relaxed">
                {design.visualLanguage || "Analysis of typographic hierarchy and color contrast ratios."}
              </p>
            </div>
            <div>
              <h4 className="font-af text-[11px] font-bold text-slate uppercase tracking-widest mb-2">Technical System</h4>
              <p className="text-[14px] text-gravel leading-relaxed">
                {design.technicalSystem || "Extraction of design tokens compatible with modern component libraries."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Colors */}
      <section>
        <h3 className="font-display text-[2rem] text-obsidian mb-6 pb-2 border-b border-chalk">
          Color Palette
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {designTokens.colors.map((color) => (
            <div
              key={color.name}
              className="flex items-center justify-between p-4 bg-powder rounded-xl border border-chalk hover:bg-eggshell transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-full border border-chalk shadow-sm"
                  style={{ backgroundColor: color.hex.split(" →")[0] }}
                />
                <div>
                  <p className="font-af text-[14px] font-semibold text-obsidian uppercase tracking-wide">
                    {color.name}
                  </p>
                  <p className="font-mono text-[12px] text-gravel">
                    {color.hex}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(color.hex)}
                className="text-[12px] font-medium text-slate hover:text-obsidian uppercase tracking-wider"
              >
                Copy
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section>
        <h3 className="font-display text-[2rem] text-obsidian mb-6 pb-2 border-b border-chalk">
          Typography
        </h3>
        <div className="space-y-4">
          {designTokens.typography.map((t) => (
            <div
              key={t.name}
              className="p-6 bg-powder rounded-xl border border-chalk"
            >
              <div className="flex items-end justify-between mb-4">
                <span className="font-af text-[12px] text-gravel uppercase tracking-widest">{t.name}</span>
                <span className="font-mono text-[12px] text-slate">{t.fontSize} · {t.fontWeight}</span>
              </div>
              <p
                style={{
                  fontFamily: t.fontFamily,
                  fontSize: t.fontSize,
                  fontWeight: t.fontWeight,
                  lineHeight: t.lineHeight,
                  letterSpacing: t.letterSpacing,
                }}
                className="text-obsidian leading-tight"
              >
                The quick brown fox jumps over the lazy dog.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Spacing & Shadows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Spacing */}
        <section>
          <h3 className="font-display text-[2rem] text-obsidian mb-6 pb-2 border-b border-chalk">
            Spacing
          </h3>
          <div className="space-y-4">
            {designTokens.spacing.map((s) => (
              <div key={s.name} className="flex items-center gap-4">
                <span className="font-mono text-[12px] text-gravel w-12">{s.name}</span>
                <div
                  className="h-2 bg-obsidian/10 rounded-full"
                  style={{ width: Math.max(s.px, 4) }}
                />
                <span className="font-mono text-[12px] text-slate ml-auto">{s.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Shadows */}
        <section>
          <h3 className="font-display text-[2rem] text-obsidian mb-6 pb-2 border-b border-chalk">
            Shadows
          </h3>
          <div className="space-y-4">
            {designTokens.shadows.map((s) => (
              <div
                key={s.name}
                className="p-4 bg-eggshell border border-chalk rounded-xl"
                style={{ boxShadow: s.value }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-af text-[13px] font-semibold text-obsidian uppercase tracking-wide">{s.name}</span>
                  <span className="font-mono text-[10px] text-slate truncate max-w-[150px]">{s.value}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Radii */}
      <section>
        <h3 className="font-display text-[2rem] text-obsidian mb-6 pb-2 border-b border-chalk">
          Shape & Radius
        </h3>
        <div className="flex flex-wrap gap-6">
          {designTokens.radii.map((r) => (
            <div
              key={r.name}
              className="flex flex-col items-center gap-3"
            >
              <div
                className="w-20 h-20 bg-powder border border-chalk shadow-subtle-2 flex items-center justify-center overflow-hidden"
                style={{ borderRadius: r.value }}
              >
                  <div className="w-12 h-12 bg-obsidian/5 border border-obsidian/10" style={{ borderRadius: r.value }} />
              </div>
              <div className="text-center">
                <p className="font-af text-[12px] font-semibold text-obsidian uppercase tracking-tight">{r.name}</p>
                <p className="font-mono text-[11px] text-slate">{r.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function DetailTabs({ design, showOnly, adaptive }: DetailTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>(
    showOnly === "code" ? "design-md" : (adaptive ? "design-md" : "preview")
  );
  const [copied, setCopied] = useState(false);

  // If adaptive, "preview" should be hidden on lg screens in the right column
  // because it's already visible in the left column.
  const getTabClassName = (tabId: Tab) => {
    if (adaptive && tabId === "preview") {
      return "lg:hidden";
    }
    return "";
  };

  const filteredTabs = showOnly === "code" ? tabs.filter(t => t.id !== "preview") : tabs;

  function getActiveCode(): string {
    switch (activeTab) {
      case "design-md":
        return design.designMarkdown;
      case "tailwind":
        return tokensToTailwind(design.designTokens);
      case "css":
        return tokensToCSS(design.designTokens);
      default:
        return "";
    }
  }

  async function handleCopy() {
    const code = getActiveCode();
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (showOnly === "preview") {
    return <PreviewContent design={design} />;
  }

  return (
    <div>
      {/* Tab bar */}
      <div className="flex items-center gap-6 mb-10 border-b border-chalk pb-0 sticky top-0 bg-eggshell z-20 overflow-x-auto no-scrollbar">
        {filteredTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 text-[14px] font-af font-medium transition-all whitespace-nowrap border-b-2 -mb-px ${getTabClassName(tab.id)} ${
              activeTab === tab.id
                ? "text-obsidian border-obsidian"
                : "text-gravel border-transparent hover:text-obsidian"
            }`}
          >
            {tab.label}
          </button>
        ))}

        {activeTab !== "preview" && (
          <div className="ml-auto mb-2">
            <Button variant="outlined" size="sm" onClick={handleCopy} className="text-[12px] py-1 h-auto">
              {copied ? "Copied!" : "Copy Code"}
            </Button>
          </div>
        )}
      </div>

      {/* Tab content */}
      <div className="mt-4">
        {activeTab === "preview" && <PreviewContent design={design} />}
        {activeTab === "design-md" && <CodeWindow code={design.designMarkdown} />}
        {activeTab === "tailwind" && <CodeWindow code={tokensToTailwind(design.designTokens)} />}
        {activeTab === "css" && <CodeWindow code={tokensToCSS(design.designTokens)} />}
      </div>
    </div>
  );
}
