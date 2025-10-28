package api

import (
	"github.com/JHelar/PiggyPay.git/internal/db"
	"github.com/gofiber/fiber/v2"
)

func registerGroupRoutes(app fiber.Router, db *db.DB) {
	app.Use([]string{"/"}, func(c *fiber.Ctx) error {
		return verifyUserSession(c, db)
	})

	app.Post("/create", func(ctx *fiber.Ctx) error {
		return createGroup(ctx, db)
	}).Name("createGroup")

	app.Get("/", func(ctx *fiber.Ctx) error {
		return getGroups(ctx, db)
	}).Name("getGroups")

	app.Get("/:id", func(ctx *fiber.Ctx) error {
		return getGroup(ctx, db)
	}).Name("getGroup")

	app.Patch("/:id", func(ctx *fiber.Ctx) error {
		return updateGroup(ctx, db)
	}).Name("updateGroup")

	app.Delete("/:id", func(ctx *fiber.Ctx) error {
		return deleteGroup(ctx, db)
	}).Name("deleteGroup")

	app.Get("/:id/member", func(ctx *fiber.Ctx) error {
		return getMembers(ctx, db)
	}).Name("getMembers")

	app.Post("/:id/member", func(ctx *fiber.Ctx) error {
		return addMember(ctx, db)
	}).Name("addMember")

	app.Delete("/:id/member", func(ctx *fiber.Ctx) error {
		return removeMember(ctx, db)
	}).Name("removeMember")

	app.Get("/:id/expenses", func(ctx *fiber.Ctx) error {
		return getExpenses(ctx, db)
	}).Name("getExpenses")
}
