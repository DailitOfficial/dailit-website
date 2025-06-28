-- Enable RLS (Row Level Security)
-- This ensures data security and proper access control

-- Create leads table for RequestAccessModal submissions
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  industry TEXT NOT NULL,
  number_of_users TEXT NOT NULL,
  source TEXT DEFAULT 'request_access_modal',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact_submissions table for Contact form submissions
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

-- Create lead_activities table for tracking interactions
CREATE TABLE IF NOT EXISTS lead_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contact_submissions(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('email_sent', 'call_made', 'demo_scheduled', 'follow_up', 'note_added')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT -- For future admin user tracking
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_created_at ON contact_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_activities_lead_id ON lead_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_activities_contact_id ON lead_activities(contact_id);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a lead capture system)
-- In production, you might want more restrictive policies

-- Allow anonymous users to insert leads (for form submissions)
CREATE POLICY "Allow anonymous lead insertion" ON leads
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow anonymous users to insert contact submissions
CREATE POLICY "Allow anonymous contact insertion" ON contact_submissions
  FOR INSERT TO anon
  WITH CHECK (true);

-- For admin access (you can create an admin role later)
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

-- Allow authenticated users to manage activities
CREATE POLICY "Allow authenticated users to manage activities" ON lead_activities
  FOR ALL TO authenticated
  USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_leads_updated_at 
  BEFORE UPDATE ON leads 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_submissions_updated_at 
  BEFORE UPDATE ON contact_submissions 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Create admin_users table for admin authentication
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for admin users to access their own data
CREATE POLICY "Admin users can view their own data" ON admin_users
  FOR SELECT TO authenticated
  USING (auth.email() = email);

-- Create policy for super admins to manage all admin users
CREATE POLICY "Super admins can manage admin users" ON admin_users
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.email() 
      AND role = 'super_admin' 
      AND is_active = true
    )
  );

-- Update existing policies to check admin status
DROP POLICY IF EXISTS "Allow authenticated users to view leads" ON leads;
DROP POLICY IF EXISTS "Allow authenticated users to update leads" ON leads;
DROP POLICY IF EXISTS "Allow authenticated users to view contacts" ON contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated users to update contacts" ON contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated users to manage activities" ON lead_activities;

-- Create new admin-only policies
CREATE POLICY "Allow admin users to view leads" ON leads
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.email() 
      AND is_active = true
    )
  );

CREATE POLICY "Allow admin users to update leads" ON leads
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.email() 
      AND is_active = true
    )
  );

CREATE POLICY "Allow admin users to view contacts" ON contact_submissions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.email() 
      AND is_active = true
    )
  );

CREATE POLICY "Allow admin users to update contacts" ON contact_submissions
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.email() 
      AND is_active = true
    )
  );

CREATE POLICY "Allow admin users to manage activities" ON lead_activities
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.email() 
      AND is_active = true
    )
  );

-- Create trigger for admin_users updated_at
CREATE TRIGGER update_admin_users_updated_at 
  BEFORE UPDATE ON admin_users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (change this email to your own!)
INSERT INTO admin_users (email, full_name, role) VALUES
  ('admin@dailit.com', 'Admin User', 'super_admin')
ON CONFLICT (email) DO NOTHING;

-- Insert some sample data for testing (optional)
-- You can remove this in production
INSERT INTO leads (business_name, full_name, email, industry, number_of_users, notes) VALUES
  ('Test Company', 'John Doe', 'john@testcompany.com', 'technology', '11-50', 'Sample lead for testing')
ON CONFLICT (email) DO NOTHING; 