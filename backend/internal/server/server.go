package server

import (
	"github.com/JHelar/PiggyPay.git/internal/api"
	"github.com/JHelar/PiggyPay.git/internal/db"
	"github.com/gofiber/fiber/v2"
)

const APP_NAME = "PiggyPay"

type Server struct {
	app *fiber.App
	db  *db.DB
}

func New() *Server {
	app := fiber.New(fiber.Config{
		AppName: APP_NAME,
	})
	db := db.New()

	apiGroup := app.Group("/api/v1")
	api.RegisterRoutes(apiGroup, db)

	return &Server{
		app,
		db,
	}
}

func (s *Server) Run(address string) error {
	return s.app.Listen(address)
}
