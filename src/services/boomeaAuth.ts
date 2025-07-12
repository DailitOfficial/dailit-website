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
   * Based on official Boomea API documentation
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
        // Note: credentials: 'include' removed to avoid CORS issues
        // Boomea will still set cookies automatically in the response
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

      // Extract session token from response headers
      const sessionToken = response.headers.get('token')
      if (!sessionToken) {
        console.error('❌ No session token received from Boomea API')
        return {
          success: false,
          error: 'Authentication failed. No session token received from Boomea API.'
        }
      }

      console.log('✅ Authentication successful!')
      console.log('🎫 Session token received:', sessionToken)

      // Get user information and team details
      const userInfo = await this.getUserInfo(sessionToken)
      if (!userInfo.success) {
        return {
          success: false,
          error: 'Failed to retrieve user information.'
        }
      }

      // Get team/workspace information
      const teamSlug = await this.getTeamSlug(sessionToken, userInfo.user!)

      return {
        success: true,
        token: sessionToken,
        user: userInfo.user,
        teamSlug: teamSlug
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
   * Get user information using the session token
   */
  private async getUserInfo(token: string): Promise<{ success: boolean; user?: BoomeaUser; error?: string }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        console.error('Failed to get user info:', response.status)
        return { success: false, error: 'Failed to retrieve user information' }
      }

      const userData: BoomeaUser = await response.json()
      console.log('👤 User info retrieved:', userData)
      
      return { success: true, user: userData }
    } catch (error) {
      console.error('Error getting user info:', error)
      return { success: false, error: 'Failed to retrieve user information' }
    }
  }

  /**
   * Get team/workspace slug for the user
   * This determines which workspace URL to redirect to
   */
  private async getTeamSlug(token: string, user: BoomeaUser): Promise<string> {
    try {
      // First try to get user's teams
      const response = await fetch(`${this.API_BASE_URL}/users/me/teams`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const teams = await response.json()
        if (teams && teams.length > 0) {
          // Use the first team's name as the slug
          const teamSlug = teams[0].name?.toLowerCase().replace(/\s+/g, '-') || 'general'
          console.log('🏢 Team slug determined:', teamSlug)
          return teamSlug
        }
      }

      // Fallback: use username or email prefix as team slug
      const fallbackSlug = user.username || user.email.split('@')[0]
      console.log('🔄 Using fallback team slug:', fallbackSlug)
      return fallbackSlug
    } catch (error) {
      console.error('Error getting team slug:', error)
      // Final fallback
      return 'general'
    }
  }

  /**
   * Redirect user to their Boomea workspace
   * Since we can't set cross-domain cookies, we'll redirect with instructions
   */
  redirectToDashboard(teamSlug: string): void {
    try {
      // Redirect directly to Boomea's login page with the target URL
      const dashboardUrl = `${this.DASHBOARD_URL}/login?redirect_to=%2Frio%2Fchannels%2Fgeneral`
      console.log('🚀 Redirecting to Boomea login with redirect parameter:', dashboardUrl)
      
      // Show a message to the user before redirecting
      const message = `✅ Authentication Successful!\n\nYour credentials have been verified with Boomea.\n\nYou will now be redirected to Boomea's login page.\n\nPlease log in with the same credentials:\n• Email: ${localStorage.getItem('boomea_email') || 'your email'}\n• Password: (the password you just entered)\n\nThis is required due to browser security restrictions.`
      
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
   * Alternative redirect method that provides better user experience
   */
  redirectToDashboardWithTeam(teamSlug: string): void {
    try {
      // Since we can't set cross-domain cookies, we'll redirect to Boomea's login
      // with the target URL as a parameter
      const dashboardUrl = `${this.DASHBOARD_URL}/login?redirect_to=%2Frio%2Fchannels%2Fgeneral`
      console.log('🚀 Redirecting to Boomea login with redirect parameter:', dashboardUrl)
      
      // Show a message to the user before redirecting
      const message = `✅ Authentication Successful!\n\nYour credentials have been verified with Boomea.\n\nYou will now be redirected to Boomea's login page.\n\nPlease log in with the same credentials:\n• Email: ${localStorage.getItem('boomea_email') || 'your email'}\n• Password: (the password you just entered)\n\nThis is required due to browser security restrictions.`
      
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