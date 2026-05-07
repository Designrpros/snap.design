pub mod utils;
pub mod colors;
pub mod typography;
pub mod spacing;
pub mod shadows;
pub mod radii;

use scraper::{Html, Selector};
use serde::{Deserialize, Serialize};
use reqwest;

pub use utils::{ColorToken, TypographyToken, SpacingToken, ShadowToken, RadiiToken};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DesignTokens {
    pub colors: Vec<ColorToken>,
    pub typography: Vec<TypographyToken>,
    pub spacing: Vec<SpacingToken>,
    pub shadows: Vec<ShadowToken>,
    pub radii: Vec<RadiiToken>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ExtractionResult {
    pub id: String,
    pub title: String,
    pub category: String,
    pub url: String,
    pub iframe_url: String,
    pub description: String,
    pub featured: bool,
    pub screenshot: String,
    pub design_tokens: DesignTokens,
    pub design_markdown: String,
}

#[tauri::command]
pub async fn extract_url(url: String) -> Result<ExtractionResult, String> {
    let client = reqwest::Client::builder()
        .user_agent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")
        .build()
        .map_err(|e| e.to_string())?;

    let response = client
        .get(&url)
        .send()
        .await
        .map_err(|e| format!("Failed to fetch URL: {}", e))?;

    let final_url = response.url().clone();
    let body = response.text()
        .await
        .map_err(|e| format!("Failed to read response: {}", e))?;

    let (id, title, description, mut colors, mut typography, mut spacing, mut shadows, mut radii, stylesheet_urls, inline_css) = {
        let document = Html::parse_document(&body);

        let title = utils::extract_title(&document)
            .unwrap_or_default();
        let description = utils::extract_meta(&document, "description")
            .unwrap_or_default();

        let colors = colors::extract_colors_from_styles(&document);
        let typography = typography::extract_typography(&document);
        let spacing = spacing::extract_spacing(&document);
        let shadows = shadows::extract_shadows(&document);
        let radii = radii::extract_radii(&document);
        let id = utils::slugify(&title);

        // Collect inline CSS text for global base font-size detection
        let style_selector = Selector::parse("style").unwrap();
        let mut inline = String::new();
        for style in document.select(&style_selector) {
            inline.push_str(&style.text().collect::<Vec<_>>().join(""));
            inline.push('\n');
        }

        let mut urls = Vec::new();
        let link_selector = Selector::parse("link[rel=\"stylesheet\"]").unwrap();
        for link in document.select(&link_selector) {
            if let Some(href) = link.value().attr("href") {
                if let Ok(abs_url) = final_url.join(href) {
                    urls.push(abs_url);
                }
            }
        }
        (id, title, description, colors, typography, spacing, shadows, radii, urls, inline)
    };

    // Fetch external stylesheets and extract ALL token types from them
    let mut all_css = inline_css.clone();
    let mut external_css_list: Vec<String> = Vec::new();

    for abs_url in stylesheet_urls {
        if let Ok(css_res) = client.get(abs_url).send().await {
            if let Ok(css_text) = css_res.text().await {
                all_css.push_str(&css_text);
                external_css_list.push(css_text);
            }
        }
    }

    // Compute global base font-size from combined inline + external CSS
    let base_font_size = typography::find_base_font_size(&all_css)
        .unwrap_or_else(|| "16px".to_string());

    for css_text in &external_css_list {
        colors::extract_colors_from_text(css_text, &mut colors);
        typography::extract_typography_from_text(css_text, &mut typography, &base_font_size);
        spacing::extract_spacing_from_text(css_text, &mut spacing);
        shadows::extract_shadows_from_text(css_text, &mut shadows);
        radii::extract_radii_from_text(css_text, &mut radii);
    }

    // Final deduplication across inline + external sources
    typography::deduplicate_typography(&mut typography);

    let tokens = DesignTokens {
        colors,
        typography,
        spacing,
        shadows,
        radii,
    };

    let design_md = utils::generate_design_markdown(&title, &tokens);
    let category = utils::classify_category(&title, &description);

    Ok(ExtractionResult {
        id: id.clone(),
        title,
        category,
        url: url.clone(),
        iframe_url: url.clone(),
        description,
        featured: false,
        screenshot: String::new(),
        design_tokens: tokens,
        design_markdown: design_md,
    })
}
