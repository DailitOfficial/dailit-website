// Authentication service for Boomea integration
export interface LoginCredentials {
  username?: string
  email?: string
  password: string
  rememberMe?: boolean
}

export interface LoginResponse {
  success: boolean
  message?: string
  token?: string
  user?: any
  redirectUrl?: string
}

export interface AuthError {
  message: string
  code?: string
}

class AuthService {
  private baseUrl = '/api/auth'

  /**
   * Authenticate user with Boomea
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      // Validate credentials
      if (!credentials.email && !credentials.username) {
        throw new Error('Email or username is required')
      }
      if (!credentials.password) {
        throw new Error('Password is required')
      }

      // Prepare login data
      const loginData = {
        email: credentials.email || credentials.username,
        password: credentials.password,
        remember: true // Enable remember me functionality
      }

      // Make request to our login API endpoint
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(loginData),
        credentials: 'include', // Include cookies for session management
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Login failed: ${response.status}`)
      }

      const data = await response.json()

      // If login successful, set authentication state
      if (data.success || data.token || response.status === 200) {
        // Store authentication token if provided
        if (data.token) {
          localStorage.setItem('boomea-auth-token', data.token)
        }

        // Set Dailit login state for PWA integration
        localStorage.setItem('dailit-login-state', 'logged-in')
        
        // Store user info if provided
        if (data.user) {
          localStorage.setItem('dailit-user-info', JSON.stringify(data.user))
        }

                 return {
           success: true,
           message: 'Login successful',
           token: data.token,
           user: data.user,
           redirectUrl: 'https://app.boomea.com/dashboard' // Redirect to Boomea dashboard
         }
      } else {
        throw new Error(data.message || 'Login failed')
      }

    } catch (error: any) {
      console.error('Authentication error:', error)
      
      // Handle specific error cases
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        throw new Error('Invalid email or password')
      } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
        throw new Error('Account access denied. Please contact your administrator.')
      } else if (error.message.includes('429') || error.message.includes('Too Many Requests')) {
        throw new Error('Too many login attempts. Please try again later.')
      } else if (error.message.includes('503') || error.message.includes('unavailable')) {
        throw new Error('Authentication service is currently unavailable. Please try again later.')
      } else if (error.message.includes('Network') || error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection and try again.')
      }

      throw new Error(error.message || 'Login failed. Please try again.')
    }
  }

  /**
   * Logout user from Boomea
   */
  async logout(): Promise<void> {
    try {
      // Clear local storage
      localStorage.removeItem('boomea-auth-token')
      localStorage.removeItem('dailit-login-state')
      localStorage.removeItem('dailit-user-info')

      // Make logout request to our logout API endpoint
      await fetch(`${this.baseUrl}/logout`, {
        method: 'POST',
        credentials: 'include',
      }).catch(() => {
        // Ignore logout request errors as we've already cleared local state
      })

    } catch (error) {
      console.error('Logout error:', error)
      // Still clear local storage even if server logout fails
      localStorage.removeItem('boomea-auth-token')
      localStorage.removeItem('dailit-login-state')
      localStorage.removeItem('dailit-user-info')
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('boomea-auth-token')
    const loginState = localStorage.getItem('dailit-login-state')
    return !!(token && loginState === 'logged-in')
  }

  /**
   * Get current user info
   */
  getCurrentUser(): any {
    try {
      const userInfo = localStorage.getItem('dailit-user-info')
      return userInfo ? JSON.parse(userInfo) : null
    } catch {
      return null
    }
  }

  /**
   * Validate authentication token
   */
  async validateToken(): Promise<boolean> {
    try {
      const token = localStorage.getItem('boomea-auth-token')
      if (!token) return false

      const response = await fetch(`${this.baseUrl}/validate-token`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      return response.ok
    } catch {
      return false
    }
  }

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        return {
          success: true,
          message: 'Password reset email sent. Please check your inbox.'
        }
      } else {
        return {
          success: false,
          message: data.message || 'Failed to send password reset email.'
        }
      }
    } catch (error: any) {
      return {
        success: false,
        message: 'Network error. Please try again.'
      }
    }
  }
}

// Export singleton instance
export const authService = new AuthService() 