# 🔍 Admin Password Reset Debugging Guide

## Quick Diagnosis

If password reset says "admin email not found" but you can see the admin user, follow these steps:

### Step 1: Check Browser Console
1. **Open Developer Tools** (F12)
2. **Go to Console tab**
3. **Try password reset again**
4. **Look for these messages**:
   ```
   Attempting password reset for: your-email@domain.com
   Admin user query result: { adminUser: ..., adminError: ... }
   ```

### Step 2: Check Database Setup

#### Option A: Quick SQL Check
Go to Supabase → SQL Editor and run:
```sql
-- Check if admin_users table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'admin_users';

-- Check if your admin user exists
SELECT email, is_active, full_name 
FROM admin_users 
WHERE email = 'your-email@domain.com';
```

#### Option B: Check RLS Policies
```sql
-- Check RLS policies for admin_users table
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'admin_users';
```

### Step 3: Common Issues & Solutions

#### Issue 1: Table doesn't exist
**Error**: `relation "admin_users" does not exist`
**Solution**: Run the `supabase-setup.sql` file

#### Issue 2: User not in admin_users table
**Error**: `No admin user found for email`
**Solution**: 
```sql
INSERT INTO admin_users (email, full_name, role, is_active)
VALUES ('your-email@domain.com', 'Your Name', 'super_admin', true);
```

#### Issue 3: RLS Policy blocking access
**Error**: `permission denied` or `RLS policy violation`
**Solution**: Check if user exists in Supabase Auth:
1. Go to Authentication → Users
2. Make sure user exists and is confirmed
3. Email should match exactly

#### Issue 4: User not active
**Error**: `Email not found in admin users`
**Solution**:
```sql
UPDATE admin_users 
SET is_active = true 
WHERE email = 'your-email@domain.com';
```

### Step 4: Manual Test

Run this in Supabase SQL Editor to test the exact query:
```sql
-- Test the exact query used by the reset function
SELECT email, is_active, full_name 
FROM admin_users 
WHERE email = 'your-email@domain.com' 
  AND is_active = true;
```

If this returns no results, the user either:
- Doesn't exist in admin_users table
- Has is_active = false
- Email doesn't match exactly (check for typos)

### Step 5: Environment Variables

Make sure `.env.local` exists with correct values:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Step 6: Quick Fix Commands

If you need to quickly fix the admin user:

```sql
-- Delete existing admin user (if needed)
DELETE FROM admin_users WHERE email = 'your-email@domain.com';

-- Create fresh admin user
INSERT INTO admin_users (email, full_name, role, is_active)
VALUES ('your-email@domain.com', 'Admin User', 'super_admin', true);

-- Verify it was created
SELECT * FROM admin_users WHERE email = 'your-email@domain.com';
```

### Step 7: Test Again

1. **Clear browser cache** (Ctrl+Shift+R)
2. **Go to** `/admin`
3. **Click "Forgot your password?"**
4. **Enter your email**
5. **Check browser console** for debug messages

---

## Most Common Solutions:

### 🔧 Solution 1: Run Database Setup
```sql
-- Copy entire supabase-setup.sql content and run it
```

### 🔧 Solution 2: Add Admin User
```sql
INSERT INTO admin_users (email, full_name, role, is_active)
VALUES ('admin@yourdomain.com', 'Admin User', 'super_admin', true);
```

### 🔧 Solution 3: Check Email Match
- Make sure email in Supabase Auth matches email in admin_users table exactly
- Check for typos, extra spaces, case sensitivity

### 🔧 Solution 4: Verify Environment Variables
- Check `.env.local` file exists
- Restart development server after adding env vars

---

**Need help?** Share the browser console output and I can help diagnose the specific issue! 

# Admin System Debug Guide

## Common Issues and Solutions

### 1. Password Reset Returns "Email not found" Even Though Admin User Exists

**Symptoms:**
- Admin user exists in Supabase dashboard
- Database query shows user exists when run directly
- Password reset form shows "Email not found in admin users"
- Console shows: `Table count result: {count: 0, countError: null}`

**Root Cause:**
Row Level Security (RLS) is enabled on the `admin_users` table but there are no policies allowing public read access.

**Solution:**
Run the following SQL commands in your Supabase SQL Editor:

```sql
-- Check if RLS is enabled (should return true)
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'admin_users';

-- Check existing policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'admin_users';

-- Option 1: Create a policy to allow public read access for password reset
CREATE POLICY "Allow public read for password reset" ON admin_users
FOR SELECT USING (true);

-- Option 2: Temporarily disable RLS (less secure)
-- ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- Option 3: Create a more secure policy (recommended)
CREATE POLICY "Allow password reset check" ON admin_users
FOR SELECT USING (is_active = true);
```

**Verification:**
After running the SQL, test the password reset again. The console should now show:
- `Table count result: {count: 1, countError: null}` (or however many admin users you have)
- `All admin users: {allAdmins: Array(1), allError: null}`

### 2. Admin User Email Mismatch

**Symptoms:**
- Password reset fails with "Email not found"
- You recently changed the admin email in Supabase Auth

**Root Cause:**
The email in Supabase Auth doesn't match the email in the `admin_users` table.

**Solution:**
```sql
-- Check current emails
SELECT email FROM admin_users;
SELECT email FROM auth.users;

-- Update admin_users table to match auth.users
UPDATE admin_users 
SET email = 'admin@dailit.com' 
WHERE email = 'admin@dailut.com';  -- Replace with your old email
```

### 3. Table Doesn't Exist

**Symptoms:**
- Console shows: `relation "admin_users" does not exist`

**Solution:**
Run the `PASSWORD_RESET_SETUP.sql` script to create the required tables.

### 4. Permission Denied Errors

**Symptoms:**
- Console shows: `permission denied` or `RLS` errors

**Solution:**
1. Check your Supabase project settings
2. Ensure the service role key is being used for admin operations
3. Review RLS policies as described in issue #1

## Environment Variables Required

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Testing Commands

### Check Database Connection
```sql
SELECT current_database(), current_user;
```

### Check Admin Users Table
```sql
-- Count rows
SELECT COUNT(*) FROM admin_users;

-- Show all admin users
SELECT id, email, full_name, role, is_active, created_at FROM admin_users;

-- Check RLS status
SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE tablename = 'admin_users';
```

### Check Auth Users
```sql
-- Show auth users (requires service role)
SELECT id, email, created_at FROM auth.users;
```

## Debugging Steps

1. **Check Console Logs**: Open browser dev tools and look for detailed error messages
2. **Verify Database Data**: Use Supabase dashboard to confirm admin user exists
3. **Test RLS Policies**: Run the SQL commands above to check and fix RLS issues
4. **Check Environment**: Ensure you're using the correct Supabase project
5. **Verify Email Match**: Ensure auth.users email matches admin_users email

## Contact Support

If issues persist after following this guide:
1. Provide the exact console error messages
2. Share the output of the SQL verification commands
3. Confirm which Supabase project you're using 