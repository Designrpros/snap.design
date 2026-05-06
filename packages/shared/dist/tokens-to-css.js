export function tokensToCSS(tokens) {
    const lines = [];
    lines.push(":root {");
    tokens.colors.forEach((c) => {
        lines.push(`  ${c.cssVariable}: ${c.hex.split(" →")[0]};`);
    });
    lines.push("");
    tokens.typography.forEach((t) => {
        const key = t.name.toLowerCase().replace(/\s+/g, "-");
        lines.push(`  --font-${key}: ${t.fontWeight} ${t.fontSize}/${t.lineHeight} "${t.fontFamily}", sans-serif;`);
    });
    lines.push("");
    tokens.spacing.forEach((s) => {
        lines.push(`  --spacing-${s.name}: ${s.value};`);
    });
    lines.push("");
    tokens.shadows.forEach((s) => {
        const key = s.name.toLowerCase().replace(/\s+/g, "-");
        lines.push(`  --shadow-${key}: ${s.value};`);
    });
    lines.push("");
    tokens.radii.forEach((r) => {
        const key = r.name.toLowerCase().replace(/\s+/g, "-");
        lines.push(`  --radius-${key}: ${r.value};`);
    });
    lines.push("}");
    return lines.join("\n");
}
