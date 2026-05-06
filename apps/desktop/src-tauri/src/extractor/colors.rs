use scraper::{Html, Selector};
use crate::extractor::utils::ColorToken;

pub fn extract_colors_from_styles(doc: &Html) -> Vec<ColorToken> {
    let mut colors = Vec::new();
    let style_selector = Selector::parse("style").unwrap();
    for style in doc.select(&style_selector) {
        let text = style.text().collect::<Vec<_>>().join("");
        extract_colors_from_text(&text, &mut colors);
    }
    colors
}

pub fn extract_colors_from_text(text: &str, target: &mut Vec<ColorToken>) {
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
