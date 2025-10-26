-- name: GetGroupsByUserId :many
SELECT groups.id as id, groups.display_name as group_name, groups.state as group_state, groups.color_theme as group_theme, groups.created_at as created_at, groups.updated_at as updated_at FROM groups
    INNER JOIN group_members
        ON group_members.group_id=groups.id
    WHERE group_members.user_id=?
    ORDER BY group_members.created_at DESC;

-- name: CreateGroup :one
INSERT INTO groups (display_name, state, color_theme) VALUES (?, ?, ?)
    RETURNING id, display_name, state, color_theme, created_at, updated_at;

-- name: UpsertGroupMember :exec
INSERT INTO group_members (group_id, user_id, state, role) VALUES (?, ?, ?, ?)
    ON CONFLICT (group_id, user_id)
        DO UPDATE SET state=excluded.state, role=excluded.state, updated_at=excluded.state;

-- name: GetGroupById :one
SELECT groups.id as id, groups.display_name as group_name, groups.state as group_state, groups.color_theme as group_theme, groups.created_at as created_at, groups.updated_at as updated_at, group_members.role as member_role FROM groups
    INNER JOIN group_members
        ON group_members.group_id=groups.id
    WHERE groups.id=? AND group_members.user_id=?
    LIMIT 1;