package api

import (
	"github.com/JHelar/PiggyPay.git/internal/db"
	"github.com/gofiber/fiber/v2"
)

func RegisterRoutes(app fiber.Router, db *db.DB) {
	app.Post("/", func(ctx *fiber.Ctx) error {
		return helloWorld(ctx, db)
	}).Name("helloWorld")

	groupRouter := app.Group("/groups")
	registerGroupRoutes(groupRouter, db)

	userRouter := app.Group("/user")
	registerUserRoutes(userRouter, db)
}

func helloWorld(ctx *fiber.Ctx, db *db.DB) error {
	return ctx.SendString("Hello PiggyPay")
}
