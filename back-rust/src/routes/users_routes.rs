use axum::{Router, routing::{get, put, delete}};

use crate::users::{get_all_users, update_user, delete_user};

pub fn users_routes() -> Router {
    Router::new()
        .without_v07_checks()
        .route("/{uuid}/update", put(update_user))
        .route("/{uuid}/delete", delete(delete_user))
        .route("/all", get(get_all_users))
}
