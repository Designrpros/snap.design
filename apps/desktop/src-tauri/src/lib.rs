mod extractor;
mod db;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:snap-design.db", db::migrations())
                .build(),
        )
        .invoke_handler(tauri::generate_handler![extractor::extract_url])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
