use reqwest::Client;
use serde_json::Value;
use thiserror::Error;
use xrpl::asynch::clients::{AsyncJsonRpcClient, XRPLAsyncClient};
use xrpl::models::{ledger::objects::account_root::AccountRoot, requests::account_info::AccountInfo};
use xrpl::wallet::Wallet;
use std::borrow::Cow;
use url::Url;
use std::env;

const XRP_API_URL: &str = "https://s.altnet.rippletest.net:51234";

// Define a custom error type
#[derive(Error, Debug)]
pub enum XrpError {
    #[error("Invalid response from XRP Ledger")]
    InvalidResponse,
    #[error("Reqwest error: {0}")]
    ReqwestError(#[from] reqwest::Error),
}

pub async fn check_xrp_connection() -> Result<(), XrpError> {
    let client = Client::new();
    let url = XRP_API_URL; // XRP Testnet API

    let payload = serde_json::json!({
        "method": "server_info",
        "params": [{}]
    });

    let response = client.post(url)
        .json(&payload)
        .send()
        .await?
        .json::<Value>()
        .await?;

    if let Some(_info) = response.get("result").and_then(|r| r.get("info")) {
        println!("✅ Connected to XRP Ledger");
        //println!("Server Info: {:#?}", _info);
        Ok(())
    } else {
        println!("❌ Failed to connect to XRP Ledger");
        println!("Response: {:#?}", response);

        // Return a custom error
        Err(XrpError::InvalidResponse) // This line should work now
    }
}

pub async fn get_ledger_info() -> Result<(), reqwest::Error> {
    let client = Client::new();
    let url = XRP_API_URL;

    let payload = serde_json::json!({
        "method": "ledger",
        "params": [{"ledger_index": "validated"}]
    });

    let response: Value = client.post(url)
        .json(&payload)
        .send()
        .await?
        .json()
        .await?;

    println!("{:#?}", response);
    Ok(())
}

/// Setup an issuer account root
pub async fn setup_issuer_account_root<'a>() -> AccountRoot<'a> {
    let wallet = Wallet::new(env::var("XRP_COLD_WALLET_SECRET")
        .expect("Cannot retrieve issuer secret seed")
        .as_ref(), 0)
        .unwrap();
    eprintln!("Issuer Wallet: {:?}\n", wallet);

    let url: Url = Url::parse(XRP_API_URL).unwrap();
    // Connect to XRPL Testnet
    let client = AsyncJsonRpcClient::connect(url);

    // Request to get account root information
    let account_info_request = AccountInfo {
        common_fields: xrpl::models::requests::CommonFields {
            command: xrpl::models::requests::RequestMethod::AccountInfo,
            id: None,
        },
        account: Cow::Owned(wallet.classic_address.clone()),
        ledger_lookup: None,
        strict: None,
        queue: None,
        signer_lists: None,
    };
    let response = client.request(xrpl::models::requests::XRPLRequest::AccountInfo(account_info_request)).await.unwrap();
    eprintln!("Response: {:?}\n", response);

    // Parse the response to create an AccountRoot instance
    if let xrpl::models::results::XRPLResult::AccountInfo(account_info) = response.result.unwrap() {
        let account_data = account_info.get_account_root();
        let account_root = AccountRoot::from(account_data.clone());
        //eprintln!("Account Root: {:?}", account_root);
        account_root
    } else {
        panic!("Failed to retrieve account data");
    }
}

