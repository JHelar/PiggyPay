-- name: CreateSignInToken :one
INSERT INTO user_sign_in_tokens (email, expires_at) VALUES (?, ?)
    ON CONFLICT (email) DO UPDATE SET expires_at=excluded.expires_at
    RETURNING id;

-- name: GetSignInToken :one
DELETE FROM user_sign_in_tokens
    WHERE id=?
    RETURNING email, expires_at;

-- name: CreateNewUserSession :one
INSERT INTO user_sessions (user_id, email, expires_at) VALUES (?, ?, ?)
    ON CONFLICT (email) DO UPDATE SET expires_at=excluded.expires_at
    RETURNING id;

-- name: CreateExistingUserSession :one
INSERT INTO user_sessions (user_id, email, expires_at) VALUES (?, ?, ?)
    ON CONFLICT (user_id) DO UPDATE SET 
        expires_at=excluded.expires_at
    RETURNING id;

-- name: UpdateUserSession :exec
UPDATE user_sessions
    SET
        expires_at=?,
        email=null,
        user_id=?
    WHERE id=?;

-- name: GetUserSessionById :one
SELECT id, user_id, email, expires_at FROM user_sessions
    WHERE id=?;

-- name: DeleteUserSessionById :exec
DELETE FROM user_sessions
    WHERE id=?;

-- name: GetUserByEmail :one
SELECT * FROM users
    WHERE email=?;

-- name: GetUserById :one
SELECT first_name, last_name, phone_number, email FROM users
    WHERE id=?;

-- name: CreateUser :one
INSERT INTO users (first_name, last_name, phone_number, email) VALUES (?, ?, ?, ?)
    RETURNING id;

-- name: UpdateUser :one
UPDATE users
    SET
        first_name=?,
        last_name=?,
        phone_number=?,
        email=?,
        updated_at=CURRENT_TIMESTAMP
    WHERE users.id=?
    RETURNING first_name, last_name, phone_number, email;

-- name: DeleteUser :exec
DELETE FROM users
    WHERE id=?;