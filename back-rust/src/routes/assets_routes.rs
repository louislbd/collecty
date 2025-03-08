use axum::{Router, routing::{get, post, delete}};

use crate::assets::{get_assets, get_user_assets, create_asset, delete_asset, get_asset_from_user_and_asset_id};


pub fn assets_routes() -> Router {
    Router::new()
        .route("/", get(get_assets))
        .route("/{uuid}", get(get_user_assets))
        .route("/create", post(create_asset))
        .route("/{asset_id}/delete", delete(delete_asset))
        .route("/{uuid}/{asset_id}/get-asset-from-uuid", get(get_asset_from_user_and_asset_id))
}
