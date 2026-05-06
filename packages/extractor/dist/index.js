function mapTokens(rustTokens) {
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
export async function extractDesign(url) {
    // Tauri IPC: invoke the Rust extract_url command
    if (typeof window !== "undefined" && "__TAURI__" in window) {
        const { invoke } = await import("@tauri-apps/api/core");
        const result = await invoke("extract_url", { url });
        return {
            id: result.id,
            title: result.title,
            category: result.category,
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
async function extractDesignMock(url) {
    // In dev mode, return a mock result
    const id = url
        .replace(/https?:\/\//, "")
        .replace(/[^a-zA-Z0-9]/g, "-")
        .toLowerCase();
    return {
        id,
        title: url,
        category: "SaaS",
        url,
        iframeUrl: url,
        description: `Design tokens extracted from ${url}`,
        featured: false,
        screenshot: undefined,
        designTokens: {
            colors: [
                { name: "background", hex: "#ffffff", cssVariable: "--background" },
                { name: "foreground", hex: "#1a1a1a", cssVariable: "--foreground" },
                { name: "primary", hex: "#0066cc", cssVariable: "--primary" },
                { name: "muted", hex: "#f5f5f5", cssVariable: "--muted" },
            ],
            typography: [
                {
                    name: "Heading",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "2rem",
                    fontWeight: 700,
                    lineHeight: "1.2",
                    letterSpacing: "-0.02em",
                },
                {
                    name: "Body",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "1rem",
                    fontWeight: 400,
                    lineHeight: "1.5",
                    letterSpacing: "0",
                },
            ],
            spacing: [
                { name: "xs", value: "4px", px: 4 },
                { name: "sm", value: "8px", px: 8 },
                { name: "md", value: "16px", px: 16 },
                { name: "lg", value: "24px", px: 24 },
                { name: "xl", value: "48px", px: 48 },
            ],
            shadows: [
                { name: "sm", value: "0 1px 2px rgba(0,0,0,0.05)" },
                { name: "md", value: "0 4px 6px rgba(0,0,0,0.07)" },
                { name: "lg", value: "0 10px 15px rgba(0,0,0,0.1)" },
            ],
            radii: [
                { name: "sm", value: "4px", px: 4 },
                { name: "md", value: "8px", px: 8 },
                { name: "lg", value: "16px", px: 16 },
                { name: "full", value: "9999px", px: 9999 },
            ],
        },
        designMarkdown: `# ${url}\n\n## Colors\n\nExtracted from the live site.\n`,
    };
}
