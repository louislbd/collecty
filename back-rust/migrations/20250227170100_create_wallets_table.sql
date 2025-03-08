-- Add migration script here
CREATE TABLE wallets (
    wallet_id TEXT UNIQUE PRIMARY KEY,
    user_id TEXT REFERENCES users(user_id) ON DELETE CASCADE NOT NULL,
    xrp_address TEXT UNIQUE NOT NULL,
    secret TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);
