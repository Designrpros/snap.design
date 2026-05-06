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

    let response = client
        .get(&url)
        .send()
        .await
        .map_err(|e| format!("Failed to fetch URL: {}", e))?;

    let final_url = response.url().clone();
    let body = response.text()
        .await
        .map_err(|e| format!("Failed to read response: {}", e))?;

    // Perform all DOM-dependent extraction in a block to ensure non-Send types are dropped before awaits
    let (id, title, description, mut colors, typography, spacing, shadows, radii, stylesheet_urls) = {
        let document = Html::parse_document(&body);
        
        let title = extract_title(&document)
            .unwrap_or_else(|| "Untitled Site".to_string());
        let description = extract_meta(&document, "description")
            .unwrap_or_else(|| "No description available".to_string());
        
        let colors = extract_colors_from_styles(&document);
        let typography = extract_typography(&document);
        let spacing = extract_spacing(&document);
        let shadows = extract_shadows(&document);
        let radii = extract_radii(&document);
        let id = slugify(&title);

        let mut urls = Vec::new();
        let link_selector = Selector::parse("link[rel=\"stylesheet\"]").unwrap();
        for link in document.select(&link_selector) {
            if let Some(href) = link.value().attr("href") {
                if let Ok(abs_url) = final_url.join(href) {
                    urls.push(abs_url);
                }
            }
        }
        (id, title, description, colors, typography, spacing, shadows, radii, urls)
    };

    // Now it is safe to await network calls as 'document' is out of scope
    for abs_url in stylesheet_urls {
        if let Ok(css_res) = client.get(abs_url).send().await {
            if let Ok(css_text) = css_res.text().await {
                extract_colors_from_text(&css_text, &mut colors);
            }
        }
    }

    let tokens = DesignTokens {
        colors, // No longer limiting to 8
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

fn extract_colors_from_styles(doc: &Html) -> Vec<ColorToken> {
    let mut colors = Vec::new();
    let style_selector = Selector::parse("style").unwrap();
    for style in doc.select(&style_selector) {
        let text = style.text().collect::<Vec<_>>().join("");
        extract_colors_from_text(&text, &mut colors);
    }
    colors
}

fn extract_colors_from_text(text: &str, target: &mut Vec<ColorToken>) {
    // Comprehensive regex for Hex, RGB, HSL, and OKLCH
    let hex_re = regex::Regex::new(r"#(?:[0-9a-fA-F]{3,4}){1,2}").unwrap();
    let fn_re = regex::Regex::new(r"(?:rgb|hsl|oklch)a?\([^)]+\)").unwrap();
    
    let mut seen = std::collections::HashSet::new();
    for c in target.iter() {
        seen.insert(c.hex.to_lowercase());
    }

    // 1. Extract Hex
    for cap in hex_re.captures_iter(text) {
        let val = cap[0].to_string().to_lowercase();
        if seen.contains(&val) || val.len() < 4 { continue; }
        seen.insert(val.clone());
        let name = format!("color-{}", target.len() + 1);
        target.push(ColorToken {
            name,
            css_variable: format!("--color-{}", target.len() + 1),
            hex: val,
        });
    }

    // 2. Extract functional colors
    for cap in fn_re.captures_iter(text) {
        let val = cap[0].to_string().to_lowercase();
        if seen.contains(&val) { continue; }
        seen.insert(val.clone());
        let name = format!("color-{}", target.len() + 1);
        target.push(ColorToken {
            name,
            css_variable: format!("--color-{}", target.len() + 1),
            hex: val,
        });
    }
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

fn extract_colors(doc: &Html, client: &reqwest::Client, base_url: &str) -> Vec<ColorToken> {
    let mut colors = Vec::new();
    let mut all_css = String::new();
    
    // 1. Inline <style> tags
    let style_selector = Selector::parse("style").unwrap();
    for style in doc.select(&style_selector) {
        all_css.push_str(&style.text().collect::<Vec<_>>().join(""));
    }

    // 2. External <link> stylesheets
    let link_selector = Selector::parse("link[rel=\"stylesheet\"]").unwrap();
    let mut external_css_futures = Vec::new();
    
    for link in doc.select(&link_selector) {
        if let Some(href) = link.value().attr("href") {
            let full_url = if href.starts_with("http") {
                href.to_string()
            } else if href.starts_with("//") {
                format!("https:{}", href)
            } else {
                format!("{}/{}", base_url.trim_end_matches('/'), href.trim_start_matches('/'))
            };
            external_css_futures.push(client.get(full_url).send());
        }
    }

    // Since we are in an async context, we can wait for these
    // For simplicity in this script, we'll use a block_on or just fetch sequentially if needed
    // But since this is a command, we can just await them.
    
    let mut seen = std::collections::HashSet::new();

    // Extract colors from all collected CSS
    let color_regex = regex::Regex::new(r"#(?:[0-9a-fA-F]{3,4}){1,2}|rgb\([^)]+\)|hsl\([^)]+\)|oklch\([^)]+\)").unwrap();
    
    for cap in color_regex.captures_iter(&all_css) {
        let val = cap[0].to_string().to_lowercase();
        if seen.contains(&val) || val.len() < 4 { continue; }
        seen.insert(val.clone());
        
        let name = format!("color-{}", colors.len() + 1);
        colors.push(ColorToken {
            name: name.clone(),
            hex: val.clone(),
            css_variable: format!("--{}", name),
        });
        
        if colors.len() >= 8 { break; }
    }

    // Fallback if nothing found
    if colors.is_empty() {
        colors.push(ColorToken { name: "Primary".to_string(), hex: "#000000".to_string(), css_variable: "--primary".to_string() });
        colors.push(ColorToken { name: "Background".to_string(), hex: "#ffffff".to_string(), css_variable: "--background".to_string() });
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
    let font_size_re = regex::Regex::new(r"font-size\s*:\s*([^;}]+)").unwrap();
    let mut seen = std::collections::HashSet::new();

    // Primary font extraction
    for cap in font_family_re.captures_iter(&all_css) {
        let family = cap[1].trim().trim_matches('"').trim_matches('\'').to_string();
        if seen.contains(&family) || family == "inherit" {
            continue;
        }
        seen.insert(family.clone());

        let name = family.split(',').next().unwrap_or(&family).trim_matches('"').trim_matches('\'').to_string();
        
        // Try to find a corresponding size in the same block (very basic)
        let size = "16px".to_string(); 
        
        typography.push(TypographyToken {
            name: name.clone(),
            font_family: family,
            font_size: size,
            font_weight: 400,
            line_height: "1.5".to_string(),
            letter_spacing: "0".to_string(),
        });
        if typography.len() >= 5 { break; }
    }

    if typography.is_empty() {
        typography.push(TypographyToken {
            name: "Main Sans".to_string(),
            font_family: "Inter, system-ui, sans-serif".to_string(),
            font_size: "16px".to_string(),
            font_weight: 400,
            line_height: "1.5".to_string(),
            letter_spacing: "0".to_string(),
        });
    }

    typography
}

fn extract_spacing(doc: &Html) -> Vec<SpacingToken> {
    // Look for --spacing or similar variables
    let mut spacing = Vec::new();
    let style_selector = Selector::parse("style").unwrap();
    let mut all_css = String::new();
    for style in doc.select(&style_selector) {
        all_css.push_str(&style.text().collect::<Vec<_>>().join(""));
    }

    let space_re = regex::Regex::new(r"--spacing-([\w-]+)\s*:\s*(\d+px)").unwrap();
    for cap in space_re.captures_iter(&all_css) {
        let name = cap[1].to_string();
        let value = cap[2].to_string();
        let px = value.replace("px", "").parse::<i32>().unwrap_or(0);
        spacing.push(SpacingToken { name, value, px });
    }

    if spacing.is_empty() {
        return vec![
            SpacingToken { name: "xs".to_string(), value: "4px".to_string(), px: 4 },
            SpacingToken { name: "sm".to_string(), value: "8px".to_string(), px: 8 },
            SpacingToken { name: "md".to_string(), value: "16px".to_string(), px: 16 },
            SpacingToken { name: "lg".to_string(), value: "24px".to_string(), px: 24 },
            SpacingToken { name: "xl".to_string(), value: "32px".to_string(), px: 32 },
        ];
    }
    spacing
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
