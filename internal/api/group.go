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

	userId, ok := c.Locals(USER_ID).(int64)
	if !ok {
		return fiber.ErrUnauthorized
	}

	user_groups, err := db.Queries.GetGroupsByUserId(ctx, userId)
	if err != nil {
		log.Printf("createGroup: %v\n", err.Error())
		return fiber.ErrInternalServerError
	}

	for _, groups := range user_groups {
		if groups.GroupName == payload.DisplayName {
			log.Printf("createGroup: name already in use %s\n")
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
		UserID:  userId,
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

	userId, ok := c.Locals(USER_ID).(int64)
	if !ok {
		return fiber.ErrUnauthorized
	}

	groups, err := db.Queries.GetGroupsByUserId(ctx, userId)
	if err != nil {
		log.Printf("getGroups, error getting user groups")
		return fiber.ErrInternalServerError
	}

	return c.JSON(groups)
}

func getGroup(c *fiber.Ctx, db *db.DB) error {
	ctx := context.Background()

	userId, ok := c.Locals(USER_ID).(int64)
	if !ok {
		return fiber.ErrUnauthorized
	}

	groupId, err := strconv.ParseInt(c.Params("id"), 10, 64)
	if err != nil {
		log.Printf("getGroup failed to convert group id")
		return fiber.ErrInternalServerError
	}

	group, err := db.Queries.GetGroupById(ctx, generated.GetGroupByIdParams{
		ID:     groupId,
		UserID: userId,
	})

	if err != nil && err == sql.ErrNoRows {
		log.Printf("getGroup no group (%d) matched for user (%d)", groupId, userId)
		return fiber.ErrNotFound
	}

	return c.JSON(group)
}
