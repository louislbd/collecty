use axum::{http::StatusCode, response::IntoResponse, Extension, Json};
use reqwest::Client;
use sqlx::PgPool;
use serde_json::{json, Value};
use std::sync::Arc;
use serde_json::from_value;
use uuid::Uuid;
use axum::extract::Path;

use crate::{helpers::collecty_response::CollectyResponse, models::{NFTOffer, Offer, OfferRequest, Token}};

pub async fn cancel_offer(
    Extension(pool): Extension<Arc<PgPool>>,
    Path(offer_id): Path<String>,
) -> Result<impl IntoResponse, StatusCode> {
    let _deleted_offer = sqlx::query!(
        "DELETE FROM offers WHERE offer_id = $1",
        offer_id
    )
    .execute(&*pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(StatusCode::OK)
}

pub async fn get_user_offers(Extension(pool): Extension<Arc<PgPool>>, Path(user_id): Path<String>,) -> Result<Json<Vec<Offer>>, StatusCode> {
    let offers = sqlx::query_as!(Offer, "SELECT * FROM offers WHERE user_id = $1", user_id)
        .fetch_all(&*pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(offers))
}

pub async fn get_all_offers(Extension(pool): Extension<Arc<PgPool>>) -> Result<Json<Vec<Offer>>, StatusCode> {
    let offers = sqlx::query_as!(Offer, "SELECT * FROM offers")
        .fetch_all(&*pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(offers))
}

pub async fn create_offer(
    Extension(pool): Extension<Arc<PgPool>>,
    Json(payload): Json<OfferRequest>,
) -> Result<impl IntoResponse, StatusCode> {
    let offer_id = format!("offer_{}", Uuid::new_v4());

    let offer_details = create_xrpl_offer(
        payload.client_secret.clone(),
        payload.nft_token_id.clone(),
        payload.price.clone(),
        "True".to_string(),
    ).await
    .map_err(|e| {
        eprintln!("NFT creation failed: {}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    let offer_json = offer_details.0;

    let mut offer_json = offer_json.as_object().unwrap().clone();
    offer_json.insert("is_sell_offer".to_string(), Value::String(offer_json["is_sell_offer"].to_string()));
    offer_json.insert("price".to_string(), Value::String(offer_json["price"].to_string()));

    // Parse the NFT details
    let offer_response: NFTOffer = from_value(Value::Object(offer_json))
        .map_err(|e| {
            eprintln!("Failed to parse NFT response: {}", e);
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    eprintln!("account: {}", offer_response.account);

    // Insert the new offer into the database
    let _new_offer = sqlx::query_as!(
        Offer,
        r#"
        INSERT INTO offers (offer_id, user_id, account, nft_id, price, is_sell_offer)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING offer_id, user_id, account, nft_id, price, is_sell_offer, created_at
        "#,
        offer_id,
        payload.user_id,
        offer_response.account,
        offer_response.nft_id,
        offer_response.price,
        offer_response.is_sell_offer,
    )
    .fetch_one(&*pool)
    .await
    .map_err(|e| {
        eprintln!("Failed to store offer: {:?}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    Ok(StatusCode::OK)

}

/// Get all tokens
pub async fn get_tokens(Extension(pool): Extension<Arc<PgPool>>) -> Result<Json<Vec<Token>>, StatusCode> {
    let tokens = sqlx::query_as!(Token, "SELECT * FROM tokens")
        .fetch_all(&*pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(tokens))
}

pub async fn get_one_token(Extension(pool): Extension<Arc<PgPool>>, token_id: String) -> Result<Json<Token>, StatusCode> {
    let token = sqlx::query_as!(Token, "SELECT * FROM tokens WHERE token_id = $1", token_id)
        .fetch_one(&*pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(token))
}

pub async fn create_xrpl_nft(
    uri: String,
    client_seed: String,
) -> Result<Json<Value>, CollectyResponse> {
    let client = Client::new();

    let resp = client
        .post("http://localhost:8000/nft/create")
        .json(&json!({
            "uri": uri,
            "client_wallet_seed": client_seed,
        }))
        .send()
        .await
        .map_err(|e| {
            eprintln!("HTTP error: {}", e);
            CollectyResponse {
                status: StatusCode::INTERNAL_SERVER_ERROR,
                message: "HTTP error".to_string(),
                is_valid: false,
            }
        })?;

    let response_json: Value = resp
        .json()
        .await
        .map_err(|e| {
            eprintln!("JSON parse error: {}", e);
            CollectyResponse {
                status: StatusCode::INTERNAL_SERVER_ERROR,
                message: "JSON parse error".to_string(),
                is_valid: false,
            }
        })?;

    if let Some(Value::Bool(false)) = response_json.get("success") {
        eprintln!("NFT creation failed: {:?}", response_json.get("error"));
        return Err(CollectyResponse {
            status: StatusCode::BAD_REQUEST,
            message: "NFT creation failed".to_string(),
            is_valid: false,
        });
    }

    // 4) Return *all* JSON data back to the caller
    Ok(Json(response_json))
}

pub async fn create_xrpl_offer(
    wallet_seed: String,
    nft_id: String,
    amount: String,
    is_sell_offer: String,
) -> Result<Json<Value>, StatusCode> {
    let client = Client::new();

    let resp = client
        .post("http://localhost:8000/nft/offer/create")
        .json(&json!({
            "wallet_seed": wallet_seed,
            "nft_id": nft_id,
            "amount": amount,
            "is_sell_offer": is_sell_offer,
        }))
        .send()
        .await
        .map_err(|e| {
            eprintln!("HTTP error: {}", e);
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    let response_json: Value = resp
        .json()
        .await
        .map_err(|e| {
            eprintln!("JSON parse error: {}", e);
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    if let Some(Value::Bool(false)) = response_json.get("success") {
        eprintln!("NFTOffer creation failed: {:?}", response_json.get("error"));
        return Err(StatusCode::BAD_REQUEST);
    }

    // 4) Return *all* JSON data back to the caller
    // print response_json
    print!("{:?}", response_json);
    Ok(Json(response_json))
}

