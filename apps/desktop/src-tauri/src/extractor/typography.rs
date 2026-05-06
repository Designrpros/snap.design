use scraper::{Html, Selector};
use crate::extractor::utils::TypographyToken;

pub fn extract_typography(doc: &Html) -> Vec<TypographyToken> {
    let mut typography = Vec::new();
    let style_selector = Selector::parse("style").unwrap();
    
    let mut all_css = String::new();
    for style in doc.select(&style_selector) {
        all_css.push_str(&style.text().collect::<Vec<_>>().join(""));
    }

    let font_family_re = regex::Regex::new(r"font-family\s*:\s*([^;}]+)").unwrap();
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
