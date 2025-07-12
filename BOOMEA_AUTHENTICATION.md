# Boomea Authentication System

This document explains how the Boomea authentication integration works in your Dialit website.

## Overview

The integration provides seamless authentication with Boomea's communication platform:

1. **User enters Boomea credentials** in your website's login form
2. **Credentials are sent to Boomea's API** for authentication
3. **Session cookies are set** in the user's browser for Boomea
4. **User is redirected** to their specific Boomea workspace
5. **User is automatically logged in** to Boomea without needing to log in again

## How It Works

### Authentication Flow

1. **User clicks "Sign In"** on your website
2. **Login modal opens** asking for Boomea email and password
3. **Form submission** sends credentials to Boomea's API endpoint:
   ```
   POST https://app.boomea.com/api/v4/users/login
   {
     "login_id": "user@example.com",
     "password": "userpassword"
   }
   ```

4. **Boomea responds** with:
   - Session token in `token` header
   - `MMAUTHTOKEN` and `MMUSERID` cookies
   - User information

5. **Cookies are set** in the user's browser for the `.boomea.com` domain with proper attributes:
   - `domain=.boomea.com`
   - `path=/`
   - `secure`
   - `samesite=none`
   - `max-age=15552000` (180 days)

6. **User information is retrieved** using the session token:
   ```
   GET https://app.boomea.com/api/v4/users/me
   Authorization: Bearer <session_token>
   ```

7. **Team/workspace is determined** by calling:
   ```
   GET https://app.boomea.com/api/v4/users/me/teams
   Authorization: Bearer <session_token>
   ```

8. **User is redirected** to their specific workspace:
   ```
   https://app.boomea.com/rio/channels/general
   ```

### Technical Implementation

#### Files Modified

1. **`src/services/boomeaAuth.ts`**
   - Handles all Boomea API interactions
   - Manages session tokens and cookies
   - Determines user's workspace/team
   - Handles authentication errors
   - **Fixed cookie setting** for cross-domain authentication
   - **Improved redirection URLs** to match Boomea's structure

2. **`src/components/BoomeaLoginModal.tsx`**
   - Login form for Boomea credentials
   - Calls authentication service
   - Handles loading states and errors
   - Redirects to Boomea dashboard
   - **Enhanced error handling** and user feedback

#### Key Features

- **Session Token Authentication**: Uses Boomea's official API with Bearer tokens
- **Cookie Management**: Automatically sets Boomea's session cookies with proper attributes
- **Workspace Detection**: Determines user's team/workspace for proper redirection
- **Error Handling**: Comprehensive error messages for different failure scenarios
- **Secure**: No credentials stored locally, only session tokens
- **Cross-Domain Cookies**: Properly sets cookies for `.boomea.com` domain

## Recent Fixes

### Cookie Setting Issues
- **Problem**: Cookies weren't being set properly for cross-domain authentication
- **Solution**: Added proper cookie attributes including `domain`, `secure`, `samesite`, and `max-age`
- **Result**: Users should now be automatically logged in when redirected to Boomea

### Redirection URL Issues
- **Problem**: Incorrect URL format was causing login prompts on Boomea
- **Solution**: Updated to use the correct URL format: `https://app.boomea.com/rio/channels/general`
- **Result**: Users are redirected to the correct Boomea workspace

### Authentication Flow Improvements
- **Added**: `credentials: 'include'` to API requests for better cookie handling
- **Added**: Delay before redirect to ensure cookies are set
- **Added**: Multiple fallback URL formats for redirection
- **Added**: Better console logging for debugging

## API Endpoints Used

- **Login**: `POST /users/login` - Authenticate user and get session token
- **User Info**: `GET /users/me` - Get current user information
- **Teams**: `GET /users/me/teams` - Get user's teams/workspaces
- **Logout**: `POST /users/logout` - End user session

## User Experience

1. **User visits your website** and clicks "Sign In"
2. **Login modal appears** asking for Boomea credentials
3. **User enters their Boomea email and password**
4. **System authenticates** with Boomea in the background
5. **User is automatically redirected** to their Boomea workspace
6. **User is logged in** to Boomea without any additional steps

## Error Handling

The system handles various error scenarios:

- **Invalid credentials** (401): "Invalid email or password"
- **Account disabled** (403): "Access denied. Your account may be disabled"
- **Rate limiting** (429): "Too many login attempts"
- **Server errors** (500+): "Server error. Please try again later"
- **Network issues**: "Network error. Please check your connection"

## Security Considerations

- **No credential storage**: Boomea credentials are never stored locally
- **Session tokens**: Only session tokens are stored for API access
- **Secure cookies**: Boomea's session cookies are set with secure flags
- **HTTPS only**: All API calls use HTTPS
- **Token expiration**: Session tokens expire after 180 days (handled by Boomea)
- **Cross-domain security**: Proper cookie attributes for secure cross-domain authentication

## Troubleshooting

### Common Issues

1. **"Invalid email or password"**
   - Verify user has valid Boomea account
   - Check for typos in credentials
   - Ensure account is active

2. **"No session token received"**
   - Check network connectivity
   - Verify Boomea API is accessible
   - Check browser console for detailed errors

3. **User not logged in on Boomea**
   - Check if cookies are being set properly
   - Verify domain settings for cookies
   - Check browser security settings
   - **New**: Check browser console for cookie setting logs

4. **Wrong workspace redirect**
   - Check team detection logic
   - Verify user has proper team access
   - Check API response for team information
   - **New**: System now uses standardized URL format

### Debugging

Enable browser console logging to see detailed authentication flow:

```javascript
// Console will show:
🔐 Starting Boomea authentication...
🔐 Initiating Boomea authentication...
📡 API Response Status: 200 OK
🍪 Received cookies from Boomea: MMAUTHTOKEN=..., MMUSERID=...
🍪 Set cookie: MMAUTHTOKEN=...
🍪 Set local cookie: MMAUTHTOKEN=...
✅ Authentication successful!
🎫 Session token received: <token>
👤 User info retrieved: {id, username, email, ...}
🏢 Team slug determined: <teamSlug>
✅ Authentication successful, preparing redirect...
🏢 Using team slug for redirect: <teamSlug>
🚀 Trying redirect URLs: [array of possible URLs]
🚀 Redirecting to Boomea dashboard: https://app.boomea.com/rio/channels/general
```

### Recent Fixes Applied

1. **Cookie Domain Issues**: Fixed cookie setting to work properly with Boomea's domain
2. **Redirection URL**: Updated to use the correct Boomea URL format
3. **Authentication Timing**: Added delays to ensure cookies are set before redirect
4. **Error Handling**: Improved error messages and debugging information

## Future Enhancements

Potential improvements for the authentication system:

1. **Session persistence**: Remember user login across browser sessions
2. **Auto-login**: Automatically log in returning users
3. **Multi-workspace support**: Allow users to choose which workspace to access
4. **SSO integration**: Support for enterprise single sign-on
5. **Mobile optimization**: Better mobile authentication experience 