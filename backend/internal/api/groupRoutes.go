package api

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
)

func registerGroupRoutes(public fiber.Router, context *ApiContext) {
	verifyGroupMemberHandle := func(c *fiber.Ctx) error {
		return verifyGroupMember(c, context)
	}

	public.Use([]string{"/"}, func(c *fiber.Ctx) error {
		return verifyUserSession(c, context)
	})

	public.Post("/", func(ctx *fiber.Ctx) error {
		return createGroup(ctx, context)
	}).Name("createGroup")

	public.Get("/", func(ctx *fiber.Ctx) error {
		return getGroups(ctx, context)
	}).Name("getGroups")

	public.Get(fmt.Sprintf("/:%s", GroupIdParam), verifyGroupMemberHandle, func(ctx *fiber.Ctx) error {
		return getGroup(ctx, context)
	}).Name("getGroup")

	public.Patch(fmt.Sprintf("/:%s", GroupIdParam), verifyGroupMemberHandle, func(ctx *fiber.Ctx) error {
		return updateGroup(ctx, context)
	}).Name("updateGroup")

	public.Delete(fmt.Sprintf("/:%s", GroupIdParam), verifyGroupMemberHandle, func(ctx *fiber.Ctx) error {
		return deleteGroup(ctx, context)
	}).Name("deleteGroup")

	publicMemberRouter := public.Group(fmt.Sprintf("/:%s/member", GroupIdParam))
	registerMemberRoutes(publicMemberRouter, context)

	transactionRouter := public.Group(fmt.Sprintf("/:%s/transaction", GroupIdParam), verifyGroupMemberHandle)
	registerTransactionRoutes(transactionRouter, context)

	expenseRouter := public.Group(fmt.Sprintf("/:%s/expense", GroupIdParam), verifyGroupMemberHandle)
	registerExpenseRoutes(expenseRouter, context)
}
