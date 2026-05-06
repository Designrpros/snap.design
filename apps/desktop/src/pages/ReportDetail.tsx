import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import type { DesignEntry } from "@snap/shared";
import { Badge, Button } from "@snap/shared";
import { tokensToTailwind, tokensToCSS } from "@snap/shared";
import { getReportById } from "../lib/reports-store";

export default function ReportDetail() {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<DesignEntry | null>(null);
  const [activeTab, setActiveTab] = useState<"preview" | "design-md" | "tailwind" | "css">("design-md");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      setReport(getReportById(id) ?? null);
    }
  }, [id]);

  if (!report) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 text-center">
        <h2 className="font-ppmondwest text-display">Report not found</h2>
        <p className="font-af text-subheading text-medium-gray mt-4">The design you're looking for doesn't exist.</p>
        <div className="mt-8">
          <Link to="/">
            <Button variant="solid" size="lg">Back to Gallery</Button>
          </Link>
        </div>
      </div>
    );
  }

  const tabs: { id: typeof activeTab | "design-md"; label: string }[] = [
    { id: "preview", label: "Preview" },
    { id: "design-md", label: "DESIGN.md" },
    { id: "tailwind", label: "Tailwind" },
    { id: "css", label: "CSS" },
  ];

  function getActiveCode(): string {
    switch (activeTab) {
      case "tailwind":
        return tokensToTailwind(report!.designTokens);
      case "css":
        return tokensToCSS(report!.designTokens);
      case "design-md":
        return report!.designMarkdown;
      default:
        return "";
    }
  }

  async function handleCopy() {
    const code = getActiveCode();
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-eggshell h-[calc(100vh-56px)] overflow-hidden">
      <div className="max-w-7xl mx-auto h-full px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full overflow-y-auto lg:overflow-hidden no-scrollbar">
          {/* Left Column (Scrollable on LG) */}
          <div className="h-auto lg:h-full lg:overflow-y-auto no-scrollbar pt-8 pb-12 lg:pb-24 lg:pr-12">
            <div className="space-y-12">
              {/* Image Scrollview (Small) */}
              <div className="rounded-2xl overflow-hidden border border-chalk shadow-subtle-4 bg-powder max-h-[300px] overflow-y-auto no-scrollbar scroll-smooth">
                {report.screenshot && (
                  <img
                    src={report.screenshot}
                    alt={`Screenshot of ${report.title}`}
                    className="w-full h-auto"
                  />
                )}
              </div>

              {/* Title & Info */}
              <div>
                <h1 className="font-display text-[3.5rem] md:text-[4rem] leading-[1.1] text-obsidian mb-6">
                  {report.title}
                </h1>
                <p className="font-af text-[15px] leading-relaxed text-gravel max-w-xl">
                  {report.description}
                </p>
                <div className="flex items-center gap-4 mt-8">
                  <Badge className="py-1 px-3 text-[12px]">{report.category}</Badge>
                  <a
                    href={report.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[14px] text-obsidian hover:underline font-medium"
                  >
                    Visit Website
                  </a>
                </div>
              </div>

              {/* Tokens Visualizer (Preview) - ONLY ON LARGE SCREENS */}
              <div className="hidden lg:flex flex-col gap-12 pt-12 border-t border-chalk">
                {/* Overview / Taste */}
                <section className="bg-powder p-8 rounded-3xl border border-chalk">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-obsidian animate-pulse" />
                    <h3 className="font-af text-[13px] font-bold text-obsidian uppercase tracking-[0.2em]">Design Taste, Extracted</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <p className="font-display text-[2.2rem] leading-[1.1] text-obsidian mb-6">
                        {report.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-eggshell border border-chalk rounded-full text-[11px] font-medium text-gravel uppercase tracking-wider">{report.category}</span>
                        <span className="px-3 py-1 bg-eggshell border border-chalk rounded-full text-[11px] font-medium text-gravel uppercase tracking-wider">Achromatic</span>
                        <span className="px-3 py-1 bg-eggshell border border-chalk rounded-full text-[11px] font-medium text-gravel uppercase tracking-wider">Precision</span>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-af text-[11px] font-bold text-slate uppercase tracking-widest mb-2">Visual Language</h4>
                        <p className="text-[14px] text-gravel leading-relaxed">
                          {report.visualLanguage || "Analysis of typographic hierarchy and color contrast ratios."}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-af text-[11px] font-bold text-slate uppercase tracking-widest mb-2">Technical System</h4>
                        <p className="text-[14px] text-gravel leading-relaxed">
                          {report.technicalSystem || "Extraction of design tokens compatible with modern component libraries."}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="font-display text-[2rem] text-obsidian mb-6 pb-2 border-b border-chalk">Color Palette</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {report.designTokens.colors.map((color) => (
                      <div key={color.name} className="flex items-center justify-between p-4 bg-powder rounded-xl border border-chalk hover:bg-eggshell transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full border border-chalk shadow-sm" style={{ backgroundColor: color.hex.split(" →")[0] }} />
                          <div>
                            <p className="font-af text-[14px] font-semibold text-obsidian uppercase tracking-wide">{color.name}</p>
                            <p className="font-mono text-[12px] text-gravel">{color.hex}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="font-display text-[2rem] text-obsidian mb-6 pb-2 border-b border-chalk">Typography</h3>
                  <div className="space-y-4">
                    {report.designTokens.typography.map((t) => (
                      <div key={t.name} className="p-6 bg-powder rounded-xl border border-chalk">
                        <div className="flex items-end justify-between mb-4">
                          <span className="font-af text-[12px] text-gravel uppercase tracking-widest">{t.name}</span>
                          <span className="font-mono text-[12px] text-slate">{t.fontSize}</span>
                        </div>
                        <p style={{ fontFamily: t.fontFamily, fontSize: t.fontSize, fontWeight: t.fontWeight, lineHeight: t.lineHeight, letterSpacing: t.letterSpacing }} className="text-obsidian leading-tight">
                          The quick brown fox jumps over the lazy dog.
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <section>
                    <h3 className="font-display text-[2rem] text-obsidian mb-6 pb-2 border-b border-chalk">Spacing</h3>
                    <div className="space-y-4">
                      {report.designTokens.spacing.map((s) => (
                        <div key={s.name} className="flex items-center gap-4">
                          <span className="font-mono text-[12px] text-gravel w-12">{s.name}</span>
                          <div className="h-2 bg-obsidian/10 rounded-full" style={{ width: Math.max(s.px, 4) }} />
                          <span className="font-mono text-[12px] text-slate ml-auto">{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                  <section>
                    <h3 className="font-display text-[2rem] text-obsidian mb-6 pb-2 border-b border-chalk">Shadows</h3>
                    <div className="space-y-4">
                      {report.designTokens.shadows.map((s) => (
                        <div key={s.name} className="p-4 bg-eggshell border border-chalk rounded-xl" style={{ boxShadow: s.value }}>
                          <div className="flex justify-between items-center">
                            <span className="font-af text-[13px] font-semibold text-obsidian uppercase tracking-wide">{s.name}</span>
                            <span className="font-mono text-[10px] text-slate truncate max-w-[100px]">{s.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                <section>
                  <h3 className="font-display text-[2rem] text-obsidian mb-6 pb-2 border-b border-chalk">Shape & Radius</h3>
                  <div className="flex flex-wrap gap-6">
                    {report.designTokens.radii.map((r) => (
                      <div key={r.name} className="flex flex-col items-center gap-3">
                        <div className="w-20 h-20 bg-powder border border-chalk shadow-subtle-2 flex items-center justify-center overflow-hidden" style={{ borderRadius: r.value }}>
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
            </div>
          </div>

          {/* Right Column (Scrollable Code Tabs + Preview on small screens) */}
          <div className="h-auto lg:h-full lg:overflow-y-auto no-scrollbar border-t lg:border-t-0 lg:border-l border-chalk lg:pl-12 pt-8 pb-24">
            {/* Tabs */}
            <div className="flex items-center gap-6 mb-10 border-b border-chalk pb-0 sticky top-0 bg-eggshell z-20 overflow-x-auto no-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 text-[14px] font-af font-medium transition-all whitespace-nowrap border-b-2 -mb-px ${tab.id === 'preview' ? 'lg:hidden' : ''} ${activeTab === tab.id
                      ? "text-obsidian border-obsidian"
                      : "text-gravel border-transparent hover:text-obsidian"
                    }`}
                >
                  {tab.label}
                </button>
              ))}

              <div className="ml-auto mb-2">
                <Button variant="outlined" size="sm" onClick={handleCopy} className="text-[12px] py-1 h-auto">
                  {copied ? "Copied!" : "Copy Code"}
                </Button>
              </div>
            </div>

            {/* Tab content */}
            <div className="mt-4">
              {activeTab === "preview" && (
                <div className="lg:hidden">
                  <div className="flex flex-col gap-12">
                    {/* Overview / Taste */}
                    <section className="bg-powder p-8 rounded-3xl border border-chalk">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="w-2 h-2 rounded-full bg-obsidian animate-pulse" />
                        <h3 className="font-af text-[13px] font-bold text-obsidian uppercase tracking-[0.2em]">Design Taste, Extracted</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <p className="font-display text-[2.2rem] leading-[1.1] text-obsidian mb-6">
                            {report.description}
                          </p>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h3 className="font-display text-[2rem] text-obsidian mb-6 pb-2 border-b border-chalk">Color Palette</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {report.designTokens.colors.map((color) => (
                          <div key={color.name} className="flex items-center justify-between p-4 bg-powder rounded-xl border border-chalk">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full border border-chalk shadow-sm" style={{ backgroundColor: color.hex.split(" →")[0] }} />
                              <div>
                                <p className="font-af text-[14px] font-semibold text-obsidian uppercase tracking-wide">{color.name}</p>
                                <p className="font-mono text-[12px] text-gravel">{color.hex}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section>
                      <h3 className="font-display text-[2rem] text-obsidian mb-6 pb-2 border-b border-chalk">Typography</h3>
                      <div className="space-y-4">
                        {report.designTokens.typography.map((t) => (
                          <div key={t.name} className="p-6 bg-powder rounded-xl border border-chalk">
                            <div className="flex items-end justify-between mb-4">
                              <span className="font-af text-[12px] text-gravel uppercase tracking-widest">{t.name}</span>
                            </div>
                            <p style={{ fontFamily: t.fontFamily, fontSize: t.fontSize, fontWeight: t.fontWeight, lineHeight: t.lineHeight, letterSpacing: t.letterSpacing }} className="text-obsidian leading-tight">
                              The quick brown fox jumps over the lazy dog.
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section>
                      <h3 className="font-display text-[2rem] text-obsidian mb-6 pb-2 border-b border-chalk">Spacing</h3>
                      <div className="space-y-4">
                        {report.designTokens.spacing.map((s) => (
                          <div key={s.name} className="flex items-center gap-4">
                            <span className="font-mono text-[12px] text-gravel w-12">{s.name}</span>
                            <div className="h-2 bg-obsidian/10 rounded-full" style={{ width: Math.max(s.px, 4) }} />
                            <span className="font-mono text-[12px] text-slate ml-auto">{s.value}</span>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section>
                      <h3 className="font-display text-[2rem] text-obsidian mb-6 pb-2 border-b border-chalk">Shadows</h3>
                      <div className="space-y-4">
                        {report.designTokens.shadows.map((s) => (
                          <div key={s.name} className="p-4 bg-eggshell border border-chalk rounded-xl" style={{ boxShadow: s.value }}>
                            <div className="flex justify-between items-center">
                              <span className="font-af text-[13px] font-semibold text-obsidian uppercase tracking-wide">{s.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section>
                      <h3 className="font-display text-[2rem] text-obsidian mb-6 pb-2 border-b border-chalk">Shape & Radius</h3>
                      <div className="flex flex-wrap gap-6">
                        {report.designTokens.radii.map((r) => (
                          <div key={r.name} className="flex flex-col items-center gap-3">
                            <div className="w-20 h-20 bg-powder border border-chalk flex items-center justify-center" style={{ borderRadius: r.value }}>
                              <div className="w-12 h-12 bg-obsidian/5 border border-obsidian/10" style={{ borderRadius: r.value }} />
                            </div>
                            <p className="font-af text-[12px] font-semibold text-obsidian uppercase tracking-tight">{r.name}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                </div>
              )}

              {activeTab !== "preview" && (
                <div className="bg-powder rounded-2xl border border-chalk overflow-hidden shadow-subtle">
                  <pre className="p-6 font-mono text-[13px] text-obsidian leading-relaxed whitespace-pre-wrap">
                    <code>{getActiveCode()}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
