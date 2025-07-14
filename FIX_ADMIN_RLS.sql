-- Fix RLS policies for admin_users table - COMPLETE FIX
-- Run this in your Supabase SQL Editor to fix HTTP 500 errors

-- First, check if the table exists and current status
SELECT 'Checking admin_users table...' as status;
SELECT table_name FROM information_schema.tables WHERE table_name = 'admin_users';

-- Check current RLS status
SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE tablename = 'admin_users';

-- Check existing policies that might be causing conflicts
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies WHERE tablename = 'admin_users';

-- STEP 1: Drop ALL existing conflicting policies
DROP POLICY IF EXISTS "Admin users can view their own data" ON admin_users;
DROP POLICY IF EXISTS "Allow password reset check" ON admin_users;
DROP POLICY IF EXISTS "Allow public read for password reset" ON admin_users;
DROP POLICY IF EXISTS "Allow admin self access" ON admin_users;
DROP POLICY IF EXISTS "Allow authenticated users to read admin_users" ON admin_users;
DROP POLICY IF EXISTS "Super admins can manage admin users" ON admin_users;
DROP POLICY IF EXISTS "Allow service role full access admin_users" ON admin_users;

-- STEP 2: Temporarily disable RLS to test if that's the issue
-- ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- STEP 3: Create ONE simple policy that allows authenticated users to read
-- This should work for the admin login flow
CREATE POLICY "allow_authenticated_read" ON admin_users
    FOR SELECT 
    TO authenticated 
    USING (true);

-- STEP 4: Create a policy for service role (for admin operations)
CREATE POLICY "allow_service_role_all" ON admin_users
    FOR ALL 
    TO service_role 
    USING (true);

-- STEP 5: Create a policy for updating last_login
CREATE POLICY "allow_authenticated_update_login" ON admin_users
    FOR UPDATE 
    TO authenticated 
    USING (true)
    WITH CHECK (true);

-- STEP 6: Verify the new policies were created
SELECT 'New policies created:' as status;
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies WHERE tablename = 'admin_users';

-- STEP 7: Test the query that was failing
SELECT 'Testing the exact query that was failing...' as status;
SELECT email, full_name, role, is_active 
FROM admin_users 
WHERE email = 'admin@dailit.com' AND is_active = true;

-- STEP 8: Show all admin users to verify
SELECT 'All admin users:' as status;
SELECT id, email, full_name, role, is_active, created_at FROM admin_users;

-- STEP 9: Test count query
SELECT 'Testing count query...' as status;
SELECT COUNT(*) FROM admin_users WHERE email = 'admin@dailit.com' AND is_active = true;

-- If the above queries work in SQL editor but still fail in the app,
-- uncomment the line below to temporarily disable RLS entirely:
-- ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

SELECT 'RLS fix completed. Test your admin login now.' as final_status; 