package db

import (
	"context"
	"database/sql"
	"log"

	"github.com/JHelar/PiggyPay.git/internal/db/generated"

	_ "embed"

	_ "github.com/mattn/go-sqlite3"
)

const DATABASE_NAME = "piggypay.db"

//go:embed schema/schema.sql
var ddl string

type DB struct {
	Queries *generated.Queries
	db      *sql.DB
}

func New() *DB {
	ctx := context.Background()

	db, err := sql.Open("sqlite3", DATABASE_NAME)
	if err != nil {
		log.Fatal("Failed to open database", err)
	}

	if _, err := db.ExecContext(ctx, ddl); err != nil {
		log.Fatal("Failed to update schema", err)
	}

	return &DB{
		Queries: generated.New(db),
		db:      db,
	}
}
