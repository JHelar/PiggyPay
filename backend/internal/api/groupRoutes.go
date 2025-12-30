package api

import (
	"fmt"

	"github.com/JHelar/PiggyPay.git/internal/db"
	"github.com/gofiber/fiber/v2"
)

func registerGroupRoutes(public fiber.Router, db *db.DB) {
	verifyGroupMemberHandle := func(c *fiber.Ctx) error {
		return verifyGroupMember(c, db)
	}

	public.Use([]string{"/"}, func(c *fiber.Ctx) error {
		return verifyUserSession(c, db)
	})

	public.Post("/", func(ctx *fiber.Ctx) error {
		return createGroup(ctx, db)
	}).Name("createGroup")

	public.Get("/", func(ctx *fiber.Ctx) error {
		return getGroups(ctx, db)
	}).Name("getGroups")

	public.Get(fmt.Sprintf("/:%s", GroupIdParam), verifyGroupMemberHandle, func(ctx *fiber.Ctx) error {
		return getGroup(ctx, db)
	}).Name("getGroup")

	public.Patch(fmt.Sprintf("/:%s", GroupIdParam), verifyGroupMemberHandle, func(ctx *fiber.Ctx) error {
		return updateGroup(ctx, db)
	}).Name("updateGroup")

	public.Delete(fmt.Sprintf("/:%s", GroupIdParam), verifyGroupMemberHandle, func(ctx *fiber.Ctx) error {
		return deleteGroup(ctx, db)
	}).Name("deleteGroup")

	publicMemberRouter := public.Group(fmt.Sprintf("/:%s/member", GroupIdParam))
	registerMemberRoutes(publicMemberRouter, db)

	transactionRouter := public.Group(fmt.Sprintf("/:%s/transaction", GroupIdParam), verifyGroupMemberHandle)
	registerTransactionRoutes(transactionRouter, db)

	expenseRouter := public.Group(fmt.Sprintf("/:%s/expense", GroupIdParam), verifyGroupMemberHandle)
	registerExpenseRoutes(expenseRouter, db)
}
