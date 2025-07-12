# Development Authentication Setup

## Current Status

The login system is currently set up in **development mode** to allow testing without requiring a live Boomea API connection.

## How It Works

### Development Mode (Current)
- **Login**: Accepts any email/password combination
- **Password Reset**: Simulates successful password reset
- **Authentication**: Generates mock tokens and user data
- **Redirect**: Still redirects to `https://app.boomea.com/dashboard` (you can change this for testing)

### Production Mode (When Ready)
- **Login**: Will connect to actual Boomea API
- **Password Reset**: Will use real Boomea password reset
- **Authentication**: Will use real Boomea tokens and user data

## Testing the Login System

### 1. Test Login
1. Go to `http://localhost:3000`
2. Click "Sign In" in the header
3. Enter any email and password (e.g., `test@example.com` / `password123`)
4. Click "Sign In"
5. You should see "Login successful" and be redirected to Boomea dashboard

### 2. Test Password Reset
1. In the login modal, click "Forgot password?"
2. Enter any email address
3. Click "Send Reset Link"
4. You should see "Password reset email sent" message

### 3. Test PWA Integration
1. Install the PWA from the website
2. Login through the PWA
3. Should redirect to Boomea dashboard
4. Test logout detection

## Files Modified for Development Mode

### API Routes
- `src/app/api/auth/login/route.ts` - Simulates login
- `src/app/api/auth/reset-password/route.ts` - Simulates password reset
- `src/app/api/auth/logout/route.ts` - Handles logout
- `src/app/api/auth/validate-token/route.ts` - Validates tokens

### Frontend Components
- `src/components/LoginModal.tsx` - Updated to use new auth service
- `src/services/auth.ts` - New authentication service
- `src/components/PWAWrapper.tsx` - Updated redirects

## Switching to Production Mode

When you're ready to connect to the real Boomea API:

### 1. Update Login API Route
In `src/app/api/auth/login/route.ts`:
```typescript
// Comment out the development code
/*
// For development/testing purposes...
*/

// Uncomment the production code
// Make request to Boomea login endpoint
const response = await fetch('https://app.boomea.com/login', {
  // ... production code
})
```

### 2. Update Password Reset API Route
In `src/app/api/auth/reset-password/route.ts`:
```typescript
// Comment out the development code
/*
// For development/testing purposes...
*/

// Uncomment the production code
// Make request to Boomea password reset endpoint
const response = await fetch('https://app.boomea.com/reset-password', {
  // ... production code
})
```

### 3. Test with Real Credentials
- Use actual Boomea user credentials
- Verify redirects work correctly
- Test password reset functionality

## Environment Variables

No additional environment variables are needed for development mode. When switching to production, you may need:

```env
# If Boomea requires API keys
NEXT_PUBLIC_BOOMEA_API_KEY=your_api_key
BOOMEA_API_SECRET=your_api_secret
```

## Troubleshooting

### Common Issues

1. **"Network error" message**
   - Check that the development server is running
   - Verify API routes are accessible at `/api/auth/*`
   - Check browser console for errors

2. **Login not working**
   - Ensure you're using the popup login (not admin login)
   - Check that the LoginModal component is being used
   - Verify the auth service is properly imported

3. **PWA not redirecting**
   - Check localStorage for `dailit-login-state`
   - Verify PWA is properly installed
   - Check browser console for redirect logs

### Debug Information

Enable debug logging by checking:
- Browser console for authentication service logs
- Network tab for API request/response details
- Application tab for localStorage changes

## Next Steps

1. **Test the current development setup** to ensure everything works
2. **Configure Boomea API** when ready for production
3. **Update API routes** to use real Boomea endpoints
4. **Test with real credentials** and real Boomea service
5. **Deploy to production** with proper error handling

## Notes

- The admin login system (`/admin`) is separate and uses Supabase authentication
- The user login system (popup) uses the new Boomea integration
- Both systems can coexist without conflicts
- PWA integration works with both systems 