package api

import (
	"context"
	"database/sql"
	"log"
	"strings"
	"time"

	"github.com/JHelar/PiggyPay.git/internal/db"
	"github.com/gofiber/fiber/v2"
)

type UserSession struct {
	Bearer string `reqHeader:"Authorization"`
}

const BEARER = "Bearer "
const USER_EMAIL = "email"
const USER_ID = "userId"

func verifyUserSession(c *fiber.Ctx, db *db.DB) error {
	ctx := context.Background()
	header := new(UserSession)

	if err := c.ReqHeaderParser(header); err != nil {
		return err
	}

	if len(header.Bearer) == 0 {
		log.Println("Missing token")
		return fiber.ErrUnauthorized
	}

	sessionId, ok := strings.CutPrefix(header.Bearer, BEARER)
	if !ok || len(sessionId) == 0 {
		log.Println("Missing Bearer token")
	}

	session, err := db.Queries.GetUserSessionById(ctx, sessionId)
	if err != nil && err == sql.ErrNoRows {
		log.Printf("Missing Session: %s\n", sessionId)
		return fiber.ErrUnauthorized
	}

	if err != nil {
		return fiber.ErrInternalServerError
	}

	if session.ExpiresAt.Before(time.Now()) {
		log.Printf("Session expired: %s\n", sessionId)
		if err := db.Queries.DeleteUserSessionById(ctx, sessionId); err != nil {
			log.Println(err)
		}

		return fiber.ErrUnauthorized
	}

	log.Printf("Session found: (Email: %s)", session.Email.String)
	c.Locals(USER_EMAIL, session.Email.String)
	c.Locals(USER_ID, session.UserID.Int64)
	return c.Next()
}
