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

	session := mustGetUserSession(c)
	group := mustGetGroupSession(c)

	members, err := db.Queries.GetGroupMembers(ctx, generated.GetGroupMembersParams{
		GroupID: group.ID,
		UserID:  session.UserID.Int64,
	})
	if err == sql.ErrNoRows || len(members) == 0 {
		log.Printf("getMembers user(%v) is not member in group(%v)\n", session.UserID.Int64, group.ID)
		return fiber.ErrUnauthorized
	}

	if err != nil {
		log.Printf("getMembers error getting members for group(%v)\n", group.ID)
		return fiber.DefaultErrorHandler(c, err)
	}

	return c.JSON(members)
}

func addMember(c *fiber.Ctx, db *db.DB) error {
	ctx := context.Background()

	session := mustGetUserSession(c)
	group := mustGetGroupSession(c)

	_, err := db.Queries.GetGroupMember(ctx, generated.GetGroupMemberParams{
		GroupID: group.ID,
		UserID:  session.UserID.Int64,
	})
	if err == nil {
		log.Printf("addMember user(%v) already member in group(%v)\n", session.UserID.Int64, group.ID)
		_, err = c.WriteString("user already a member")
		return err
	}
	if err != sql.ErrNoRows {
		log.Printf("addMember error getting member info for user(%v) in group(%v)", session.UserID.Int64, group.ID)
		return fiber.DefaultErrorHandler(c, err)
	}

	if err = db.Queries.UpsertGroupMember(ctx, generated.UpsertGroupMemberParams{
		GroupID: group.ID,
		UserID:  session.UserID.Int64,
		State:   string(MemberStateAdding),
		Role:    string(MemberRoleRegular),
	}); err != nil {
		log.Printf("addMember failed to add member(%v) to group(%v)", session.UserID.Int64, group.ID)
		return err
	}

	_, err = c.WriteString("Member added")
	return err
}

func removeMember(c *fiber.Ctx, db *db.DB) error {
	ctx := context.Background()

	session := mustGetUserSession(c)
	group := mustGetGroupSession(c)

	memberUserId, err := strconv.ParseInt(c.Query("member_id"), 10, 64)
	if err != nil {
		log.Println("addMember failed to convert member_id id")
		return fiber.DefaultErrorHandler(c, err)
	}

	user_member, err := db.Queries.GetGroupMember(ctx, generated.GetGroupMemberParams{
		GroupID: group.ID,
		UserID:  session.UserID.Int64,
	})

	if err != nil {
		log.Printf("removeMember error getting member info for user(%v) in group(%v)", session.UserID.Int64, group.ID)
		return fiber.DefaultErrorHandler(c, err)
	}

	if user_member.MemberRole != string(MemberRoleAdmin) {
		log.Printf("removeMember user(%v) is not an admin", session.UserID.Int64)
		return fiber.ErrUnauthorized
	}

	if err = db.Queries.DeleteGroupMember(ctx, generated.DeleteGroupMemberParams{
		GroupID: group.ID,
		UserID:  memberUserId,
	}); err != nil {
		log.Printf("removeMember failed to remove member(%v) from group(%v)", memberUserId, group.ID)
		return fiber.DefaultErrorHandler(c, err)
	}

	_, err = c.WriteString("Member removed")
	return err
}
