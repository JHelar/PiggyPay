-- name: CreateNewUserSession :one
INSERT INTO user_sessions (user_email, expires_at) VALUES (?, ?)
    ON CONFLICT (user_email) DO UPDATE SET expires_at=excluded.expires_at
    RETURNING id;

-- name: CreateUserSession :one
INSERT INTO user_sessions (user_id, user_email, expires_at) VALUES (?, ?, ?)
    ON CONFLICT (user_email, user_id) DO UPDATE SET expires_at=excluded.expires_at
    RETURNING id;