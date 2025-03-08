use axum::{Router, routing::{get, post}};

use crate::auth::{register, login};

pub fn auth_routes() -> Router {
    Router::new()
        .route("/", get(|| async { "Auth route" }))
        .route("/register", post(register))
        .route("/login", post(login))
}
