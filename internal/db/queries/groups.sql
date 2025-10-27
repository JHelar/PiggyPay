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
    WHERE group_members.user_id=?
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

-- name: GetGroupById :one
SELECT groups.id AS id,
    groups.display_name AS group_name,
    groups.state AS group_state,
    groups.color_theme AS group_theme,
    groups.created_at AS created_at,
    groups.updated_at AS updated_at,
    group_members.role AS member_role,
    (
        SELECT IFNULL(SUM(group_expenses.cost), 0.0)
        FROM group_expenses
        WHERE group_expenses.group_id = groups.id
    ) AS total_expenses
    FROM groups
    INNER JOIN group_members
        ON group_members.group_id=groups.id
    WHERE groups.id=? AND group_members.user_id=?
    LIMIT 1;

-- name: DeleteGroupById :exec
DELETE FROM groups
    WHERE id=(
        SELECT groups.id
        FROM groups
        INNER JOIN group_members
            ON groups.id=group_members.group_id
        WHERE groups.id=? AND group_members.role=? AND group_members.user_id=?
        LIMIT 1
    );