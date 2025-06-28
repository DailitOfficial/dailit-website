# 🌐 Connect Hostinger Domain to Vercel - Complete Guide

## Overview
This guide will help you connect your domain from Hostinger to your Vercel-deployed website.

## 📋 Prerequisites
- ✅ Domain purchased from Hostinger
- ✅ Website deployed on Vercel
- ✅ Access to both Hostinger and Vercel dashboards

---

## 🚨 **IMPORTANT: CDN Issue Fix**

### ❌ Error: "Cannot add A/AAAA record when CDN is enabled"

If you get this error, you need to **disable Hostinger's CDN first**:

#### **Step 1: Disable CDN in Hostinger**
1. **Go to Hostinger**: https://hpanel.hostinger.com/
2. **Click "Websites"** (left sidebar)
3. **Find your domain** and click **"Manage"**
4. **Look for "CDN" or "CloudFlare"** section
5. **Turn OFF/Disable the CDN**
6. **Wait 5-10 minutes** for changes to propagate

#### **Step 2: Clear Existing DNS (if needed)**
1. **Go to "Domains"** → **"Manage"** → **"DNS / Name Servers"**
2. **Delete any existing A or AAAA records**
3. **Keep MX records** (for email)

#### **Step 3: Continue with normal setup below**

---

## 🚀 Step 1: Get Your Vercel Deployment URL

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Click on your project** (dailit-website)
3. **Copy the deployment URL** (something like `dailit-website-xyz.vercel.app`)
4. **Keep this URL handy** - you'll need it later

---

## 🔧 Step 2: Add Domain to Vercel

### 2.1 Access Vercel Domain Settings
1. **In your Vercel project**, click **"Settings"** (top navigation)
2. **Click "Domains"** (left sidebar)
3. **Click "Add Domain"** button

### 2.2 Add Your Domain
1. **Enter your domain** (e.g., `yourdomain.com`)
2. **Click "Add"**
3. **Vercel will show DNS configuration** - keep this page open!

### 2.3 Note the DNS Records
Vercel will show you DNS records like:
- **Type**: `A` **Name**: `@` **Value**: `76.76.19.61`
- **Type**: `CNAME` **Name**: `www` **Value**: `cname.vercel-dns.com`

**📝 Write these down - you'll add them to Hostinger!**

---

## 🌐 Step 3: Configure DNS in Hostinger

### 3.1 Access Hostinger DNS Zone
1. **Go to Hostinger**: https://hpanel.hostinger.com/
2. **Login to your account**
3. **Click "Domains"** (left sidebar)
4. **Find your domain** and click **"Manage"**
5. **Click "DNS / Name Servers"** tab

### 3.2 Clear Existing Records (if needed)
1. **Look for existing A and CNAME records**
2. **Delete any conflicting records**:
   - Delete existing `A` record pointing to `@`
   - Delete existing `CNAME` record pointing to `www`
   - **⚠️ DO NOT delete MX records** (needed for email)

### 3.3 Add Vercel DNS Records

#### Add A Record:
1. **Click "Add Record"**
2. **Type**: Select `A`
3. **Name**: Enter `@`
4. **Points to**: Enter `76.76.19.61` (or the IP Vercel gave you)
5. **TTL**: Leave default (14400)
6. **Click "Add Record"**

#### Add CNAME Record:
1. **Click "Add Record"**
2. **Type**: Select `CNAME`
3. **Name**: Enter `www`
4. **Points to**: Enter `cname.vercel-dns.com` (or what Vercel gave you)
5. **TTL**: Leave default (14400)
6. **Click "Add Record"**

### 3.4 Save Changes
1. **Click "Save"** or **"Update"**
2. **Wait for confirmation message**

---

## ⏱️ Step 4: Wait for DNS Propagation

### 4.1 Propagation Time
- **DNS changes take 24-48 hours** to fully propagate
- **Most changes work within 1-2 hours**
- **Be patient!**

### 4.2 Check Propagation Status
You can check if DNS is working:
1. **Go to**: https://dnschecker.org/
2. **Enter your domain**
3. **Check if it points to Vercel's IP**

---

## ✅ Step 5: Verify Domain Connection

