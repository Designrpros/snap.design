use scraper::{Html, Selector};
use crate::extractor::utils::SpacingToken;

fn parse_spacing_px(value: &str) -> i32 {
    let trimmed = value.trim();
    if let Ok(n) = trimmed.trim_end_matches("px").parse::<i32>() {
        return n;
    }
    let rem_re = regex::Regex::new(r"(\d*\.?\d+)rem").unwrap();
    if let Some(c) = rem_re.captures(trimmed) {
        if let Ok(n) = c[1].parse::<f64>() {
            return (n * 16.0).round() as i32;
        }
    }
    let em_re = regex::Regex::new(r"(\d*\.?\d+)em").unwrap();
    if let Some(c) = em_re.captures(trimmed) {
        if let Ok(n) = c[1].parse::<f64>() {
            return (n * 16.0).round() as i32;
        }
    }
    let num_re = regex::Regex::new(r"(\d*\.?\d+)").unwrap();
    if let Some(c) = num_re.captures(trimmed) {
        return c[1].parse::<f64>().map(|v| v.round() as i32).unwrap_or(0);
    }
    0
}

fn humanize_spacing_name(raw: &str) -> String {
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

pub fn extract_spacing_from_text(text: &str, target: &mut Vec<SpacingToken>) {
    let mut seen: std::collections::HashSet<String> = std::collections::HashSet::new();
    for s in target.iter() {
        seen.insert(s.name.clone());
        seen.insert(s.value.clone());
    }

    // CSS custom properties: --spacing-*, --space-*, --gap-*, --padding-*, --margin-*
    let var_re = regex::Regex::new(
        r"--(?:spacing|space|gap|padding|margin)-([a-zA-Z0-9_-]+)\s*:\s*([^;{}]+)"
    ).unwrap();
    for cap in var_re.captures_iter(text) {
        let name = cap[1].trim().to_string();
        let value = cap[2].trim().trim_matches(';').trim().to_string();
        if name == "inherit" || value.starts_with("var(") || seen.contains(&name) { continue; }
        seen.insert(name.clone());
        seen.insert(value.clone());
        let px = parse_spacing_px(&value);
        if px > 0 {
            target.push(SpacingToken {
                name: humanize_spacing_name(&name),
                value,
                px,
            });
        }
    }

    // Properties from rule blocks: gap, padding, margin
    let block_re = regex::Regex::new(r"\{([^}]*)\}").unwrap();
    let prop_re = regex::Regex::new(r"(gap|padding|margin)\s*:\s*([^;{}]+)").unwrap();
    for block_cap in block_re.captures_iter(text) {
        let block = &block_cap[1];
        for prop_cap in prop_re.captures_iter(block) {
            let prop = prop_cap[1].trim().to_string();
            let val = prop_cap[2].trim().to_string();
            if val == "0" || val == "none" || val == "inherit" || seen.contains(&val) {
                continue;
            }
            seen.insert(val.clone());
            let px = parse_spacing_px(&val);
            if px > 0 {
                let name = format!("{}-{}", prop, target.len() + 1);
                target.push(SpacingToken {
                    name: humanize_spacing_name(&name),
                    value: val,
                    px,
                });
            }
        }
    }
}

pub fn extract_spacing(doc: &Html) -> Vec<SpacingToken> {
    let mut spacing = Vec::new();
    let style_selector = Selector::parse("style").unwrap();
    let mut all_css = String::new();
    for style in doc.select(&style_selector) {
        all_css.push_str(&style.text().collect::<Vec<_>>().join(""));
        all_css.push('\n');
    }
    extract_spacing_from_text(&all_css, &mut spacing);

    spacing
}
