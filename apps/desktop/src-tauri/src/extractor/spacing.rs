use scraper::{Html, Selector};
use crate::extractor::utils::SpacingToken;

pub fn extract_spacing(doc: &Html) -> Vec<SpacingToken> {
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
