package postgres

import (
	"database/sql"
	"errors"

	"github.com/adk-saugat/snapstudy/server/internals/core/domain"
)

type UserStore struct {
	db *sql.DB
}

func NewUserStore(db *sql.DB) *UserStore {
	return &UserStore{db: db}
}

func (s *UserStore) CreateUser(user domain.User) (*domain.User, error) {
	query := `
		INSERT INTO users (username, email, password, created_at)
		VALUES ($1, $2, $3, $4) RETURNING id
	`
	err := s.db.QueryRow(query, user.Username, user.Email, user.Password, user.CreatedAt).Scan(&user.ID)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (s *UserStore) FindByEmail(email string) (*domain.User, error) {
	query := `
		SELECT id, username, email, password, created_at,
			COALESCE(stripe_customer_id, ''), COALESCE(stripe_subscription_id, ''), subscription_active,
			trial_ends_at
		FROM users WHERE email = $1
	`
	var user domain.User
	var trialEnds sql.NullTime
	err := s.db.QueryRow(query, email).Scan(
		&user.ID,
		&user.Username,
		&user.Email,
		&user.Password,
		&user.CreatedAt,
		&user.StripeCustomerID,
		&user.StripeSubscriptionID,
		&user.SubscriptionActive,
		&trialEnds,
	)
	if err != nil {
		return nil, err
	}
	if trialEnds.Valid {
		t := trialEnds.Time
		user.TrialEndsAt = &t
	}
	return &user, nil
}

func (s *UserStore) FindByID(id string) (*domain.User, error) {
	query := `
		SELECT id, username, email, password, created_at,
			COALESCE(stripe_customer_id, ''), COALESCE(stripe_subscription_id, ''), subscription_active,
			trial_ends_at
		FROM users WHERE id = $1
	`
	var user domain.User
	var trialEnds sql.NullTime
	err := s.db.QueryRow(query, id).Scan(
		&user.ID,
		&user.Username,
		&user.Email,
		&user.Password,
		&user.CreatedAt,
		&user.StripeCustomerID,
		&user.StripeSubscriptionID,
		&user.SubscriptionActive,
		&trialEnds,
	)
	if err != nil {
		return nil, err
	}
	if trialEnds.Valid {
		t := trialEnds.Time
		user.TrialEndsAt = &t
	}
	return &user, nil
}

func (s *UserStore) SetSubscriptionFromCheckout(userID, customerID, subscriptionID string) error {
	query := `
		UPDATE users
		SET stripe_customer_id = $2, stripe_subscription_id = $3, subscription_active = TRUE
		WHERE id = $1
	`
	_, err := s.db.Exec(query, userID, customerID, subscriptionID)
	return err
}

func (s *UserStore) SetSubscriptionActiveBySubscriptionID(subscriptionID string, active bool) error {
	query := `
		UPDATE users SET subscription_active = $2 WHERE stripe_subscription_id = $1
	`
	_, err := s.db.Exec(query, subscriptionID, active)
	return err
}

func (s *UserStore) ClearSubscriptionBySubscriptionID(subscriptionID string) error {
	query := `
		UPDATE users
		SET stripe_subscription_id = NULL, subscription_active = FALSE
		WHERE stripe_subscription_id = $1
	`
	_, err := s.db.Exec(query, subscriptionID)
	return err
}

func (s *UserStore) StartAppTrial(userID string, days int) error {
	if days < 1 {
		days = 14
	}
	if days > 365 {
		days = 365
	}
	res, err := s.db.Exec(`
		UPDATE users
		SET trial_ends_at = CURRENT_TIMESTAMP + ($2 * INTERVAL '1 day')
		WHERE id = $1 AND trial_ends_at IS NULL AND subscription_active = FALSE
	`, userID, days)
	if err != nil {
		return err
	}
	n, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if n == 0 {
		return errors.New("trial not available for this user")
	}
	return nil
}
