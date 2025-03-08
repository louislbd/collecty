use axum::{
    extract::{Extension, Json, Path},
    http::StatusCode,
};
use sqlx::PgPool;
use uuid::Uuid;
use std::sync::Arc;
use tokio::fs::File;
use tokio::io::AsyncWriteExt;
use std::path::PathBuf;
use std::fs;

use axum_extra::extract::Multipart;

use crate::models::{Asset, AssetRequest, NftResponse};
use serde_json::from_value;
use crate::tokens::create_xrpl_nft;

use crate::helpers::collecty_response::CollectyResponse;

/// Get all assets
pub async fn get_assets(
    Extension(pool): Extension<Arc<PgPool>>,
) -> Result<Json<Vec<Asset>>, StatusCode> {
    let assets = sqlx::query_as!(Asset, "SELECT * FROM assets")
        .fetch_all(&*pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(assets))
}

/// Get a user's assets
pub async fn get_user_assets(
    Extension(pool): Extension<Arc<PgPool>>,
    Path(uuid): Path<String>,
) -> Result<Json<Vec<Asset>>, StatusCode> {

    let assets = sqlx::query_as!(Asset, r#"SELECT * FROM assets WHERE user_id = $1"#, uuid)
        .fetch_all(&*pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(assets))
}

pub async fn get_asset_from_user_and_asset_id(
    Extension(pool): Extension<Arc<PgPool>>,
    Path(uuid): Path<String>,
    Path(nftoken_id): Path<String>,
) -> Result<Json<Vec<Asset>>, StatusCode> {
    let assets = sqlx::query_as!(Asset, r#"SELECT  * FROM assets WHERE user_id = $1 AND nftoken_id = $2"#, uuid, nftoken_id)
        .fetch_all(&*pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(assets))
}

// Custom error response type
/*struct CollectyResponse(StatusCode, String);

impl IntoResponse for CollectyResponse {
    fn into_response(self, isValid: bool) -> axum::response::Response {
        if !isValid {
            return (self.0, Json(json!({
                "error": self.1,
                "status": self.0.as_u16()
            }))).into_response();
        } else {
            return (self.0, Json(json!({
                "message": self.1,
                "status": self.0.as_u16()
            }))).into_response();
        }
        (self.0, body).into_response()
    }
}*/


pub async fn create_asset(
    Extension(pool): Extension<Arc<PgPool>>,
    mut multipart: Multipart,
) -> Result<CollectyResponse, CollectyResponse> {
    let mut user_id = None;
    let mut xrp_address = None;
    let mut asset_name = None;
    let mut asset_description = None;
    let mut client_secret = None;
    let mut image_data = None;
    let mut content_type = None;

    /* Parse multipart form data
    
    while let Some(field) = match multipart.next_field().await {
        Ok(field) => field,
        Err(_) => {
            return Err(CollectyResponse {
                status: StatusCode::BAD_REQUEST,
                message: "Invalid multipart data".to_string(),
                is_valid: false,
            });
        }
    } {
        let name = field.name().unwrap_or("").to_string();
        match name.as_str() {
            "user_id" => user_id = Some(field.text().await.unwrap()),
            "xrp_address" => xrp_address = Some(field.text().await.unwrap()),
            "asset_name" => asset_name = Some(field.text().await.unwrap()),
            "asset_description" => asset_description = Some(field.text().await.unwrap()),
            "client_secret" => client_secret = Some(field.text().await.unwrap()),
            "image" => {
                content_type = field.content_type().map(|ct| ct.to_string());
                image_data = Some(field.bytes().await.map_err(|e| CollectyResponse {
                    status: StatusCode::BAD_REQUEST,
                    message: format!("Failed to read image: {}", e),
                    is_valid: false,
                })?.to_vec());
            }
            _ => {}
        }
    }*/

    while let Some(mut field) = multipart.next_field().await.map_err(|e| CollectyResponse {
        status: StatusCode::BAD_REQUEST,
        message: format!("Invalid multipart data: {}", e),
        is_valid: false,
    })? {
        let name = field.name().unwrap_or("");
        match name {
            "user_id" => user_id = Some(field.text().await.map_err(|e| CollectyResponse {
                status: StatusCode::BAD_REQUEST,
                message: format!("Invalid user_id: {}", e),
                is_valid: false,
            })?),
            "author" => user_id = Some(field.text().await.map_err(|e| CollectyResponse {
                status: StatusCode::BAD_REQUEST,
                message: format!("Invalid user_id: {}", e),
                is_valid: false,
            })?),
            "xrp_address" => xrp_address = Some(field.text().await.map_err(|e| CollectyResponse {
                status: StatusCode::BAD_REQUEST,
                message: format!("Invalid xrp_address: {}", e),
                is_valid: false,
            })?),
            "asset_name" => asset_name = Some(field.text().await.map_err(|e| CollectyResponse {
                status: StatusCode::BAD_REQUEST,
                message: format!("Invalid asset_name: {}", e),
                is_valid: false,
            })?),
            "asset_description" => asset_description = Some(field.text().await.map_err(|e| CollectyResponse {
                status: StatusCode::BAD_REQUEST,
                message: format!("Invalid asset_description: {}", e),
                is_valid: false,
            })?),
            "client_secret" => client_secret = Some(field.text().await.map_err(|e| CollectyResponse {
                status: StatusCode::BAD_REQUEST,
                message: format!("Invalid client_secret: {}", e),
                is_valid: false,
            })?),
            "image" => {
                content_type = field.content_type().map(|ct| ct.to_string());
                let mut bytes = Vec::new();
                while let Some(chunk) = field.chunk().await.map_err(|e| {
                    eprintln!("Image chunk error: {}", e);
                    CollectyResponse {
                        status: StatusCode::BAD_REQUEST,
                        message: format!("Failed to read image chunk: {}", e),
                        is_valid: false,
                    }
                })? {
                    bytes.extend_from_slice(&chunk);
                }
                if bytes.is_empty() {
                    return Err(CollectyResponse {
                        status: StatusCode::BAD_REQUEST,
                        message: "Image data is empty".to_string(),
                        is_valid: false,
                    });
                }
                image_data = Some(bytes);
            }
            _ => eprintln!("Unknown field: {}", name),
        }
    }


    eprint!("here - UPLOADING IMAGE");
    let asset_id = format!("asset_{}", Uuid::new_v4());
    let image_path = upload_image(asset_id.clone(), user_id.clone().unwrap(), image_data, content_type.as_deref())
        .await
        .map_err(|_e| CollectyResponse {
            status: StatusCode::BAD_REQUEST,
            message: "Error uploading img".to_string(),
            is_valid: false,
        }).unwrap();

    eprintln!("image_path: {:?}", image_path);
    
    let asset_request = AssetRequest {
        user_id: user_id.unwrap(),
        xrp_address: xrp_address.clone().unwrap(),
        asset_name: asset_name.clone().unwrap(),
        asset_description: asset_description.clone().unwrap(),
        image_url: image_path.clone(),
        client_secret: client_secret.clone().unwrap(),
    };
    
    eprintln!("asset_request: {:?}", asset_request.user_id);
    eprintln!("asset_request: {:?}", asset_request);

    let nft_details = create_xrpl_nft(
        asset_request.image_url.clone(),
        asset_request.client_secret.clone(),
    ).await
    .map_err(|e: CollectyResponse| {
        eprintln!("NFT creation failed: {:?}", e);
        CollectyResponse {
            status: StatusCode::BAD_REQUEST,
            message: "Error creation NFT".to_string(),
            is_valid: false,
        }
    })?;

    let nft_json = nft_details.0;

    //Parse the NFT details
    let nft_response: NftResponse = from_value(nft_json)
        .map_err(|e| {
            eprintln!("Failed to parse NFT response: {}", e);
            CollectyResponse {
                status: StatusCode::BAD_REQUEST,
                message: "Failed to parse NFT response:".to_string(),
                is_valid: false,
            }
        }).unwrap();

    if nft_response.raw_result.meta.transaction_result != "tesSUCCESS" {
        eprintln!("NFT creation failed: {:?}", nft_response.raw_result.meta.transaction_result);
        return Err(CollectyResponse {
            status: StatusCode::BAD_REQUEST,
            message: "NFT creation Failed".to_string(),
            is_valid: false,
        });
    }

    eprintln!("Inserting new asset into the database");

    let new_asset = sqlx::query_as!(
        Asset,
        r#"
        INSERT INTO assets (
            asset_id, 
            user_id, 
            xrp_address, 
            asset_name,
            asset_description,
            image_url,
            nftoken_id,
            issuer,
            uri,
            flags,
            transfer_fee
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING 
            asset_id, 
            user_id, 
            xrp_address, 
            asset_name,
            asset_description, 
            image_url, 
            created_at,
            nftoken_id,
            issuer,
            uri,
            flags,
            transfer_fee
        "#,
        asset_id,        // asset_id from NFT
        asset_request.user_id,
        asset_request.xrp_address,
        asset_request.asset_name,
        asset_request.asset_description,
        asset_request.image_url,
        nft_response.nft.id,        // nftoken_id
        nft_response.nft.issuer, // issuer
        nft_response.nft.uri,           // uri
        nft_response.nft.flags,         // flags
        nft_response.nft.transfer_fee,   // transfer_fee
    )
    .fetch_one(&*pool)
    .await
    .map_err(|_e| {
        eprintln!("eeor: {:?}", _e);
        CollectyResponse {
            status: StatusCode::INTERNAL_SERVER_ERROR,
            message: "Failed to store asset".to_string(),
            is_valid: false,
        }
    });

    eprintln!("new_asset: {:?}", new_asset);
    eprintln!("after");

    return Ok(CollectyResponse {
        status: StatusCode::OK,
        message: image_path.to_string(),
        is_valid: true,
    })

}

/// Update an asset
pub async fn delete_asset(
    Extension(pool): Extension<Arc<PgPool>>,
    Path(asset_id): Path<String>,
) -> Result<StatusCode, StatusCode> {
    let result = sqlx::query!("DELETE FROM assets WHERE asset_id = $1", asset_id)
        .execute(&*pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    match result.rows_affected() {
        0 => Err(StatusCode::NOT_FOUND),
        _ => Ok(StatusCode::NO_CONTENT),
    }
}




/// Uploads an image to the "uploads" directory with format asset_id-user_id.extension
/// Only allows .jpeg and .png extensions
/// Returns the file path as a String on success
pub async fn upload_image(
    asset_id: String,
    user_id: String,
    image_data: Option<Vec<u8>>,
    content_type: Option<&str>,
) -> Result<String, StatusCode> {
    // Determine the file extension based on content type
    let extension = match content_type {
        Some("image/jpeg") => "jpeg",
        Some("image/png") => "png",
        _ => {
            eprintln!("Unsupported image format: {:?}", content_type);
            return Err(StatusCode::BAD_REQUEST);
        }
    };

    // Create the uploads directory if it doesn't exist
    let upload_dir = PathBuf::from("uploads");
    if !upload_dir.exists() {
        fs::create_dir_all(&upload_dir).map_err(|e| {
            eprintln!("Failed to create uploads directory: {}", e);
            StatusCode::INTERNAL_SERVER_ERROR
        })?;
    }

    let filename = format!("{}-{}.{}", asset_id, user_id, extension);
    let file_path = upload_dir.join(&filename);

    let mut file = File::create(&file_path).await.map_err(|e| {
        eprintln!("Failed to create file: {}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    file.write_all(image_data.as_deref().ok_or(StatusCode::BAD_REQUEST)?).await.map_err(|e| {
        eprintln!("Failed to write image data: {}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    Ok(file_path.to_string_lossy().into_owned())
}