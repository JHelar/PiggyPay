package api

import (
	"github.com/JHelar/PiggyPay.git/internal/db"
	"github.com/gofiber/fiber/v2"
)

func registerMemberRoutes(app fiber.Router, db *db.DB) {
	app.Get("/", func(ctx *fiber.Ctx) error {
		return getMembers(ctx, db)
	}).Name("getMembers")

	app.Post("/", func(ctx *fiber.Ctx) error {
		return addMember(ctx, db)
	}).Name("addMember")

	app.Patch("/ready", func(ctx *fiber.Ctx) error {
		return memberReadyToPay(ctx, db)
	}).Name("memberReadyToPay")

	app.Delete("/", func(ctx *fiber.Ctx) error {
		return removeMember(ctx, db)
	}).Name("removeMember")

	transactionRouter := app.Group("/transaction")
	registerTransactionRoutes(transactionRouter, db)
}
