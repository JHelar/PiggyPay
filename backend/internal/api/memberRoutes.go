package api

import (
	"github.com/JHelar/PiggyPay.git/internal/db"
	"github.com/gofiber/fiber/v2"
)

func registerMemberRoutes(public fiber.Router, db *db.DB) {
	verifyGroupMemberHandle := func(c *fiber.Ctx) error {
		return verifyGroupMember(c, db)
	}

	public.Get("/", verifyGroupMemberHandle, func(ctx *fiber.Ctx) error {
		return getMembers(ctx, db)
	}).Name("getMembers")

	public.Post("/", func(ctx *fiber.Ctx) error {
		return addMember(ctx, db)
	}).Name("addMember")

	public.Patch("/ready", verifyGroupMemberHandle, func(ctx *fiber.Ctx) error {
		return memberReadyToPay(ctx, db)
	}).Name("memberReadyToPay")

	public.Delete("/", verifyGroupMemberHandle, func(ctx *fiber.Ctx) error {
		return removeMember(ctx, db)
	}).Name("removeMember")

	transactionRouter := public.Group("/transaction", verifyGroupMemberHandle)
	registerTransactionRoutes(transactionRouter, db)
}
