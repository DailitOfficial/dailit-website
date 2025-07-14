-- DIAGNOSE AND FIX ADMIN TABLES
-- Run this to check what exists and fix any issues

-- Step 1: Check if tables exist and their structure
SELECT 'Checking existing tables...' as status;

-- Check if admin_users table exists and its columns
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'admin_users' 
ORDER BY ordinal_position;

-- Check if admin_password_history table exists
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'admin_password_history' 
ORDER BY ordinal_position;

-- Step 2: Drop existing views that might be causing issues
DROP VIEW IF EXISTS admin_password_activity CASCADE;
DROP VIEW IF EXISTS admin_users_summary CASCADE;

-- Step 3: Ensure admin_users table has all required columns
-- Add missing columns if they don't exist
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS password_reset_count INTEGER DEFAULT 0;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS last_password_reset TIMESTAMP WITH TIME ZONE;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS password_reset_locked_until TIMESTAMP WITH TIME ZONE;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS password_last_changed TIMESTAMP WITH TIME ZONE;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS password_change_count INTEGER DEFAULT 0;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS password_never_changed BOOLEAN DEFAULT true;

-- Step 4: Create admin_password_history table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_password_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    change_type TEXT NOT NULL CHECK (change_type IN ('reset', 'manual_update', 'initial_setup')),
    changed_by TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT
);

-- Step 5: Create the record_password_change function
CREATE OR REPLACE FUNCTION record_password_change(
    user_email TEXT,
    change_type TEXT DEFAULT 'manual_update',
    changed_by_email TEXT DEFAULT NULL,
    user_ip INET DEFAULT NULL,
    user_agent_string TEXT DEFAULT NULL,
    change_notes TEXT DEFAULT NULL
)
RETURNS void AS $$
DECLARE
    user_id UUID;
BEGIN
    -- Get user ID
    SELECT id INTO user_id FROM admin_users WHERE email = user_email;
    
    IF user_id IS NULL THEN
        RAISE EXCEPTION 'Admin user not found: %', user_email;
    END IF;
    
    -- Update admin_users password tracking
    UPDATE admin_users 
    SET 
        password_last_changed = NOW(),
        password_change_count = COALESCE(password_change_count, 0) + 1,
        password_never_changed = false,
        updated_at = NOW()
    WHERE id = user_id;
    
    -- Insert into password history
    INSERT INTO admin_password_history (
        admin_user_id,
        email,
        change_type,
        changed_by,
        ip_address,
        user_agent,
        notes
    ) VALUES (
        user_id,
        user_email,
        change_type,
        COALESCE(changed_by_email, 'self'),
        user_ip,
        user_agent_string,
        COALESCE(change_notes, 'Password changed via admin interface')
    );
END;
$$ language 'plpgsql';

-- Step 6: Create views with explicit column checks
-- First, let's create a simple version of the password activity view
CREATE OR REPLACE VIEW admin_password_activity AS
SELECT 
    h.id,
    h.email,
    u.full_name,
    h.change_type,
    h.changed_by,
    h.created_at,
    h.ip_address,
    h.notes,
    u.password_change_count,
    u.password_last_changed,
    u.password_never_changed
FROM admin_password_history h
LEFT JOIN admin_users u ON h.admin_user_id = u.id
ORDER BY h.created_at DESC;

-- Create admin users summary view
CREATE OR REPLACE VIEW admin_users_summary AS
SELECT 
    id,
    email,
    full_name,
    role,
    is_active,
    last_login,
    created_at,
    updated_at,
    COALESCE(password_reset_count, 0) as password_reset_count,
    last_password_reset,
    COALESCE(password_change_count, 0) as password_change_count,
    password_last_changed,
    COALESCE(password_never_changed, true) as password_never_changed,
    CASE 
        WHEN COALESCE(password_never_changed, true) THEN 'Never changed'
        WHEN password_last_changed > NOW() - INTERVAL '30 days' THEN 'Recently changed'
        WHEN password_last_changed > NOW() - INTERVAL '90 days' THEN 'Changed within 3 months'
        ELSE 'Needs update'
    END as password_status
FROM admin_users
ORDER BY created_at DESC;

-- Step 7: Test the views
SELECT 'Testing views after fix...' as status;

-- Test admin_users_summary
SELECT COUNT(*) as admin_users_summary_count FROM admin_users_summary;

-- Test admin_password_activity (might be empty if no password changes yet)
SELECT COUNT(*) as password_activity_count FROM admin_password_activity;

-- Show current admin users
SELECT email, full_name, role, password_never_changed FROM admin_users_summary;

-- Step 8: Show final table structures
SELECT 'Final admin_users columns:' as info;
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'admin_users' ORDER BY ordinal_position;

SELECT 'Final admin_password_history columns:' as info;
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'admin_password_history' ORDER BY ordinal_position;

SELECT 'Setup completed successfully!' as final_status; 