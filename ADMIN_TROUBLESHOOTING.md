# 🔧 Admin Authentication Troubleshooting Guide

## 🚨 Common Issues & Solutions

### ❌ Issue 1: "Missing Supabase environment variables"

**Symptoms:**
- Error in browser console
- Admin page won't load
- "Loading admin system..." message stuck

**Solution:**
1. **Create `.env.local` file** in your project root:
   ```bash
   # Copy the example file
   cp .env.local.example .env.local
   ```

2. **Get your Supabase credentials**:
   - Go to https://supabase.com/dashboard
   - Select your project
   - Go to **Settings** → **API**
   - Copy **Project URL** and **anon public** key

3. **Update `.env.local`**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Restart development server**:
   ```bash
   npm run dev
   ```

---

### ❌ Issue 2: "Invalid email or password"

**Symptoms:**
- Login form shows error message
- Credentials seem correct

**Step-by-Step Fix:**

#### 2.1 Check Supabase Auth User
1. **Go to Supabase Dashboard** → **Authentication** → **Users**
2. **Look for your admin email**
3. **Check status**: Should be "Confirmed" (green checkmark)

#### 2.2 If User Doesn't Exist:
**Use Supabase UI**:
1. **Authentication** → **Users** → **Add user**
2. **Email**: `admin@yourdomain.com`
3. **Password**: Create strong password
4. **Auto Confirm User**: ✅ Check this!
5. **Click "Create user"**

#### 2.3 Check Database Record
```sql
-- Check if admin user exists in admin_users table
SELECT * FROM admin_users WHERE email = 'admin@yourdomain.com';
```

#### 2.4 If No Database Record:
```sql
-- Insert admin user into admin_users table
INSERT INTO admin_users (email, full_name, role, is_active)
VALUES ('admin@yourdomain.com', 'Admin User', 'super_admin', true);
```

---

### ❌ Issue 3: "User authenticated but no admin access"

**Symptoms:**
- Login seems to work
- But immediately redirects back to login
- Or shows "not authorized" error

**Solution:**
```sql
-- 1. Check if user exists in admin_users table
SELECT * FROM admin_users WHERE email = 'your-email@domain.com';

-- 2. If no results, add the user:
INSERT INTO admin_users (email, full_name, role, is_active)
VALUES ('your-email@domain.com', 'Your Name', 'super_admin', true);

-- 3. Make sure user is active:
UPDATE admin_users 
SET is_active = true 
WHERE email = 'your-email@domain.com';
```

---

### ❌ Issue 4: "Database connection error" or "RLS policy error"

**Symptoms:**
- Can login but can't see leads/contacts
- Error about Row Level Security
- "Failed to load data" message

**Solution:**

#### 4.1 Check RLS Policies
```sql
-- Check if policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('leads', 'contact_submissions', 'admin_users');
```

#### 4.2 If Policies Missing, Run Setup:
1. **Go to Supabase SQL Editor**
2. **Copy entire `supabase-setup.sql` content**
3. **Run it** (this will recreate all tables and policies)

#### 4.3 Verify Environment Variables Again:
```bash
# Check if .env.local exists and has correct values
cat .env.local
```

---

### ❌ Issue 5: "Cannot read properties of null/undefined"

**Symptoms:**
- JavaScript errors in browser console
- Admin page crashes or shows blank screen

**Solution:**

#### 5.1 Clear Browser Data:
1. **Open Developer Tools** (F12)
2. **Right-click refresh button** → **Empty Cache and Hard Reload**
3. **Or try incognito/private mode**

#### 5.2 Check Browser Console:
1. **Open Developer Tools** (F12)
2. **Go to Console tab**
3. **Look for specific error messages**
4. **Share error details for further help**

#### 5.3 Restart Development Server:
```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

---

## 🔍 Diagnostic Checklist

### ✅ Environment Setup
- [ ] `.env.local` file exists
- [ ] Contains correct `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Contains correct `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Development server restarted after adding env vars

### ✅ Supabase Auth
- [ ] User exists in Authentication → Users
- [ ] User status is "Confirmed" (green checkmark)
- [ ] Email is verified
- [ ] Password is correct

### ✅ Database Setup
- [ ] All tables created (leads, contact_submissions, admin_users)
- [ ] Admin user exists in `admin_users` table
- [ ] Admin user `is_active = true`
- [ ] RLS policies are set up correctly

### ✅ Testing
- [ ] Can access `/admin` page
- [ ] Login form appears
- [ ] Can submit login form
- [ ] Redirects to admin dashboard
- [ ] Can see leads and contacts
- [ ] Can update lead status

---

## 🛠️ Manual Database Setup

If you're having persistent issues, here's the complete manual setup:

### 1. Create Tables
```sql
-- Run this in Supabase SQL Editor
-- (This is from supabase-setup.sql)

-- Create leads table
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

-- Create contact_submissions table
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

-- Create admin_users table
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
```

### 2. Enable RLS
```sql
-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
```

### 3. Create Policies
```sql
-- Allow anonymous users to insert leads
CREATE POLICY "Allow anonymous lead insertion" ON leads
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow anonymous users to insert contact submissions
CREATE POLICY "Allow anonymous contact insertion" ON contact_submissions
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow admin users to view/update leads
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

-- Similar policies for contact_submissions
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

-- Admin users can view their own data
CREATE POLICY "Admin users can view their own data" ON admin_users
  FOR SELECT TO authenticated
  USING (auth.email() = email);
```

### 4. Insert Admin User
```sql
-- Replace with your actual email and name
INSERT INTO admin_users (email, full_name, role, is_active)
VALUES ('admin@yourdomain.com', 'Admin User', 'super_admin', true);
```

---

## 🆘 Still Having Issues?

### Debug Information to Gather:
1. **Browser Console Errors** (F12 → Console)
2. **Network Tab Errors** (F12 → Network)
3. **Environment Variables** (without sensitive values)
4. **Supabase Project URL** (just the project ID part)
5. **Exact Error Messages**

### Quick Test:
```bash
# Test if environment variables are loaded
npm run dev
# Then visit http://localhost:3000/admin
# Check browser console for any errors
```

### Contact Information:
- **Supabase Support**: https://supabase.com/support
- **Check logs in Supabase Dashboard** → **Logs**

---

## ✅ Success Indicators

When everything is working correctly:
1. ✅ `/admin` page loads without errors
2. ✅ Login form appears
3. ✅ Can login with credentials
4. ✅ Admin dashboard shows leads and contacts
5. ✅ Can update lead/contact status
6. ✅ No errors in browser console

**Your admin system should now be fully functional! 🎉** 