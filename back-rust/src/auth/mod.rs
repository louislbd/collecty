use axum::{extract::Json, Extension, http::StatusCode, response::IntoResponse};
use bcrypt::{hash, verify, DEFAULT_COST};
use chrono::{Duration, Utc};
use jsonwebtoken::{encode, decode, Header, EncodingKey, DecodingKey, Validation};
use serde_json::json;
use serde::{Deserialize,  Serialize};
use sqlx::PgPool;
use std::env;
use std::sync::Arc;
use uuid::Uuid;

use crate::models::{User, RegisterUser, LoginUser};

#[derive(Serialize, Deserialize)]
pub struct Claims {
    sub: String,
    exp: usize,
}

/// Generate a JWT token for a user
pub fn generate_jwt(user_id: &str) -> Result<String, jsonwebtoken::errors::Error> {
    let expiration = Utc::now()
        .checked_add_signed(Duration::hours(24))
        .expect("valid timestamp")
        .timestamp() as usize;

    let claims = Claims { sub: user_id.to_string(), exp: expiration };

    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(env::var("AUTH_SECRET").expect("Error encoding token").as_ref()),
    )
}

/// Validate and decode a JWT token
pub fn validate_jwt(token: &str) -> Result<Claims, jsonwebtoken::errors::Error> {
    let token_data = decode::<Claims>(
        token,
        &DecodingKey::from_secret(env::var("AUTH_SECRET").expect("Error decoding token").as_ref()),
        &Validation::default(),
    )?;

    Ok(token_data.claims)
}

/// Register a new user
pub async fn register(
    Extension(pool): Extension<Arc<PgPool>>,
    Json(payload): Json<RegisterUser>,
) -> impl IntoResponse {
    let password_hash = hash(&payload.password, DEFAULT_COST).unwrap();
    let new_user_id = format!("user_{}", Uuid::new_v4());

    let result = sqlx::query_as!(
        User,
        r#"
        INSERT INTO users (user_id, username, email, password_hash)
        VALUES ($1, $2, $3, $4)
        RETURNING user_id, username, email, password_hash, created_at
        "#,
        new_user_id,
        payload.username,
        payload.email,
        password_hash,
    )
    .fetch_one(&*pool)
    .await;

    match result {
        Ok(_) => (
            StatusCode::CREATED,
            Json(json!({ "message": "User registered",})),
        ),
        Err(_) => (
            StatusCode::BAD_REQUEST,
            Json(json!({ "error": "Could not create user" })),
        ),
    }
}

/// Login a user
pub async fn login(
    Extension(pool): Extension<Arc<PgPool>>,
    Json(payload): Json<LoginUser>,
) -> impl IntoResponse {
    let user = sqlx::query!(
        r#"SELECT * FROM users WHERE email = $1"#,
        payload.email
    )
    .fetch_optional(&*pool)
    .await
    .unwrap();

    if let Some(user) = user {
        if verify(&payload.password, &user.password_hash).unwrap() {
            match generate_jwt(&user.user_id.to_string()) {
                Ok(token) => {
                    return (StatusCode::OK, Json(json!({ "token": token, "user_id": user.user_id })));
                }
                Err(_) => {
                    return (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({ "error": "Failed to generate token" })));
                }
            }
        }
    }

    (StatusCode::UNAUTHORIZED, Json(json!({ "error": "Invalid credentials" })))
}
