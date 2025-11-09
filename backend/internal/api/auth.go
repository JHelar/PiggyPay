package api

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/JHelar/PiggyPay.git/internal/db"
	"github.com/JHelar/PiggyPay.git/internal/db/generated"
	"github.com/gofiber/fiber/v2"
)

type UserSession struct {
	Bearer string `reqHeader:"Authorization"`
}

const SESSION_EXPIRE_TIME = time.Minute * 10
const SIGN_IN_TOKEN_EXPIRE_TIME = time.Minute * 10

const BEARER = "Bearer "
const USER_SESSION_LOCAL = "userSession"

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

	log.Printf("Session found: (Email: %s, UserId: %d)\n", session.Email.String, session.UserID.Int64)
	c.Locals(USER_SESSION_LOCAL, session)
	return c.Next()
}

func mustGetUserSession(c *fiber.Ctx) generated.GetUserSessionByIdRow {
	return c.Locals(USER_SESSION_LOCAL).(generated.GetUserSessionByIdRow)
}

type NewUserSignIn struct {
	Email string `json:"email" xml:"email" form:"email"`
}

func newUserSignIn(c *fiber.Ctx, db *db.DB) error {
	ctx := context.Background()
	payload := new(NewUserSignIn)

	if err := c.BodyParser(payload); err != nil {
		return err
	}

	expires := time.Now().Add(SESSION_EXPIRE_TIME)
	signInToken, err := db.Queries.CreateSignInToken(ctx, generated.CreateSignInTokenParams{
		Email:     payload.Email,
		ExpiresAt: expires,
	})

	if err != nil {
		return err
	}

	return c.JSON(fiber.Map{
		"token": signInToken,
	})
}

func verifyUserSignIn(c *fiber.Ctx, db *db.DB) error {
	ctx := context.Background()
	token := c.Query("token")

	if len(token) <= 0 {
		return fmt.Errorf("missing token")
	}

	signInToken, err := db.Queries.GetSignInToken(ctx, token)

	if err != nil {
		return err
	}

	if signInToken.ExpiresAt.Before(time.Now()) {
		return fmt.Errorf("token has expired")
	}

	user, err := db.Queries.GetUserByEmail(ctx, signInToken.Email)

	expires := time.Now().Add(SESSION_EXPIRE_TIME)
	var isNewUser bool
	var session string

	if err == sql.ErrNoRows {
		// New user session
		isNewUser = true
		session, err = db.Queries.CreateNewUserSession(ctx, generated.CreateNewUserSessionParams{
			Email:     sql.NullString{Valid: true, String: signInToken.Email},
			UserID:    sql.NullInt64{Valid: false},
			ExpiresAt: expires,
		})
	} else {
		isNewUser = false
		session, err = db.Queries.CreateExistingUserSession(ctx, generated.CreateExistingUserSessionParams{
			Email:     sql.NullString{Valid: false},
			UserID:    sql.NullInt64{Valid: true, Int64: user.ID},
			ExpiresAt: expires,
		})
	}

	if err != nil {
		return err
	}

	return c.JSON(fiber.Map{
		"session":  session,
		"new_user": isNewUser,
	})
}
