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