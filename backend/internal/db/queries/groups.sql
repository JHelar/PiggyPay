-- name: GetGroupsByUserId :many
SELECT groups.id AS id,
    groups.display_name AS group_name,
    groups.state AS group_state,
    groups.color_theme AS group_theme,
    groups.created_at AS created_at,
    groups.updated_at AS updated_at,
    (
        SELECT IFNULL(SUM(group_expenses.cost), 0.0)
        FROM group_expenses
        WHERE group_expenses.group_id = groups.id
    ) AS total_expenses
    FROM groups
    INNER JOIN group_members
        ON group_members.group_id=groups.id
    WHERE group_members.user_id=? AND groups.state!='group_state:archived'
    ORDER BY group_members.created_at DESC;

-- name: CreateGroup :one
INSERT INTO groups (display_name, state, color_theme) VALUES (?, ?, ?)
    RETURNING id, display_name, state, color_theme, created_at, updated_at;

-- name: UpdateGroupById :one
UPDATE groups
    SET 
        display_name=?,
        color_theme=?,
        updated_at=CURRENT_TIMESTAMP
    WHERE id = (
        SELECT groups.id
        FROM groups
        INNER JOIN group_members 
            ON group_members.group_id=groups.id
        WHERE groups.id=? AND group_members.user_id=?
    )
    RETURNING id, display_name, state, color_theme, created_at, updated_at;

-- name: UpdateGroupState :exec
UPDATE groups
    SET
        state=?,
        updated_at=CURRENT_TIMESTAMP
    WHERE id = (
        SELECT groups.id
        FROM groups
        INNER JOIN group_members 
            ON group_members.group_id=groups.id
        WHERE groups.id=? AND group_members.user_id=?
    );

-- name: GetGroupForUserById :one
SELECT groups.id AS id,
    groups.display_name AS group_name,
    groups.state AS group_state,
    groups.color_theme AS group_theme,
    groups.created_at AS created_at,
    groups.updated_at AS updated_at,
    group_members.role AS member_role,
    group_members.state AS member_state,
    (
        SELECT IFNULL(SUM(group_expenses.cost), 0.0)
        FROM group_expenses
        WHERE group_expenses.group_id = groups.id
    ) AS total_expenses
    FROM groups
    INNER JOIN group_members
        ON group_members.group_id=groups.id
    WHERE groups.id=? AND group_members.user_id=? AND groups.state!='group_state:archived'
    LIMIT 1;

-- name: UpdateGroupStateById :exec
UPDATE groups
SET state = @group_state, updated_at = CURRENT_TIMESTAMP
WHERE id = @group_id;

-- name: UpdateGroupStateIfMembersIsInState :exec
UPDATE groups
SET state = @to_group_state, updated_at = CURRENT_TIMESTAMP
WHERE id = @group_id AND groups.state = @check_group_state
    AND (
        SELECT COUNT(*) = SUM(group_members.state = @check_member_state)
        FROM group_members
        WHERE group_id=groups.id
    );

-- name: ArchiveGroupById :exec
UPDATE groups
SET state = "group_state:archived", updated_at = CURRENT_TIMESTAMP
    WHERE id IN (
        SELECT groups.id
        FROM groups
        INNER JOIN group_members
            ON groups.id=group_members.group_id
        WHERE groups.id=@group_id AND group_members.role=@member_role AND group_members.user_id=@user_id
    );

CREATE TRIGGER prevent_expense_insert_on_archived_group
BEFORE INSERT ON group_expenses
FOR EACH ROW
WHEN (
    SELECT state FROM groups WHERE id = NEW.group_id
) = 'group_state:archived'
BEGIN
    SELECT RAISE(FAIL, 'Cannot add expenses to an archived group');
END;

CREATE TRIGGER prevent_expense_update_on_archived_group
BEFORE UPDATE ON group_expenses
FOR EACH ROW
WHEN (
    SELECT state FROM groups WHERE id = OLD.group_id
) = 'group_state:archived'
BEGIN
    SELECT RAISE(FAIL, 'Cannot modify expenses of an archived group');
END;


CREATE TRIGGER prevent_update_on_archived_groups
BEFORE UPDATE ON groups
FOR EACH ROW
WHEN OLD.state = 'group_state:archived'
BEGIN
    SELECT RAISE(FAIL, 'Cannot modify an archived group');
END;