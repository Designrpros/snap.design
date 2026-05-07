use scraper::{Html, Selector};
use crate::extractor::utils::TypographyToken;
use std::collections::HashMap;

fn parse_font_weight(raw: &str) -> i32 {
    let trimmed = raw.trim().to_lowercase();
    if let Ok(n) = trimmed.parse::<i32>() { return n; }
    match trimmed.as_str() {
        "bold" => 700, "bolder" => 700, "normal" => 400, "lighter" => 300,
        _ => 400,
    }
}

fn first_font_word(family: &str) -> String {
    family.split(|c: char| c == ',' || c == ' ').next().unwrap_or("").trim().trim_matches('"').trim_matches('\'').to_lowercase()
}

fn is_var_reference(value: &str) -> bool {
    value.trim().starts_with("var(")
}

/// Split a CSS selector into individual "selector words" (tag names, classes, IDs).
fn selector_words(selector: &str) -> Vec<String> {
    selector.split(|c: char| matches!(c, ' ' | '>' | '+' | '~' | ',' | ':' | '.' | '#' | '[' | '(' | ')'))
        .map(|s| s.trim().to_lowercase())
        .filter(|s| !s.is_empty() && s.chars().all(|c| c.is_alphanumeric() || c == '-'))
        .collect()
}

/// A parsed CSS rule block with its selector and property→value map.
struct CssRule {
    selector: String,
    props: HashMap<String, String>,
}

fn parse_all_rules(css: &str) -> Vec<CssRule> {
    let rule_re = regex::Regex::new(r"(?s)([^{]+)\{([^}]*)\}").unwrap();
    let prop_re = regex::Regex::new(
        r"(font-family|font-size|font-weight|line-height|letter-spacing)\s*:\s*([^;]+)"
    ).unwrap();

    let mut rules = Vec::new();
    for cap in rule_re.captures_iter(css) {
        let selector = cap[1].trim().to_string();
        let block = &cap[2];
        let mut props = HashMap::new();
        for prop_cap in prop_re.captures_iter(block) {
            let prop = prop_cap[1].trim().to_string();
            let val = prop_cap[2].trim().to_string();
            props.entry(prop).or_insert(val);
        }
        if !props.is_empty() {
            rules.push(CssRule { selector, props });
        }
    }
    rules
}

/// Given a set of known selector words from a font-family rule, try to find
/// font-size/weight/lh/ls from another rule that shares at least one selector word.
fn find_associated_props<'a>(words: &[String], rules: &'a [CssRule]) -> HashMap<&'a str, &'a str> {
    let mut found: HashMap<&str, &str> = HashMap::new();
    for rule in rules {
        if rule.props.contains_key("font-family") { continue; }
        let rule_words = selector_words(&rule.selector);
        let has_overlap = words.iter().any(|w| rule_words.contains(w));
        if !has_overlap { continue; }

        for (prop, val) in &rule.props {
            match prop.as_str() {
                "font-size" => { found.entry("font-size").or_insert(val.as_str()); }
                "font-weight" => { found.entry("font-weight").or_insert(val.as_str()); }
                "line-height" => { found.entry("line-height").or_insert(val.as_str()); }
                "letter-spacing" => { found.entry("letter-spacing").or_insert(val.as_str()); }
                _ => {}
            }
        }
    }
    found
}

pub fn find_base_font_size(css: &str) -> Option<String> {
    let rule_re = regex::Regex::new(r"(?s)([^{]+)\{([^}]*)\}").unwrap();
    let size_re = regex::Regex::new(r"font-size\s*:\s*([^;]+)").unwrap();

    for &priority in &["html", ":root", "body"] {
        for cap in rule_re.captures_iter(css) {
            if cap[1].trim() == priority {
                if let Some(sz) = size_re.captures(&cap[2]) {
                    return Some(sz[1].trim().to_string());
                }
            }
        }
    }
    None
}

