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
  try {
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
  } catch {
    throw new Error("Design extraction requires the Tauri desktop runtime.");
  }
}
