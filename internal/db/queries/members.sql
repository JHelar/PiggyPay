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
        
-- name: DeleteGroupMember :exec
DELETE FROM group_members
    WHERE group_id=? AND user_id=?;