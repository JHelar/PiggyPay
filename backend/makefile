.PHONY: schema
schema:
	@echo "🔄 Generating Go code from SQL schema..."
	@sqlc generate || (echo "❌ sqlc failed!" && exit 1)
	@echo "✅ sqlc generation complete."

.PHONY: run
run:
	go run ./cmd/server/main.go