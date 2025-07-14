-- FIX RLS POLICY FOR ANONYMOUS LEAD INSERTION
-- The policy exists but is not working correctly

-- Step 1: Check current policies
SELECT 'Current RLS policies:' as info;
SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'leads'
ORDER BY policyname;

-- Step 2: Drop the existing policy and recreate it correctly
DROP POLICY IF EXISTS "Allow anonymous lead insertion" ON leads;

-- Step 3: Create the correct policy for anonymous users
-- This policy allows anonymous users (anon role) to INSERT into leads table
CREATE POLICY "Allow anonymous lead insertion" ON leads
  FOR INSERT TO anon
  WITH CHECK (true);

-- Step 4: Also create a policy for authenticated users (just in case)
DROP POLICY IF EXISTS "Allow authenticated lead insertion" ON leads;
CREATE POLICY "Allow authenticated lead insertion" ON leads
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Step 5: Check that RLS is enabled
SELECT 'RLS status:' as info;
SELECT schemaname, tablename, rowsecurity
FROM pg_tables 
WHERE tablename = 'leads';

-- Step 6: Verify the policies were created correctly
SELECT 'Updated RLS policies:' as info;
SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'leads'
ORDER BY policyname;

-- Step 7: Test the insertion as anonymous user
SELECT 'Testing anonymous insertion:' as info;
SET ROLE anon;
INSERT INTO leads (business_name, full_name, email, industry, number_of_users, source) 
VALUES ('Policy Test Company', 'Policy Test User', 'policytest@example.com', 'technology', '1-10', 'policy_test')
ON CONFLICT (email) DO NOTHING;
RESET ROLE;

-- Step 8: Verify the test record was created
SELECT 'Test results:' as info;
SELECT business_name, full_name, email, source, created_at 
FROM leads 
WHERE email = 'policytest@example.com';

SELECT 'RLS policy fix completed!' as final_status; 