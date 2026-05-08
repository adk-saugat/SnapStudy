package postgres

import (
	"database/sql"
	"fmt"
)

// EnsureUserBillingSchema adds Stripe billing columns on users if they are missing.
// Idempotent; run at startup so the API matches the DB when migrations were not applied.
func EnsureUserBillingSchema(db *sql.DB) error {
	stmts := []string{
		`ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT NULL`,
		`ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT NULL`,
		`ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_active BOOLEAN NOT NULL DEFAULT FALSE`,
		`ALTER TABLE users ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ NULL`,
		`CREATE UNIQUE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON users (stripe_customer_id) WHERE stripe_customer_id IS NOT NULL`,
		`CREATE UNIQUE INDEX IF NOT EXISTS idx_users_stripe_subscription_id ON users (stripe_subscription_id) WHERE stripe_subscription_id IS NOT NULL`,
	}
	for _, q := range stmts {
		if _, err := db.Exec(q); err != nil {
			return fmt.Errorf("ensure user billing schema: %w", err)
		}
	}
	return nil
}
