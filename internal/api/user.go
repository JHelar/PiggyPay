package api

import (
	"context"
	"database/sql"
	"log"

	"github.com/JHelar/PiggyPay.git/internal/db"
	"github.com/JHelar/PiggyPay.git/internal/db/generated"
	"github.com/gofiber/fiber/v2"
)

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

	session := mustGetUserSession(c)

	userId, err := db.Queries.CreateUser(ctx, generated.CreateUserParams{
		Email:       session.Email.String,
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

	session := mustGetUserSession(c)

	user, err := db.Queries.GetUserById(ctx, session.UserID.Int64)
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

type UpdateUser struct {
	FirstName   string `json:"first_name" xml:"first_name" form:"first_name"`
	LastName    string `json:"last_name" xml:"last_name" form:"last_name"`
	PhoneNumber string `json:"phone_number" xml:"phone_number" form:"phone_number"`
	Email       string `json:"email" xml:"email" form:"email"`
}

func updateUser(c *fiber.Ctx, db *db.DB) error {
	ctx := context.Background()
	payload := new(UpdateUser)

	session := mustGetUserSession(c)

	if err := c.BodyParser(payload); err != nil {
		return err
	}

	user, err := db.Queries.UpdateUser(ctx, generated.UpdateUserParams{
		ID:          session.UserID.Int64,
		FirstName:   payload.FirstName,
		LastName:    payload.LastName,
		PhoneNumber: payload.PhoneNumber,
		Email:       payload.Email,
	})

	if err != nil {
		log.Printf("updateUser error updating user %v", err.Error())
		return fiber.DefaultErrorHandler(c, err)
	}

	return c.JSON(user)
}

func deleteUser(c *fiber.Ctx, db *db.DB) error {
	ctx := context.Background()

	session := mustGetUserSession(c)

	if err := db.Queries.DeleteUser(ctx, session.UserID.Int64); err != nil {
		log.Printf("updateUser error deleting user %v", err.Error())
		return fiber.DefaultErrorHandler(c, err)
	}

	_, err := c.WriteString("Deleted")
	return err
}
