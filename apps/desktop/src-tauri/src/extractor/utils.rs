use serde::{Deserialize, Serialize};
use scraper::{Html, Selector};
use crate::extractor::DesignTokens;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ColorToken {
    pub name: String,
    pub hex: String,
    pub css_variable: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TypographyToken {
    pub name: String,
    pub font_family: String,
    pub font_size: String,
    pub font_weight: i32,
    pub line_height: String,
    pub letter_spacing: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SpacingToken {
    pub name: String,
    pub value: String,
    pub px: i32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ShadowToken {
    pub name: String,
    pub value: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct RadiiToken {
    pub name: String,
    pub value: String,
    pub px: i32,
}

pub fn slugify(s: &str) -> String {
    s.to_lowercase()
        .chars()
        .map(|c| if c.is_alphanumeric() { c } else { '-' })
        .collect::<String>()
        .split('-')
        .filter(|s| !s.is_empty())
        .collect::<Vec<_>>()
        .join("-")
}

pub fn extract_title(doc: &Html) -> Option<String> {
    let selector = Selector::parse("title").ok()?;
    let element = doc.select(&selector).next()?;
    let text = element.text().collect::<Vec<_>>().join("");
    Some(text.trim().to_string())
}

pub fn extract_meta(doc: &Html, name: &str) -> Option<String> {
    let selector = Selector::parse(&format!("meta[name=\"{}\"]", name)).ok()?;
    doc.select(&selector)
        .next()
        .and_then(|el| el.value().attr("content").map(|s| s.to_string()))
}

pub fn extract_og(doc: &Html, name: &str) -> Option<String> {
    let selector = Selector::parse(&format!("meta[property=\"og:{}\"]", name)).ok()?;
    doc.select(&selector)
        .next()
        .and_then(|el| el.value().attr("content").map(|s| s.to_string()))
}

pub fn classify_category(title: &str, description: &str) -> String {
    let title_lower = title.to_lowercase();
    let desc_lower = description.to_lowercase();
    let combined = format!("{} {}", title_lower, desc_lower);

    // Category definition with keyword lists.
    // Each keyword has a weight: primary signals (weight 3), secondary (weight 2), tertiary (weight 1).
    // Domain patterns automatically match with weight 3.
    let categories: &[(&str, &[(&str, i32)])] = &[
        ("SaaS", &[
            ("saas", 3), ("platform", 2), ("dashboard", 2), ("api", 2),
            ("cloud", 2), ("enterprise", 2), ("crm", 3), ("analytics", 2),
            ("automation", 2), ("workflow", 2), ("b2b", 3), ("software", 2),
            ("subscription", 2), ("pricing", 1), ("sign up", 1), ("integration", 2),
            ("collaboration", 1), ("team", 1), ("workspace", 1), ("no-code", 2),
            ("low-code", 2), ("infrastructure", 1), ("hosting", 1), ("deploy", 1),
        ]),
        ("E-commerce", &[
            ("shop", 3), ("store", 3), ("commerce", 3), ("cart", 3),
            ("retail", 2), ("checkout", 3), ("buy", 2), ("product", 1),
            ("shipping", 2), ("marketplace", 2), ("merch", 2), ("sale", 1),
            ("discount", 1), ("order", 2), ("inventory", 2), ("payment", 1),
            ("shopify", 3), ("woocommerce", 3), ("etsy", 3), ("amazon", 2),
        ]),
        ("Developer Tools", &[
            ("dev", 2), ("developer", 3), ("github", 3), ("git", 3),
            ("cli", 3), ("tool", 1), ("api", 2), ("sdk", 3),
            ("library", 2), ("framework", 2), ("open source", 3), ("npm", 3),
            ("package", 2), ("debug", 2), ("code", 2), ("repository", 2),
            ("documentation", 1), ("testing", 2), ("ci/cd", 3), ("devops", 3),
            ("docker", 3), ("kubernetes", 3), ("container", 2), ("compiler", 2),
            ("runtime", 2), ("terminal", 2), ("editor", 1), ("ide", 2),
        ]),
        ("AI", &[
            ("ai", 3), ("artificial intelligence", 3), ("machine learning", 3),
            ("gpt", 3), ("llm", 3), ("language model", 3), ("neural", 2),
            ("deep learning", 2), ("generative", 2), ("chatgpt", 3),
            ("openai", 3), ("claude", 3), ("copilot", 2), ("prompt", 2),
            ("transformer", 2), ("diffusion", 2), ("image generation", 2),
            ("speech", 1), ("voice", 1), ("synthesis", 1), ("nlp", 3),
            ("natural language", 2), ("computer vision", 2), ("embedding", 2),
            ("vector", 1), ("rag", 3), ("agent", 2), ("chatbot", 2),
        ]),
        ("Finance", &[
            ("bank", 3), ("finance", 3), ("payment", 2), ("stripe", 3),
            ("crypto", 2), ("trading", 2), ("investment", 2), ("stock", 2),
            ("wallet", 2), ("exchange", 2), ("transaction", 2), ("invoice", 2),
            ("accounting", 2), ("tax", 2), ("lending", 2), ("insurance", 2),
            ("mortgage", 2), ("loan", 2), ("credit", 2), ("debit", 2),
            ("fintech", 3), ("banking", 2), ("wealth", 1), ("portfolio", 1),
            ("blockchain", 2), ("defi", 3), ("nft", 2),
        ]),
        ("Crypto", &[
            ("crypto", 3), ("blockchain", 3), ("defi", 3), ("nft", 3),
            ("web3", 3), ("ethereum", 3), ("bitcoin", 3), ("solana", 3),
            ("token", 2), ("wallet", 2), ("dex", 2), ("dao", 3),
            ("metamask", 3), ("smart contract", 3), ("mining", 2), ("staking", 2),
            ("swap", 1), ("bridge", 1), ("airdrop", 2), ("mint", 2),
            ("ledger", 1), ("consensus", 1), ("dapp", 3),
        ]),
        ("Productivity", &[
            ("todo", 3), ("task", 2), ("notes", 3), ("calendar", 2),
            ("productivity", 3), ("project management", 2), ("kanban", 2),
            ("notion", 3), ("reminders", 2), ("planner", 2), ("organize", 1),
            ("workspace", 1), ("collaboration", 1), ("document", 1),
            ("spreadsheet", 1), ("whiteboard", 2), ("mind map", 2),
            ("checklist", 2), ("habit", 2), ("focus", 1), ("pomodoro", 2),
            ("time tracking", 2), ("goal", 1), ("journal", 2),
        ]),
        ("Social", &[
            ("social", 3), ("chat", 3), ("message", 3), ("community", 2),
            ("messaging", 3), ("forum", 2), ("network", 2), ("feed", 2),
            ("profile", 1), ("follower", 2), ("post", 1), ("comment", 1),
            ("like", 1), ("share", 1), ("group", 2), ("direct message", 3),
            ("discord", 3), ("slack", 3), ("telegram", 3), ("whatsapp", 3),
            ("dating", 2), ("match", 2), ("live", 1), ("stream", 1),
        ]),
        ("Portfolio", &[
            ("portfolio", 3), ("personal", 1), ("resume", 3), ("cv", 3),
            ("bio", 3), ("about me", 3), ("freelance", 2), ("designer", 1),
            ("developer", 1), ("photographer", 2), ("artist", 2), ("creative", 1),
            ("work", 1), ("project", 1), ("showcase", 2), ("gallery", 1),
            ("contact", 1), ("hire me", 2),
        ]),
        ("Media", &[
            ("media", 3), ("video", 3), ("photo", 3), ("stream", 3),
            ("streaming", 3), ("podcast", 3), ("audio", 2), ("music", 2),
            ("film", 2), ("cinema", 2), ("youtube", 3), ("vimeo", 3),
            ("twitch", 3), ("broadcast", 2), ("recording", 2), ("editing", 2),
            ("playlist", 2), ("channel", 2), ("subscription", 1), ("watch", 1),
            ("listen", 1), ("studio", 2), ("production", 1),
        ]),
        ("Landing Page", &[
            ("landing", 3), ("coming soon", 3), ("launch", 3), ("waitlist", 3),
            ("beta", 2), ("early access", 2), ("pre-order", 2), ("preorder", 2),
            ("teaser", 2), ("sneak peek", 2), ("countdown", 2), ("notify", 1),
            ("subscribe", 1), ("newsletter", 1),
        ]),
        ("Health", &[
            ("health", 3), ("medical", 2), ("fitness", 3), ("wellness", 2),
            ("workout", 3), ("exercise", 2), ("mental health", 3), ("therapy", 2),
            ("doctor", 2), ("patient", 2), ("clinic", 2), ("pharmacy", 2),
            ("nutrition", 2), ("diet", 2), ("meditation", 2), ("yoga", 2),
            ("sleep", 2), ("tracker", 1), ("heart rate", 2), ("telehealth", 3),
            ("hospital", 2), ("diagnostic", 2), ("prescription", 2),
        ]),
        ("Gaming", &[
            ("game", 3), ("gaming", 3), ("esports", 3), ("tournament", 2),
            ("multiplayer", 2), ("rpg", 2), ("fps", 2), ("mmorpg", 2),
            ("console", 2), ("steam", 3), ("xbox", 3), ("playstation", 3),
            ("nintendo", 3), ("twitch", 2), ("discord", 1), ("mod", 2),
            ("achievement", 2), ("leaderboard", 2), ("quest", 1), ("level", 1),
            ("character", 1), ("skin", 1), ("loot", 1),
        ]),
        ("Education", &[
            ("education", 3), ("learning", 2), ("course", 3), ("teach", 2),
            ("student", 2), ("school", 3), ("university", 3), ("academy", 3),
            ("tutor", 2), ("online class", 2), ("curriculum", 2), ("lesson", 2),
            ("certificate", 2), ("bootcamp", 3), ("training", 2), ("workshop", 2),
            ("lecture", 2), ("study", 1), ("exam", 2), ("quiz", 2),
            ("mooc", 3), ("edtech", 3), ("classroom", 2),
        ]),
        ("Dashboard", &[
            ("dashboard", 3), ("analytics", 2), ("metrics", 2), ("report", 2),
            ("chart", 2), ("graph", 2), ("monitor", 2), ("overview", 1),
            ("kpi", 2), ("insight", 2), ("data", 1), ("statistics", 2),
            ("visualization", 2), ("real-time", 1), ("export", 1),
        ]),
        ("Marketplace", &[
            ("marketplace", 3), ("market", 2), ("buy", 1), ("sell", 2),
            ("listing", 2), ("vendor", 2), ("seller", 2), ("buyer", 2),
            ("classifieds", 2), ("auction", 2), ("bidding", 2), ("gig", 2),
            ("freelance", 1), ("service", 1), ("rental", 2), ("booking", 2),
            ("reservation", 2), ("peer-to-peer", 2), ("p2p", 2),
        ]),
    ];

    let mut scores: Vec<(&str, i32)> = Vec::new();

    for (cat_name, keywords) in categories {
        let mut score = 0i32;
        for (kw, weight) in *keywords {
            if combined.contains(kw) {
                score += weight;
            }
        }
        // Bonus: if the category name appears in the combined text
        if combined.contains(&cat_name.to_lowercase()) {
            score += 3;
        }
        if score > 0 {
            scores.push((cat_name, score));
        }
    }

    // Sort by score descending, pick the highest
    scores.sort_by(|a, b| b.1.cmp(&a.1));

    if let Some((best, _)) = scores.first() {
        return best.to_string();
    }

    "SaaS".to_string()
}

pub fn generate_design_markdown(title: &str, tokens: &DesignTokens) -> String {
    let mut md = String::new();
    md.push_str(&format!("# {}\n\n", title));

    md.push_str("## Colors\n\n");
    md.push_str("| Name | Hex | CSS Variable |\n|------|-----|-------------|\n");
    for c in &tokens.colors {
        md.push_str(&format!("| {} | `{}` | `{}` |\n", c.name, c.hex, c.css_variable));
    }

    md.push_str("\n## Typography\n\n");
    for t in &tokens.typography {
        md.push_str(&format!(
            "**{}** — {} weight {} {}/{} ls {}\n\n",
            t.name, t.font_family, t.font_weight, t.font_size, t.line_height, t.letter_spacing
        ));
    }

    if !tokens.spacing.is_empty() {
        md.push_str("## Spacing\n\n");
        md.push_str("| Name | Value | Px |\n|------|-------|----|\n");
        for s in &tokens.spacing {
            md.push_str(&format!("| {} | `{}` | {} |\n", s.name, s.value, s.px));
        }
        md.push('\n');
    }

    if !tokens.shadows.is_empty() {
        md.push_str("## Shadows\n\n");
        md.push_str("| Name | Value |\n|------|-------|\n");
        for s in &tokens.shadows {
            md.push_str(&format!("| {} | `{}` |\n", s.name, s.value));
        }
        md.push('\n');
    }

    if !tokens.radii.is_empty() {
        md.push_str("## Border Radius\n\n");
        md.push_str("| Name | Value | Px |\n|------|-------|----|\n");
        for r in &tokens.radii {
            md.push_str(&format!("| {} | `{}` | {} |\n", r.name, r.value, r.px));
        }
        md.push('\n');
    }

    md
}
