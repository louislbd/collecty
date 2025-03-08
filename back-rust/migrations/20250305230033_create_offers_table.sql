-- Add migration script here
CREATE TABLE offers (
    offer_id TEXT UNIQUE PRIMARY KEY,
    user_id TEXT NOT NULL,
    account TEXT NOT NULL,
    nft_id TEXT NOT NULL,
    nft_url TEXT NOT NULL,
    price TEXT NOT NULL,
    is_sell_offer TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);
