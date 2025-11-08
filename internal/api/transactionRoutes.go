package api

import (
	"fmt"

	"github.com/JHelar/PiggyPay.git/internal/db"
	"github.com/gofiber/fiber/v2"
)

func registerTransactionRoutes(app fiber.Router, db *db.DB) {
	app.Get("/", func(ctx *fiber.Ctx) error {
		return getTransactions(ctx, db)
	}).Name("getTransactions")

	app.Use([]string{fmt.Sprintf("/:%s", TransactionIdParam)}, func(c *fiber.Ctx) error {
		return verifyTransactionSession(c)
	})

	app.Get(fmt.Sprintf("/:%s", TransactionIdParam), func(ctx *fiber.Ctx) error {
		return getTransaction(ctx, db)
	}).Name("getTransaction")

	app.Patch(fmt.Sprintf("/:%s/pay", TransactionIdParam), func(ctx *fiber.Ctx) error {
		return payTransaction(ctx, db)
	}).Name("payTransaction")
}
