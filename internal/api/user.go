package api

import (
	"context"
	"log"
	"time"

	"github.com/JHelar/PiggyPay.git/internal/db"
	"github.com/JHelar/PiggyPay.git/internal/db/generated"
	"github.com/gofiber/fiber/v2"
)

const EXPIRE_TIME = time.Minute * 10

type NewUserSession struct {
	Email string `json:"email" xml:"email" form:"email"`
}

func newUserSession(c *fiber.Ctx, db *db.DB) error {
	ctx := context.Background()
	payload := new(NewUserSession)

	if err := c.BodyParser(payload); err != nil {
		return err
	}

	expires := time.Now().Add(EXPIRE_TIME)
	sessionId, err := db.Queries.CreateNewUserSession(ctx, generated.CreateNewUserSessionParams{
		UserEmail: payload.Email,
		ExpiresAt: expires,
	})

	if err != nil {
		return err
	}

	log.Printf("Session id: %s\n", sessionId)

	return nil
}
