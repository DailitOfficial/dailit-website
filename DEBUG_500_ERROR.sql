-- DEBUG SCRIPT FOR HTTP 500 ERRORS
-- Run this in Supabase SQL Editor to identify the exact issue

-- STEP 1: Basic table check
SELECT 'STEP 1: Checking if admin_users table exists...' as status;
SELECT table_name FROM information_schema.tables WHERE table_name = 'admin_users';

-- STEP 2: Check table structure
SELECT 'STEP 2: Checking table structure...' as status;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'admin_users' 
ORDER BY ordinal_position;

-- STEP 3: Check RLS status
SELECT 'STEP 3: Checking RLS status...' as status;
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'admin_users';

-- STEP 4: Check existing policies
SELECT 'STEP 4: Checking existing RLS policies...' as status;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'admin_users';

-- STEP 5: Check if data exists
SELECT 'STEP 5: Checking if admin user data exists...' as status;
SELECT COUNT(*) as total_admin_users FROM admin_users;

-- STEP 6: Try the exact query that's failing (as service role)
SELECT 'STEP 6: Testing the failing query...' as status;
SELECT email, full_name, role, is_active 
FROM admin_users 
WHERE email = 'admin@dailit.com' AND is_active = true;

-- STEP 7: Check auth.users to see if the user exists there
SELECT 'STEP 7: Checking Supabase Auth users...' as status;
SELECT id, email, created_at, email_confirmed_at, last_sign_in_at
FROM auth.users 
WHERE email = 'admin@dailit.com';

-- STEP 8: If the above queries work, the issue is likely RLS policies
-- Let's temporarily disable RLS to test
SELECT 'STEP 8: To test if RLS is the issue, uncomment the next line:' as info;
-- ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- STEP 9: Test query after disabling RLS (uncomment if you disabled RLS above)
-- SELECT 'STEP 9: Testing query with RLS disabled...' as status;
-- SELECT * FROM admin_users WHERE email = 'admin@dailit.com' AND is_active = true;

-- STEP 10: Re-enable RLS and create simple policies (uncomment if needed)
-- ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
-- DROP POLICY IF EXISTS "Admin users can view their own data" ON admin_users;
-- DROP POLICY IF EXISTS "Allow password reset check" ON admin_users;
-- DROP POLICY IF EXISTS "Allow public read for password reset" ON admin_users;
-- DROP POLICY IF EXISTS "Allow admin self access" ON admin_users;
-- DROP POLICY IF EXISTS "Allow authenticated users to read admin_users" ON admin_users;
-- DROP POLICY IF EXISTS "Super admins can manage admin users" ON admin_users;
-- DROP POLICY IF EXISTS "Allow service role full access admin_users" ON admin_users;

-- Create one simple policy
-- CREATE POLICY "simple_read_policy" ON admin_users FOR SELECT USING (true);

SELECT 'Debug script completed. Check the results above.' as final_status;
SELECT 'If any step fails, that shows where the problem is.' as note;
SELECT 'If all steps work here but the app still gets 500 errors,' as note2;
SELECT 'then the issue might be with JWT tokens or API keys.' as note3; 