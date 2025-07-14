-- SIMPLE RLS POLICY FIX
-- Compatible with all Supabase versions

-- Step 1: Drop existing policies
DROP POLICY IF EXISTS "Allow anonymous lead insertion" ON leads;
DROP POLICY IF EXISTS "Allow authenticated lead insertion" ON leads;

-- Step 2: Create the correct policy for anonymous users
CREATE POLICY "Allow anonymous lead insertion" ON leads
  FOR INSERT TO anon
  WITH CHECK (true);

-- Step 3: Create policy for authenticated users too
CREATE POLICY "Allow authenticated lead insertion" ON leads
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Step 4: Test insertion
INSERT INTO leads (business_name, full_name, email, industry, number_of_users, source) 
VALUES ('Simple Test Company', 'Simple Test User', 'simpletest@example.com', 'technology', '1-10', 'simple_test')
ON CONFLICT (email) DO NOTHING;

-- Step 5: Check if it worked
SELECT 'Test result:' as info;
SELECT business_name, full_name, email, created_at 
FROM leads 
WHERE email = 'simpletest@example.com';

SELECT 'Simple RLS fix completed!' as final_status; 