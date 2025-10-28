-- name: UpsertGroupMember :exec
INSERT INTO group_members (group_id, user_id, state, role) VALUES (?, ?, ?, ?)
    ON CONFLICT (group_id, user_id)
        DO UPDATE 
            SET 
                state=excluded.state,
                role=excluded.role,
                updated_at=CURRENT_TIMESTAMP;

-- name: GetGroupMember :one
SELECT group_id, user_id, state AS member_state, role AS member_role FROM group_members
    WHERE group_id=? AND user_id=?
    LIMIT 1;

-- name: GetGroupMembers :many
SELECT 
    users.first_name AS first_name, 
    users.last_name AS last_name, 
    users.id AS member_id, 
    group_members.role AS member_role
    FROM group_members
    INNER JOIN users
        ON users.id=group_members.user_id
    WHERE 
        group_members.group_id=?
    AND EXISTS (
        SELECT 1
        FROM group_members group_members_check
        WHERE group_members_check.group_id=group_members.group_id
        AND group_members_check.user_id=?
    );

        
-- name: DeleteGroupMember :exec
DELETE FROM group_members
    WHERE group_id=? AND user_id=?;