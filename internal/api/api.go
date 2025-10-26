package api

import (
	"github.com/JHelar/PiggyPay.git/internal/db"
	"github.com/gofiber/fiber/v2"
)

func RegisterRoutes(app fiber.Router, db *db.DB) {
	app.Post("/", func(ctx *fiber.Ctx) error {
		return helloWorld(ctx, db)
	}).Name("helloWorld")

	app.Post("/user/signIn", func(ctx *fiber.Ctx) error {
		return newUserSignIn(ctx, db)
	}).Name("newUserSignIn")

	app.Get("/user/signIn", func(ctx *fiber.Ctx) error {
		return verifyUserSignIn(ctx, db)
	}).Name("verifyUserSignIn")

	app.Use([]string{"/user/create", "/user/me", "/groups"}, func(c *fiber.Ctx) error {
		return verifyUserSession(c, db)
	})

	app.Post("/user/create", func(ctx *fiber.Ctx) error {
		return createNewUser(ctx, db)
	}).Name("createNewUser")

	app.Get("/user/me", func(ctx *fiber.Ctx) error {
		return getUser(ctx, db)
	}).Name("getUser")

	app.Post("/groups/create", func(ctx *fiber.Ctx) error {
		return createGroup(ctx, db)
	}).Name("createGroup")

	app.Get("/groups", func(ctx *fiber.Ctx) error {
		return getGroups(ctx, db)
	}).Name("getGroups")

	app.Get("/groups/:id", func(ctx *fiber.Ctx) error {
		return getGroup(ctx, db)
	}).Name("getGroup")
}

func helloWorld(ctx *fiber.Ctx, db *db.DB) error {
	return ctx.SendString("Hello PiggyPay")
}
