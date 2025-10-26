package api

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"time"

	"github.com/JHelar/PiggyPay.git/internal/db"
	"github.com/JHelar/PiggyPay.git/internal/db/generated"
	"github.com/gofiber/fiber/v2"
)

const SESSION_EXPIRE_TIME = time.Minute * 10
const SIGN_IN_TOKEN_EXPIRE_TIME = time.Minute * 10

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

type CreateNewUser struct {
	FirstName   string `json:"first_name" xml:"first_name" form:"first_name"`
	LastName    string `json:"last_name" xml:"last_name" form:"last_name"`
	PhoneNumber string `json:"phone_number" xml:"phone_number" form:"phone_number"`
}

func createNewUser(c *fiber.Ctx, db *db.DB) error {
	ctx := context.Background()
	payload := new(CreateNewUser)

	if err := c.BodyParser(payload); err != nil {
		return err
	}

	email, ok := c.Locals(USER_EMAIL).(string)
	if !ok || len(email) == 0 {
		fmt.Println("Missing email")
		return fiber.ErrExpectationFailed
	}

	userId, err := db.Queries.CreateUser(ctx, generated.CreateUserParams{
		Email:       email,
		FirstName:   payload.FirstName,
		LastName:    payload.LastName,
		PhoneNumber: payload.PhoneNumber,
	})

	if err != nil {
		return err
	}

	return c.JSON(fiber.Map{
		"user_id": userId,
	})
}

func getUser(c *fiber.Ctx, db *db.DB) error {
	ctx := context.Background()

	userId, ok := c.Locals(USER_ID).(int64)
	if !ok {
		return fiber.ErrExpectationFailed
	}

	user, err := db.Queries.GetUserById(ctx, userId)
	if err != nil && err == sql.ErrNoRows {
		return fiber.ErrUnauthorized
	}

	if err != nil {
		log.Println(err.Error())
		return fiber.ErrInternalServerError
	}

	return c.JSON(fiber.Map{
		"first_name": user.FirstName,
	})
}
