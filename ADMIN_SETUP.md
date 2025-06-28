# 🔐 Admin Authentication Setup Guide

## Step 1: Run SQL in Supabase

1. **Go to your Supabase Dashboard**: https://app.supabase.com/project/tkinucahmpjlghuempsc
2. **Navigate to**: SQL Editor (left sidebar)
3. **Copy and paste the entire contents** of `supabase-setup.sql` into the SQL editor
4. **Click "Run"** to execute all the SQL commands

This will create:
- `leads` table for RequestAccessModal submissions
- `contact_submissions` table for Contact form submissions  
- `admin_users` table for admin authentication
- `lead_activities` table for tracking interactions
- All necessary security policies (RLS)
- Sample admin user: `admin@dailit.com`

## Step 2: Set Up Admin User Authentication

### Option A: Using Supabase Auth UI (Recommended)

1. **Go to**: Authentication > Users in your Supabase dashboard
2. **Click "Add user"**
3. **Enter**:
   - Email: `admin@dailit.com` (or your preferred admin email)
   - Password: Create a secure password
   - Email Confirm: ✅ (check this)
4. **Click "Create user"**

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Create admin user
supabase auth admin create-user admin@dailit.com --password your-secure-password
```

## Step 3: Update Admin User Email (Optional)

If you want to use a different email than `admin@dailit.com`:

1. **Update the SQL**: In `supabase-setup.sql`, change:
   ```sql
   INSERT INTO admin_users (email, full_name, role) VALUES
     ('your-email@domain.com', 'Your Name', 'super_admin')
   ```

2. **Re-run the SQL** in Supabase dashboard

3. **Create the auth user** with the same email in Step 2

## Step 4: Test the Admin Panel

1. **Visit**: `http://localhost:3000/admin` (or your deployed URL + `/admin`)
2. **Login with**:
   - Email: `admin@dailit.com` (or your email)
   - Password: The password you set in Step 2

## Step 5: Enable Email Confirmation (Optional)

For production, you may want to disable email confirmation:

1. **Go to**: Authentication > Settings in Supabase
2. **Scroll to**: Email Auth
3. **Uncheck**: "Enable email confirmations" (for easier admin setup)
4. **Or set up**: Custom SMTP settings for email delivery

## 🛡️ Security Features

### ✅ What's Protected:
- **Admin Panel**: Requires authentication + admin user status
- **Lead Data**: Only accessible to authenticated admin users
- **Contact Data**: Only accessible to authenticated admin users
- **Row Level Security**: Enabled on all tables
- **Admin-Only Policies**: Database-level access control

### 🔒 Admin Roles:
- **admin**: Can view and manage leads/contacts
- **super_admin**: Can view/manage leads/contacts + manage other admin users

### 📱 Mobile Responsive:
- **Mobile Cards**: Lead and contact data displayed in card format on mobile
- **Responsive Tables**: Desktop tables with horizontal scroll
- **Touch-Friendly**: Buttons and forms optimized for mobile interaction
- **Responsive Stats**: Grid layout adapts to screen size

## 🚀 Lead Capture System

### Automatic Lead Capture:
1. **Request Access Modal**: Saves to `leads` table
2. **Contact Form**: Saves to `contact_submissions` table
3. **Real-time Updates**: Admin dashboard updates automatically
4. **Status Management**: Track lead progression (new → contacted → qualified → converted)

### Lead Data Captured:
- Business Name
- Full Name  
- Email
- Industry
- Number of Users
- Source (request_access_modal)
- Timestamp

### Contact Data Captured:
- Name
- Email
- Company (optional)
- Message
- Source (contact_form)
- Timestamp

## 🔧 Troubleshooting

### Issue: "Permission denied" when accessing admin panel
**Solution**: Make sure the user exists in both:
1. Supabase Auth (Authentication > Users)
2. `admin_users` table with matching email

### Issue: "Failed to load data"
**Solution**: Check that:
1. Environment variables are set correctly in `.env.local`
2. RLS policies are applied (run the SQL again)
3. Admin user has `is_active = true`

### Issue: Can't sign in
**Solution**: 
1. Check the password is correct
2. Verify email exists in Supabase Auth
3. Check browser console for detailed error messages

## 📊 Next Steps

1. **Test Lead Capture**: Fill out the Request Access modal on your homepage
2. **Test Contact Form**: Submit the contact form
3. **Check Admin Dashboard**: Verify data appears correctly
4. **Test Mobile**: Check responsiveness on mobile devices
5. **Production Deployment**: Update admin email before going live

## 🎯 Production Checklist

- [ ] Change default admin email from `admin@dailit.com`
- [ ] Set strong password for admin user
- [ ] Test lead capture forms
- [ ] Test admin authentication
- [ ] Verify mobile responsiveness
- [ ] Set up email notifications (optional)
- [ ] Configure backup admin users (optional)

Your lead capture system is now ready! 🎉 