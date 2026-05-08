-- +goose Up
-- +goose StatementBegin
ALTER TABLE users
ADD COLUMN stripe_customer_id TEXT NULL,
ADD COLUMN stripe_subscription_id TEXT NULL,
ADD COLUMN subscription_active BOOLEAN NOT NULL DEFAULT FALSE;

CREATE UNIQUE INDEX idx_users_stripe_customer_id ON users (stripe_customer_id)
WHERE stripe_customer_id IS NOT NULL;

CREATE UNIQUE INDEX idx_users_stripe_subscription_id ON users (stripe_subscription_id)
WHERE stripe_subscription_id IS NOT NULL;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_users_stripe_subscription_id;
DROP INDEX IF EXISTS idx_users_stripe_customer_id;

ALTER TABLE users
DROP COLUMN IF EXISTS subscription_active,
DROP COLUMN IF EXISTS stripe_subscription_id,
DROP COLUMN IF EXISTS stripe_customer_id;
-- +goose StatementEnd
