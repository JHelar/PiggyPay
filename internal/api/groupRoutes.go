package api

import (
	"fmt"

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

	app.Use([]string{fmt.Sprintf("/:%s", GroupIdParam)}, func(c *fiber.Ctx) error {
		return verifyGroupMember(c, db)
	})

	app.Get(fmt.Sprintf("/:%s", GroupIdParam), func(ctx *fiber.Ctx) error {
		return getGroup(ctx, db)
	}).Name("getGroup")

	app.Patch(fmt.Sprintf("/:%s", GroupIdParam), func(ctx *fiber.Ctx) error {
		return updateGroup(ctx, db)
	}).Name("updateGroup")

	app.Delete(fmt.Sprintf("/:%s", GroupIdParam), func(ctx *fiber.Ctx) error {
		return deleteGroup(ctx, db)
	}).Name("deleteGroup")

	memberRouter := app.Group(fmt.Sprintf("/:%s/member", GroupIdParam))
	registerMemberRoutes(memberRouter, db)

	expenseRouter := app.Group(fmt.Sprintf("/:%s/expense", GroupIdParam))
	registerExpenseRoutes(expenseRouter, db)
}
