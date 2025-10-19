-- Создание тестового пользователя
-- Email: test@example.com
-- Пароль: password123

INSERT INTO users (email, password_hash, nickname, role, is_active, created_at, updated_at)
VALUES (
  'test@example.com',
  '$2b$10$3TEJ0/KdUFOjFHz4IALfYeLayMaj8gwseUKXcGchwkOR6q0S1bNOC',
  'Тестовый',
  'user',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE 
SET 
  password_hash = EXCLUDED.password_hash,
  nickname = EXCLUDED.nickname,
  updated_at = NOW();

