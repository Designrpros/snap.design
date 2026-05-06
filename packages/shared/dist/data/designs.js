export const categories = [
    "SaaS",
    "E-commerce",
    "Portfolio",
    "Dashboard",
    "Landing Page",
    "AI",
    "Finance",
    "Developer Tools",
    "Social",
    "Health",
    "Crypto",
    "Gaming",
    "Education",
    "Media",
    "Productivity",
    "Marketplace",
];
export const sortOptions = ["trending", "popular", "newest"];
export function getDesignById(id) {
    return designs.find((d) => d.id === id);
}
export function getDesignsByCategory(category) {
    if (!category)
        return designs;
    return designs.filter((d) => d.category === category);
}
export function getSortedDesigns(designs, sort) {
    if (!sort)
        return designs;
    return [...designs].sort((a, b) => {
        var _a, _b;
        const aVal = (_a = a[sort]) !== null && _a !== void 0 ? _a : 0;
        const bVal = (_b = b[sort]) !== null && _b !== void 0 ? _b : 0;
        return bVal - aVal;
    });
}
export const designs = [
    {
        id: "linear-app",
        title: "Linear",
        category: "SaaS",
        url: "https://linear.app",
        iframeUrl: "https://linear.app",
        screenshot: "/screenshots/linear-app.png",
        description: "A project management tool with a dark, minimalist interface and refined typography.",
        featured: true,
        trending: 98,
        popular: 245,
        newest: 12,
        designTokens: {
            colors: [
                {
                    name: "Background",
                    hex: "#1a1a1a",
                    cssVariable: "--color-bg",
                },
                {
                    name: "Surface",
                    hex: "#262626",
                    cssVariable: "--color-surface",
                },
                {
                    name: "Primary",
                    hex: "#5e6ad2",
                    cssVariable: "--color-primary",
                },
                {
                    name: "Text Primary",
                    hex: "#f7f8f8",
                    cssVariable: "--color-text-primary",
                },
                {
                    name: "Text Secondary",
                    hex: "#9ca3af",
                    cssVariable: "--color-text-secondary",
                },
                {
                    name: "Border",
                    hex: "#333333",
                    cssVariable: "--color-border",
                },
                {
                    name: "Success",
                    hex: "#0eb575",
                    cssVariable: "--color-success",
                },
                {
                    name: "Warning",
                    hex: "#f2a33c",
                    cssVariable: "--color-warning",
                },
            ],
            typography: [
                {
                    name: "Heading XL",
                    fontFamily: "Inter",
                    fontSize: "32px",
                    fontWeight: 700,
                    lineHeight: "1.2",
                    letterSpacing: "-0.02em",
                },
                {
                    name: "Heading LG",
                    fontFamily: "Inter",
                    fontSize: "24px",
                    fontWeight: 600,
                    lineHeight: "1.3",
                    letterSpacing: "-0.015em",
                },
                {
                    name: "Heading MD",
                    fontFamily: "Inter",
                    fontSize: "18px",
                    fontWeight: 600,
                    lineHeight: "1.4",
                    letterSpacing: "-0.01em",
                },
                {
                    name: "Body",
                    fontFamily: "Inter",
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: "1.5",
                    letterSpacing: "0em",
                },
                {
                    name: "Caption",
                    fontFamily: "Inter",
                    fontSize: "12px",
                    fontWeight: 400,
                    lineHeight: "1.4",
                    letterSpacing: "0em",
                },
            ],
            spacing: [
                { name: "xs", value: "4px", px: 4 },
                { name: "sm", value: "8px", px: 8 },
                { name: "md", value: "16px", px: 16 },
                { name: "lg", value: "24px", px: 24 },
                { name: "xl", value: "32px", px: 32 },
                { name: "2xl", value: "48px", px: 48 },
                { name: "3xl", value: "64px", px: 64 },
            ],
            shadows: [
                {
                    name: "Card",
                    value: "0px 2px 8px rgba(0,0,0,0.12), 0px 0px 1px rgba(0,0,0,0.2)",
                },
                {
                    name: "Dropdown",
                    value: "0px 8px 24px rgba(0,0,0,0.2), 0px 0px 1px rgba(0,0,0,0.3)",
                },
                {
                    name: "Modal",
                    value: "0px 16px 48px rgba(0,0,0,0.25), 0px 0px 1px rgba(0,0,0,0.3)",
                },
            ],
            radii: [
                { name: "Button", value: "6px", px: 6 },
                { name: "Card", value: "8px", px: 8 },
                { name: "Input Field", value: "6px", px: 6 },
                { name: "Modal", value: "12px", px: 12 },
                { name: "Avatar", value: "9999px", px: 9999 },
            ],
        },
        designMarkdown: `# Linear Design System

## Colors
\`\`\`css
:root {
  --color-bg: #1a1a1a;
  --color-surface: #262626;
  --color-primary: #5e6ad2;
  --color-text-primary: #f7f8f8;
  --color-text-secondary: #9ca3af;
  --color-border: #333333;
  --color-success: #0eb575;
  --color-warning: #f2a33c;
}
\`\`\`

## Typography
\`\`\`css
--font-heading-xl: 700 32px/1.2 "Inter", sans-serif;
--font-heading-lg: 600 24px/1.3 "Inter", sans-serif;
--font-heading-md: 600 18px/1.4 "Inter", sans-serif;
--font-body: 400 14px/1.5 "Inter", sans-serif;
--font-caption: 400 12px/1.4 "Inter", sans-serif;
\`\`\`

## Spacing Scale (4px base)
4, 8, 16, 24, 32, 48, 64

## Usage Notes
- Dark-first design with restrained use of color
- Keyboard-first interactions with visible focus rings
- Command menu (⌘+K) is the centerpiece of navigation
- Subtle glass effects on overlays`,
    },
    {
        id: "vercel-platform",
        title: "Vercel",
        category: "SaaS",
        url: "https://vercel.com",
        iframeUrl: "https://vercel.com",
        screenshot: "/screenshots/vercel-platform.png",
        description: "A developer platform with clean geometry, geometric precision and a monochrome palette.",
        featured: false,
        trending: 85,
        popular: 190,
        newest: 8,
        designTokens: {
            colors: [
                {
                    name: "Background",
                    hex: "#000000",
                    cssVariable: "--color-bg",
                },
                {
                    name: "Surface",
                    hex: "#111111",
                    cssVariable: "--color-surface",
                },
                {
                    name: "Accent",
                    hex: "#0070f3",
                    cssVariable: "--color-accent",
                },
                {
                    name: "Text Primary",
                    hex: "#ffffff",
                    cssVariable: "--color-text-primary",
                },
                {
                    name: "Text Secondary",
                    hex: "#888888",
                    cssVariable: "--color-text-secondary",
                },
                {
                    name: "Border",
                    hex: "#333333",
                    cssVariable: "--color-border",
                },
                {
                    name: "Success",
                    hex: "#00c853",
                    cssVariable: "--color-success",
                },
                {
                    name: "Error",
                    hex: "#ff3d00",
                    cssVariable: "--color-error",
                },
            ],
            typography: [
                {
                    name: "Hero",
                    fontFamily: "Geist",
                    fontSize: "80px",
                    fontWeight: 700,
                    lineHeight: "0.95",
                    letterSpacing: "-0.04em",
                },
                {
                    name: "Heading",
                    fontFamily: "Geist",
                    fontSize: "48px",
                    fontWeight: 600,
                    lineHeight: "1.1",
                    letterSpacing: "-0.03em",
                },
                {
                    name: "Subheading",
                    fontFamily: "Geist",
                    fontSize: "22px",
                    fontWeight: 400,
                    lineHeight: "1.4",
                    letterSpacing: "-0.01em",
                },
                {
                    name: "Body",
                    fontFamily: "Geist",
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "1.6",
                    letterSpacing: "0em",
                },
                {
                    name: "Label",
                    fontFamily: "Geist Mono",
                    fontSize: "13px",
                    fontWeight: 500,
                    lineHeight: "1.3",
                    letterSpacing: "0.02em",
                },
            ],
            spacing: [
                { name: "xs", value: "6px", px: 6 },
                { name: "sm", value: "12px", px: 12 },
                { name: "md", value: "20px", px: 20 },
                { name: "lg", value: "32px", px: 32 },
                { name: "xl", value: "48px", px: 48 },
                { name: "2xl", value: "72px", px: 72 },
                { name: "3xl", value: "96px", px: 96 },
            ],
            shadows: [
                {
                    name: "Subtle",
                    value: "0px 2px 8px rgba(0,0,0,0.08), 0px 0px 1px rgba(0,0,0,0.1)",
                },
                {
                    name: "Elevated",
                    value: "0px 8px 32px rgba(0,0,0,0.12), 0px 0px 1px rgba(0,0,0,0.15)",
                },
                {
                    name: "Overlay",
                    value: "0px 16px 64px rgba(0,0,0,0.2), 0px 0px 2px rgba(0,0,0,0.25)",
                },
            ],
            radii: [
                { name: "Button", value: "6px", px: 6 },
                { name: "Card", value: "12px", px: 12 },
                { name: "Input Field", value: "8px", px: 8 },
                { name: "Container", value: "16px", px: 16 },
                { name: "Pill", value: "9999px", px: 9999 },
            ],
        },
        designMarkdown: `# Vercel Design System

## Colors
\`\`\`css
:root {
  --color-bg: #000000;
  --color-surface: #111111;
  --color-accent: #0070f3;
  --color-text-primary: #ffffff;
  --color-text-secondary: #888888;
  --color-border: #333333;
  --color-success: #00c853;
  --color-error: #ff3d00;
}
\`\`\`

## Typography
\`\`\`css
--font-hero: 700 80px/0.95 "Geist", sans-serif;
--font-heading: 600 48px/1.1 "Geist", sans-serif;
--font-subheading: 400 22px/1.4 "Geist", sans-serif;
--font-body: 400 16px/1.6 "Geist", sans-serif;
--font-label: 500 13px/1.3 "Geist Mono", monospace;
\`\`\`

## Spacing Scale (6px base)
6, 12, 20, 32, 48, 72, 96

## Usage Notes
- Maximum contrast with black backgrounds and white text
- Geist font family is Vercel's custom typeface
- Blue accent (#0070f3) used sparingly for CTAs
- Generous whitespace with large typography scale`,
    },
    {
        id: "stripe-checkout",
        title: "Stripe",
        category: "SaaS",
        url: "https://stripe.com",
        iframeUrl: "https://stripe.com",
        screenshot: "/screenshots/stripe-checkout.png",
        description: "A payment platform with refined gradients, glass surfaces, and elegant UI elements.",
        featured: false,
        trending: 72,
        popular: 210,
        newest: 5,
        designTokens: {
            colors: [
                {
                    name: "Background",
                    hex: "#ffffff",
                    cssVariable: "--color-bg",
                },
                {
                    name: "Surface",
                    hex: "#f6f9fc",
                    cssVariable: "--color-surface",
                },
                {
                    name: "Primary",
                    hex: "#635bff",
                    cssVariable: "--color-primary",
                },
                {
                    name: "Text Primary",
                    hex: "#0a2540",
                    cssVariable: "--color-text-primary",
                },
                {
                    name: "Text Secondary",
                    hex: "#425466",
                    cssVariable: "--color-text-secondary",
                },
                {
                    name: "Border",
                    hex: "#e0e6eb",
                    cssVariable: "--color-border",
                },
                {
                    name: "Success",
                    hex: "#09825d",
                    cssVariable: "--color-success",
                },
                {
                    name: "Accent Gradient",
                    hex: "#635bff → #00d4ff",
                    cssVariable: "--color-accent-gradient",
                },
            ],
            typography: [
                {
                    name: "Display",
                    fontFamily: "Sohne",
                    fontSize: "72px",
                    fontWeight: 600,
                    lineHeight: "0.95",
                    letterSpacing: "-0.03em",
                },
                {
                    name: "Heading",
                    fontFamily: "Sohne",
                    fontSize: "40px",
                    fontWeight: 600,
                    lineHeight: "1.1",
                    letterSpacing: "-0.02em",
                },
                {
                    name: "Subheading",
                    fontFamily: "Sohne",
                    fontSize: "22px",
                    fontWeight: 400,
                    lineHeight: "1.3",
                    letterSpacing: "-0.01em",
                },
                {
                    name: "Body LG",
                    fontFamily: "Sohne",
                    fontSize: "17px",
                    fontWeight: 400,
                    lineHeight: "1.6",
                    letterSpacing: "0em",
                },
                {
                    name: "UI Text",
                    fontFamily: "Sohne",
                    fontSize: "14px",
                    fontWeight: 500,
                    lineHeight: "1.4",
                    letterSpacing: "0.01em",
                },
            ],
            spacing: [
                { name: "xs", value: "8px", px: 8 },
                { name: "sm", value: "16px", px: 16 },
                { name: "md", value: "24px", px: 24 },
                { name: "lg", value: "40px", px: 40 },
                { name: "xl", value: "64px", px: 64 },
                { name: "2xl", value: "96px", px: 96 },
                { name: "3xl", value: "128px", px: 128 },
            ],
            shadows: [
                {
                    name: "Card",
                    value: "0px 2px 12px rgba(0,0,0,0.04), 0px 0px 1px rgba(0,0,0,0.08)",
                },
                {
                    name: "Elevated",
                    value: "0px 8px 32px rgba(0,0,0,0.06), 0px 0px 2px rgba(0,0,0,0.1)",
                },
                {
                    name: "Nav",
                    value: "0px 1px 4px rgba(0,0,0,0.04), 0px 0px 1px rgba(0,0,0,0.06)",
                },
            ],
            radii: [
                { name: "Button", value: "6px", px: 6 },
                { name: "Card", value: "16px", px: 16 },
                { name: "Input Field", value: "6px", px: 6 },
                { name: "Container", value: "24px", px: 24 },
                { name: "Pill", value: "9999px", px: 9999 },
            ],
        },
        designMarkdown: `# Stripe Design System

## Colors
\`\`\`css
:root {
  --color-bg: #ffffff;
  --color-surface: #f6f9fc;
  --color-primary: #635bff;
  --color-text-primary: #0a2540;
  --color-text-secondary: #425466;
  --color-border: #e0e6eb;
  --color-success: #09825d;
  --color-accent-gradient: linear-gradient(135deg, #635bff, #00d4ff);
}
\`\`\`

## Typography
\`\`\`css
--font-display: 600 72px/0.95 "Sohne", sans-serif;
--font-heading: 600 40px/1.1 "Sohne", sans-serif;
--font-subheading: 400 22px/1.3 "Sohne", sans-serif;
--font-body-lg: 400 17px/1.6 "Sohne", sans-serif;
--font-ui: 500 14px/1.4 "Sohne", sans-serif;
\`\`\`

## Spacing Scale (8px base)
8, 16, 24, 40, 64, 96, 128

## Usage Notes
- Glass-morphism effects on navigation and cards
- Indigo-to-cyan gradient accent for featured elements
- Sohne is Stripe's custom typeface with excellent legibility
- Generous use of whitespace, minimalist UI chrome`,
    },
    {
        id: "raycast-store",
        title: "Raycast",
        category: "SaaS",
        url: "https://raycast.com",
        iframeUrl: "https://raycast.com",
        screenshot: "/screenshots/raycast-store.png",
        description: "A productivity tool with a distinctive warm gradient aesthetic and rounded, friendly UI.",
        featured: false,
        trending: 90,
        popular: 175,
        newest: 15,
        designTokens: {
            colors: [
                {
                    name: "Background",
                    hex: "#ffffff",
                    cssVariable: "--color-bg",
                },
                {
                    name: "Surface",
                    hex: "#f5f5f7",
                    cssVariable: "--color-surface",
                },
                {
                    name: "Primary",
                    hex: "#ff6b35",
                    cssVariable: "--color-primary",
                },
                {
                    name: "Text Primary",
                    hex: "#1d1d1f",
                    cssVariable: "--color-text-primary",
                },
                {
                    name: "Text Secondary",
                    hex: "#86868b",
                    cssVariable: "--color-text-secondary",
                },
                {
                    name: "Border",
                    hex: "#d2d2d7",
                    cssVariable: "--color-border",
                },
                {
                    name: "Gradient Start",
                    hex: "#ff6b35",
                    cssVariable: "--color-gradient-start",
                },
                {
                    name: "Gradient End",
                    hex: "#ff2d55",
                    cssVariable: "--color-gradient-end",
                },
            ],
            typography: [
                {
                    name: "Hero",
                    fontFamily: "Satoshi",
                    fontSize: "64px",
                    fontWeight: 700,
                    lineHeight: "0.95",
                    letterSpacing: "-0.03em",
                },
                {
                    name: "Heading",
                    fontFamily: "Satoshi",
                    fontSize: "36px",
                    fontWeight: 700,
                    lineHeight: "1.1",
                    letterSpacing: "-0.02em",
                },
                {
                    name: "Subheading",
                    fontFamily: "Satoshi",
                    fontSize: "20px",
                    fontWeight: 500,
                    lineHeight: "1.3",
                    letterSpacing: "-0.01em",
                },
                {
                    name: "Body",
                    fontFamily: "Satoshi",
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "1.5",
                    letterSpacing: "0em",
                },
                {
                    name: "Caption",
                    fontFamily: "Satoshi",
                    fontSize: "13px",
                    fontWeight: 400,
                    lineHeight: "1.4",
                    letterSpacing: "0.01em",
                },
            ],
            spacing: [
                { name: "xs", value: "8px", px: 8 },
                { name: "sm", value: "12px", px: 12 },
                { name: "md", value: "20px", px: 20 },
                { name: "lg", value: "32px", px: 32 },
                { name: "xl", value: "48px", px: 48 },
                { name: "2xl", value: "80px", px: 80 },
                { name: "3xl", value: "120px", px: 120 },
            ],
            shadows: [
                {
                    name: "Subtle",
                    value: "0px 2px 12px rgba(0,0,0,0.04), 0px 0px 1px rgba(0,0,0,0.06)",
                },
                {
                    name: "Card",
                    value: "0px 4px 20px rgba(0,0,0,0.06), 0px 0px 2px rgba(0,0,0,0.08)",
                },
                {
                    name: "Elevated",
                    value: "0px 12px 40px rgba(0,0,0,0.08), 0px 0px 3px rgba(0,0,0,0.1)",
                },
            ],
            radii: [
                { name: "Button", value: "10px", px: 10 },
                { name: "Card", value: "16px", px: 16 },
                { name: "Input Field", value: "10px", px: 10 },
                { name: "Container", value: "20px", px: 20 },
                { name: "Pill", value: "9999px", px: 9999 },
            ],
        },
        designMarkdown: `# Raycast Design System

## Colors
\`\`\`css
:root {
  --color-bg: #ffffff;
  --color-surface: #f5f5f7;
  --color-primary: #ff6b35;
  --color-text-primary: #1d1d1f;
  --color-text-secondary: #86868b;
  --color-border: #d2d2d7;
  --color-gradient-start: #ff6b35;
  --color-gradient-end: #ff2d55;
}
\`\`\`

## Typography
\`\`\`css
--font-hero: 700 64px/0.95 "Satoshi", sans-serif;
--font-heading: 700 36px/1.1 "Satoshi", sans-serif;
--font-subheading: 500 20px/1.3 "Satoshi", sans-serif;
--font-body: 400 16px/1.5 "Satoshi", sans-serif;
--font-caption: 400 13px/1.4 "Satoshi", sans-serif;
\`\`\`

## Spacing Scale (8px base)
8, 12, 20, 32, 48, 80, 120

## Usage Notes
- Warm orange-to-red gradient is the brand signature
- Highly rounded UI elements (10-20px radii)
- Satoshi typeface with generous letter spacing
- Apple-inspired minimalism with Raycast's unique warmth`,
    },
    {
        id: "cursor-so",
        title: "Cursor",
        category: "Developer Tools",
        url: "https://cursor.com",
        iframeUrl: "https://cursor.com",
        screenshot: "/screenshots/cursor-so.png",
        description: "Warm ivory software studio with brushed metallic accents, dark editor panels, and smooth motion design.",
        featured: false,
        trending: 92,
        popular: 210,
        newest: 1,
        designTokens: {
            colors: [
                {
                    name: "Background",
                    hex: "#faf8f5",
                    cssVariable: "--color-bg",
                },
                {
                    name: "Surface",
                    hex: "#ffffff",
                    cssVariable: "--color-surface",
                },
                {
                    name: "Dark Panel",
                    hex: "#1a1b1e",
                    cssVariable: "--color-dark-panel",
                },
                {
                    name: "Text Primary",
                    hex: "#1a1a1a",
                    cssVariable: "--color-text-primary",
                },
                {
                    name: "Text Secondary",
                    hex: "#6e6e73",
                    cssVariable: "--color-text-secondary",
                },
                {
                    name: "Accent Violet",
                    hex: "#6c5ce7",
                    cssVariable: "--color-accent",
                },
                {
                    name: "Border",
                    hex: "#e8e4dd",
                    cssVariable: "--color-border",
                },
                {
                    name: "Warm Ivory",
                    hex: "#f3ede4",
                    cssVariable: "--color-warm-ivory",
                },
            ],
            typography: [
                {
                    name: "Hero",
                    fontFamily: "Inter",
                    fontSize: "64px",
                    fontWeight: 700,
                    lineHeight: "1.05",
                    letterSpacing: "-0.03em",
                },
                {
                    name: "Heading",
                    fontFamily: "Inter",
                    fontSize: "36px",
                    fontWeight: 600,
                    lineHeight: "1.15",
                    letterSpacing: "-0.02em",
                },
                {
                    name: "Subheading",
                    fontFamily: "Inter",
                    fontSize: "20px",
                    fontWeight: 500,
                    lineHeight: "1.35",
                    letterSpacing: "-0.01em",
                },
                {
                    name: "Body",
                    fontFamily: "Inter",
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "1.55",
                    letterSpacing: "0em",
                },
                {
                    name: "Code",
                    fontFamily: "JetBrains Mono",
                    fontSize: "13px",
                    fontWeight: 400,
                    lineHeight: "1.6",
                    letterSpacing: "0em",
                },
            ],
            spacing: [
                { name: "xs", value: "8px", px: 8 },
                { name: "sm", value: "16px", px: 16 },
                { name: "md", value: "24px", px: 24 },
                { name: "lg", value: "40px", px: 40 },
                { name: "xl", value: "64px", px: 64 },
                { name: "2xl", value: "96px", px: 96 },
                { name: "3xl", value: "144px", px: 144 },
            ],
            shadows: [
                {
                    name: "Card",
                    value: "0px 2px 8px rgba(0,0,0,0.04), 0px 0px 1px rgba(0,0,0,0.06)",
                },
                {
                    name: "Elevated",
                    value: "0px 8px 30px rgba(0,0,0,0.06), 0px 0px 2px rgba(0,0,0,0.04)",
                },
                {
                    name: "Glow",
                    value: "0px 0px 20px rgba(108,92,231,0.15)",
                },
            ],
            radii: [
                { name: "Button", value: "8px", px: 8 },
                { name: "Card", value: "12px", px: 12 },
                { name: "Panel", value: "16px", px: 16 },
                { name: "Input Field", value: "8px", px: 8 },
                { name: "Pill", value: "9999px", px: 9999 },
            ],
        },
        designMarkdown: `# Cursor Design System

## Colors
\`\`\`css
:root {
  --color-bg: #faf8f5;
  --color-surface: #ffffff;
  --color-dark-panel: #1a1b1e;
  --color-text-primary: #1a1a1a;
  --color-text-secondary: #6e6e73;
  --color-accent: #6c5ce7;
  --color-border: #e8e4dd;
  --color-warm-ivory: #f3ede4;
}
\`\`\`

## Typography
\`\`\`css
--font-hero: 700 64px/1.05 "Inter", sans-serif;
--font-heading: 600 36px/1.15 "Inter", sans-serif;
--font-subheading: 500 20px/1.35 "Inter", sans-serif;
--font-body: 400 16px/1.55 "Inter", sans-serif;
--font-code: 400 13px/1.6 "JetBrains Mono", monospace;
\`\`\`

## Spacing Scale (8px base)
8, 16, 24, 40, 64, 96, 144

## Usage Notes
- Warm ivory base (#faf8f5) with white surfaces for depth
- Dark editor panels (#1a1b1e) for code-heavy interfaces
- Violet accent (#6c5ce7) sparingly for interactive elements
- Smooth motion transitions (200-300ms ease-out)
- Inter font for UI, JetBrains Mono for code blocks`,
    },
    {
        id: "apple-design",
        title: "Apple",
        category: "E-commerce",
        url: "https://www.apple.com",
        iframeUrl: "https://www.apple.com",
        screenshot: "/screenshots/apple-design.png",
        description: "Consumer electronics with iconic minimalist design, dramatic product photography and precise typography.",
        featured: false,
        trending: 78,
        popular: 230,
        newest: 10,
        designTokens: {
            colors: [
                {
                    name: "Background",
                    hex: "#ffffff",
                    cssVariable: "--color-bg",
                },
                {
                    name: "Dark BG",
                    hex: "#000000",
                    cssVariable: "--color-dark-bg",
                },
                {
                    name: "Text Primary",
                    hex: "#1d1d1f",
                    cssVariable: "--color-text-primary",
                },
                {
                    name: "Text Light",
                    hex: "#f5f5f7",
                    cssVariable: "--color-text-light",
                },
                {
                    name: "Link Blue",
                    hex: "#0066cc",
                    cssVariable: "--color-link",
                },
                {
                    name: "Border",
                    hex: "#d2d2d7",
                    cssVariable: "--color-border",
                },
                {
                    name: "Surface",
                    hex: "#f5f5f7",
                    cssVariable: "--color-surface",
                },
                {
                    name: "Red",
                    hex: "#bf4800",
                    cssVariable: "--color-red",
                },
            ],
            typography: [
                {
                    name: "Hero Title",
                    fontFamily: "SF Pro Display",
                    fontSize: "80px",
                    fontWeight: 600,
                    lineHeight: "0.9",
                    letterSpacing: "-0.015em",
                },
                {
                    name: "Section Title",
                    fontFamily: "SF Pro Display",
                    fontSize: "48px",
                    fontWeight: 600,
                    lineHeight: "1.05",
                    letterSpacing: "-0.01em",
                },
                {
                    name: "Headline",
                    fontFamily: "SF Pro Display",
                    fontSize: "28px",
                    fontWeight: 600,
                    lineHeight: "1.15",
                    letterSpacing: "0em",
                },
                {
                    name: "Body",
                    fontFamily: "SF Pro Text",
                    fontSize: "17px",
                    fontWeight: 400,
                    lineHeight: "1.47",
                    letterSpacing: "0em",
                },
                {
                    name: "Caption",
                    fontFamily: "SF Pro Text",
                    fontSize: "12px",
                    fontWeight: 400,
                    lineHeight: "1.33",
                    letterSpacing: "0em",
                },
            ],
            spacing: [
                { name: "xs", value: "8px", px: 8 },
                { name: "sm", value: "16px", px: 16 },
                { name: "md", value: "24px", px: 24 },
                { name: "lg", value: "40px", px: 40 },
                { name: "xl", value: "60px", px: 60 },
                { name: "2xl", value: "96px", px: 96 },
                { name: "3xl", value: "144px", px: 144 },
            ],
            shadows: [
                {
                    name: "Card",
                    value: "0px 2px 12px rgba(0,0,0,0.04), 0px 0px 1px rgba(0,0,0,0.06)",
                },
                {
                    name: "Nav",
                    value: "0px 1px 4px rgba(0,0,0,0.03), 0px 0px 1px rgba(0,0,0,0.05)",
                },
                {
                    name: "Button",
                    value: "0px 2px 8px rgba(0,0,0,0.06), 0px 0px 1px rgba(0,0,0,0.08)",
                },
            ],
            radii: [
                { name: "Button", value: "980px", px: 980 },
                { name: "Card", value: "18px", px: 18 },
                { name: "Input Field", value: "12px", px: 12 },
                { name: "Container", value: "24px", px: 24 },
                { name: "Icon", value: "8px", px: 8 },
            ],
        },
        designMarkdown: `# Apple Design System

## Colors
\`\`\`css
:root {
  --color-bg: #ffffff;
  --color-dark-bg: #000000;
  --color-text-primary: #1d1d1f;
  --color-text-light: #f5f5f7;
  --color-link: #0066cc;
  --color-border: #d2d2d7;
  --color-surface: #f5f5f7;
  --color-red: #bf4800;
}
\`\`\`

## Typography
\`\`\`css
--font-hero: 600 80px/0.9 "SF Pro Display", sans-serif;
--font-section: 600 48px/1.05 "SF Pro Display", sans-serif;
--font-headline: 600 28px/1.15 "SF Pro Display", sans-serif;
--font-body: 400 17px/1.47 "SF Pro Text", sans-serif;
--font-caption: 400 12px/1.33 "SF Pro Text", sans-serif;
\`\`\`

## Spacing Scale (8px base)
8, 16, 24, 40, 60, 96, 144

## Usage Notes
- Alternating black and white full-bleed sections
- Pill-shaped buttons (980px radius) for primary CTAs
- No visible borders - elevation and spacing create separation
- Ultra-minimal navigation that disappears on scroll`,
    },
];