### 5.1 Check Vercel Status
1. **Go back to Vercel** → **Settings** → **Domains**
2. **Your domain should show**:
   - ✅ **Valid Configuration**
   - 🔒 **SSL Certificate** (may take a few minutes)

### 5.2 Test Your Website
1. **Visit your domain** (e.g., `yourdomain.com`)
2. **Also test** `www.yourdomain.com`
3. **Both should redirect to your Vercel site**

---

## 🛠️ Troubleshooting

### ❌ Problem: "Cannot add A/AAAA record when CDN is enabled"
**Solution:**
1. **Disable CDN** in Hostinger (Websites → Manage → CDN → Turn OFF)
2. **Wait 10 minutes**
3. **Try adding DNS records again**
4. **CDN conflicts with custom DNS** - you can't use both

### ❌ Problem: "Invalid Configuration"
**Solution:**
1. **Double-check DNS records** in Hostinger
2. **Make sure A record points to** `76.76.19.61`
3. **Make sure CNAME points to** `cname.vercel-dns.com`
4. **Wait longer** - DNS can take up to 48 hours

### ❌ Problem: "SSL Certificate Failed"
**Solution:**
1. **Wait 10-15 minutes** after domain verification
2. **Try clicking "Refresh"** in Vercel
3. **SSL certificates are automatic** but can take time

### ❌ Problem: Domain shows "This site can't be reached"
**Solution:**
1. **Check DNS propagation** at dnschecker.org
2. **Clear your browser cache**
3. **Try incognito/private browsing**
4. **Wait for full DNS propagation**

### ❌ Problem: Shows old website content
**Solution:**
1. **Clear browser cache**
2. **Wait for DNS propagation**
3. **Check if old hosting is still active**

---

## 🔒 Step 6: Enable HTTPS Redirect (Optional)

### 6.1 Force HTTPS
1. **In Vercel** → **Settings** → **Domains**
2. **Find your domain**
3. **Click "Edit"**
4. **Enable "Redirect to HTTPS"**
5. **Save changes**

---

## 📧 Step 7: Set Up Email (Optional)

If you want email with your domain:

### 7.1 Keep Hostinger Email
1. **In Hostinger**, go to **"Email"**
2. **Set up email accounts** as normal
3. **Email will continue working** with Hostinger

### 7.2 Email DNS Records
1. **Don't delete MX records** in Hostinger DNS
2. **Only change A and CNAME records** for website
3. **Keep all MX records** for email

---

## 🎯 Final Checklist

- [ ] ✅ **CDN disabled** in Hostinger
- [ ] ✅ Domain added to Vercel
- [ ] ✅ A record: `@` → `76.76.19.61`
- [ ] ✅ CNAME record: `www` → `cname.vercel-dns.com`
- [ ] ✅ DNS propagation complete (24-48 hours)
- [ ] ✅ Domain shows "Valid Configuration" in Vercel
- [ ] ✅ SSL certificate active
- [ ] ✅ Website accessible at your domain
- [ ] ✅ Both `yourdomain.com` and `www.yourdomain.com` work

---

## 🚨 Important Notes

### ⚠️ About CDN:
- **Hostinger's CDN conflicts** with custom DNS
- **You must disable CDN** to use Vercel
- **Vercel has its own CDN** - you don't need Hostinger's

### ⚠️ Don't Delete These Hostinger Records:
- **MX records** (for email)
- **TXT records** (for verification)
- **Any other records** you're not sure about

### ⚠️ Only Change:
- **A record** pointing to `@`
- **CNAME record** pointing to `www`

### ⚠️ Backup:
- **Take screenshots** of your current DNS before making changes
- **Write down existing records** in case you need to revert

---

## 🎉 Success!

Once everything is working:
1. **Your domain will show your Vercel website**
2. **SSL certificate will be active (🔒)**
3. **Both www and non-www versions will work**
4. **Your lead capture system will be live**
5. **Vercel's CDN will handle performance** (better than Hostinger's)

**Need help?** Check the troubleshooting section or contact support!

---

## 📞 Support Contacts

- **Vercel Support**: https://vercel.com/help
- **Hostinger Support**: https://www.hostinger.com/contact
- **DNS Checker**: https://dnschecker.org/

Your professional website with lead capture is now ready for the world! 🌟 