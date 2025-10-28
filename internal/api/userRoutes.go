package api

import (
	"github.com/JHelar/PiggyPay.git/internal/db"
	"github.com/gofiber/fiber/v2"
)

func registerUserRoutes(app fiber.Router, db *db.DB) {
	app.Use([]string{"/create", "/me"}, func(c *fiber.Ctx) error {
		return verifyUserSession(c, db)
	})

	app.Post("/signIn", func(ctx *fiber.Ctx) error {
		return newUserSignIn(ctx, db)
	}).Name("newUserSignIn")

	app.Get("/signIn", func(ctx *fiber.Ctx) error {
		return verifyUserSignIn(ctx, db)
	}).Name("verifyUserSignIn")

	app.Post("/create", func(ctx *fiber.Ctx) error {
		return createNewUser(ctx, db)
	}).Name("createNewUser")

	app.Get("/me", func(ctx *fiber.Ctx) error {
		return getUser(ctx, db)
	}).Name("getUser")

	app.Patch("/me", func(ctx *fiber.Ctx) error {
		return updateUser(ctx, db)
	}).Name("updateUser")

	app.Delete("/me", func(ctx *fiber.Ctx) error {
		return deleteUser(ctx, db)
	}).Name("deleteUser")
}
