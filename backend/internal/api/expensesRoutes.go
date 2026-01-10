package api

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
)

func registerExpenseRoutes(app fiber.Router, api *ApiContext) {
	app.Get("/", func(ctx *fiber.Ctx) error {
		return getExpenses(ctx, api)
	}).Name("getExpenses")

	app.Post("/", func(c *fiber.Ctx) error {
		return addExpense(c, api)
	}).Name("addExpense")

	app.Get(fmt.Sprintf("/:%s", ExpenseIdParam), func(ctx *fiber.Ctx) error {
		return getExpense(ctx, api)
	}).Name("getExpense")

	app.Patch(fmt.Sprintf("/:%s", ExpenseIdParam), func(ctx *fiber.Ctx) error {
		return updateExpense(ctx, api)
	}).Name("updateExpense")

	app.Delete(fmt.Sprintf("/:%s", ExpenseIdParam), func(ctx *fiber.Ctx) error {
		return removeExpense(ctx, api)
	}).Name("removeExpense")
}
