-- Add migration script here
CREATE TABLE tokens (
    token_id TEXT UNIQUE PRIMARY KEY,
    asset_id TEXT NOT NULL,
    owner_user_id TEXT NOT NULL,
    token_transaction_id TEXT UNIQUE NOT NULL,
    xrp_address TEXT NOT NULL,
    asset_tx_blob TEXT NOT NULL,
    supply BIGINT NOT NULL DEFAULT 1,
    asset_name TEXT NOT NULL,
    asset_description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);
