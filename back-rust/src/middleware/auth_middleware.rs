use axum::{
    extract::FromRequestParts,
    http::{header, request::Parts, StatusCode},
    response::{IntoResponse, Response},
    Json,
};
use jsonwebtoken::{decode, DecodingKey, Validation, Algorithm};
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::env;


// Claims structure for JWT
#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: String,
    exp: usize,
}

// Authenticated user structure
pub struct AuthenticatedUser {
    pub user_id: String,
}

// Custom rejection type for unauthorized responses
#[derive(Debug)]
pub struct AuthRejection {
    status: StatusCode,
    message: String,
}

impl IntoResponse for AuthRejection {
    fn into_response(self) -> Response {
        let body = Json(json!({
            "error": self.message,
            "status": self.status.as_u16(),
        }));
        (self.status, body).into_response()
    }
}

impl<S> FromRequestParts<S> for AuthenticatedUser
where
    S: Send + Sync,
{
    type Rejection = AuthRejection;

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        let auth_header = parts
            .headers
            .get(header::AUTHORIZATION)
            .ok_or(AuthRejection {
                status: StatusCode::UNAUTHORIZED,
                message: "Missing Authorization header".to_string(),
            })?
            .to_str()
            .map_err(|_| AuthRejection {
                status: StatusCode::BAD_REQUEST,
                message: "Invalid header format".to_string(),
            })?;

        let token = auth_header.strip_prefix("Bearer ").ok_or(AuthRejection {
            status: StatusCode::UNAUTHORIZED,
            message: "Invalid token format: missing 'Bearer ' prefix".to_string(),
        })?;

        let secret = env::var("AUTH_SECRET").map_err(|_| AuthRejection {
            status: StatusCode::INTERNAL_SERVER_ERROR,
            message: "Server configuration error: missing AUTH_SECRET".to_string(),
        })?;
        let decoding_key = DecodingKey::from_secret(secret.as_ref());

        let token_data = decode::<Claims>(token, &decoding_key, &Validation::new(Algorithm::HS256))
            .map_err(|e| AuthRejection {
                status: StatusCode::UNAUTHORIZED,
                message: format!("Invalid token: {}", e),
            })?;

        Ok(AuthenticatedUser {
            user_id: token_data.claims.sub,
        })
    }
}