export type Category = "SaaS" | "E-commerce" | "Portfolio" | "Dashboard" | "Landing Page" | "AI" | "Finance" | "Developer Tools" | "Social" | "Health" | "Crypto" | "Gaming" | "Education" | "Media" | "Productivity" | "Marketplace";
export type SortOption = "trending" | "popular" | "newest";
export interface ColorToken {
    name: string;
    hex: string;
    cssVariable: string;
}
export interface TypographyToken {
    name: string;
    fontFamily: string;
    fontSize: string;
    fontWeight: number;
    lineHeight: string;
    letterSpacing: string;
}
export interface SpacingToken {
    name: string;
    value: string;
    px: number;
}
export interface ShadowToken {
    name: string;
    value: string;
}
export interface RadiiToken {
    name: string;
    value: string;
    px: number;
}
export interface DesignTokens {
    colors: ColorToken[];
    typography: TypographyToken[];
    spacing: SpacingToken[];
    shadows: ShadowToken[];
    radii: RadiiToken[];
}
export interface DesignEntry {
    id: string;
    title: string;
    category: Category;
    url: string;
    iframeUrl: string;
    description: string;
    featured: boolean;
    trending?: number;
    popular?: number;
    newest?: number;
    screenshot?: string;
    designTokens: DesignTokens;
    designMarkdown: string;
}
//# sourceMappingURL=index.d.ts.map