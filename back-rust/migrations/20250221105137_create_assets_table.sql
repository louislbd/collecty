-- Add migration script here
CREATE TABLE assets (
    asset_id TEXT UNIQUE PRIMARY KEY,
    user_id TEXT NOT NULL,
    xrp_address TEXT NOT NULL,
    asset_name TEXT NOT NULL,
    asset_description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    nftoken_id TEXT,
    issuer TEXT,
    uri TEXT,
    flags INTEGER,
    transfer_fee INTEGER
);