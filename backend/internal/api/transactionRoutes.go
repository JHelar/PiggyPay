package api

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
)

func registerTransactionRoutes(app fiber.Router, api *ApiContext) {
	app.Get("/", func(ctx *fiber.Ctx) error {
		return getTransactions(ctx, api)
	}).Name("getTransactions")

	app.Use([]string{fmt.Sprintf("/:%s", TransactionIdParam)}, func(c *fiber.Ctx) error {
		return verifyTransactionSession(c)
	})

	app.Get(fmt.Sprintf("/:%s", TransactionIdParam), func(ctx *fiber.Ctx) error {
		return getTransaction(ctx, api)
	}).Name("getTransaction")

	app.Patch(fmt.Sprintf("/:%s/pay", TransactionIdParam), func(ctx *fiber.Ctx) error {
		return payTransaction(ctx, api)
	}).Name("payTransaction")
}
