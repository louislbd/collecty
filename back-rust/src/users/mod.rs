use axum::{extract::{Extension, Path}, Json, response::IntoResponse, http::StatusCode};
use serde::Serialize;
use serde_json::json;
use sqlx::PgPool;
use std::sync::Arc;

use crate::models::UpdateUser;

#[derive(Serialize)]
struct UserResponse {
    user_id: String,
    username: String,
    email: String,
}

pub async fn get_all_users(
    Extension(pool): Extension<Arc<PgPool>>,
) -> impl IntoResponse {
    let result = sqlx::query_as!(
        UserResponse,
        "SELECT user_id, username, email FROM users"
    )
    .fetch_all(&*pool)
    .await;

    match result {
        Ok(users) => (StatusCode::OK, Json(users)).into_response(),
        Err(_) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({ "error": "Failed to retrieve users" })),
        )
        .into_response(),
    }
}


pub async fn update_user(
    Path(uuid): Path<String>,
    Extension(pool): Extension<Arc<PgPool>>,
    Json(payload): Json<UpdateUser>,
) -> impl IntoResponse {
    let result = sqlx::query!(
        "UPDATE users SET username = COALESCE($1, username), email = COALESCE($2, email) WHERE user_id = $3",
        payload.username,
        payload.email,
        uuid
    )
    .execute(&*pool)
    .await;

    match result {
        Ok(_) => (StatusCode::OK, "User updated").into_response(),
        Err(_) => (StatusCode::INTERNAL_SERVER_ERROR, "Update failed").into_response(),
    }
}


pub async fn delete_user(
    Extension(pool): Extension<Arc<PgPool>>,
    Path(uuid): Path<String>,
) -> impl IntoResponse {
    let result = sqlx::query!("DELETE FROM users WHERE user_id = $1", uuid)
        .execute(&*pool)
        .await;

    match result {
        Ok(_) => (
            StatusCode::OK,
            Json(json!({ "message": "User deleted successfully" })),
        ),
        Err(_) => (
            StatusCode::BAD_REQUEST,
            Json(json!({ "error": "Failed to delete user" })),
        ),
    }
}
