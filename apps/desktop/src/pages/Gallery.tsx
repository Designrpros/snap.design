import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { DesignEntry, SortOption } from "@snap/shared";
import { categories, getDesignsByCategory, getSortedDesigns } from "@snap/shared";
import { Button, Input, Card, Badge } from "@snap/shared";
import { extractDesign } from "@snap/extractor";
import { getReports, saveReport, deleteReport } from "../lib/reports-store";

/* ── FilterBar ─────────────────────────────── */

/* ── FilterBar ─────────────────────────────── */

function FilterBar({
  activeCategory,
  onFilter,
}: {
  activeCategory?: string;
  onFilter: (cat: string | null) => void;
}) {
  return (
    <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-3 mt-8">
      <Button
        variant="outlined"
        size="md"
        active={!activeCategory}
        onClick={() => onFilter(null)}
        className="text-[14px]"
      >
        All
      </Button>
      {categories.map((cat) => (
        <Button
          key={cat}
          variant="outlined"
          size="md"
          active={activeCategory === cat}
          onClick={() => onFilter(cat)}
          className="text-[14px]"
        >
          {cat}
        </Button>
      ))}
    </div>
  );
}

/* ── SegmentedPicker ─────────────────────────────── */

type Segment = "all" | "newest";

const segments: { id: Segment; label: string }[] = [
  { id: "all", label: "All Snaps" },
  { id: "newest", label: "Newest" },
];

function SegmentedPicker({
  activeSegment,
  onChange,
}: {
  activeSegment: Segment;
  onChange: (s: Segment) => void;
}) {
  return (
    <div className="flex items-center gap-1 p-1 bg-powder rounded-full">
      {segments.map((seg) => (
        <Button
          key={seg.id}
          variant="ghost"
          size="sm"
          active={activeSegment === seg.id}
          onClick={() => onChange(seg.id)}
          className={`text-[13px] font-medium transition-all ${
            activeSegment === seg.id
              ? "bg-obsidian text-eggshell shadow-subtle-2"
              : "text-gravel hover:text-obsidian"
          }`}
        >
          {seg.label}
        </Button>
      ))}
    </div>
  );
}

/* ── DesignCard ───────────────────────────── */

