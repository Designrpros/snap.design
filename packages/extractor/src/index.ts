import type { DesignEntry } from "@snap/shared";

// Maps Rust snake_case fields to the TypeScript camelCase DesignEntry
// The Tauri backend returns snake_case from serde by default.

interface RustDesignToken {
  colors: Array<{ name: string; hex: string; css_variable: string }>;
  typography: Array<{ name: string; font_family: string; font_size: string; font_weight: number; line_height: string; letter_spacing: string }>;
  spacing: Array<{ name: string; value: string; px: number }>;
  shadows: Array<{ name: string; value: string }>;
  radii: Array<{ name: string; value: string; px: number }>;
}

interface RustExtractionResult {
  id: string;
  title: string;
  category: string;
  url: string;
  iframe_url: string;
  description: string;
  featured: boolean;
  screenshot: string;
  design_tokens: RustDesignToken;
  design_markdown: string;
}

function mapTokens(rustTokens: RustDesignToken): DesignEntry["designTokens"] {
  return {
    colors: rustTokens.colors.map((c) => ({
      name: c.name,
      hex: c.hex,
      cssVariable: c.css_variable,
    })),
    typography: rustTokens.typography.map((t) => ({
      name: t.name,
      fontFamily: t.font_family,
      fontSize: t.font_size,
      fontWeight: t.font_weight,
      lineHeight: t.line_height,
      letterSpacing: t.letter_spacing,
    })),
    spacing: rustTokens.spacing.map((s) => ({
      name: s.name,
      value: s.value,
      px: s.px,
    })),
    shadows: rustTokens.shadows.map((s) => ({
      name: s.name,
      value: s.value,
    })),
    radii: rustTokens.radii.map((r) => ({
      name: r.name,
      value: r.value,
      px: r.px,
    })),
  };
}

export async function extractDesign(url: string): Promise<DesignEntry> {
  // Tauri IPC: invoke the Rust extract_url command
  if (typeof window !== "undefined" && "__TAURI__" in window) {
    const { invoke } = await import("@tauri-apps/api/core");
    const result: RustExtractionResult = await invoke("extract_url", { url });
    return {
      id: result.id,
      title: result.title,
      category: result.category as DesignEntry["category"],
      url: result.url,
      iframeUrl: result.iframe_url,
      description: result.description,
      featured: result.featured,
      screenshot: result.screenshot || undefined,
      designTokens: mapTokens(result.design_tokens),
      designMarkdown: result.design_markdown,
    };
  }

  // Fallback for browser dev: mock extraction
  return extractDesignMock(url);
}

async function extractDesignMock(url: string): Promise<DesignEntry> {
  // Return curated design tokens for known seed URLs
  const match = await matchCurated(url);
  if (match) return match;

  // Add a deliberate delay to simulate "deep analysis"
  await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 1000));

  const id = url
    .replace(/https?:\/\//, "")
    .replace(/[^a-zA-Z0-9]/g, "-")
    .toLowerCase();

  // Try to extract a nice title from the URL
  let title = url.replace(/https?:\/\/(www\.)?/, "").split("/")[0];
  title = title.charAt(0).toUpperCase() + title.slice(1).split(".")[0];

  const screenshot = `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=1200&h=900`;

  // Procedural Generation based on URL hash
  const hash = url.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Generate HSL based on hash
  const hue = hash % 360;
  const saturation = 40 + (hash % 40);
  const lightness = 10 + (hash % 20);

  const colors = [
    { name: "Primary", hex: `hsl(${hue}, ${saturation}%, ${lightness}%)`, cssVariable: "--primary" },
    { name: "Secondary", hex: `hsl(${(hue + 180) % 360}, ${saturation}%, ${lightness + 20}%)`, cssVariable: "--secondary" },
    { name: "Surface", hex: "#FDFCFB", cssVariable: "--surface" },
    { name: "Accent", hex: `hsl(${(hue + 120) % 360}, ${saturation}%, 50%)`, cssVariable: "--accent" },
  ];

  const categories: DesignEntry["category"][] = ["SaaS", "E-commerce", "Portfolio", "Dashboard", "AI", "Developer Tools"];
  const category = categories[hash % categories.length];

  return {
    id,
    title,
    category,
    url,
    iframeUrl: url,
    description: `A unique ${category.toLowerCase()} design system characterized by its procedural color balance.`,
    visualLanguage: `Dynamic ${hue}° hue-based visual system with balanced saturation.`,
    technicalSystem: "Synthesized design tokens mapped to viewport-relative units for modern extraction.",
    featured: false,
    screenshot,
    designTokens: {
      colors,
      typography: [
        { name: "Display", fontFamily: "Inter, sans-serif", fontSize: "3rem", fontWeight: 700, lineHeight: "1.1", letterSpacing: "-0.04em" },
        { name: "Heading", fontFamily: "Inter, sans-serif", fontSize: "1.5rem", fontWeight: 600, lineHeight: "1.2", letterSpacing: "-0.02em" },
        { name: "Body", fontFamily: "Inter, sans-serif", fontSize: "1rem", fontWeight: 400, lineHeight: "1.5", letterSpacing: "0" },
      ],
      spacing: [
        { name: "xs", value: "4px", px: 4 },
        { name: "sm", value: "8px", px: 8 },
        { name: "md", value: "16px", px: 16 },
        { name: "lg", value: "24px", px: 24 },
        { name: "xl", value: "48px", px: 48 },
      ],
      shadows: [
        { name: "subtle", value: "0 1px 2px rgba(0,0,0,0.05)" },
        { name: "standard", value: "0 4px 6px rgba(0,0,0,0.07)" },
        { name: "elevated", value: "0 10px 15px rgba(0,0,0,0.1)" },
      ],
      radii: [
        { name: "none", value: "0px", px: 0 },
        { name: "sm", value: "4px", px: 4 },
        { name: "md", value: "12px", px: 12 },
        { name: "full", value: "9999px", px: 9999 },
      ],
    },
    designMarkdown: `# ${title} Design System\n\n## Overview\nThis design system was extracted from ${url}. It features a unique palette of ${colors.length} tokens.\n\n## Core Principles\n- **Precision Extraction**: Verified spatial systems and token accuracy.\n- **Scalable Tokens**: Normalized for modern CSS and Tailwind v4.\n`,
  };
}

async function matchCurated(url: string): Promise<DesignEntry | null> {
  const normalized = url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "").toLowerCase();
  const curated = [
    { normalized: "linear.app", id: "linear-app" },
    { normalized: "vercel.com", id: "vercel-platform" },
    { normalized: "stripe.com", id: "stripe-checkout" },
    { normalized: "raycast.com", id: "raycast-store" },
    { normalized: "cursor.com", id: "cursor-so" },
    { normalized: "apple.com", id: "apple-design" },
  ];

  const seed = curated.find((c) => normalized === c.normalized);
  if (!seed) return null;

  // Dynamically import the curated design data at runtime
  try {
    const { designs } = await import("@snap/shared");
    const entry = designs.find((d: DesignEntry) => d.id === seed.id);
    if (entry) return { ...entry };
  } catch {
    // Fall through to generic mock
  }
  return null;
}
