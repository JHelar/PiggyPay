package api

import (
	"bufio"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
	"github.com/valyala/fasthttp"
)

const EventStreamContent = "text/event-stream"

func userStream(c *fiber.Ctx, api *ApiContext) error {
	session := mustGetUserSession(c)

	if c.Accepts(EventStreamContent) == EventStreamContent {
		c.Set(fiber.HeaderContentType, EventStreamContent)
		c.Set(fiber.HeaderCacheControl, "no-cache")
		c.Set(fiber.HeaderConnection, "keep-alive")
		c.Set(fiber.HeaderTransferEncoding, "chunked")

		c.Status(fiber.StatusOK).Request().SetBodyStreamWriter(fasthttp.StreamWriter(func(w *bufio.Writer) {
			client := api.Pool.AddConnection(session.UserID.Int64)

			eventChan := client.Events()

			for message := range eventChan {
				if _, err := w.WriteString(message); err != nil {
					log.Errorf("Failed to send message to client, closing: %v", err.Error())
					api.Pool.RemoveConnection(client.ID)
					break
				}
				if err := w.Flush(); err != nil {
					log.Errorf("Failed to send message to client, closing: %v", err.Error())
					api.Pool.RemoveConnection(client.ID)
					break
				}
			}
		}))
	}

	return nil
}