function ScreenshotPreview({ design, onFail }: { design: DesignEntry; onFail?: () => void }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // If not loaded after 10 seconds, try to force a refresh
    const timer = setTimeout(() => {
      if (!loaded) {
        setRetryCount((c) => c + 1);
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, [loaded, retryCount]);

  // If we've retried too many times, show the fallback
  if (error && retryCount > 3) return <ColorPreview design={design} />;

  // Append a cache-buster if we're retrying
  const imageUrl = retryCount > 0 
    ? `${design.screenshot}&retry=${retryCount}`
    : design.screenshot;

  return (
    <div className="relative w-full h-full overflow-hidden group/screenshot bg-powder">
      <img
        key={imageUrl} // Force re-render on retry
        src={imageUrl}
        alt={`Screenshot of ${design.title}`}
        onLoad={() => {
          setLoaded(true);
          setError(false);
        }}
        onError={() => {
          // Don't show error immediately, try retrying first
          if (retryCount > 3) {
            setError(true);
            onFail?.();
          } else {
            // Wait a bit before retrying on error
            setTimeout(() => setRetryCount((c) => c + 1), 3000);
          }
        }}
        className={`w-full h-full object-cover object-top hover:scale-[1.05] transition-all duration-700 ease-in-out ${
          loaded ? "opacity-100 scale-100" : "opacity-0 scale-110"
        }`}
      />
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-powder/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-chalk border-t-obsidian rounded-full animate-spin" />
            <p className="font-af text-[10px] text-gravel uppercase tracking-widest animate-pulse">
              {retryCount > 0 ? `Retrying (${retryCount})...` : "Capturing..."}
            </p>
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-obsidian/0 group-hover/screenshot:bg-obsidian/5 transition-colors duration-500" />
    </div>
  );
}

function ColorPreview({ design }: { design: DesignEntry }) {
  const colors = design.designTokens.colors.slice(0, 4).map(
    (c) => c.hex.split(" →")[0]
  );

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#F8F7F5] p-8 flex flex-col justify-between border-b border-chalk">
      <div className="flex -space-x-3">
        {colors.map((c, i) => (
          <div
            key={i}
            className="w-12 h-12 rounded-full border-2 border-white shadow-subtle-2"
            style={{ backgroundColor: c, zIndex: 10 - i }}
          />
        ))}
        <div className="w-12 h-12 rounded-full border-2 border-white bg-white shadow-subtle-2 flex items-center justify-center z-0">
          <span className="text-[10px] font-bold text-gravel">+{design.designTokens.colors.length - 4}</span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-obsidian/20" />
          <span className="font-af text-[10px] font-bold text-gravel uppercase tracking-[0.2em]">Visual Taste</span>
        </div>
        <span className="font-display text-[2.4rem] leading-[1.1] text-obsidian line-clamp-2">
          {design.title}
        </span>
      </div>
    </div>
  );
}

function DesignCard({ design, onDelete }: { design: DesignEntry; onDelete: (id: string) => void }) {
  const navigate = useNavigate();
  
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Delete clicked for:", design.id);
    onDelete(design.id);
  };

  const handleCardClick = () => {
    navigate(`/report/${design.id}`);
  };

  return (
    <div className="group relative">
      {/* Clickable Card Area */}
      <div 
        onClick={handleCardClick}
        className="cursor-pointer"
      >
        <Card size="lg" hover className="overflow-hidden border border-chalk shadow-subtle-2 group-hover:shadow-subtle-4 transition-all duration-500 bg-eggshell">
          <div className="relative aspect-[16/10] overflow-hidden">
            {design.screenshot ? (
              <ScreenshotPreview design={design} />
            ) : (
              <ColorPreview design={design} />
            )}
          </div>
          <div className="px-6 py-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display text-[1.6rem] leading-none text-obsidian truncate group-hover:text-gravel transition-colors duration-300">
                {design.title}
              </h3>
              <Badge className="py-0.5 px-2.5 text-[10px] uppercase tracking-wider">{design.category}</Badge>
            </div>
            <p className="font-af text-[14px] text-gravel line-clamp-1 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
              {design.description}
            </p>
          </div>
        </Card>
      </div>

      {/* Hover Delete Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDelete(design.id);
        }}
        className="absolute top-4 right-4 p-2.5 bg-white/95 backdrop-blur-md border border-chalk rounded-full text-gravel hover:text-red-500 hover:border-red-200 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-elevated z-[100] cursor-pointer"
        title="Delete extraction"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6m4-6v6"/>
        </svg>
      </button>
    </div>
  );
}

/* ── GalleryGrid ────────────────────────────── */

function GalleryGrid({ designs, onDelete }: { designs: DesignEntry[]; onDelete: (id: string) => void }) {
  if (designs.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="font-af text-subheading text-gravel">
          No designs found. Start by extracting a website.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-4 md:px-8 max-w-7xl mx-auto">
      {designs.map((design) => (
        <DesignCard key={design.id} design={design} onDelete={onDelete} />
      ))}
    </div>
  );
}

/* ── Gallery (page) ────────────────────────── */

export default function Gallery() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userReports, setUserReports] = useState<DesignEntry[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | undefined>();
  const [segment, setSegment] = useState<Segment>("all");

  const navigate = useNavigate();

  useEffect(() => {
    setUserReports(getReports());
  }, []);

  function refreshReports() {
    const latest = getReports();
    console.log("Refreshing reports, count:", latest.length);
    setUserReports([...latest]);
  }

  function handleDelete(id: string) {
    const updated = userReports.filter((r) => r.id !== id);
    setUserReports(updated);
    localStorage.setItem("snap-design-reports", JSON.stringify(updated));
    console.log("Deleted directly, new count:", updated.length);
  }

  const filtered = useMemo(() => {
    let result = userReports;
    
    // Filter by Category
    if (activeCategory) {
      result = result.filter((d) => d.category === activeCategory);
    }

    // Filter by Query
    if (query.trim()) {
      const lower = query.toLowerCase();
      result = result.filter(
        (d) =>
          d.title.toLowerCase().includes(lower) ||
          d.description.toLowerCase().includes(lower) ||
          d.url.toLowerCase().includes(lower) ||
          d.category.toLowerCase().includes(lower)
      );
    }

    return result;
  }, [userReports, activeCategory, query]);

  const sortKey = segment === "newest" ? "newest" : undefined;

  const designs = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = (a as any)[sortKey] ?? 0;
      const bVal = (b as any)[sortKey] ?? 0;
      return bVal - aVal;
    });
  }, [filtered, sortKey]);

  function isUrl(text: string) {
    return /^https?:\/\//.test(text.trim());
  }

  async function handleExtract() {
    if (!query.trim() || !isUrl(query)) return;
    setLoading(true);
    setError(null);
    try {
      // 1. Extract metadata and tokens
      const result = await extractDesign(query.trim());
      
      // 2. Pre-load the screenshot to ensure "Ready" state
      // We use a taller height (1600) to simulate a better "long format" view
      const fullScreenshotUrl = `https://s0.wp.com/mshots/v1/${encodeURIComponent(query.trim())}?w=1200&h=1600`;
      result.screenshot = fullScreenshotUrl;

      await new Promise((resolve, reject) => {
        const img = new Image();
        img.src = fullScreenshotUrl;
        // Give it a timeout so we don't wait forever if the service is down
        const timeout = setTimeout(resolve, 10000); 
        img.onload = () => {
          clearTimeout(timeout);
          resolve(true);
        };
        img.onerror = () => {
          clearTimeout(timeout);
          resolve(false); // Still resolve so we can show the report with fallback
        };
      });

      saveReport(result);
      refreshReports();
      setQuery("");
      navigate(`/report/${result.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Extraction failed");
    } finally {
      setLoading(false);
    }
  }

  function handleFilter(cat: string | null) {
    setActiveCategory(cat ?? undefined);
  }

  function handleSegment(s: Segment) {
    setSegment(s);
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-eggshell text-center px-4 pt-20 md:pt-32 pb-24 md:pb-32 border-b border-chalk">
        <h1 className="font-display text-[3.5rem] md:text-[5.5rem] leading-[1] tracking-tight font-light text-obsidian mb-6">
          Design taste, extracted.
        </h1>
        <p className="font-af text-lg text-gravel max-w-xl mx-auto leading-relaxed mb-12">
          Browse design systems from the world&apos;s best products. Copy colors, typography, spacing, and shadows directly into your project.
        </p>
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative flex items-center p-1 bg-eggshell border border-chalk rounded-2xl shadow-subtle">
            <input
              type="text"
              placeholder="Search or paste a URL to extract..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleExtract()}
              className="flex-1 bg-transparent border-none focus:ring-0 px-5 py-3 text-obsidian placeholder:text-slate font-af text-[15px]"
            />
            {isUrl(query) ? (
              <button 
                onClick={handleExtract}
                className="bg-gravel hover:bg-obsidian text-eggshell font-medium px-6 py-2.5 rounded-xl transition-colors text-[14px]"
              >
                {loading ? "..." : "Extract"}
              </button>
            ) : (
              <button className="bg-gravel hover:bg-obsidian text-eggshell font-medium px-6 py-2.5 rounded-xl transition-colors text-[14px]">
                Search
              </button>
            )}
          </div>
        </div>
        {error && <p className="font-af text-caption text-red-600 mt-2">{error}</p>}
        {loading && (
          <div className="mt-12 max-w-lg mx-auto">
            <div className="flex items-center justify-center gap-1 mb-6">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-obsidian rounded-full animate-spectrum"
                  style={{
                    height: `${Math.random() * 40 + 20}px`,
                    animationDelay: `${i * 0.1}s`,
                    opacity: 0.3 + (i / 12) * 0.7
                  }}
                />
              ))}
            </div>
            <p className="font-display text-[1.5rem] text-obsidian animate-pulse">
              Extracting design taste...
            </p>
            <p className="font-af text-[13px] text-gravel mt-2">
              Analyzing typography, colors, and spatial systems.
            </p>
          </div>
        )}
        <FilterBar activeCategory={activeCategory} onFilter={handleFilter} />
      </section>

      {/* Gallery */}
      <section className="pt-16 md:pt-24 pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SegmentedPicker activeSegment={segment} onChange={handleSegment} />
          </div>
          <p className="font-af text-caption text-medium-gray">
            {designs.length} extraction{designs.length !== 1 ? "s" : ""}
          </p>
        </div>
        <GalleryGrid designs={designs} onDelete={handleDelete} />
      </section>
    </>
  );
}
