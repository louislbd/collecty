use axum::{Extension, Router};
use tokio::net::TcpListener;
use sqlx::PgPool;
use std::sync::Arc;
use xrpl::models::ledger::objects::account_root::AccountRoot;

use lib;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let pool: PgPool = lib::db::db_connection().await?;
    let pool: Arc<sqlx::Pool<sqlx::Postgres>> = Arc::new(pool);
    let app: Router = lib::routes::create_routes().layer(Extension(pool.clone()));
    let listener: TcpListener = TcpListener::bind("0.0.0.0:8080").await?;
    let _account_root: AccountRoot<'_> = lib::xrp::setup_issuer_account_root().await;

    println!("🚀 Collecty-Back running on {}", listener.local_addr()?);
    axum::serve(listener, app).await?;

    Ok(())
}
