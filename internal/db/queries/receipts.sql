-- name: CreateReceipt :one
INSERT INTO group_member_receipts (group_id, user_id, total_dept, current_dept) VALUES (?, ?, ?, ?)
    RETURNING id, user_id, total_dept;