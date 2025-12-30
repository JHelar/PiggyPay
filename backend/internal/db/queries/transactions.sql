-- name: CreateMemberTransaction :exec
INSERT INTO group_member_transactions (from_receipt_id, to_receipt_id, state, amount) VALUES (?, ?, ?, ?);

-- name: GetUserGroupTransactions :many
SELECT 
    group_member_transactions.from_receipt_id AS from_receipt_id,
    group_member_transactions.to_receipt_id AS to_receipt_id, 
    group_member_transactions.state AS transaction_state, 
    group_member_transactions.amount AS transaction_amount,
    to_users.first_name AS to_first_name,
    to_users.last_name AS to_last_name,
    to_users.phone_number as to_phone_number
    FROM group_member_transactions
    INNER JOIN group_member_receipts from_receipts
        ON group_member_transactions.from_receipt_id=from_receipts.id
    INNER JOIN group_member_receipts to_receipts
        ON group_member_transactions.to_receipt_id=to_receipts.id
    INNER JOIN users to_users
        ON to_users.id=to_receipts.user_id
    WHERE
        from_receipts.user_id=?
        AND from_receipts.group_id=?;

-- name: GetUserGroupTransaction :one
SELECT 
    group_member_transactions.from_receipt_id AS from_receipt_id,
    group_member_transactions.to_receipt_id AS to_receipt_id, 
    group_member_transactions.state AS transaction_state, 
    group_member_transactions.amount AS transaction_amount,
    to_users.first_name AS to_first_name,
    to_users.last_name AS to_last_name,
    to_users.phone_number as to_phone_number
    FROM group_member_transactions
    INNER JOIN group_member_receipts from_receipts
        ON group_member_transactions.from_receipt_id=from_receipts.id
    INNER JOIN group_member_receipts to_receipts
        ON group_member_transactions.to_receipt_id=to_receipts.id
    INNER JOIN users to_users
        ON to_users.id=from_receipts.user_id
    WHERE
        group_member_transactions.id=?
        AND from_receipts.user_id=?
        AND from_receipts.group_id=?;
    
-- name: PayUserGroupTransaction :one
UPDATE group_member_transactions
SET state=@to_state,payed_at=CURRENT_TIMESTAMP
WHERE id=(
        SELECT id FROM group_member_transactions
            INNER JOIN group_member_receipts
                ON group_member_receipts.id=group_member_transactions.from_receipt_id
            WHERE 
                group_member_receipts.user_id=? 
                AND group_member_receipts.current_dept > 0
                AND group_member_receipts.group_id=?
                AND group_member_transactions.id=?
                AND group_member_transactions.state=@from_state
    )
RETURNING *;