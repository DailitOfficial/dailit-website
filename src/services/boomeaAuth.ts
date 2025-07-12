// Boomea Authentication Service
// This service handles authentication with the Boomea API and automatic dashboard redirection

// Types for Boomea authentication
export interface BoomeaLoginCredentials {
  email: string
  password: string
}

export interface BoomeaAuthResponse {
  success: boolean
  error?: string
  token?: string
  user?: any
  teamSlug?: string
}

export interface BoomeaUser {
  id: string
  username: string
  email: string
  nickname?: string
  first_name?: string
  last_name?: string
  roles?: string
  locale?: string
  timezone?: any
  teams?: any[]
  channels?: any[]
}

// Boomea Authentication Service
class BoomeaAuthService {
  private readonly API_BASE_URL = 'https://app.boomea.com/api/v4'
  private readonly DASHBOARD_URL = 'https://app.boomea.com'

  /**
   * Authenticate user with Boomea API using Session Token Authentication
   * Simplified version that just verifies credentials
   */
  async login(credentials: BoomeaLoginCredentials): Promise<BoomeaAuthResponse> {
    try {
      console.log('🔐 Initiating Boomea authentication...')
      
      const response = await fetch(`${this.API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          login_id: credentials.email,
          password: credentials.password
        })
      })

      console.log('📡 API Response Status:', response.status, response.statusText)

      if (!response.ok) {
        let errorMessage = 'Login failed. Please try again.'
        
        if (response.status === 401) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.'
        } else if (response.status === 400) {
          errorMessage = 'Invalid request. Please check your email format and try again.'
        } else if (response.status === 403) {
          errorMessage = 'Access denied. Your account may be disabled or require verification.'
        } else if (response.status === 429) {
          errorMessage = 'Too many login attempts. Please wait a moment and try again.'
        } else if (response.status >= 500) {
          errorMessage = 'Server error. Please try again later.'
        }
        
        // Try to get more specific error from response body
        try {
          const errorData = await response.json()
          if (errorData.message || errorData.error) {
            errorMessage = errorData.message || errorData.error
          }
          console.log('❌ API Error Response:', errorData)
        } catch (e) {
          console.log('❌ Could not parse error response body')
        }
        
        return {
          success: false,
          error: errorMessage
        }
      }

      // If we get here, authentication was successful
      console.log('✅ Authentication successful!')

      // Try to get user data from response body
      let userData = null
      try {
        userData = await response.json()
        console.log('👤 User data received:', userData)
      } catch (e) {
        console.log('⚠️ Could not parse user data from response')
      }

      // Try to get token from headers
      const sessionToken = response.headers.get('token')
      if (sessionToken) {
        console.log('🎫 Session token received:', sessionToken)
      } else {
        console.log('⚠️ No session token in headers')
      }

      return {
        success: true,
        token: sessionToken || 'verified',
        user: userData,
        teamSlug: 'general'
      }

    } catch (error) {
      console.error('🚨 Boomea login error:', error)
      return {
        success: false,
        error: `Network error: ${error instanceof Error ? error.message : 'Please check your connection and try again.'}`
      }
    }
  }

  /**
   * Simple redirect to Boomea login page
   */
  redirectToDashboard(teamSlug: string): void {
    try {
      // Simple redirect to Boomea's login page
      const dashboardUrl = `${this.DASHBOARD_URL}/login?redirect_to=%2Frio%2Fchannels%2Fgeneral`
      console.log('🚀 Redirecting to Boomea login:', dashboardUrl)
      
      // Show a simple message to the user
      const message = `✅ Credentials verified!\n\nYou will now be redirected to Boomea's login page.\n\nPlease log in with the same credentials you just entered.`
      
      if (confirm(message)) {
        window.location.href = dashboardUrl
      }
    } catch (error) {
      console.error('Dashboard redirect error:', error)
      // Fallback to general dashboard
      window.location.href = this.DASHBOARD_URL
    }
  }

  /**
   * Alternative redirect method
   */
  redirectToDashboardWithTeam(teamSlug: string): void {
    this.redirectToDashboard(teamSlug)
  }

  /**
   * Logout user from Boomea session
   */
  async logout(token: string, email: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/users/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login_id: email
        })
      })

      if (response.ok) {
        console.log('✅ Logout successful')
        // Clear any stored tokens
        this.clearStoredData()
        return true
      } else {
        console.error('Logout failed:', response.status)
        return false
      }
    } catch (error) {
      console.error('Logout error:', error)
      return false
    }
  }

  /**
   * Clear any stored authentication data
   */
  private clearStoredData(): void {
    try {
      // Clear any localStorage items if they exist
      localStorage.removeItem('boomea_token')
      localStorage.removeItem('boomea_email')
      localStorage.removeItem('boomea_user')
      localStorage.removeItem('boomea_login_time')
      console.log('🧹 Cleared stored authentication data')
    } catch (error) {
      console.error('Error clearing stored data:', error)
    }
  }

  // Placeholder methods for backward compatibility
  async attemptAutoAuthentication(): Promise<boolean> {
    return false
  }

  hasValidSession(): boolean {
    return false
  }

  async validateSession(userId: string): Promise<boolean> {
    return false
  }

  storeAuthData(token: string, email: string, userData?: any): void {
    // Store minimal data for potential future use
    try {
      localStorage.setItem('boomea_token', token)
      localStorage.setItem('boomea_email', email)
      if (userData) {
        localStorage.setItem('boomea_user', JSON.stringify(userData))
      }
      localStorage.setItem('boomea_login_time', Date.now().toString())
    } catch (error) {
      console.error('Error storing auth data:', error)
    }
  }

  clearAuthData(): void {
    this.clearStoredData()
  }

  getStoredAuthData(): { token?: string; email?: string; user?: any } | null {
    try {
      const token = localStorage.getItem('boomea_token')
      const email = localStorage.getItem('boomea_email')
      const userStr = localStorage.getItem('boomea_user')
      
      if (!token || !email) {
        return null
      }

      return {
        token,
        email,
        user: userStr ? JSON.parse(userStr) : null
      }
    } catch (error) {
      console.error('Error getting stored auth data:', error)
      return null
    }
  }
}

// Export singleton instance
export const boomeaAuthService = new BoomeaAuthService()