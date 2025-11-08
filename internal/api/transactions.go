package api

import (
	"context"
	"fmt"
	"log"
	"strconv"

	"github.com/JHelar/PiggyPay.git/internal/db"
	"github.com/JHelar/PiggyPay.git/internal/db/generated"
	"github.com/gofiber/fiber/v2"
)

const TransactionIdParam = "transactionId"
const TransactionSessionLocal = "transactionSession"

type TransactionSession struct {
	generated.GetGroupMemberRow

	TransactionID int64
}

func verifyTransactionSession(c *fiber.Ctx) error {
	session := mustGetGroupSession(c)
	transactionId, err := strconv.ParseInt(c.Params(TransactionIdParam), 10, 64)
	if err != nil {
		log.Printf("mustGetTransactionSession failed to convert transaction id")
		return fiber.ErrInternalServerError
	}

	c.Locals(TransactionSessionLocal, TransactionSession{
		TransactionID:     transactionId,
		GetGroupMemberRow: session,
	})

	return c.Next()
}

func mustGetTransactionSession(c *fiber.Ctx) TransactionSession {
	return c.Locals(TransactionSessionLocal).(TransactionSession)
}

func getTransactions(c *fiber.Ctx, db *db.DB) error {
	ctx := context.Background()

	session := mustGetGroupSession(c)

	transactions, err := db.Queries.GetUserGroupTransactions(ctx, generated.GetUserGroupTransactionsParams{
		UserID:  session.UserID,
		GroupID: session.GroupID,
	})

	if err != nil {
		log.Printf("getTransactions failed to get transactions for user(%v) and group(%v)", session.UserID, session.GroupID)
		return fiber.DefaultErrorHandler(c, err)
	}

	return c.JSON(transactions)
}

func getTransaction(c *fiber.Ctx, db *db.DB) error {
	ctx := context.Background()

	session := mustGetTransactionSession(c)

	transaction, err := db.Queries.GetUserGroupTransaction(ctx, generated.GetUserGroupTransactionParams{
		ID:      session.TransactionID,
		UserID:  session.UserID,
		GroupID: session.GroupID,
	})

	if err != nil {
		fmt.Printf("getTransaction failed to get transaction(%v) for user(%v) and group(%v)", session.TransactionID, session.UserID, session.GroupID)
		return fiber.DefaultErrorHandler(c, err)
	}

	return c.JSON(transaction)
}

func payTransaction(c *fiber.Ctx, db *db.DB) error {
	ctx := context.Background()

	session := mustGetTransactionSession(c)

	if err := db.Queries.PayUserGroupTransaction(ctx, generated.PayUserGroupTransactionParams{
		FromState: string(TransactionStateUnpaid),
		ToState:   string(TransactionStatePaid),
		UserID:    session.UserID,
		GroupID:   session.GroupID,
		ID:        session.TransactionID,
	}); err != nil {
		fmt.Printf("getTransaction failed to pay transaction(%v) for user(%v) and group(%v)", session.TransactionID, session.UserID, session.GroupID)
		return fiber.DefaultErrorHandler(c, err)
	}

	return c.SendString("Transaction payed")
}
