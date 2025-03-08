use axum::{Json, Extension, http::StatusCode, response::IntoResponse};
use sqlx::PgPool;
use std::sync::Arc;
use uuid::Uuid;

use crate::models::{Wallet, WalletRequest};

pub async fn new_wallet(
    Extension(pool): Extension<Arc<PgPool>>,
    Json(wallet): Json<WalletRequest>,
) -> Result<impl IntoResponse, StatusCode> {
    let wallet_id = format!("wallet_{}", Uuid::new_v4());

    let new_wallet = sqlx::query_as!(
        Wallet,
        r#"
        INSERT INTO wallets (wallet_id, user_id, xrp_address, secret)
        VALUES ($1, $2, $3, $4)
        RETURNING wallet_id, user_id, xrp_address, secret, created_at
        "#,
        wallet_id,
        wallet.user_id,
        wallet.xrp_address,
        wallet.secret
    )
    .fetch_one(&*pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok((StatusCode::CREATED, Json(new_wallet)))
}
