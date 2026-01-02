-- name: UpsertGroupMember :exec
INSERT INTO group_members (group_id, user_id, state, role) VALUES (?, ?, ?, ?)
    ON CONFLICT (group_id, user_id)
        DO UPDATE 
            SET 
                state=excluded.state,
                role=excluded.role,
                updated_at=CURRENT_TIMESTAMP;

-- name: UpdateGroupMemberState :exec
UPDATE group_members
    SET
        state=@member_state,
        updated_at=CURRENT_TIMESTAMP
    WHERE
        user_id=@user_id AND
        group_id=@group_id;

-- name: GetGroupMember :one
SELECT group_id, user_id, state AS member_state, role AS member_role FROM group_members
    WHERE group_id=? AND user_id=?
    LIMIT 1;

-- name: GetGroupMemberInfoForUser :one
SELECT
    users.first_name AS first_name, 
    users.last_name AS last_name,  
    group_members.role AS member_role,
    group_members.state AS member_state,
    users.id AS member_id
    FROM group_members
    INNER JOIN users
        ON users.id=group_members.user_id
    WHERE 
        group_members.group_id=@group_id
    AND group_members.user_id=@user_id;


-- name: GetGroupMembersForUser :many
SELECT 
    users.first_name AS first_name, 
    users.last_name AS last_name,  
    group_members.role AS member_role,
    group_members.state AS member_state,
    users.id AS member_id
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

-- name: GetGroupMemberTotals :many
SELECT user_id, (
        SELECT IFNULL(SUM(group_expenses.cost), 0.0)
        FROM group_expenses
        WHERE group_expenses.group_id = group_members.group_id 
            AND group_expenses.user_id=group_members.user_id
    ) as total,
    group_members.role AS role,
    group_members.state AS state
    FROM group_members
    WHERE group_members.group_id=?;
        
-- name: DeleteGroupMember :exec
DELETE FROM group_members
    WHERE group_id=? AND user_id=?;