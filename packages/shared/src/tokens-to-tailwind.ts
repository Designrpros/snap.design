import type { DesignTokens } from "./types";

export function tokensToTailwind(tokens: DesignTokens): string {
  const lines: string[] = [];
  lines.push("// tailwind.config.ts");
  lines.push("const config = {");
  lines.push("  theme: {");
  lines.push("    extend: {");

  lines.push("      colors: {");
  tokens.colors.forEach((c) => {
    const key = c.name.toLowerCase().replace(/\s+/g, "-");
    lines.push(`        "${key}": "${c.hex.split(" →")[0]}",`);
  });
  lines.push("      },");

  lines.push("      fontFamily: {");
  const families = new Set(tokens.typography.map((t) => t.fontFamily));
  families.forEach((f) => {
    const key = f.toLowerCase().replace(/\s+/g, "-");
    lines.push(`        "${key}": ["${f}", "sans-serif"],`);
  });
  lines.push("      },");

  lines.push("      fontSize: {");
  tokens.typography.forEach((t) => {
    const key = t.name.toLowerCase().replace(/\s+/g, "-");
    lines.push(
      `        "${key}": ["${t.fontSize}", { lineHeight: "${t.lineHeight}", letterSpacing: "${t.letterSpacing}", fontWeight: "${t.fontWeight}" }],`
    );
  });
  lines.push("      },");

  lines.push("      borderRadius: {");
  tokens.radii.forEach((r) => {
    const key = r.name.toLowerCase().replace(/\s+/g, "-");
    lines.push(`        "${key}": "${r.value}",`);
  });
  lines.push("      },");

  lines.push("      boxShadow: {");
  tokens.shadows.forEach((s) => {
    const key = s.name.toLowerCase().replace(/\s+/g, "-");
    lines.push(`        "${key}": "${s.value}",`);
  });
  lines.push("      },");

  lines.push("    },");
  lines.push("  },");
  lines.push("};");
  lines.push("export default config;");
  return lines.join("\n");
}
