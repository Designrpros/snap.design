import type { DesignTokens } from "./types";

export function tokensToTailwind(tokens: DesignTokens): string {
  const lines: string[] = [];

  lines.push('@import "tailwindcss";');
  lines.push("");
  lines.push("@theme {");

  // Colors
  if (tokens.colors.length > 0) {
    lines.push("  /* Colors */");
    tokens.colors.forEach((c) => {
      const key = c.name.toLowerCase().replace(/\s+/g, "-");
      const val = c.hex.split(" →")[0];
      lines.push(`  --color-${key}: ${val};`);
    });
    lines.push("");
  }

  // Typography
  if (tokens.typography.length > 0) {
    lines.push("  /* Typography */");
    const families = new Set(tokens.typography.map((t) => t.fontFamily));
    families.forEach((f) => {
      const key = f.split(",")[0].trim().replace(/['"]/g, "").toLowerCase().replace(/\s+/g, "-");
      lines.push(`  --font-${key}: "${f}", sans-serif;`);
    });
    lines.push("");
    tokens.typography.forEach((t) => {
      const key = t.name.toLowerCase().replace(/\s+/g, "-");
      lines.push(`  --font-size-${key}: ${t.fontSize};`);
      lines.push(`  --font-weight-${key}: ${t.fontWeight};`);
      if (t.lineHeight !== "normal" && t.lineHeight !== "1.5") {
        lines.push(`  --line-height-${key}: ${t.lineHeight};`);
      }
      if (t.letterSpacing !== "normal" && t.letterSpacing !== "0") {
        lines.push(`  --letter-spacing-${key}: ${t.letterSpacing};`);
      }
    });
    lines.push("");
  }

  // Spacing
  if (tokens.spacing.length > 0) {
    lines.push("  /* Spacing */");
    tokens.spacing.forEach((s) => {
      const key = s.name.toLowerCase().replace(/\s+/g, "-");
      lines.push(`  --spacing-${key}: ${s.value};`);
    });
    lines.push("");
  }

  // Radii
  if (tokens.radii.length > 0) {
    lines.push("  /* Border Radius */");
    tokens.radii.forEach((r) => {
      const key = r.name.toLowerCase().replace(/\s+/g, "-");
      lines.push(`  --radius-${key}: ${r.value};`);
    });
    lines.push("");
  }

  // Shadows
  if (tokens.shadows.length > 0) {
    lines.push("  /* Shadows */");
    tokens.shadows.forEach((s) => {
      const key = s.name.toLowerCase().replace(/\s+/g, "-");
      lines.push(`  --shadow-${key}: ${s.value};`);
    });
    lines.push("");
  }

  lines.push("}");
  return lines.join("\n");
}
