use dotenv::dotenv;
use sqlx::{PgPool, postgres::PgPoolOptions};
use std::env;

pub async fn db_connection() -> Result<PgPool, sqlx::Error> {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("Error connecting to database");

    match PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await {
            Ok(pool) => {
                println!("Successfully connected to the database.");
                Ok(pool)
            },
            Err(e) => {
                eprintln!("Error connecting to database: {}", e);
                Err(e)
            }
        }
}
