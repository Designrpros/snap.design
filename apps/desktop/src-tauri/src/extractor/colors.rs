use scraper::{Html, Selector};
use crate::extractor::utils::ColorToken;

fn humanize_color_name(raw: &str) -> String {
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

fn is_valid_hex(s: &str) -> bool {
    let chars: Vec<char> = s.chars().collect();
    let len = chars.len();
    match len {
        3 | 4 | 6 | 8 => chars.iter().all(|c| c.is_ascii_hexdigit()),
        _ => false,
    }
}

/// Extract colors from CSS custom property declarations.
/// Skips build-system artifacts (Tailwind internals, gradient interpolation steps).
fn extract_color_variables(text: &str, target: &mut Vec<ColorToken>) {
    let mut seen: std::collections::HashSet<String> = std::collections::HashSet::new();
    for c in target.iter() {
        seen.insert(c.css_variable.clone());
    }

    let var_re = regex::Regex::new(
        r"--([a-zA-Z0-9_-]+)\s*:\s*(#[0-9a-fA-F]{3,8}|(?:rgb|hsl|oklch|lab|lch)a?\([^)]+\))"
    ).unwrap();

    for cap in var_re.captures_iter(text) {
        let var_name = cap[1].trim().to_string();
        let color_val = cap[2].trim().to_lowercase().to_string();

        if color_val.starts_with('#') && !is_valid_hex(&color_val) { continue; }

        // Skip Tailwind internal variables
        if var_name.starts_with("tw-") { continue; }

        // Skip auto-generated color scale variables (numeric-only names with hsla opacity steps)
        if var_name.chars().all(|c| c.is_ascii_digit() || c == '-')
            && color_val.starts_with("hsla") {
            continue;
        }

        if seen.contains(&var_name) { continue; }
        seen.insert(var_name.clone());

        target.push(ColorToken {
            name: humanize_color_name(&var_name),
            hex: color_val,
            css_variable: format!("--{}", var_name),
        });
    }
}

pub fn extract_colors_from_styles(doc: &Html) -> Vec<ColorToken> {
    let mut colors = Vec::new();
    let style_selector = Selector::parse("style").unwrap();
    for style in doc.select(&style_selector) {
        let text = style.text().collect::<Vec<_>>().join("");
        extract_colors_from_text(&text, &mut colors);
    }

    // Also scan inline style attributes for colors
    let el_selector = Selector::parse("[style]").unwrap();
    let mut inline_css = String::new();
    for el in doc.select(&el_selector) {
        if let Some(style_attr) = el.value().attr("style") {
            if style_attr.contains('#') || style_attr.contains("rgb") {
                inline_css.push_str(style_attr);
                inline_css.push(';');
            }
        }
    }
    if !inline_css.is_empty() {
        extract_colors_from_text(&inline_css, &mut colors);
    }

    colors
}

pub fn extract_colors_from_text(text: &str, target: &mut Vec<ColorToken>) {
    let before = target.len();

    // First pass: named CSS variables (gives semantic names)
    extract_color_variables(text, target);

    // Only fall back to raw extraction if no CSS variable colors were found at all.
    // Sites with CSS variables have semantic color tokens; raw hexes are noise.
    if target.len() > before {
        return;
    }

    // Build seen-set of color values already captured
    let mut seen_values: std::collections::HashSet<String> = std::collections::HashSet::new();
    for c in target.iter() {
        seen_values.insert(c.hex.to_lowercase());
    }

    // Hex colors: 3, 4, 6, or 8 hex digits after #
    let hex_re = regex::Regex::new(
        r"#([0-9a-fA-F]{6}|[0-9a-fA-F]{8}|[0-9a-fA-F]{3}|[0-9a-fA-F]{4})\b"
    ).unwrap();
    for cap in hex_re.captures_iter(text) {
        let val = cap[0].to_lowercase();
        if seen_values.contains(&val) { continue; }
        seen_values.insert(val.clone());

        let idx = target.len() + 1;
        target.push(ColorToken {
            name: format!("Color {}", idx),
            css_variable: format!("--color-{}", idx),
            hex: val,
        });
    }

    // Functional colors: rgb/rgba/hsl/hsla/oklch/oklcha/lab/lch
    let fn_re = regex::Regex::new(r"(?:rgb|hsl|oklch|lab|lch)a?\([^)]+\)").unwrap();
    for cap in fn_re.captures_iter(text) {
        let val = cap[0].to_lowercase();
        if seen_values.contains(&val) { continue; }
        seen_values.insert(val.clone());

        let idx = target.len() + 1;
        target.push(ColorToken {
            name: format!("Color {}", idx),
            css_variable: format!("--color-{}", idx),
            hex: val,
        });
    }
}
