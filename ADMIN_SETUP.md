# 🔐 Admin Setup Guide - Complete Instructions

## Overview
This guide will help you set up admin authentication for your Dail it website. You need to create an admin user in both Supabase Auth and your database.

## 📋 Prerequisites
- ✅ Supabase project created
- ✅ Database tables created (from `supabase-setup.sql`)
- ✅ Environment variables configured

---

## 🚀 Step 1: Create Admin User in Supabase Auth

### 1.1 Access Supabase Dashboard
1. **Go to**: https://supabase.com/dashboard
2. **Select your project**
3. **Click "Authentication"** (left sidebar)
4. **Click "Users"** tab

### 1.2 Create New User
1. **Click "Add user"** button
2. **Fill in the form**:
   - **Email**: `admin@yourdomain.com` (use your actual domain)
   - **Password**: Create a strong password (save this!)
   - **Auto Confirm User**: ✅ **Check this box**
3. **Click "Create user"**

### 1.3 Verify User Creation
- ✅ User should appear in the users list
- ✅ Status should be "Confirmed"
- ✅ Email should be verified

---

## 🗄️ Step 2: Add Admin User to Database

### 2.1 Access SQL Editor
1. **In Supabase Dashboard**, click **"SQL Editor"** (left sidebar)
2. **Click "New query"**

### 2.2 Insert Admin User Record
```sql
-- Insert admin user into admin_users table
INSERT INTO admin_users (email, full_name, role, is_active)
VALUES (
  'admin@yourdomain.com',  -- Replace with your actual email
  'Admin User',            -- Replace with your name
  'super_admin',           -- Role: 'admin' or 'super_admin'
  true                     -- Active status
);
```

### 2.3 Execute Query
1. **Paste the SQL** (update the email and name)
2. **Click "Run"** button
3. **Verify**: Should see "Success. No rows returned"

### 2.4 Verify Database Record
```sql
-- Check if admin user was created
SELECT * FROM admin_users WHERE email = 'admin@yourdomain.com';
```

You should see your admin user record.

---

## 🔧 Step 3: Test Admin Login

### 3.1 Try Logging In
1. **Go to**: `your-website.com/admin`
2. **Enter credentials**:
   - **Email**: The email you created
   - **Password**: The password you set
3. **Click "Sign In"**

### 3.2 Expected Result
- ✅ Should redirect to admin dashboard
- ✅ Should see leads and contact submissions
- ✅ Should see your admin name in header

---

## 🛠️ Troubleshooting

### ❌ Problem: "Invalid email or password"
**Possible Causes:**
1. **User not created in Supabase Auth**
2. **Wrong email/password**
3. **User not confirmed**

**Solutions:**
1. **Check Supabase Auth** → Users → Make sure user exists
2. **Verify email is confirmed** (green checkmark)
3. **Try password reset** if needed

### ❌ Problem: "User authenticated but no admin access"
**Cause:** User exists in Auth but not in `admin_users` table

**Solution:**
```sql
-- Check if user exists in admin_users table
SELECT * FROM admin_users WHERE email = 'your-email@domain.com';

-- If no results, insert the admin user:
INSERT INTO admin_users (email, full_name, role, is_active)
VALUES ('your-email@domain.com', 'Your Name', 'super_admin', true);
```

### ❌ Problem: "Database connection error"
**Possible Causes:**
1. **Wrong environment variables**
2. **RLS policies blocking access**
3. **Tables not created**

**Solutions:**
1. **Check `.env.local`**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
2. **Run the setup SQL** from `supabase-setup.sql`
3. **Check RLS policies** are correctly set

### ❌ Problem: "Cannot read properties of null"
**Cause:** Authentication check failing

**Solution:**
1. **Clear browser cache**
2. **Try incognito mode**
3. **Check browser console** for errors

---

## 🔒 Step 4: Security Best Practices

### 4.1 Strong Password
- ✅ Use a password manager
- ✅ Minimum 12 characters
- ✅ Mix of letters, numbers, symbols

### 4.2 Email Security
- ✅ Use a professional email
- ✅ Enable 2FA on your email account
- ✅ Don't share admin credentials

### 4.3 Regular Maintenance
- ✅ Change password every 90 days
- ✅ Monitor login activity
- ✅ Remove inactive admin users

---

## 📊 Step 5: Using the Admin Dashboard

### 5.1 Dashboard Features
- **📋 Leads Management**: View and update lead status
- **📧 Contact Submissions**: Manage contact form submissions
- **📈 Activity Tracking**: See lead interaction history
- **🔄 Status Updates**: Change lead/contact status

### 5.2 Lead Status Options
- **New**: Fresh lead, not contacted
- **Contacted**: Initial contact made
- **Qualified**: Potential customer
- **Converted**: Became a customer
- **Lost**: Not interested/lost

### 5.3 Contact Status Options
- **New**: Fresh contact submission
- **Responded**: Reply sent to contact
- **Closed**: Issue resolved/closed

---

## 🆘 Emergency Access

### If You're Locked Out:
1. **Reset password** in Supabase Auth dashboard
2. **Create new admin user** following steps above
3. **Check RLS policies** haven't changed
4. **Verify environment variables**

---

## 📞 Support

### Supabase Issues:
- **Documentation**: https://supabase.com/docs
- **Support**: https://supabase.com/support

### Authentication Issues:
- **Check browser console** for errors
- **Try different browser**
- **Clear cookies and cache**

---

## ✅ Final Checklist

- [ ] ✅ Admin user created in Supabase Auth
- [ ] ✅ User status is "Confirmed"
- [ ] ✅ Admin user added to `admin_users` table
- [ ] ✅ Can login to `/admin` successfully
- [ ] ✅ Can view leads and contacts
- [ ] ✅ Can update lead/contact status
- [ ] ✅ Password saved securely

**Your admin system is now ready! 🎉**

---

## 🔄 Adding More Admin Users

To add additional admin users:

1. **Create user in Supabase Auth** (Step 1)
2. **Add to database**:
   ```sql
   INSERT INTO admin_users (email, full_name, role, is_active)
   VALUES ('new-admin@domain.com', 'New Admin Name', 'admin', true);
   ```
3. **Test login**

**Note**: Use `'admin'` role for regular admins, `'super_admin'` for full access. 