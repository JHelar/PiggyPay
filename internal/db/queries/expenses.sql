-- name: GetGroupExpenses :many
SELECT 
    group_expenses.id AS id,
    group_expenses.name AS name,
    group_expenses.cost as cost,
    users.first_name AS first_name,
    users.last_name AS last_name
    FROM group_expenses
        INNER JOIN users
            ON users.id=group_expenses.user_id
    WHERE group_expenses.group_id=?
    AND EXISTS (
        SELECT 1
        FROM group_members group_members_check
        WHERE group_members_check.group_id=group_expenses.group_id
        AND group_members_check.user_id=?
    );

-- name: AddExpense :one
INSERT INTO group_expenses (name, cost, group_id, user_id) 
    VALUES (?, ?, ?, ?)
    RETURNING 
        id, 
        name, 
        cost,
        (
            SELECT users.first_name
            FROM users
            WHERE users.id = group_expenses.user_id
        ) AS first_name,
        (
            SELECT users.last_name
            FROM users
            WHERE users.id = group_expenses.user_id
        ) AS last_name;