use axum::response::{IntoResponse, Response};
use axum::http::StatusCode;
use axum::Json;
use serde_json::json;

#[derive(Debug)]
pub struct CollectyResponse {
    pub status: StatusCode,
    pub message: String,
    pub is_valid: bool,
}

impl IntoResponse for CollectyResponse {
    fn into_response(self) -> Response {
        if !self.is_valid {
            return (self.status, Json(json!({
                "error": self.message,
                "status": self.status.as_u16()
            }))).into_response();
        } else {
            return (self.status, Json(json!({
                "message": self.message,
                "status": self.status.as_u16()
            }))).into_response();
        }
    }
}