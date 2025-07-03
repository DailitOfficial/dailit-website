-- FIX FORM SUBMISSION ISSUES
-- Run this script in your Supabase SQL Editor to fix common issues

-- Step 1: Check if tables exist and create them if missing
SELECT 'Checking and creating tables...' as status;

-- Create leads table if it doesn't exist
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  industry TEXT NOT NULL,
  number_of_users TEXT NOT NULL,
  source TEXT DEFAULT 'request_access_modal',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact_submissions table if it doesn't exist
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  message TEXT NOT NULL,
  source TEXT DEFAULT 'contact_form',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'responded', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Enable RLS if not already enabled
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Step 3: Drop existing policies and recreate them
DROP POLICY IF EXISTS "Allow anonymous lead insertion" ON leads;
DROP POLICY IF EXISTS "Allow anonymous contact insertion" ON contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated users to view leads" ON leads;
DROP POLICY IF EXISTS "Allow authenticated users to update leads" ON leads;
DROP POLICY IF EXISTS "Allow authenticated users to view contacts" ON contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated users to update contacts" ON contact_submissions;

-- Step 4: Create proper policies for form submissions
-- Allow anonymous users to insert leads (this is crucial for the form to work)
CREATE POLICY "Allow anonymous lead insertion" ON leads
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow anonymous users to insert contact submissions
CREATE POLICY "Allow anonymous contact insertion" ON contact_submissions
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow authenticated users to view and update (for admin interface)
CREATE POLICY "Allow authenticated users to view leads" ON leads
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to update leads" ON leads
  FOR UPDATE TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to view contacts" ON contact_submissions
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to update contacts" ON contact_submissions
  FOR UPDATE TO authenticated
  USING (true);

-- Step 5: Test the form submission capability
SELECT 'Testing form submission...' as status;

-- Try to insert a test lead as anonymous user
INSERT INTO leads (business_name, full_name, email, industry, number_of_users, source) 
VALUES ('Test Company', 'Test User', 'test@example.com', 'technology', '1-10', 'test_submission')
ON CONFLICT (email) DO NOTHING;

-- Check if the test lead was inserted
SELECT 'Test results:' as status;
SELECT * FROM leads WHERE email = 'test@example.com';

-- Step 6: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_created_at ON contact_submissions(created_at);

-- Step 7: Check final table structure
SELECT 'Final table structure:' as status;
SELECT table_name, column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name IN ('leads', 'contact_submissions')
ORDER BY table_name, ordinal_position;

-- Step 8: Check RLS policies
SELECT 'RLS Policies:' as status;
SELECT schemaname, tablename, policyname, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('leads', 'contact_submissions')
ORDER BY tablename, policyname;

SELECT 'Form submission setup completed!' as final_status;
SELECT 'You can now test the form at /test-form' as instructions; 