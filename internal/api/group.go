package api

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"strconv"

	"github.com/JHelar/PiggyPay.git/internal/db"
	"github.com/JHelar/PiggyPay.git/internal/db/generated"
	"github.com/JHelar/PiggyPay.git/pkg/utils"
	"github.com/gofiber/fiber/v2"
)

type ColorTheme string
type GroupState string
type MemberState string
type MemberRole string
type TransactionState string

const (
	ColorThemeBlue  ColorTheme = "color_theme:blue"
	ColorThemeGreen ColorTheme = "color_theme:green"
)

const (
	GroupStateExpenses   GroupState = "group_state:expenses"
	GroupStateGenerating GroupState = "group_state:generating"
	GroupStatePaying     GroupState = "group_state:paying"
	GroupStateResolved   GroupState = "group_state:resolved"
)

const (
	MemberRoleAdmin   MemberRole = "member_role:admin"
	MemberRoleRegular MemberRole = "member_role:regular"
)

const (
	MemberStateAdding   MemberState = "member_state:adding"
	MemberStateReady    MemberState = "member_state:ready"
	MemberStateResolved MemberState = "member_state:resolved"
	MemberStatePaying   MemberState = "member_state:paying"
)

const (
	TransactionStateUnpaid TransactionState = "transaction_state:unpaid"
	TransactionStatePaid   TransactionState = "transaction_state:Paid"
)

func canModifyExpenses(groupState GroupState) bool {
	return groupState == GroupStateExpenses
}

const GroupSessionLocal = "groupSession"
const GroupIdParam = "groupId"

func verifyGroupMember(c *fiber.Ctx, db *db.DB) error {
	ctx := context.Background()

	groupId, err := strconv.ParseInt(c.Params(GroupIdParam), 10, 64)
	if err != nil {
		log.Printf("verifyGroup failed to convert group id")
		return fiber.ErrInternalServerError
	}

	session := mustGetUserSession(c)

	member, err := db.Queries.GetGroupMember(ctx, generated.GetGroupMemberParams{
		GroupID: groupId,
		UserID:  session.UserID.Int64,
	})

	if err != nil {
		log.Printf("verifyGroup user(%v) cannot access group(%v)", session.UserID.Int64, groupId)
		return fiber.ErrUnauthorized
	}

	c.Locals(GroupSessionLocal, member)
	return c.Next()
}

func mustGetGroupSession(c *fiber.Ctx) generated.GetGroupMemberRow {
	return c.Locals(GroupSessionLocal).(generated.GetGroupMemberRow)
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

	session := mustGetGroupSession(c)

	if err := c.BodyParser(payload); err != nil {
		log.Printf("updateGroup failed to parse payload")
		return fiber.DefaultErrorHandler(c, err)
	}

	group, err := db.Queries.UpdateGroupById(ctx, generated.UpdateGroupByIdParams{
		DisplayName: payload.DisplayName,
		ColorTheme:  payload.ColorTheme,
		ID:          session.GroupID,
		UserID:      session.UserID,
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

	session := mustGetGroupSession(c)

	if err := db.Queries.DeleteGroupById(ctx, generated.DeleteGroupByIdParams{
		ID:     session.GroupID,
		Role:   string(MemberRoleAdmin),
		UserID: session.UserID,
	}); err != nil {
		log.Printf("deleteGroup failed to delete group\n")
		return fiber.DefaultErrorHandler(c, err)
	}

	return c.SendString("Group deleted")
}

func checkGroupReadyState(groupId int64, db *db.DB) {
	ctx := context.Background()
	if err := db.RunAsTransaction(ctx, func(q *generated.Queries) error {
		err := q.UpdateGroupStateIfMembersIsInState(ctx, generated.UpdateGroupStateIfMembersIsInStateParams{
			ID:      groupId,
			State:   string(GroupStateGenerating),
			State_2: string(GroupStateExpenses),
			State_3: string(MemberStateReady),
		})

		if err == sql.ErrNoRows {
			return fmt.Errorf("checkGroupReadyState group not updated")
		}

		// Create members
		members, err := q.GetGroupMemberTotals(ctx, groupId)

		if err != nil {
			return fmt.Errorf("checkGroupReadyState failed to get group member totals")
		}

		groupTotal := 0.0
		for _, member := range members {
			groupTotal = groupTotal + member.Total.(float64)
		}

		payPerMember := groupTotal / float64(len(members))
		var receipts []generated.CreateReceiptRow

		for _, member := range members {
			total_dept := member.Total.(float64) - payPerMember

			receipt, err := q.CreateReceipt(ctx, generated.CreateReceiptParams{
				GroupID:     groupId,
				UserID:      member.UserID,
				TotalDept:   total_dept,
				CurrentDept: total_dept,
			})

			if err != nil {
				return err
			}

			receipts = append(receipts, receipt)
		}

		transactions, err := utils.BalanceReceipts(receipts)
		if err != nil {
			return fmt.Errorf("checkGroupReadyState failed to balance receipts, %v", err.Error())
		}
		for _, transaction := range transactions {
			q.CreateMemberTransaction(ctx, generated.CreateMemberTransactionParams{
				FromReceiptID: transaction.FromID,
				ToReceiptID:   transaction.ToID,
				State:         string(TransactionStateUnpaid),
				Amount:        transaction.Cost,
			})
		}

		if err := q.UpdateGroupStateIfMembersIsInState(ctx, generated.UpdateGroupStateIfMembersIsInStateParams{
			ID:      groupId,
			State:   string(GroupStatePaying),
			State_2: string(GroupStateGenerating),
			State_3: string(MemberStateReady),
		}); err != nil {
			return fmt.Errorf("checkGroupReadyState error updating group state: %v", err.Error())
		}
		return nil
	}); err != nil {
		log.Printf("checkGroupReadyState failed to create receipts: %v", err.Error())
		return
	}
}