/// Use scraper's CSS selector engine to match font-family and font-size rules
/// against the actual HTML elements. When an element matches both a font-family
/// rule and a font-size rule, create a token with the correct size.
fn extract_element_sizes(doc: &Html, css: &str, target: &mut Vec<TypographyToken>) {
    let rule_re = regex::Regex::new(r"(?s)([^{]+)\{([^}]*)\}").unwrap();
    let prop_re = regex::Regex::new(r"(font-family|font-size)\s*:\s*([^;]+)").unwrap();

    // Collect font-family rules and font-size rules with their parsed selectors
    let mut font_rules: Vec<(Selector, String)> = Vec::new();
    let mut size_rules: Vec<(Selector, String)> = Vec::new();

    for cap in rule_re.captures_iter(css) {
        let selector_str = cap[1].trim();
        let block = &cap[2];

        for prop_cap in prop_re.captures_iter(block) {
            let prop = prop_cap[1].trim();
            let val = prop_cap[2].trim().to_string();
            if let Ok(sel) = Selector::parse(selector_str) {
                match prop {
                    "font-family" => {
                        if !is_var_reference(&val) && val != "inherit" {
                            font_rules.push((sel, val));
                        }
                    }
                    "font-size" => size_rules.push((sel, val)),
                    _ => {}
                }
            }
        }
    }

    if font_rules.is_empty() || size_rules.is_empty() { return; }

    let mut seen: std::collections::HashSet<(String, String)> = std::collections::HashSet::new();
    for t in target.iter() {
        seen.insert((first_font_word(&t.font_family), t.font_size.clone()));
    }

    let mut found: Vec<TypographyToken> = Vec::new();

    // For each font-family rule, find its matching elements,
    // then check which font-size rules also match those elements.
    for (ff_sel, family) in &font_rules {
        for element in doc.select(ff_sel) {
            for (fs_sel, size) in &size_rules {
                // Check if this element matches the font-size selector
                let matches = doc.select(fs_sel).any(|el| el.id() == element.id());
                if matches {
                    let key = (first_font_word(family), size.clone());
                    if seen.contains(&key) { continue; }
                    seen.insert(key.clone());

                    let name = family.split(',').next().unwrap_or(family)
                        .trim_matches('"').trim_matches('\'').to_string();
                    found.push(TypographyToken {
                        name,
                        font_family: family.clone(),
                        font_size: size.clone(),
                        font_weight: 400,
                        line_height: "1.5".to_string(),
                        letter_spacing: "normal".to_string(),
                    });
                    break; // one size per element per font-family rule is enough
                }
            }
        }
    }

    target.extend(found);
}

pub fn deduplicate_typography(tokens: &mut Vec<TypographyToken>) {
    let mut seen: std::collections::HashSet<(String, String, i32)> = std::collections::HashSet::new();
    tokens.retain(|t| {
        let key = (
            first_font_word(&t.font_family),
            t.font_size.clone(),
            t.font_weight,
        );
        seen.insert(key)
    })
}

/// If multiple tokens share the same primary font name, append weight to distinguish them.
fn distinguish_names(tokens: &mut Vec<TypographyToken>) {
    let mut counts: HashMap<String, usize> = HashMap::new();
    for t in tokens.iter() {
        *counts.entry(first_font_word(&t.font_family)).or_insert(0) += 1;
    }

    // Pre-compute per-key weight-frequency maps to avoid double-borrow
    let mut weight_counts: HashMap<String, HashMap<i32, usize>> = HashMap::new();
    for t in tokens.iter() {
        let key = first_font_word(&t.font_family);
        *weight_counts.entry(key).or_default().entry(t.font_weight).or_insert(0) += 1;
    }

    for t in tokens.iter_mut() {
        let key = first_font_word(&t.font_family);
        if counts.get(&key).copied().unwrap_or(1) <= 1 { continue; }

        let weight_dup = weight_counts.get(&key)
            .and_then(|wc| wc.get(&t.font_weight))
            .copied()
            .unwrap_or(1) > 1;

        if weight_dup {
            t.name = format!("{} {} / {}", t.name, t.font_size, t.font_weight);
        } else {
            t.name = format!("{} {}", t.name, t.font_weight);
        }
    }
}

