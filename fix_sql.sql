-- Fix: Insert admin profile with proper UUID
INSERT INTO user_profiles (id, email, role, created_at)
VALUES ('00000000-0000-0000-0000-000000000000'::uuid, 'faical.benhaida@gmail.com', 'admin', now());