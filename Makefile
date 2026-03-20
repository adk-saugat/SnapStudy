run:
	cd infra && docker compose up --build

run-server:
	cd server/cmd/server && go run main.go

run-dev:	
	cd web && npm run dev
