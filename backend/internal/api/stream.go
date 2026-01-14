package api

import (
	"bufio"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
	"github.com/valyala/fasthttp"
)

const EventStreamContent = "text/event-stream"

func userStream(c *fiber.Ctx, api *ApiContext) error {
	session := mustGetUserSession(c)

	c.Set(fiber.HeaderContentType, EventStreamContent)
	c.Set(fiber.HeaderCacheControl, "no-cache")
	c.Set(fiber.HeaderConnection, "keep-alive")
	c.Set(fiber.HeaderTransferEncoding, "chunked")

	ctx := c.Context()
	ctx.SetBodyStreamWriter(fasthttp.StreamWriter(func(w *bufio.Writer) {
		keepAliveTicker := time.NewTicker(15 * time.Second)
		defer keepAliveTicker.Stop()

		keepAliveMsg := ":keepalive\n"

		client := api.Pool.AddConnection(session.UserID.Int64)
		defer api.Pool.RemoveConnection(client.ID)

		eventChan := client.Events()

		for {
			select {
			case message, ok := <-eventChan:
				{
					if !ok {
						return
					}
					if _, err := fmt.Fprint(w, message); err != nil {
						log.Errorf("Failed to send message to client, closing: %v", err.Error())
						return
					}
					if err := w.Flush(); err != nil {
						log.Errorf("Failed to send message to client, closing: %v", err.Error())
						return
					}
				}
			case <-keepAliveTicker.C:
				{
					if _, err := fmt.Fprint(w, keepAliveMsg); err != nil {
						log.Errorf("Failed to send keep alive message to client, closing: %v", err.Error())
						return
					}
					if err := w.Flush(); err != nil {
						log.Errorf("Failed to send message to client, closing: %v", err.Error())
						return
					}
				}
			case <-ctx.Done():
				log.Info("Client disconnect")
				return
			}
		}
	}))

	return nil
}
