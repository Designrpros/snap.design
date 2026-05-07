use serde::{Deserialize, Serialize};
use scraper::{Html, Selector};
use crate::extractor::DesignTokens;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ColorToken {
    pub name: String,
    pub hex: String,
    pub css_variable: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TypographyToken {
    pub name: String,
    pub font_family: String,
    pub font_size: String,
    pub font_weight: i32,
    pub line_height: String,
    pub letter_spacing: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SpacingToken {
    pub name: String,
    pub value: String,
    pub px: i32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ShadowToken {
    pub name: String,
    pub value: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct RadiiToken {
    pub name: String,
    pub value: String,
    pub px: i32,
}

pub fn slugify(s: &str) -> String {
    s.to_lowercase()
        .chars()
        .map(|c| if c.is_alphanumeric() { c } else { '-' })
        .collect::<String>()
        .split('-')
        .filter(|s| !s.is_empty())
        .collect::<Vec<_>>()
        .join("-")
}

pub fn extract_title(doc: &Html) -> Option<String> {
    let selector = Selector::parse("title").ok()?;
    let element = doc.select(&selector).next()?;
    let text = element.text().collect::<Vec<_>>().join("");
    Some(text.trim().to_string())
}

pub fn extract_meta(doc: &Html, name: &str) -> Option<String> {
    let selector = Selector::parse(&format!("meta[name=\"{}\"]", name)).ok()?;
    if let Some(el) = doc.select(&selector).next() {
        el.value().attr("content").map(|s| s.to_string())
    } else {
        let og_selector = Selector::parse(&format!("meta[property=\"og:{}\"]", name)).ok()?;
        doc.select(&og_selector)
            .next()
            .and_then(|el| el.value().attr("content").map(|s| s.to_string()))
    }
}

pub fn classify_category(title: &str, description: &str) -> String {
    let combined = format!("{} {}", title.to_lowercase(), description.to_lowercase());

    let categories = [
        ("SaaS", &["saas", "platform", "dashboard", "api", "cloud"] as &[&str]),
        ("E-commerce", &["shop", "store", "commerce", "cart", "retail"]),
        ("Developer Tools", &["dev", "code", "github", "git", "api", "cli", "tool"]),
        ("AI", &["ai", "machine learning", "gpt", "llm", "artificial"]),
        ("Finance", &["bank", "finance", "payment", "stripe", "crypto"]),
        ("Productivity", &["todo", "task", "notes", "calendar", "productivity"]),
        ("Social", &["social", "chat", "message", "community"]),
        ("Portfolio", &["portfolio", "personal", "resume"]),
        ("Media", &["media", "video", "photo", "stream"]),
        ("Landing Page", &["landing", "coming soon", "launch"]),
    ];

    for (category, keywords) in &categories {
        if keywords.iter().any(|k| combined.contains(k)) {
            return category.to_string();
        }
    }

    "SaaS".to_string()
}

pub fn generate_design_markdown(title: &str, tokens: &DesignTokens) -> String {
    let mut md = String::new();
    md.push_str(&format!("# {}\n\n", title));

    md.push_str("## Colors\n\n");
    md.push_str("| Name | Hex | CSS Variable |\n|------|-----|-------------|\n");
    for c in &tokens.colors {
        md.push_str(&format!("| {} | `{}` | `{}` |\n", c.name, c.hex, c.css_variable));
    }

    md.push_str("\n## Typography\n\n");
    for t in &tokens.typography {
        md.push_str(&format!(
            "**{}** — {} weight {} {}/{} ls {}\n\n",
            t.name, t.font_family, t.font_weight, t.font_size, t.line_height, t.letter_spacing
        ));
    }

    if !tokens.spacing.is_empty() {
        md.push_str("## Spacing\n\n");
        md.push_str("| Name | Value | Px |\n|------|-------|----|\n");
        for s in &tokens.spacing {
            md.push_str(&format!("| {} | `{}` | {} |\n", s.name, s.value, s.px));
        }
        md.push('\n');
    }

    if !tokens.shadows.is_empty() {
        md.push_str("## Shadows\n\n");
        md.push_str("| Name | Value |\n|------|-------|\n");
        for s in &tokens.shadows {
            md.push_str(&format!("| {} | `{}` |\n", s.name, s.value));
        }
        md.push('\n');
    }

    if !tokens.radii.is_empty() {
        md.push_str("## Border Radius\n\n");
        md.push_str("| Name | Value | Px |\n|------|-------|----|\n");
        for r in &tokens.radii {
            md.push_str(&format!("| {} | `{}` | {} |\n", r.name, r.value, r.px));
        }
        md.push('\n');
    }

    md
}
