use scraper::{Html, Selector};
use serde::{Deserialize, Serialize};
use reqwest;

#[derive(Debug, Serialize, Deserialize)]
pub struct ColorToken {
    pub name: String,
    pub hex: String,
    pub css_variable: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TypographyToken {
    pub name: String,
    pub font_family: String,
    pub font_size: String,
    pub font_weight: i32,
    pub line_height: String,
    pub letter_spacing: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SpacingToken {
    pub name: String,
    pub value: String,
    pub px: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ShadowToken {
    pub name: String,
    pub value: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RadiiToken {
    pub name: String,
    pub value: String,
    pub px: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DesignTokens {
    pub colors: Vec<ColorToken>,
    pub typography: Vec<TypographyToken>,
    pub spacing: Vec<SpacingToken>,
    pub shadows: Vec<ShadowToken>,
    pub radii: Vec<RadiiToken>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ExtractionResult {
    pub id: String,
    pub title: String,
    pub category: String,
    pub url: String,
    pub iframe_url: String,
    pub description: String,
    pub featured: bool,
    pub screenshot: String,
    pub design_tokens: DesignTokens,
    pub design_markdown: String,
}

#[tauri::command]
pub async fn extract_url(url: String) -> Result<ExtractionResult, String> {
    let client = reqwest::Client::builder()
        .user_agent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36")
        .build()
        .map_err(|e| e.to_string())?;

    let body = client
        .get(&url)
        .send()
        .await
        .map_err(|e| format!("Failed to fetch URL: {}", e))?
        .text()
        .await
        .map_err(|e| format!("Failed to read response: {}", e))?;

    let document = Html::parse_document(&body);

    let title = extract_title(&document)
        .unwrap_or_else(|| "Untitled Site".to_string());

    let description = extract_meta(&document, "description")
        .unwrap_or_else(|| "No description available".to_string());

    let colors = extract_colors(&document);
    let typography = extract_typography(&document);
    let spacing = extract_spacing(&document);
    let shadows = extract_shadows(&document);
    let radii = extract_radii(&document);

    let id = slugify(&title);
    let tokens = DesignTokens {
        colors,
        typography,
        spacing,
        shadows,
        radii,
    };
    
    let design_md = generate_design_markdown(&title, &tokens);

    let category = classify_category(&title, &description);

    Ok(ExtractionResult {
        id: id.clone(),
        title,
        category,
        url: url.clone(),
        iframe_url: url.clone(),
        description,
        featured: false,
        screenshot: String::new(),
        design_tokens: tokens,
        design_markdown: design_md,
    })
}

fn extract_title(doc: &Html) -> Option<String> {
    let selector = Selector::parse("title").ok()?;
    let element = doc.select(&selector).next()?;
    let text = element.text().collect::<Vec<_>>().join("");
    Some(text.trim().to_string())
}

fn extract_meta(doc: &Html, name: &str) -> Option<String> {
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

fn extract_colors(doc: &Html) -> Vec<ColorToken> {
    let mut colors = Vec::new();
    let style_selector = Selector::parse("style").unwrap();
    
    let mut all_css = String::new();
    for style in doc.select(&style_selector) {
        all_css.push_str(&style.text().collect::<Vec<_>>().join(""));
    }

    let mut seen = std::collections::HashSet::new();

    // Extract CSS custom properties
    for cap in css_var_regex().captures_iter(&all_css) {
        let name = cap[1].to_string();
        let value = cap[2].to_string().trim().to_string();
        if seen.contains(&name) {
            continue;
        }
        seen.insert(name.clone());

        if is_color(&value) {
            let pretty_name = name.trim_start_matches('-').replace('-', " ");
            colors.push(ColorToken {
                name: pretty_name,
                css_variable: format!("--{}", name),
                hex: value,
            });
        }
    }

    // Extract hex colors from inline styles and style attributes
    let all_attr_selector = Selector::parse("[style]").unwrap();
    for element in doc.select(&all_attr_selector) {
        if let Some(style) = element.value().attr("style") {
            for cap in hex_regex().captures_iter(style) {
                let hex = cap[0].to_string();
                if seen.contains(&hex) {
                    continue;
                }
                seen.insert(hex.clone());
                let idx = colors.len() + 1;
                colors.push(ColorToken {
                    name: format!("color-{}", idx),
                    css_variable: format!("--color-{}", idx),
                    hex,
                });
            }
        }
    }

    // Fallback: detect common background/text colors from body
    if colors.is_empty() {
        colors.push(ColorToken {
            name: "background".to_string(),
            css_variable: "--background".to_string(),
            hex: "#ffffff".to_string(),
        });
        colors.push(ColorToken {
            name: "text".to_string(),
            css_variable: "--text".to_string(),
            hex: "#1a1a1a".to_string(),
        });
    }

    colors
}

fn css_var_regex() -> regex::Regex {
    regex::Regex::new(r"--([\w-]+)\s*:\s*([^;]+)").unwrap()
}

fn hex_regex() -> regex::Regex {
    regex::Regex::new(r"#[0-9a-fA-F]{3,8}").unwrap()
}

fn is_color(value: &str) -> bool {
    let lower = value.to_lowercase();
    lower.starts_with('#')
        || lower.starts_with("rgb")
        || lower.starts_with("hsl")
        || lower.starts_with("oklch")
        || lower.starts_with("oklab")
}

fn extract_typography(doc: &Html) -> Vec<TypographyToken> {
    let mut typography = Vec::new();
    let style_selector = Selector::parse("style").unwrap();
    
    let mut all_css = String::new();
    for style in doc.select(&style_selector) {
        all_css.push_str(&style.text().collect::<Vec<_>>().join(""));
    }

    let font_family_re = regex::Regex::new(r"font-family\s*:\s*([^;}]+)").unwrap();
    let mut seen = std::collections::HashSet::new();

    for cap in font_family_re.captures_iter(&all_css) {
        let family = cap[1].trim().trim_matches('"').trim_matches('\'').to_string();
        if seen.contains(&family) || family == "inherit" {
            continue;
        }
        seen.insert(family.clone());

        let name = family.split(',').next().unwrap_or(&family).trim_matches('"').trim_matches('\'').to_string();
        typography.push(TypographyToken {
            name: name.clone(),
            font_family: family,
            font_size: "16px".to_string(),
            font_weight: 400,
            line_height: "1.5".to_string(),
            letter_spacing: "0".to_string(),
        });
    }

    if typography.is_empty() {
        typography.push(TypographyToken {
            name: "Body".to_string(),
            font_family: "Inter, sans-serif".to_string(),
            font_size: "16px".to_string(),
            font_weight: 400,
            line_height: "1.5".to_string(),
            letter_spacing: "0".to_string(),
        });
    }

    typography
}

fn extract_spacing(_doc: &Html) -> Vec<SpacingToken> {
    vec![
        SpacingToken { name: "xs".to_string(), value: "4px".to_string(), px: 4 },
        SpacingToken { name: "sm".to_string(), value: "8px".to_string(), px: 8 },
        SpacingToken { name: "md".to_string(), value: "16px".to_string(), px: 16 },
        SpacingToken { name: "lg".to_string(), value: "24px".to_string(), px: 24 },
        SpacingToken { name: "xl".to_string(), value: "32px".to_string(), px: 32 },
        SpacingToken { name: "2xl".to_string(), value: "48px".to_string(), px: 48 },
        SpacingToken { name: "3xl".to_string(), value: "64px".to_string(), px: 64 },
    ]
}

fn extract_shadows(doc: &Html) -> Vec<ShadowToken> {
    let mut shadows = Vec::new();
    let style_selector = Selector::parse("style").unwrap();
    
    let mut all_css = String::new();
    for style in doc.select(&style_selector) {
        all_css.push_str(&style.text().collect::<Vec<_>>().join(""));
    }

    let shadow_re = regex::Regex::new(r"box-shadow\s*:\s*([^;}]+)").unwrap();
    let mut seen = std::collections::HashSet::new();

    for (i, cap) in shadow_re.captures_iter(&all_css).enumerate() {
        let value = cap[1].trim().to_string();
        if value == "none" || seen.contains(&value) {
            continue;
        }
        seen.insert(value.clone());
        let name = if i == 0 {
            "sm".to_string()
        } else if i == 1 {
            "md".to_string()
        } else {
            "lg".to_string()
        };
        shadows.push(ShadowToken { name, value });
    }

    if shadows.is_empty() {
        shadows.push(ShadowToken {
            name: "sm".to_string(),
            value: "0 1px 2px rgba(0,0,0,0.1)".to_string(),
        });
    }

    shadows
}

fn extract_radii(_doc: &Html) -> Vec<RadiiToken> {
    vec![
        RadiiToken { name: "sm".to_string(), value: "4px".to_string(), px: 4 },
        RadiiToken { name: "md".to_string(), value: "8px".to_string(), px: 8 },
        RadiiToken { name: "lg".to_string(), value: "12px".to_string(), px: 12 },
        RadiiToken { name: "xl".to_string(), value: "16px".to_string(), px: 16 },
        RadiiToken { name: "full".to_string(), value: "9999px".to_string(), px: 9999 },
    ]
}

fn slugify(s: &str) -> String {
    s.to_lowercase()
        .chars()
        .map(|c| if c.is_alphanumeric() { c } else { '-' })
        .collect::<String>()
        .split('-')
        .filter(|s| !s.is_empty())
        .collect::<Vec<_>>()
        .join("-")
}

fn classify_category(title: &str, description: &str) -> String {
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

fn generate_design_markdown(title: &str, tokens: &DesignTokens) -> String {
    let mut md = String::new();
    md.push_str(&format!("# {}\n\n", title));
    md.push_str("## Colors\n\n");
    md.push_str("| Name | Hex | CSS Variable |\n");
    md.push_str("|------|-----|-------------|\n");
    for c in &tokens.colors {
        md.push_str(&format!(
            "| {} | `{}` | `{}` |\n",
            c.name, c.hex, c.css_variable
        ));
    }
    md.push_str("\n## Typography\n\n");
    for t in &tokens.typography {
        md.push_str(&format!(
            "**{}** — {} {} {}/{}\n\n",
            t.name, t.font_family, t.font_weight, t.font_size, t.line_height
        ));
    }
    if !tokens.shadows.is_empty() {
        md.push_str("## Shadows\n\n");
        md.push_str("| Name | Value |\n");
        md.push_str("|------|-------|\n");
        for s in &tokens.shadows {
            md.push_str(&format!("| {} | `{}` |\n", s.name, s.value));
        }
    }
    md
}
