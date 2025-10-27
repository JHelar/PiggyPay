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

func addMember(c *fiber.Ctx, db *db.DB) error {
	ctx := context.Background()

	session := mustGetUserSession(c)

	groupId, err := strconv.ParseInt(c.Params("id"), 10, 64)
	if err != nil {
		log.Println("addMember failed to convert group id")
		return fiber.DefaultErrorHandler(c, err)
	}

	_, err = db.Queries.GetGroupMember(ctx, generated.GetGroupMemberParams{
		GroupID: groupId,
		UserID:  session.UserID.Int64,
	})
	if err == nil {
		log.Printf("addMember user(%v) already member in group(%v)\n", session.UserID.Int64, groupId)
		_, err = c.WriteString("user already a member")
		return err
	}
	if err != sql.ErrNoRows {
		log.Printf("addMember error getting member info for user(%v) in group(%v)", session.UserID.Int64, groupId)
		return fiber.DefaultErrorHandler(c, err)
	}

	if err = db.Queries.UpsertGroupMember(ctx, generated.UpsertGroupMemberParams{
		GroupID: groupId,
		UserID:  session.UserID.Int64,
		State:   string(MemberStateAdding),
		Role:    string(MemberRoleRegular),
	}); err != nil {
		log.Println("addMember failed to add member(%v) to group(%v)", session.UserID.Int64, groupId)
		return err
	}

	_, err = c.WriteString("Member added")
	return err
}

func removeMember(c *fiber.Ctx, db *db.DB) error {
	ctx := context.Background()

	session := mustGetUserSession(c)

	groupId, err := strconv.ParseInt(c.Params("id"), 10, 64)
	if err != nil {
		log.Println("addMember failed to convert group id")
		return fiber.DefaultErrorHandler(c, err)
	}

	memberUserId, err := strconv.ParseInt(c.Query("member_id"), 10, 64)
	if err != nil {
		log.Println("addMember failed to convert member_id id")
		return fiber.DefaultErrorHandler(c, err)
	}

	user_member, err := db.Queries.GetGroupMember(ctx, generated.GetGroupMemberParams{
		GroupID: groupId,
		UserID:  session.UserID.Int64,
	})

	if err != nil {
		log.Printf("removeMember error getting member info for user(%v) in group(%v)", session.UserID.Int64, groupId)
		return fiber.DefaultErrorHandler(c, err)
	}

	if user_member.MemberRole != string(MemberRoleAdmin) {
		log.Printf("removeMember user(%v) is not an admin", session.UserID.Int64)
		return fiber.ErrUnauthorized
	}

	if err = db.Queries.DeleteGroupMember(ctx, generated.DeleteGroupMemberParams{
		GroupID: groupId,
		UserID:  memberUserId,
	}); err != nil {
		log.Printf("removeMember failed to remove member(%v) from group(%v)", memberUserId, groupId)
		return fiber.DefaultErrorHandler(c, err)
	}

	_, err = c.WriteString("Member removed")
	return err
}
