-- name: CreateMemberTransaction :exec
INSERT INTO group_member_transactions (from_receipt_id, to_receipt_id, state, amount) VALUES (?, ?, ?, ?);