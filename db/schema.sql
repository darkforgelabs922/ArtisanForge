CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE subscription_tiers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    monthly_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    max_generations_per_month INT NOT NULL
);
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address VARCHAR(42) UNIQUE,
    tier_id INT REFERENCES subscription_tiers(id) DEFAULT 1,
    generation_credits INT DEFAULT 0
);
