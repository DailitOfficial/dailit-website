# Boomea Login Integration

This document explains the integration between Dail it's login system and Boomea's authentication platform at `https://app.boomea.com/login`.

## Overview

The login system has been updated to integrate with Boomea's authentication service instead of using a simulated login. Users can now log in with their Boomea credentials (email/username and password) and will be redirected to the Boomea dashboard.

## Key Changes

### 1. Authentication Service (`src/services/auth.ts`)
- **New**: Real authentication with Boomea API
- **Features**: 
  - Email/username login support
  - Password reset functionality
  - Token validation
  - Session management
  - Error handling

### 2. Login Modal (`src/components/LoginModal.tsx`)
- **Updated**: Now accepts both email and username
- **Integration**: Uses Boomea authentication service
- **Redirect**: Goes to `https://app.boomea.com/dashboard` after successful login
- **Error Handling**: Proper error messages for various failure scenarios

### 3. API Routes
- **`/api/auth/login`**: Handles login requests to Boomea
- **`/api/auth/reset-password`**: Handles password reset requests
- **`/api/auth/logout`**: Handles logout requests
- **`/api/auth/validate-token`**: Validates authentication tokens

### 4. PWA Integration
- **Updated**: Redirects to Boomea dashboard instead of portal.dailit.com
- **Logout Detection**: Monitors logout events from Boomea
- **State Management**: Maintains login state for PWA functionality

## How It Works

### Login Flow
1. User clicks "Sign In" in the header
2. Login modal opens with email/username and password fields
3. User enters credentials and submits
4. Request goes to `/api/auth/login` API route
5. API route forwards request to `https://app.boomea.com/login`
6. On success:
   - Authentication token is stored in localStorage
   - Login state is set to 'logged-in'
   - User is redirected to `https://app.boomea.com/dashboard`
7. On failure: Error message is displayed

### Password Reset Flow
1. User clicks "Forgot password?" in login modal
2. User enters email address
3. Request goes to `/api/auth/reset-password` API route
4. API route forwards request to Boomea's password reset endpoint
5. User receives password reset email from Boomea
6. User clicks link in email to reset password on Boomea's site

### PWA Behavior
- **When PWA is installed and user is logged in**: Automatically redirects to Boomea dashboard
- **When user logs out from Boomea**: PWA detects logout and redirects back to dailit.com
- **Cross-origin communication**: Uses postMessage for logout detection

## Technical Implementation

### Authentication Service
```typescript
// Example usage
import { authService } from '@/services/auth'

// Login
const response = await authService.login({
  email: 'user@example.com',
  password: 'password123',
  rememberMe: true
})

// Check if authenticated
const isLoggedIn = authService.isAuthenticated()

// Get current user
const user = authService.getCurrentUser()

// Logout
await authService.logout()
```

### API Routes
All API routes are located in `src/app/api/auth/` and handle:
- CORS issues by proxying requests to Boomea
- Error handling and user-friendly messages
- Input validation
- Security headers

### Error Handling
The system handles various error scenarios:
- **401 Unauthorized**: "Invalid email or password"
- **403 Forbidden**: "Account access denied. Please contact your administrator."
- **404 Not Found**: "Email address not found"
- **429 Too Many Requests**: "Too many login attempts. Please try again later."
- **Network Errors**: "Network error. Please check your connection and try again."

## Security Considerations

### 1. CORS Protection
- API routes act as proxies to avoid CORS issues
- Requests to Boomea are made server-side
- Client-side only communicates with our own API

### 2. Token Management
- Authentication tokens are stored in localStorage
- Tokens are validated on each request
- Automatic logout on token expiration

### 3. Input Validation
- Email format validation
- Password length requirements
- XSS protection through proper encoding

### 4. Error Handling
- No sensitive information in error messages
- Proper HTTP status codes
- Rate limiting protection

## Configuration

### Environment Variables
No additional environment variables are required as the integration uses public Boomea endpoints.

### API Endpoints
- **Login**: `https://app.boomea.com/login`
- **Password Reset**: `https://app.boomea.com/reset-password`
- **Logout**: `https://app.boomea.com/logout`
- **Token Validation**: `https://app.boomea.com/api/validate-token`

## Testing

### Manual Testing
1. **Login Test**:
   - Open dailit.com
   - Click "Sign In"
   - Enter valid Boomea credentials
   - Verify redirect to Boomea dashboard

2. **Invalid Credentials Test**:
   - Try logging in with invalid credentials
   - Verify appropriate error message

3. **Password Reset Test**:
   - Click "Forgot password?"
   - Enter email address
   - Verify reset email is sent

4. **PWA Test**:
   - Install PWA
   - Login through PWA
   - Verify automatic redirect to Boomea
   - Test logout detection

### Automated Testing
The system can be tested using:
- Unit tests for authentication service
- Integration tests for API routes
- E2E tests for complete login flow

## Troubleshooting

### Common Issues

1. **"Network error" message**
   - Check internet connection
   - Verify Boomea service is accessible
   - Check browser console for CORS errors

2. **"Invalid email or password"**
   - Verify credentials are correct
   - Check if account exists in Boomea
   - Ensure account is not locked

3. **PWA not redirecting**
   - Check localStorage for login state
   - Verify PWA is properly installed
   - Check browser console for errors

4. **Password reset not working**
   - Verify email address is correct
   - Check spam folder for reset email
   - Ensure email is registered in Boomea

### Debug Information
Enable debug logging by checking browser console for:
- Authentication service logs
- API request/response details
- PWA redirect logs
- Error messages

## Future Enhancements

### Potential Improvements
1. **SSO Integration**: Add support for SAML/OAuth providers
2. **Multi-factor Authentication**: Support for 2FA/MFA
3. **Session Management**: Better session handling and refresh tokens
4. **User Profile**: Display user information in the interface
5. **Remember Me**: Enhanced remember me functionality

### API Enhancements
1. **Rate Limiting**: Implement proper rate limiting
2. **Caching**: Add response caching for better performance
3. **Monitoring**: Add logging and monitoring for API usage
4. **Health Checks**: Add health check endpoints

## Support

For issues related to:
- **Boomea Integration**: Check this documentation
- **Authentication Issues**: Contact Boomea support
- **Technical Problems**: Check browser console and network tab
- **PWA Issues**: Verify PWA installation and permissions

## Migration Notes

### From Previous System
- **Admin Login**: Still uses Supabase authentication (unchanged)
- **User Login**: Now uses Boomea authentication (updated)
- **PWA Redirects**: Now goes to Boomea instead of portal.dailit.com
- **Local Storage**: Still uses `dailit-login-state` for compatibility

### Breaking Changes
- User login now requires valid Boomea credentials
- Redirect URL changed from portal.dailit.com to app.boomea.com
- Password reset now goes through Boomea system

### Backward Compatibility
- PWA login state management remains the same
- Admin authentication system unchanged
- Local storage keys unchanged 