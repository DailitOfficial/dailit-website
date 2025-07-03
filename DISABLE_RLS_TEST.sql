-- TEMPORARY: DISABLE RLS FOR TESTING
-- This is just to test if RLS is the issue
-- DO NOT USE IN PRODUCTION

-- Step 1: Check current RLS status
SELECT 'Current RLS status:' as info;
SELECT schemaname, tablename, rowsecurity
FROM pg_tables 
WHERE tablename = 'leads';

-- Step 2: Temporarily disable RLS
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;

-- Step 3: Test insertion without RLS
SELECT 'Testing without RLS:' as info;
INSERT INTO leads (business_name, full_name, email, industry, number_of_users, source) 
VALUES ('No RLS Test Company', 'No RLS Test User', 'norlstest@example.com', 'technology', '1-10', 'no_rls_test')
ON CONFLICT (email) DO NOTHING;

-- Step 4: Check if the record was created
SELECT 'Test results:' as info;
SELECT business_name, full_name, email, source, created_at 
FROM leads 
WHERE email = 'norlstest@example.com';

-- Step 5: Re-enable RLS (IMPORTANT!)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Step 6: Recreate the correct policy
DROP POLICY IF EXISTS "Allow anonymous lead insertion" ON leads;
CREATE POLICY "Allow anonymous lead insertion" ON leads
  FOR INSERT TO anon
  WITH CHECK (true);

-- Step 7: Check final status
SELECT 'Final RLS status:' as info;
SELECT schemaname, tablename, rowsecurity
FROM pg_tables 
WHERE tablename = 'leads';

SELECT 'RLS test completed - RLS is now re-enabled with correct policy!' as final_status; 