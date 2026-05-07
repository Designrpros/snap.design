use scraper::{Html, Selector};
use crate::extractor::utils::ShadowToken;

fn shadow_name_from_var(name: &str) -> String {
    name.replace('-', " ")
        .replace('_', " ")
        .split_whitespace()
        .map(|w| {
            let mut chars = w.chars();
            match chars.next() {
                None => String::new(),
                Some(c) => c.to_uppercase().collect::<String>() + &chars.collect::<String>(),
            }
        })
        .collect::<Vec<_>>()
        .join(" ")
}

pub fn extract_shadows_from_text(text: &str, target: &mut Vec<ShadowToken>) {
    let mut seen: std::collections::HashSet<String> = std::collections::HashSet::new();
    for s in target.iter() {
        seen.insert(s.value.clone());
    }

    // CSS variables: --shadow-*, --box-shadow-*, --elevation-*
    let var_re = regex::Regex::new(
        r"--(?:shadow|box-shadow|elevation)-([a-zA-Z0-9_-]+)\s*:\s*([^;{}]+)"
    ).unwrap();
    for cap in var_re.captures_iter(text) {
        let raw_name = cap[1].trim().to_string();
        let value = cap[2].trim().trim_matches(';').trim().to_string();
        if value == "none" || value.starts_with("var(") || seen.contains(&value) { continue; }
        seen.insert(value.clone());
        let name = if !raw_name.is_empty() {
            shadow_name_from_var(&raw_name)
        } else {
            format!("shadow-{}", target.len() + 1)
        };
        target.push(ShadowToken { name, value });
    }

    // Direct box-shadow declarations
    let shadow_re = regex::Regex::new(r"box-shadow\s*:\s*([^;{}]+)").unwrap();
    for cap in shadow_re.captures_iter(text) {
        let value = cap[1].trim().to_string();
        if value == "none" || seen.contains(&value) { continue; }
        seen.insert(value.clone());

        // Try to find a nearby comment or custom property name for better naming
        let name = format!("shadow-{}", target.len() + 1);
        target.push(ShadowToken { name, value });
    }

    // Inline styles
    let inline_re = regex::Regex::new(r#"box-shadow\s*:\s*([^"';{}]+)"#).unwrap();
    for cap in inline_re.captures_iter(text) {
        let value = cap[1].trim().to_string();
        if value == "none" || seen.contains(&value) { continue; }
        seen.insert(value.clone());
        let name = format!("shadow-{}", target.len() + 1);
        target.push(ShadowToken { name, value });
    }
}

pub fn extract_shadows(doc: &Html) -> Vec<ShadowToken> {
    let mut shadows = Vec::new();
    let style_selector = Selector::parse("style").unwrap();
    let mut all_css = String::new();
    for style in doc.select(&style_selector) {
        all_css.push_str(&style.text().collect::<Vec<_>>().join(""));
        all_css.push('\n');
    }
    extract_shadows_from_text(&all_css, &mut shadows);

    // Also scan for inline style attributes with box-shadow
    let all_el_selector = Selector::parse("[style]").unwrap();
    let mut inline_css = String::new();
    for el in doc.select(&all_el_selector) {
        if let Some(style_attr) = el.value().attr("style") {
            if style_attr.contains("box-shadow") {
                inline_css.push_str(style_attr);
                inline_css.push(';');
            }
        }
    }
    if !inline_css.is_empty() {
        extract_shadows_from_text(&inline_css, &mut shadows);
    }

    shadows
}
