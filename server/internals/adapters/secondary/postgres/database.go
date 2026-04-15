package postgres

import (
	"database/sql"
	"fmt"
	"net/url"
	"strings"

	_ "github.com/jackc/pgx/v5/stdlib"
)

func NewDB(databaseURL string) (*sql.DB, error) {
	connString := withSimpleProtocol(databaseURL)
	db, err := sql.Open("pgx", connString)
	if err != nil {
		return nil, fmt.Errorf("failed to open connection: %w", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(5)

	return db, nil
}

func withSimpleProtocol(databaseURL string) string {
	u, err := url.Parse(databaseURL)
	if err != nil {
		return databaseURL
	}

	query := u.Query()
	if strings.EqualFold(query.Get("default_query_exec_mode"), "simple_protocol") {
		return databaseURL
	}
	query.Set("default_query_exec_mode", "simple_protocol")
	u.RawQuery = query.Encode()
	return u.String()
}