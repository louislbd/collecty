use axum::{routing::{get, post}, Router};

use crate::tokens::{get_tokens, create_offer, get_all_offers, get_user_offers, cancel_offer};

pub fn tokens_routes() -> Router {
    Router::new()
        .route("/", get(get_tokens))
        .route("/get-all-offers", get(get_all_offers))
        .route("/{uuid}", get(get_user_offers))
        .route("/create-offer", post(create_offer))
        .route("/cancel/{offer_id}", post(cancel_offer))
    }
