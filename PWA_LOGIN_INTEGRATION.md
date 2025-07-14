# PWA Login State Management

This system automatically manages user login state in the PWA and redirects users between dailit.com and portal.dailit.com based on their authentication status.

## How It Works

### 1. Login Flow
- User clicks "Sign In" on dailit.com
- After successful login, PWA sets `dailit-login-state` to `'logged-in'` in localStorage
- If PWA is installed, user is automatically redirected to portal.dailit.com
- If not installed, normal browser redirect happens

### 2. PWA Startup Behavior
- When PWA starts, it checks `dailit-login-state` in localStorage
- If user is logged in (`'logged-in'`), PWA automatically redirects to portal.dailit.com
- If user is logged out (`'logged-out'` or null), PWA stays on dailit.com

### 3. Logout Detection
- PWA listens for logout events from multiple sources:
  - localStorage changes
  - postMessage from portal.dailit.com
  - Custom events from logout buttons

## Integration with Portal.dailit.com

### Option 1: Automatic Detection (Recommended)
The system includes automatic logout detection that monitors:
- HTTP 401/403 responses
- Clicks on logout buttons/links
- URL changes to login pages

### Option 2: Manual Integration
Add this JavaScript to your portal logout handler:

```javascript
// When user logs out in portal
function handleLogout() {
  // Your existing logout logic...
  
  // Notify PWA about logout
  localStorage.setItem('dailit-login-state', 'logged-out');
  
  // Send message to parent window (if in iframe/PWA)
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: 'logout' }, 'https://dailit.com');
  }
  
  // Redirect to main site
  window.location.href = 'https://dailit.com';
}
```

### Option 3: Server-Side Integration
Add logout detection to your portal's logout endpoint:

```javascript
// In your portal's logout API endpoint
app.post('/api/logout', (req, res) => {
  // Your logout logic...
  
  // Send logout script in response
  res.json({
    success: true,
    script: `
      localStorage.setItem('dailit-login-state', 'logged-out');
      if (window.parent !== window) {
        window.parent.postMessage({ type: 'logout' }, 'https://dailit.com');
      }
      window.location.href = 'https://dailit.com';
    `
  });
});
```

## Testing the Integration

### 1. Test Login Flow
1. Open dailit.com in browser
2. Click "Sign In" and enter credentials
3. Verify redirect to portal.dailit.com
4. Check localStorage: `dailit-login-state` should be `'logged-in'`

### 2. Test PWA Behavior
1. Install the PWA from dailit.com
2. Login through the PWA
3. Verify automatic redirect to portal.dailit.com
4. Close and reopen PWA
5. Verify it opens portal.dailit.com directly (not dailit.com)

### 3. Test Logout Flow
1. While logged in, trigger logout in portal
2. Verify redirect back to dailit.com
3. Check localStorage: `dailit-login-state` should be `'logged-out'`
4. Reopen PWA and verify it stays on dailit.com

## API Reference

### PWAAuth Utilities

```javascript
import { PWAAuth } from '@/lib/utils';

// Check if user is logged in
const isLoggedIn = PWAAuth.isLoggedIn();

// Manually set login state
PWAAuth.login();  // Sets logged-in state and triggers redirect
PWAAuth.logout(); // Sets logged-out state and triggers redirect

// Check login state
const loginState = PWAAuth.checkLoginState();
```

### Custom Events

```javascript
// Listen for login state changes
window.addEventListener('loginStateChange', (event) => {
  const { isLoggedIn } = event.detail;
  console.log('Login state changed:', isLoggedIn);
});

// Trigger login state change
const loginEvent = new CustomEvent('loginStateChange', {
  detail: { isLoggedIn: true }
});
window.dispatchEvent(loginEvent);
```

### Service Worker Messages

```javascript
// Send login state to service worker
navigator.serviceWorker.controller?.postMessage({
  type: 'SET_LOGIN_STATE',
  isLoggedIn: true
});

// Listen for service worker messages
navigator.serviceWorker.addEventListener('message', (event) => {
  if (event.data.type === 'LOGIN_STATE_CHANGED') {
    console.log('Login state changed via SW:', event.data.isLoggedIn);
  }
});
```

## localStorage Keys

- `dailit-login-state`: `'logged-in'` | `'logged-out'`

## Security Considerations

1. **Same-Origin Policy**: The system respects browser security by only accepting messages from trusted origins
2. **localStorage Isolation**: Login state is isolated per origin for security
3. **Automatic Cleanup**: Logout detection automatically cleans up login state
4. **Cross-Origin Messaging**: Only accepts logout messages from portal.dailit.com

## Troubleshooting

### PWA Not Redirecting
- Check if `dailit-login-state` is set correctly in localStorage
- Verify PWA is properly installed (standalone mode)
- Check browser console for redirect logs

### Logout Not Detected
- Verify portal logout triggers one of the detection methods
- Check if localStorage is being updated
- Ensure postMessage is sent with correct origin

### Redirect Loop
- Clear localStorage: `localStorage.removeItem('dailit-login-state')`
- Check for conflicting redirect logic in portal
- Verify origin checking in message handlers

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS PWA limitations apply)
- All modern browsers with PWA support 