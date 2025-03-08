use std::str::FromStr;

use axum::{http::Method, Router, routing::{get, get_service}, extract::DefaultBodyLimit};
use tower_http::cors::CorsLayer;
use tower_http::services::ServeDir;
use axum::middleware;
use crate::middleware::auth_middleware::AuthenticatedUser;

pub mod assets_routes;
use http::{HeaderValue, header, HeaderName};
pub mod auth_routes;
pub mod tokens_routes;
pub mod users_routes;

pub fn create_routes() -> Router {
    let assets_router: Router = assets_routes::assets_routes().route_layer(middleware::from_extractor::<AuthenticatedUser>());
    let auth_router: Router = auth_routes::auth_routes();
    let tokens_router: Router = tokens_routes::tokens_routes();
    let users_router: Router = users_routes::users_routes().route_layer(middleware::from_extractor::<AuthenticatedUser>());
    let uploads_service = ServeDir::new("uploads");


    let cors: CorsLayer = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST, Method::DELETE, Method::OPTIONS])
        .allow_origin("http://localhost:3000".parse::<HeaderValue>().unwrap())
        .allow_credentials(true)
        .allow_headers([HeaderName::from_str("X-CSRFToken").unwrap() , header::AUTHORIZATION, axum::http::header::CONTENT_LENGTH , header::ACCEPT, header::CONTENT_TYPE, header::ORIGIN, header::USER_AGENT, header::CONTENT_ENCODING]);

    Router::new()
        .without_v07_checks()
        .route("/", get(|| async { "Hello, Collecty!" }))
        .nest("/assets", assets_router)
        .nest("/auth", auth_router)
        .nest("/tokens", tokens_router)
        .nest("/users", users_router)
        .nest_service("/uploads", get_service(uploads_service))
        .layer(cors)
        .layer(DefaultBodyLimit::max(10 * 1024 * 1024))

}
