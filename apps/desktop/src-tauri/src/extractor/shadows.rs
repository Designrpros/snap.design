use scraper::{Html, Selector};
use crate::extractor::utils::ShadowToken;

pub fn extract_shadows(doc: &Html) -> Vec<ShadowToken> {
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
