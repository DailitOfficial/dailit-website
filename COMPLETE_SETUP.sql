-- COMPLETE PASSWORD TRACKING SETUP
-- Run this entire script in your Supabase SQL Editor
-- This creates all tables, functions, and views in the correct order

-- Step 1: Create admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Password reset tracking
    password_reset_count INTEGER DEFAULT 0,
    last_password_reset TIMESTAMP WITH TIME ZONE,
    password_reset_locked_until TIMESTAMP WITH TIME ZONE,
    -- Password change tracking
    password_last_changed TIMESTAMP WITH TIME ZONE,
    password_change_count INTEGER DEFAULT 0,
    password_never_changed BOOLEAN DEFAULT true
);

-- Step 2: Create password reset tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    token_hash TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- Step 3: Create password history table
CREATE TABLE IF NOT EXISTS admin_password_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    change_type TEXT NOT NULL CHECK (change_type IN ('reset', 'manual_update', 'initial_setup')),
    changed_by TEXT, -- 'self' or admin email who made the change
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT
);

-- Step 4: Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_email ON password_reset_tokens(email);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires ON password_reset_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_password_history_admin_user ON admin_password_history(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_password_history_created ON admin_password_history(created_at);

-- Step 5: Create functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 6: Create triggers
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Step 7: Create password change tracking function
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

-- Step 8: Create cleanup function
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS void AS $$
BEGIN
    DELETE FROM password_reset_tokens 
    WHERE expires_at < NOW() - INTERVAL '1 day';
END;
$$ language 'plpgsql';

-- Step 9: Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_password_history ENABLE ROW LEVEL SECURITY;

-- Step 10: Create RLS policies
-- Drop existing policies first
DROP POLICY IF EXISTS "Allow password reset check" ON admin_users;
DROP POLICY IF EXISTS "Allow admin self access" ON admin_users;
DROP POLICY IF EXISTS "Allow password reset token creation" ON password_reset_tokens;
DROP POLICY IF EXISTS "Allow password reset token read" ON password_reset_tokens;
DROP POLICY IF EXISTS "Allow admin password history read" ON admin_password_history;
DROP POLICY IF EXISTS "Allow service role full access admin_users" ON admin_users;
DROP POLICY IF EXISTS "Allow service role full access tokens" ON password_reset_tokens;
DROP POLICY IF EXISTS "Allow service role full access history" ON admin_password_history;

-- Create new policies
CREATE POLICY "Allow password reset check" ON admin_users
FOR SELECT USING (is_active = true);

CREATE POLICY "Allow admin self access" ON admin_users
FOR ALL USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "Allow password reset token creation" ON password_reset_tokens
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow password reset token read" ON password_reset_tokens
FOR SELECT USING (true);

CREATE POLICY "Allow admin password history read" ON admin_password_history
FOR SELECT USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "Allow service role full access admin_users" ON admin_users
FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Allow service role full access tokens" ON password_reset_tokens
FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Allow service role full access history" ON admin_password_history
FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Step 11: Insert initial admin user
INSERT INTO admin_users (email, full_name, role, is_active, password_never_changed)
VALUES ('admin@dailit.com', 'Admin User', 'super_admin', true, true)
ON CONFLICT (email) DO NOTHING;

-- Step 12: Create views (AFTER tables exist)
-- Drop views first if they exist
DROP VIEW IF EXISTS admin_password_activity;
DROP VIEW IF EXISTS admin_users_summary;

-- Create password activity view
CREATE OR REPLACE VIEW admin_password_activity AS
SELECT 
    aph.id,
    aph.email,
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
    password_reset_count,
    last_password_reset,
    password_change_count,
    password_last_changed,
    password_never_changed,
    CASE 
        WHEN password_never_changed THEN 'Never changed'
        WHEN password_last_changed > NOW() - INTERVAL '30 days' THEN 'Recently changed'
        WHEN password_last_changed > NOW() - INTERVAL '90 days' THEN 'Changed within 3 months'
        ELSE 'Needs update'
    END as password_status
FROM admin_users
ORDER BY created_at DESC;

-- Step 13: Add comments
COMMENT ON TABLE admin_users IS 'Admin users with password tracking';
COMMENT ON TABLE admin_password_history IS 'History of all password changes for admin users';
COMMENT ON FUNCTION record_password_change IS 'Call this function whenever a password is changed to track it in the database';

-- Step 14: Test the setup
SELECT 'Setup completed successfully!' as status;
SELECT COUNT(*) as admin_users_count FROM admin_users;
SELECT COUNT(*) as password_history_count FROM admin_password_history;

-- Test views
SELECT 'Testing views...' as status;
SELECT * FROM admin_users_summary LIMIT 1;
SELECT * FROM admin_password_activity LIMIT 1; 