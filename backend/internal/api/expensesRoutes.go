package api

import (
	"fmt"

	"github.com/JHelar/PiggyPay.git/internal/db"
	"github.com/gofiber/fiber/v2"
)

func registerExpenseRoutes(app fiber.Router, db *db.DB) {
	app.Get("/", func(ctx *fiber.Ctx) error {
		return getExpenses(ctx, db)
	}).Name("getExpenses")

	app.Post("/", func(c *fiber.Ctx) error {
		return addExpense(c, db)
	}).Name("addExpense")

	app.Get(fmt.Sprintf("/:%s", ExpenseIdParam), func(ctx *fiber.Ctx) error {
		return getExpense(ctx, db)
	}).Name("getExpense")

	app.Patch(fmt.Sprintf("/:%s", ExpenseIdParam), func(ctx *fiber.Ctx) error {
		return updateExpense(ctx, db)
	}).Name("updateExpense")

	app.Delete(fmt.Sprintf("/:%s", ExpenseIdParam), func(ctx *fiber.Ctx) error {
		return removeExpense(ctx, db)
	}).Name("removeExpense")
}
