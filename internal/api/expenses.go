package api

import (
	"context"
	"log"
	"strconv"

	"github.com/JHelar/PiggyPay.git/internal/db"
	"github.com/JHelar/PiggyPay.git/internal/db/generated"
	"github.com/gofiber/fiber/v2"
)

func getExpenses(c *fiber.Ctx, db *db.DB) error {
	ctx := context.Background()

	session := mustGetUserSession(c)

	groupId, err := strconv.ParseInt(c.Params("id"), 10, 64)
	if err != nil {
		log.Println("getExpenses failed to convert group id")
		return fiber.DefaultErrorHandler(c, err)
	}

	expenses, err := db.Queries.GetGroupExpenses(ctx, generated.GetGroupExpensesParams{
		GroupID: groupId,
		UserID:  session.UserID.Int64,
	})

	if err != nil {
		log.Printf("getExpenses failed to get group(%v) expenses for user(%v)", groupId, session.UserID.Int64)
		return fiber.DefaultErrorHandler(c, err)
	}

	return c.JSON(expenses)
}

type AddExpense struct {
	ExpenseName string  `json:"expense_name" xml:"expense_name" form:"expense_name"`
	ExpenseCost float32 `json:"expense_cost" xml:"expense_cost" form:"expense_cost"`
}

func addExpense(c *fiber.Ctx, db *db.DB) error {
	ctx := context.Background()
	payload := new(AddExpense)

	session := mustGetUserSession(c)

	if err := c.BodyParser(payload); err != nil {
		log.Println("addExpense failed to parse body")
		return fiber.DefaultErrorHandler(c, err)
	}

	groupId, err := strconv.ParseInt(c.Params("id"), 10, 64)
	if err != nil {
		log.Println("addExpense failed to convert group id")
		return fiber.DefaultErrorHandler(c, err)
	}

	expense, err := db.Queries.AddExpense(ctx, generated.AddExpenseParams{
		Name:    payload.ExpenseName,
		Cost:    float64(payload.ExpenseCost),
		GroupID: groupId,
		UserID:  session.UserID.Int64,
	})

	if err != nil {
		log.Printf("addExpense failed to add expense for user(%v) in group(%v)", session.UserID.Int64, groupId)
		return fiber.DefaultErrorHandler(c, err)
	}

	return c.JSON(expense)
}
