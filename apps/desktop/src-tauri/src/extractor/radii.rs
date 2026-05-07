use scraper::{Html, Selector};
use crate::extractor::utils::RadiiToken;

fn parse_px_value(value: &str) -> i32 {
    let re = regex::Regex::new(r"(\d+(?:\.\d+)?)px").unwrap();
    re.captures(value)
        .and_then(|c| c[1].parse::<f64>().ok())
        .map(|v| v.round() as i32)
        .unwrap_or(0)
}

fn humanize_name(raw: &str) -> String {
    raw.replace('-', " ")
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

pub fn extract_radii_from_text(text: &str, target: &mut Vec<RadiiToken>) {
    let mut seen: std::collections::HashSet<String> = std::collections::HashSet::new();
    for r in target.iter() {
        seen.insert(r.name.clone());
        seen.insert(r.value.clone());
    }

    // CSS variables like --radius-*, --border-radius-*, --rounded-*, --br-*
    let var_re = regex::Regex::new(
        r"--(?:radius|border-radius|rounded|br)-([a-zA-Z0-9_-]+)\s*:\s*([^;{}]+)"
    ).unwrap();
    for cap in var_re.captures_iter(text) {
        let name = cap[1].trim().to_string();
        let value = cap[2].trim().trim_matches(';').trim().to_string();
        if name == "inherit" || name == "none" || value.starts_with("var(") || seen.contains(&name) { continue; }
        seen.insert(name.clone());
        seen.insert(value.clone());
        target.push(RadiiToken {
            name: humanize_name(&name),
            value: value.clone(),
            px: parse_px_value(&value),
        });
    }

    // Direct border-radius declarations in rule blocks
    let br_re = regex::Regex::new(r"border-radius\s*:\s*([^;{}]+)").unwrap();
    for cap in br_re.captures_iter(text) {
        let value = cap[1].trim().to_string();
        if value == "none" || value == "inherit" || seen.contains(&value) { continue; }
        seen.insert(value.clone());
        let px = parse_px_value(&value);
        let name = if px > 0 {
            format!("Radius {}", px)
        } else {
            format!("radius-{}", target.len() + 1)
        };
        target.push(RadiiToken { name, value, px });
    }

    // Inline border-radius style attributes
    let inline_re = regex::Regex::new(r#"border-radius\s*:\s*([^"';{}]+)"#).unwrap();
    for cap in inline_re.captures_iter(text) {
        let value = cap[1].trim().to_string();
        if value == "none" || value == "inherit" || seen.contains(&value) { continue; }
        seen.insert(value.clone());
        let px = parse_px_value(&value);
        let name = if px > 0 {
            format!("Radius {}", px)
        } else {
            format!("radius-{}", target.len() + 1)
        };
        target.push(RadiiToken { name, value, px });
    }
}

pub fn extract_radii(doc: &Html) -> Vec<RadiiToken> {
    let mut radii = Vec::new();
    let style_selector = Selector::parse("style").unwrap();
    for style in doc.select(&style_selector) {
        let text = style.text().collect::<Vec<_>>().join("");
        extract_radii_from_text(&text, &mut radii);
    }

    // Also scan inline style attributes on elements
    let all_selector = Selector::parse("[style]").unwrap();
    let mut all_inline = String::new();
    for el in doc.select(&all_selector) {
        if let Some(style_attr) = el.value().attr("style") {
            if style_attr.contains("border-radius") {
                all_inline.push_str(style_attr);
                all_inline.push(';');
            }
        }
    }
    if !all_inline.is_empty() {
        extract_radii_from_text(&all_inline, &mut radii);
    }

    radii
}
