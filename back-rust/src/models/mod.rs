use chrono::{DateTime, Utc};
use serde::{Serialize, Deserialize};
use sqlx::FromRow;

#[derive(Serialize, Deserialize, sqlx::FromRow)]
pub struct User {
    pub user_id: String,
    pub username: String,
    pub email: String,
    pub password_hash: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Deserialize)]
pub struct RegisterUser {
    pub username: String,
    pub email: String,
    pub password: String,
}

#[derive(Deserialize, sqlx::FromRow)]
pub struct LoginUser {
    pub email: String,
    pub password: String,
}

#[derive(Deserialize)]
pub struct UpdateUser {
    pub username: Option<String>,
    pub email: Option<String>,
}

#[derive(Deserialize)]
pub struct DeleteUser {
    pub user_id: String,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Asset {
    pub asset_id: String,
    pub user_id: String,
    pub xrp_address: String,
    pub asset_name: String,
    pub asset_description: String,
    pub image_url: String,
    pub created_at: DateTime<Utc>,
    pub nftoken_id: Option<String>,
    pub issuer: Option<String>,
    pub uri: Option<String>,
    pub flags: Option<i32>,
    pub transfer_fee: Option<i32>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AssetRequest {
    pub user_id: String,
    pub xrp_address: String,
    pub asset_name: String,
    pub asset_description: String,
    pub image_url: String,
    pub client_secret: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Token {
    pub token_id: String,
    pub owner_user_id: String,
    pub token_transaction_id: String,
    pub asset_id: String,
    pub xrp_address: String,
    pub asset_tx_blob: String,
    pub supply: i64,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TokenRequest {
    pub asset_id: String,
    pub xrp_address: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SubmitTokenRequest {
    pub asset_id: String,
    pub tx_blob: String,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Wallet {
    pub wallet_id: String,
    pub user_id: String,
    pub xrp_address: String,
    pub secret: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct WalletRequest {
    pub user_id: String,
    pub xrp_address: String,
    pub secret: String,
}


#[derive(Debug, Deserialize)]
pub struct Meta {
    #[serde(rename = "TransactionResult")]
    pub transaction_result: String,
}

#[derive(Debug, Deserialize)]
pub struct RawResult {
    pub meta: Meta,
}

// Updated NFT response structures to match the actual JSON
#[derive(Debug, Deserialize)]
pub struct NftResponse {
    pub fee: i32,
    pub nft: NftDetails,
    pub raw_result: RawResult,
}

#[derive(Debug, Deserialize)]
pub struct NftDetails {
    pub flags: i32,
    pub id: String,
    pub issuer: String,
    pub owner: String,
    pub taxon: i32,
    pub transfer_fee: i32,
    pub uri: String,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Offer {
    pub offer_id: String,
    pub account: String,
    pub user_id: String,
    //pub nft_url: String,        // PATH TO NFT preview see 'image_url' in Asset
    pub nft_id: String,
    pub price: String,
    pub is_sell_offer: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct OfferRequest {
    pub asset_id: String,
    pub user_id: String,
    pub asset_name: String,
    pub client_secret: String,
    pub price: String,
    pub xrp_address: String,
    pub nft_token_id: String,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct NFTOffer {
    pub account: String,
    pub nft_id: String,
    pub price: String,
    pub is_sell_offer: String,
}

#[derive(Debug, Deserialize)]
pub struct NftOfferResponse {
    pub fee: i32,
    pub nft: NftDetails,
    pub raw_result: RawResult,
}