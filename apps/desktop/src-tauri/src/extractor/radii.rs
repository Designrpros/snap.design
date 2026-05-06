use scraper::Html;
use crate::extractor::utils::RadiiToken;

pub fn extract_radii(_doc: &Html) -> Vec<RadiiToken> {
    vec![
        RadiiToken { name: "sm".to_string(), value: "4px".to_string(), px: 4 },
        RadiiToken { name: "md".to_string(), value: "8px".to_string(), px: 8 },
        RadiiToken { name: "lg".to_string(), value: "12px".to_string(), px: 12 },
        RadiiToken { name: "xl".to_string(), value: "16px".to_string(), px: 16 },
        RadiiToken { name: "full".to_string(), value: "9999px".to_string(), px: 9999 },
    ]
}
