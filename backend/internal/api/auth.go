package api

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"math/rand"
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

func generateSignInCode() int64 {
	return 10000 + rand.Int63n(89999)
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
	code:= generateSignInCode()

	expires := time.Now().Add(SESSION_EXPIRE_TIME)
	err := db.Queries.CreateSignInToken(ctx, generated.CreateSignInTokenParams{
		Email:     payload.Email,
		Code: code,
		ExpiresAt: expires,
	})

	if err != nil {
		return err
	}

	log.Printf("Sign in created: code(%d) email(%s)", code, payload.Email)
	return c.SendString("Email verification code sent")
}

func verifyUserSignIn(c *fiber.Ctx, db *db.DB) error {
	ctx := context.Background()
	email := c.Query("email")
	code := c.Query("code")

	log.Printf("Verifying email(%s) code(%s)", email, code)

	signInToken, err := db.Queries.GetSignInToken(ctx, email)

	if err != nil {
		log.Printf("verifyUserSignIn error getting sign in token email(%s)", email)
		return fiber.ErrUnauthorized
	}

	if signInToken.ExpiresAt.Before(time.Now()) {
		log.Println("token has expired")
		return fiber.ErrUnauthorized
	}

	if fmt.Sprint(signInToken.Code) != code {
		log.Printf("invalid code(%s) expected(%d)", code, signInToken.Code)
		return fiber.ErrUnauthorized
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
		log.Printf("Error (%v) verify user sign in", err.Error())
		return fiber.ErrUnauthorized
	}

	log.Printf("New session(%s) created", session)

	return c.JSON(fiber.Map{
		"session":  session,
		"new_user": isNewUser,
	})
}

func signOut(c *fiber.Ctx, db *db.DB) error {
	ctx := context.Background()
	session := mustGetUserSession(c)

	if err := db.Queries.DeleteUserSessionById(ctx, session.ID); err != nil {
		log.Printf("error signOut %v", err.Error())
	}
	return c.SendString("Successfully signed out")
}
