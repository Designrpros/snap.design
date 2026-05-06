// Unified Design Auditing Interface
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

  function handleDownload() {
    const code = getActiveCode();
    if (!code) return;
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const filename = activeTab === "design-md" ? "DESIGN.md" : activeTab === "tailwind" ? "tailwind.config.ts" : "variables.css";
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  const ArchitectureView = (
    <div className="space-y-20">
      {/* Design Screenshot (Desktop only) */}
      <div className="hidden lg:block rounded-[2.5rem] overflow-hidden border border-chalk shadow-subtle-4 bg-powder max-h-[600px] overflow-y-auto no-scrollbar scroll-smooth mb-16">
        {report.screenshot && (
          <img src={report.screenshot} alt={report.title} className="w-full h-auto" />
        )}
      </div>

      <div className="mb-20 max-w-4xl">
        <h1 className="font-display text-[3.5rem] md:text-[5rem] leading-[0.9] text-obsidian mb-8 tracking-tighter">
          {report.title}
        </h1>

        <p className="font-af text-[20px] md:text-[24px] text-obsidian/80 leading-snug mb-8 font-medium">
          {report.description}
        </p>

        <div className="space-y-6 text-[16px] md:text-[17px] text-gravel leading-relaxed font-af">
          <p>
            {report.visualLanguage} {report.technicalSystem}
          </p>
          <div className="pt-4 flex items-center gap-2 text-obsidian/40 hover:text-obsidian transition-colors cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            <span className="text-[14px] font-medium underline underline-offset-4 decoration-chalk hover:decoration-obsidian transition-all">Visit Website</span>
          </div>
        </div>
      </div>

      {/* Colors */}
      <section>
        <h3 className="font-display text-[2rem] text-obsidian mb-6 pb-2 border-b border-chalk">Color Palette</h3>
        <div className="space-y-1">
          {report.designTokens.colors.map((color) => (
            <div key={color.name} className="flex items-center justify-between p-4 hover:bg-powder transition-colors group rounded-2xl">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl border border-chalk shadow-sm" style={{ backgroundColor: color.hex.split(" →")[0] }} />
                <div>
                  <p className="font-af text-[13px] font-bold text-obsidian uppercase tracking-wider mb-1">{color.name}</p>
                  <p className="font-mono text-[12px] text-gravel">{color.hex}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(color.hex);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-slate hover:text-obsidian"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeWidth={2} /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" strokeWidth={2} /></svg>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section>
        <h3 className="font-display text-[2rem] text-obsidian mb-6 pb-2 border-b border-chalk">Typography</h3>
        <div className="border border-chalk rounded-2xl overflow-hidden bg-white/50">
          {report.designTokens.typography.map((t, idx) => {
            const phrases = [
              "Architectural integrity through restraint.",
              "Systematic balance in a digital age.",
              "The beauty of functional minimalism.",
              "Design is the silent ambassador of your brand.",
              "Elegance is the only beauty that never fades.",
              "Form follows function, always.",
              "Simplicity is the ultimate sophistication.",
              "Typography is the voice of the interface.",
            ];
            return (
              <div key={t.name} className="grid grid-cols-[1fr,150px] gap-4 p-6 border-b border-chalk last:border-b-0 group hover:bg-powder transition-colors">
                <div className="min-w-0">
                  <p className="font-af text-[11px] text-slate uppercase tracking-widest mb-4">{t.name}</p>
                  <p style={{ fontFamily: t.fontFamily, fontSize: t.fontSize, fontWeight: t.fontWeight, lineHeight: t.lineHeight, letterSpacing: t.letterSpacing }} className="text-obsidian leading-tight truncate">
                    {phrases[idx % phrases.length]}
                  </p>
                </div>
                <div className="font-mono text-[11px] text-gravel space-y-1 flex flex-col justify-center">
                  <p>{t.fontSize} · {t.fontWeight}</p>
                  <p>{t.lineHeight} LH</p>
                  <p className="truncate opacity-50">{t.fontFamily.split(',')[0]}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Spacing & Shadows */}
      <div className="space-y-16">
        <section>
          <h3 className="font-display text-[2rem] text-obsidian mb-6 pb-2 border-b border-chalk">Spacing</h3>
          <div className="border border-chalk rounded-2xl overflow-hidden bg-white/50">
            {report.designTokens.spacing.map((s) => (
              <div key={s.name} className="grid grid-cols-[100px,100px,1fr] gap-4 p-4 border-b border-chalk last:border-b-0 items-center">
                <span className="font-af text-[12px] text-obsidian font-bold uppercase">{s.name}</span>
                <span className="font-mono text-[11px] text-gravel">{s.value}</span>
                <div className="h-2 bg-obsidian/10 rounded-full overflow-hidden max-w-[200px]">
                  <div className="h-full bg-obsidian/30" style={{ width: `${Math.min((s.px / 80) * 100, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-display text-[2rem] text-obsidian mb-6 pb-2 border-b border-chalk">Shadows</h3>
          <div className="space-y-3">
            {report.designTokens.shadows.map((s) => (
              <div key={s.name} className="p-6 bg-white border border-chalk rounded-2xl flex items-center justify-between group hover:bg-powder transition-colors" style={{ boxShadow: s.value }}>
                <span className="font-af text-[13px] font-bold text-obsidian uppercase tracking-widest">{s.name}</span>
                <span className="font-mono text-[11px] text-slate truncate max-w-[300px] opacity-40 group-hover:opacity-100 transition-opacity">{s.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-display text-[2rem] text-obsidian mb-6 pb-2 border-b border-chalk">Shape & Radius</h3>
          <div className="border border-chalk rounded-2xl overflow-hidden bg-white/50">
            {report.designTokens.radii.map((r) => (
              <div key={r.name} className="grid grid-cols-[100px,100px,1fr] gap-4 p-4 border-b border-chalk last:border-b-0 items-center">
                <span className="font-af text-[12px] text-obsidian font-bold uppercase">{r.name}</span>
                <span className="font-mono text-[11px] text-gravel">{r.value}</span>
                <div className="w-12 h-12 bg-white border border-chalk shadow-sm" style={{ borderRadius: r.value }} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );

  return (
    <div className="bg-eggshell h-[calc(100vh-3.5rem)] overflow-hidden">
      <div className="max-w-[1800px] mx-auto h-full px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full overflow-hidden">

          {/* Left Column (Desktop only) */}
          <div className="hidden lg:block h-full overflow-y-auto no-scrollbar pt-12 pb-32 pr-12">
            {ArchitectureView}
          </div>

          {/* Right Column (Mobile: Primary, Desktop: Code) */}
          <div className="h-full overflow-y-auto no-scrollbar border-t lg:border-t-0 lg:border-l border-chalk bg-powder flex flex-col">

            {/* Mobile Screenshot (Only visible on small screens) */}
            <div className="lg:hidden bg-eggshell px-0 py-0">
              <div className="rounded-none overflow-hidden border-b border-chalk bg-powder max-h-[400px] overflow-y-auto no-scrollbar">
                {report.screenshot && (
                  <img src={report.screenshot} alt={report.title} className="w-full h-auto" />
                )}
              </div>
            </div>

            {/* Sticky Header Tabs */}
            <div className="sticky top-0 z-30 bg-eggshell border-b border-chalk flex items-center justify-between h-14 px-8 lg:px-12 w-full flex-none">
              <div className="flex items-center gap-6 h-full">
                {tabs.map((tab) => {
                  if (tab.id === 'preview') {
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab('preview')}
                        className={`lg:hidden h-full px-1 text-[14px] font-af font-medium transition-all whitespace-nowrap border-b-2 -mb-px flex items-center ${
                          activeTab === 'preview'
                            ? "text-obsidian border-obsidian"
                            : "text-gravel border-transparent hover:text-obsidian"
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  }
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`h-full px-1 text-[14px] font-af font-medium transition-all whitespace-nowrap border-b-2 -mb-px flex items-center ${
                        activeTab === tab.id
                          ? "text-obsidian border-obsidian"
                          : "text-gravel border-transparent hover:text-obsidian"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-6">
                <button
                  onClick={handleCopy}
                  className={`transition-all hover:scale-110 ${copied ? "text-green-600" : "text-obsidian/40 hover:text-obsidian"
                    }`}
                  title="Copy to Clipboard"
                >
                  {copied ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeWidth={2} />
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" strokeWidth={2} />
                    </svg>
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className="text-obsidian/40 hover:text-obsidian transition-all hover:scale-110"
                  title="Download File"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
              {activeTab === 'preview' ? (
                <div className="p-8 md:p-12 bg-eggshell">
                  {ArchitectureView}
                </div>
              ) : (
                <pre className="p-8 md:p-12 font-mono text-[13px] text-obsidian/80 leading-relaxed overflow-x-auto no-scrollbar">
                  <code>{getActiveCode()}</code>
                </pre>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