fn extract_font_vars(text: &str, target: &mut Vec<TypographyToken>) {
    let var_re = regex::Regex::new(r"--font-([a-zA-Z0-9_-]+)-family\s*:\s*([^;}\n]+)").unwrap();
    let mut seen: std::collections::HashSet<String> = std::collections::HashSet::new();
    for t in target.iter() {
        seen.insert(first_font_word(&t.font_family));
    }
    for cap in var_re.captures_iter(text) {
        let raw_name = cap[1].trim().to_string();
        let family = cap[2].trim().trim_matches('"').trim_matches('\'').to_string();
        if family.is_empty() || family == "inherit" || is_var_reference(&family) { continue; }
        let key = first_font_word(&family);
        if seen.contains(&key) { continue; }
        seen.insert(key);
        target.push(TypographyToken {
            name: raw_name.replace('-', " "),
            font_family: family,
            font_size: "16px".to_string(),
            font_weight: 400,
            line_height: "1.5".to_string(),
            letter_spacing: "normal".to_string(),
        });
    }
}

fn extract_font_rules(text: &str, target: &mut Vec<TypographyToken>, base_font_size: &str) {
    let rules = parse_all_rules(text);

    let mut extracted: Vec<TypographyToken> = Vec::new();

    for rule in &rules {
        if !rule.props.contains_key("font-family") { continue; }

        let family = rule.props["font-family"].clone();
        if family == "inherit" || is_var_reference(&family) { continue; }

        // Props from the same rule block (converted to &str)
        let size = rule.props.get("font-size").map(|s| s.as_str());
        let weight = rule.props.get("font-weight").map(|s| s.as_str());
        let lh = rule.props.get("line-height").map(|s| s.as_str());
        let ls = rule.props.get("letter-spacing").map(|s| s.as_str());

        // If props are missing, try to find them in rules sharing selector words
        let rule_words = selector_words(&rule.selector);
        let associated = if size.is_none() || weight.is_none() || lh.is_none() || ls.is_none() {
            find_associated_props(&rule_words, &rules)
        } else {
            HashMap::new()
        };

        let final_size = size
            .or_else(|| associated.get("font-size").copied())
            .unwrap_or(base_font_size)
            .to_string();
        let final_weight = weight
            .or_else(|| associated.get("font-weight").copied())
            .map(parse_font_weight)
            .unwrap_or(400);
        let final_lh = lh
            .or_else(|| associated.get("line-height").copied())
            .unwrap_or("1.5")
            .to_string();
        let final_ls = ls
            .or_else(|| associated.get("letter-spacing").copied())
            .unwrap_or("normal")
            .to_string();

        let base_name = family.split(',').next().unwrap_or(&family).trim_matches('"').trim_matches('\'').to_string();
        extracted.push(TypographyToken {
            name: base_name,
            font_family: family,
            font_size: final_size,
            font_weight: final_weight,
            line_height: final_lh,
            letter_spacing: final_ls,
        });
    }

    target.extend(extracted);
}

pub fn extract_typography_from_text(text: &str, target: &mut Vec<TypographyToken>, base_font_size: &str) {
    extract_font_vars(text, target);
    extract_font_rules(text, target, base_font_size);
}

pub fn extract_typography(doc: &Html) -> Vec<TypographyToken> {
    let mut typography = Vec::new();
    let style_selector = Selector::parse("style").unwrap();
    let mut all_css = String::new();
    for style in doc.select(&style_selector) {
        all_css.push_str(&style.text().collect::<Vec<_>>().join(""));
        all_css.push('\n');
    }

    let el_selector = Selector::parse("[style]").unwrap();
    for el in doc.select(&el_selector) {
        if let Some(style_attr) = el.value().attr("style") {
            if style_attr.contains("font-family")
               || style_attr.contains("font-size")
               || style_attr.contains("font-weight")
            {
                all_css.push_str("* { ");
                all_css.push_str(style_attr);
                all_css.push_str(" }\n");
            }
        }
    }

    let base = find_base_font_size(&all_css).unwrap_or_else(|| "16px".to_string());
    extract_typography_from_text(&all_css, &mut typography, &base);

    // Scan HTML elements to match font-family + font-size via CSS selectors
    extract_element_sizes(doc, &all_css, &mut typography);

    deduplicate_typography(&mut typography);
    distinguish_names(&mut typography);
    typography
}
