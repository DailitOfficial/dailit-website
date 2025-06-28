-- Fix for the admin_password_activity view error
-- Run this if you get: 42703: column "email" does not exist

-- Drop and recreate the view with correct column references
DROP VIEW IF EXISTS admin_password_activity;

CREATE OR REPLACE VIEW admin_password_activity AS
SELECT 
    aph.id,
    aph.email,  -- Use email from password_history table, not admin_users
    au.full_name,
    aph.change_type,
    aph.changed_by,
    aph.created_at,
    aph.ip_address,
    aph.notes,
    au.password_change_count,
    au.password_last_changed,
    au.password_never_changed
FROM admin_password_history aph
JOIN admin_users au ON aph.admin_user_id = au.id
ORDER BY aph.created_at DESC;

-- Test the view
SELECT * FROM admin_password_activity LIMIT 5; 