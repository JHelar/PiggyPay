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

type ColorTheme string
type GroupState string
type MemberState string
type MemberRole string

const (
	ColorThemeBlue  ColorTheme = "color_theme:blue"
	ColorThemeGreen ColorTheme = "color_theme:green"
)

const (
	GroupStateExpenses GroupState = "group_state:expenses"
	GroupStateWaiting  GroupState = "group_state:waiting"
	GroupStatePaying   GroupState = "group_state:paying"
	GroupStateResolved GroupState = "group_state:resolved"
)

const (
	MemberRoleAdmin   MemberRole = "member_role:admin"
	MemberRoleRegular MemberRole = "member_role:regular"
)

const (
	MemberStateAdding   MemberState = "member_state:adding"
	MemberStateResolved MemberState = "member_state:resolved"
	MemberStatePaying   MemberState = "member_state:paying"
)

func canModifyExpenses(groupState GroupState) bool {
	if groupState == GroupStateExpenses {
		return true
	}
	if groupState == GroupStateWaiting {
		return true
	}

	return false
}

const GroupSessionLocal = "groupSession"
const GroupIdParam = "groupId"

func verifyGroup(c *fiber.Ctx, db *db.DB) error {
	ctx := context.Background()

	groupId, err := strconv.ParseInt(c.Params(GroupIdParam), 10, 64)
	if err != nil {
		log.Printf("verifyGroup failed to convert group id")
		return fiber.ErrInternalServerError
	}

	session := mustGetUserSession(c)

	group, err := db.Queries.GetGroupById(ctx, generated.GetGroupByIdParams{
		ID:     groupId,
		UserID: session.UserID.Int64,
	})

	if err != nil {
		log.Printf("verifyGroup user(%v) cannot access group(%v)", session.UserID.Int64, groupId)
		return fiber.ErrUnauthorized
	}

	c.Locals(GroupSessionLocal, group)
	return c.Next()
}

func mustGetGroupSession(c *fiber.Ctx) generated.GetGroupByIdRow {
	return c.Locals(GroupSessionLocal).(generated.GetGroupByIdRow)
}

type CreateGroup struct {
	DisplayName string `json:"display_name" xml:"display_name" form:"display_name"`
	ColorTheme  string `json:"color_theme" xml:"color_theme" form:"color_theme"`
}

func createGroup(c *fiber.Ctx, db *db.DB) error {
	ctx := context.Background()
	payload := new(CreateGroup)

	if err := c.BodyParser(payload); err != nil {
		return err
	}

	session := mustGetUserSession(c)

	user_groups, err := db.Queries.GetGroupsByUserId(ctx, session.UserID.Int64)
	if err != nil {
		log.Printf("createGroup: %v\n", err.Error())
		return fiber.ErrInternalServerError
	}

	for _, groups := range user_groups {
		if groups.GroupName == payload.DisplayName {
			log.Printf("createGroup: name already in use %s\n", payload.DisplayName)
			return fiber.NewError(
				fiber.ErrBadRequest.Code,
				"name already in use",
			)
		}
	}

	group_result, err := db.Queries.CreateGroup(ctx, generated.CreateGroupParams{
		DisplayName: payload.DisplayName,
		ColorTheme:  payload.ColorTheme,
		State:       string(GroupStateExpenses),
	})

	if err != nil {
		log.Printf("createGroup: error creating group, %s", err.Error())
		return fiber.ErrInternalServerError
	}

	if err := db.Queries.UpsertGroupMember(ctx, generated.UpsertGroupMemberParams{
		GroupID: group_result.ID,
		UserID:  session.UserID.Int64,
		State:   string(MemberStateAdding),
		Role:    string(MemberRoleAdmin),
	}); err != nil {
		log.Printf("createGroup: error creating group admin member %s", err.Error())
		return fiber.ErrInternalServerError
	}

	return c.JSON(fiber.Map{
		"group_id":    group_result.ID,
		"color_theme": group_result.ColorTheme,
	})
}

func getGroups(c *fiber.Ctx, db *db.DB) error {
	ctx := context.Background()

	session := mustGetUserSession(c)

	groups, err := db.Queries.GetGroupsByUserId(ctx, session.UserID.Int64)
	if err != nil {
		log.Printf("getGroups, error getting user groups")
		return fiber.ErrInternalServerError
	}

	return c.JSON(groups)
}

func getGroup(c *fiber.Ctx, db *db.DB) error {
	group := mustGetGroupSession(c)

	return c.JSON(group)
}

type UpdateGroup struct {
	DisplayName string `json:"display_name" xml:"display_name" form:"display_name"`
	ColorTheme  string `json:"color_theme" xml:"color_theme" form:"color_theme"`
}

func updateGroup(c *fiber.Ctx, db *db.DB) error {
	ctx := context.Background()
	payload := new(UpdateGroup)

	session := mustGetUserSession(c)

	groupSession := mustGetGroupSession(c)

	if err := c.BodyParser(payload); err != nil {
		log.Printf("updateGroup failed to parse payload")
		return fiber.DefaultErrorHandler(c, err)
	}

	group, err := db.Queries.UpdateGroupById(ctx, generated.UpdateGroupByIdParams{
		DisplayName: payload.DisplayName,
		ColorTheme:  payload.ColorTheme,
		ID:          groupSession.ID,
		UserID:      session.UserID.Int64,
	})

	if err != nil && err == sql.ErrNoRows {
		log.Println("updateGroup user cannot update group")
		return fiber.ErrUnauthorized
	}

	if err != nil {
		log.Println("updateGroup unable to update group")
		return fiber.ErrInternalServerError
	}

	return c.JSON(group)
}

func deleteGroup(c *fiber.Ctx, db *db.DB) error {
	ctx := context.Background()

	session := mustGetUserSession(c)
	group := mustGetGroupSession(c)

	if err := db.Queries.DeleteGroupById(ctx, generated.DeleteGroupByIdParams{
		ID:     group.ID,
		Role:   string(MemberRoleAdmin),
		UserID: session.UserID.Int64,
	}); err != nil {
		log.Printf("deleteGroup failed to delete group\n")
		return fiber.DefaultErrorHandler(c, err)
	}

	_, err := c.WriteString("Group deleted")
	return err
}
