package api

import (
	"context"
	"database/sql"
	"log"
	"strconv"

	"github.com/JHelar/PiggyPay.git/internal/db"
	"github.com/JHelar/PiggyPay.git/internal/db/generated"
	"github.com/gofiber/fiber/v2"
)

func getMembers(c *fiber.Ctx, db *db.DB) error {
	ctx := context.Background()

	session := mustGetGroupSession(c)

	members, err := db.Queries.GetGroupMembers(ctx, generated.GetGroupMembersParams{
		GroupID: session.GroupID,
		UserID:  session.UserID,
	})
	if err == sql.ErrNoRows || len(members) == 0 {
		log.Printf("getMembers user(%v) is not member in group(%v)\n", session.UserID, session.GroupID)
		return fiber.ErrUnauthorized
	}

	if err != nil {
		log.Printf("getMembers error getting members for group(%v)\n", session.GroupID)
		return fiber.DefaultErrorHandler(c, err)
	}

	return c.JSON(members)
}

func addMember(c *fiber.Ctx, db *db.DB) error {
	ctx := context.Background()

	session := mustGetGroupSession(c)

	_, err := db.Queries.GetGroupMember(ctx, generated.GetGroupMemberParams{
		GroupID: session.GroupID,
		UserID:  session.UserID,
	})
	if err == nil {
		log.Printf("addMember user(%v) already member in group(%v)\n", session.UserID, session.GroupID)
		return c.SendString("user already a member")
	}
	if err != sql.ErrNoRows {
		log.Printf("addMember error getting member info for user(%v) in group(%v)", session.UserID, session.GroupID)
		return fiber.DefaultErrorHandler(c, err)
	}

	if err = db.Queries.UpsertGroupMember(ctx, generated.UpsertGroupMemberParams{
		GroupID: session.GroupID,
		UserID:  session.UserID,
		State:   string(MemberStateAdding),
		Role:    string(MemberRoleRegular),
	}); err != nil {
		log.Printf("addMember failed to add member(%v) to group(%v)", session.UserID, session.GroupID)
		return err
	}

	return c.SendString("Member added")
}

type UpdateMemberState struct {
	State MemberState
}

func updateMemberState(c *fiber.Ctx, db *db.DB) error {
	ctx := context.Background()
	payload := new(UpdateMemberState)

	if err := c.BodyParser(payload); err != nil {
		log.Printf("updateMemberState failed to parse body")
		return fiber.DefaultErrorHandler(c, err)
	}

	session := mustGetGroupSession(c)

	if err := db.Queries.UpsertGroupMember(ctx, generated.UpsertGroupMemberParams{
		GroupID: session.GroupID,
		UserID:  session.UserID,
		State:   string(payload.State),
		Role:    session.MemberRole,
	}); err != nil {
		log.Printf("updateMemberState failed to update member state group(%v) for user(%v)", session.GroupID, session.UserID)
		return fiber.DefaultErrorHandler(c, err)
	}

	go checkGroupState(session.GroupID, db)

	return c.SendString("Member updated")
}

func removeMember(c *fiber.Ctx, db *db.DB) error {
	ctx := context.Background()

	session := mustGetGroupSession(c)

	memberUserId, err := strconv.ParseInt(c.Query("member_id"), 10, 64)
	if err != nil {
		log.Println("addMember failed to convert member_id id")
		return fiber.DefaultErrorHandler(c, err)
	}

	if err != nil {
		log.Printf("removeMember error getting member info for user(%v) in group(%v)", session.UserID, session.GroupID)
		return fiber.DefaultErrorHandler(c, err)
	}

	if session.MemberRole != string(MemberRoleAdmin) {
		log.Printf("removeMember user(%v) is not an admin", session.UserID)
		return fiber.ErrUnauthorized
	}

	if err = db.Queries.DeleteGroupMember(ctx, generated.DeleteGroupMemberParams{
		GroupID: session.GroupID,
		UserID:  memberUserId,
	}); err != nil {
		log.Printf("removeMember failed to remove member(%v) from group(%v)", memberUserId, session.GroupID)
		return fiber.DefaultErrorHandler(c, err)
	}

	return c.SendString("Member removed")
}
