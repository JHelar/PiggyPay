package server

import (
	"github.com/JHelar/PiggyPay.git/internal/api"
	"github.com/JHelar/PiggyPay.git/internal/db"
	"github.com/JHelar/PiggyPay.git/pkg/stream"
	"github.com/gofiber/fiber/v2"
)

const APP_NAME = "PiggyPay"

type Server struct {
	app     *fiber.App
	context *api.ApiContext
}

func New() *Server {
	app := fiber.New(fiber.Config{
		AppName: APP_NAME,
	})
	db := db.New()
	pool := stream.New()

	context := api.NewContext(db, pool)

	apiGroup := app.Group("/api/v1")
	api.RegisterRoutes(apiGroup, context)

	return &Server{
		app,
		context,
	}
}

func (s *Server) Run(address string) error {
	return s.app.Listen(address)
}
