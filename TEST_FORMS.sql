-- TEST DATA FOR ADMIN DASHBOARD
-- Run this in Supabase SQL Editor to add test data

-- Check if tables exist
SELECT 'Checking tables...' as status;
SELECT table_name FROM information_schema.tables WHERE table_name IN ('leads', 'contact_submissions');

-- Insert test leads
INSERT INTO leads (business_name, full_name, email, industry, number_of_users, source, status, notes) VALUES
  ('Test Tech Company', 'John Smith', 'john@testtech.com', 'technology', '11-50', 'request_access_modal', 'new', 'Interested in our enterprise solution'),
  ('Healthcare Corp', 'Sarah Johnson', 'sarah@healthcare.com', 'healthcare', '51-100', 'request_access_modal', 'contacted', 'Follow up scheduled for next week'),
  ('Finance Solutions', 'Mike Brown', 'mike@finance.com', 'finance', '101-500', 'request_access_modal', 'qualified', 'Ready to proceed with demo'),
  ('Retail Express', 'Lisa Davis', 'lisa@retail.com', 'retail', '11-50', 'request_access_modal', 'converted', 'Successfully converted to customer'),
  ('Manufacturing Inc', 'Tom Wilson', 'tom@manufacturing.com', 'manufacturing', '500+', 'request_access_modal', 'lost', 'Went with competitor')
ON CONFLICT (email) DO NOTHING;

-- Insert test contact submissions
INSERT INTO contact_submissions (name, email, company, message, source, status) VALUES
  ('Alice Cooper', 'alice@company.com', 'Cooper Industries', 'I need more information about your pricing plans and what features are included.', 'contact_form', 'new'),
  ('Bob Martinez', 'bob@startup.com', 'Startup LLC', 'We are a growing startup and need a scalable communication solution. Can you help?', 'contact_form', 'responded'),
  ('Carol White', 'carol@enterprise.com', 'Enterprise Corp', 'Looking for enterprise-level features with API integration capabilities.', 'contact_form', 'new'),
  ('David Green', 'david@consulting.com', 'Green Consulting', 'Need help migrating from our current system to Dail it. What support do you offer?', 'contact_form', 'closed'),
  ('Emma Thompson', 'emma@tech.com', NULL, 'Individual user interested in small business plan. What are the minimum requirements?', 'contact_form', 'new')
ON CONFLICT (email) DO NOTHING;

-- Check what was inserted
SELECT 'Test leads inserted:' as info;
SELECT business_name, full_name, email, status FROM leads ORDER BY created_at DESC LIMIT 10;

SELECT 'Test contacts inserted:' as info;
SELECT name, email, company, status FROM contact_submissions ORDER BY created_at DESC LIMIT 10;

-- Count totals
SELECT 'Total counts:' as info;
SELECT 
  (SELECT COUNT(*) FROM leads) as total_leads,
  (SELECT COUNT(*) FROM contact_submissions) as total_contacts;

-- Check RLS policies are working
SELECT 'Checking RLS policies...' as status;
SELECT schemaname, tablename, policyname FROM pg_policies WHERE tablename IN ('leads', 'contact_submissions');

SELECT 'Test data creation completed!' as final_status; 