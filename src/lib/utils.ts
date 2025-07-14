import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
} 

// PWA Login State Management
export const PWAAuth = {
  // Set user as logged in
  login: () => {
    localStorage.setItem('dailit-login-state', 'logged-in')
    const loginEvent = new CustomEvent('loginStateChange', {
      detail: { isLoggedIn: true }
    })
    window.dispatchEvent(loginEvent)
  },

  // Set user as logged out
  logout: () => {
    localStorage.setItem('dailit-login-state', 'logged-out')
    const logoutEvent = new CustomEvent('loginStateChange', {
      detail: { isLoggedIn: false }
    })
    window.dispatchEvent(logoutEvent)
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return localStorage.getItem('dailit-login-state') === 'logged-in'
  },

  // Initialize login state check (for portal integration)
  checkLoginState: () => {
    const isLoggedIn = PWAAuth.isLoggedIn()
    return isLoggedIn
  }
}

// Portal integration script for logout detection
export const createPortalLogoutScript = () => {
  return `
    // Script to be injected into portal.dailit.com for logout detection
    (function() {
      // Listen for logout events in portal
      const originalFetch = window.fetch;
      window.fetch = function(...args) {
        return originalFetch(...args).then(response => {
          // Check if response indicates logout (401, 403, or logout endpoint)
          if (response.status === 401 || response.status === 403 || 
              (typeof args[0] === 'string' && args[0].includes('logout'))) {
            // Notify parent PWA about logout
            if (window.parent && window.parent !== window) {
              window.parent.postMessage({ type: 'logout' }, 'https://dailit.com');
            }
            // Also update localStorage directly
            localStorage.setItem('dailit-login-state', 'logged-out');
          }
          return response;
        });
      };

      // Listen for manual logout buttons/links
      document.addEventListener('click', function(event) {
        const target = event.target;
        if (target && (
          target.textContent?.toLowerCase().includes('logout') ||
          target.textContent?.toLowerCase().includes('sign out') ||
          target.classList.contains('logout') ||
          target.id?.includes('logout')
        )) {
          setTimeout(() => {
            localStorage.setItem('dailit-login-state', 'logged-out');
            if (window.parent && window.parent !== window) {
              window.parent.postMessage({ type: 'logout' }, 'https://dailit.com');
            }
          }, 100);
        }
      });

      // Check for URL changes that indicate logout
      let currentUrl = window.location.href;
      setInterval(() => {
        if (window.location.href !== currentUrl) {
          currentUrl = window.location.href;
          if (currentUrl.includes('login') || currentUrl.includes('signin') || 
              currentUrl.includes('auth') || !currentUrl.includes('portal')) {
            localStorage.setItem('dailit-login-state', 'logged-out');
            if (window.parent && window.parent !== window) {
              window.parent.postMessage({ type: 'logout' }, 'https://dailit.com');
            }
          }
        }
      }, 1000);
    })();
  `;
} 