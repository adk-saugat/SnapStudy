-- +goose Up
-- +goose StatementBegin
ALTER TABLE users
ADD COLUMN trial_ends_at TIMESTAMPTZ NULL;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE users
DROP COLUMN IF EXISTS trial_ends_at;
-- +goose StatementEnd
