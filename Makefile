run:
	cd infra && docker compose up --build

run-server:
	cd server/cmd/server && go run main.go

run-dev:	
	cd web && npm run dev

# Requires goose (brew install goose). Loads server/.env for POSTGRES_CONNECTION_STRING.
migrate-up:
	cd server && bash -lc 'set -a && [ -f .env ] && . ./.env && set +a && goose -dir migrations postgres "$$POSTGRES_CONNECTION_STRING" up'
