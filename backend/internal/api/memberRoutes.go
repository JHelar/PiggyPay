package api

import (
	"github.com/gofiber/fiber/v2"
)

func registerMemberRoutes(public fiber.Router, api *ApiContext) {
	verifyGroupMemberHandle := func(c *fiber.Ctx) error {
		return verifyGroupMember(c, api)
	}

	public.Get("/me", verifyGroupMemberHandle, func(ctx *fiber.Ctx) error {
		return getMemberInfo(ctx, api)
	}).Name("getMemberInfo")

	public.Get("/", verifyGroupMemberHandle, func(ctx *fiber.Ctx) error {
		return getMembers(ctx, api)
	}).Name("getMembers")

	public.Post("/", func(ctx *fiber.Ctx) error {
		return addMember(ctx, api)
	}).Name("addMember")

	public.Patch("/ready", verifyGroupMemberHandle, func(ctx *fiber.Ctx) error {
		return memberReadyToPay(ctx, api)
	}).Name("memberReadyToPay")

	public.Delete("/", verifyGroupMemberHandle, func(ctx *fiber.Ctx) error {
		return removeMember(ctx, api)
	}).Name("removeMember")
}
