package api

import (
	"github.com/JHelar/PiggyPay.git/internal/db"
	"github.com/JHelar/PiggyPay.git/pkg/stream"
)

type ApiContext struct {
	DB   *db.DB
	Pool *stream.ConnectionPool
}

func NewContext(
	db *db.DB,
	pool *stream.ConnectionPool,
) *ApiContext {
	return &ApiContext{
		DB:   db,
		Pool: pool,
	}
}
