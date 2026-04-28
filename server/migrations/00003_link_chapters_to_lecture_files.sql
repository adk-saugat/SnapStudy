-- +goose Up
-- +goose StatementBegin
ALTER TABLE lecture_chapters
ADD COLUMN lecture_file_id UUID NULL REFERENCES lecture_files(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_lecture_chapters_lecture_file_id ON lecture_chapters(lecture_file_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_lecture_chapters_lecture_file_id;

ALTER TABLE lecture_chapters
DROP COLUMN IF EXISTS lecture_file_id;
-- +goose StatementEnd
