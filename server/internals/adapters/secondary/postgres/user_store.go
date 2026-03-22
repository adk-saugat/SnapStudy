package postgres

import (
	"database/sql"

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
		SELECT id, username, email, password, created_at FROM users WHERE email = $1
	`
	var user domain.User
	err := s.db.QueryRow(query, email).Scan(&user.ID, &user.Username, &user.Email, &user.Password, &user.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &user, nil
}