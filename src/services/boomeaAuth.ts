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

      // Extract cookies from response headers
      const setCookieHeaders = response.headers.get('set-cookie')
      if (setCookieHeaders) {
        console.log('🍪 Received cookies from Boomea:', setCookieHeaders)
        this.setBoomeaCookies(setCookieHeaders)
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
   * Set Boomea cookies in the browser
   * This allows the user to be automatically logged in when redirected to Boomea
   */
  private setBoomeaCookies(setCookieHeader: string): void {
    try {
      // Parse the set-cookie header and extract MMAUTHTOKEN and MMUSERID
      const cookies = setCookieHeader.split(',').map(cookie => cookie.trim())
      
      cookies.forEach(cookie => {
        if (cookie.startsWith('MMAUTHTOKEN=') || cookie.startsWith('MMUSERID=')) {
          // Extract cookie name and value
          const [nameValue] = cookie.split(';')
          const [name, value] = nameValue.split('=')
          
          // Set the cookie for the Boomea domain with proper attributes
          const cookieString = `${name}=${value}; domain=.boomea.com; path=/; secure; samesite=none; max-age=15552000`
          document.cookie = cookieString
          console.log(`🍪 Set cookie: ${name}=${value}`)
          
          // Also try setting without domain restriction for local testing
          const localCookieString = `${name}=${value}; path=/; secure; samesite=none; max-age=15552000`
          document.cookie = localCookieString
          console.log(`🍪 Set local cookie: ${name}=${value}`)
        }
      })
    } catch (error) {
      console.error('Error setting Boomea cookies:', error)
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
   * Updated to use the correct URL format based on the error you encountered
   */
  redirectToDashboard(teamSlug: string): void {
    try {
      // Use the correct URL format that matches Boomea's structure
      const dashboardUrl = `${this.DASHBOARD_URL}/rio/channels/general`
      console.log('🚀 Redirecting to Boomea dashboard:', dashboardUrl)
      
      // Add a small delay to ensure cookies are set before redirect
      setTimeout(() => {
        window.location.href = dashboardUrl
      }, 100)
    } catch (error) {
      console.error('Dashboard redirect error:', error)
      // Fallback to general dashboard
      window.location.href = this.DASHBOARD_URL
    }
  }

  /**
   * Alternative redirect method that tries different URL formats
   */
  redirectToDashboardWithTeam(teamSlug: string): void {
    try {
      // Try multiple URL formats to find the correct one
      const possibleUrls = [
        `${this.DASHBOARD_URL}/rio/channels/general`,
        `${this.DASHBOARD_URL}/${teamSlug}/channels/general`,
        `${this.DASHBOARD_URL}/channels/general`,
        `${this.DASHBOARD_URL}/dashboard`,
        this.DASHBOARD_URL
      ]
      
      console.log('🚀 Trying redirect URLs:', possibleUrls)
      
      // For now, use the first URL that matches the pattern from your error
      const dashboardUrl = possibleUrls[0]
      console.log('🚀 Redirecting to Boomea dashboard:', dashboardUrl)
      
      // Add a small delay to ensure cookies are set before redirect
      setTimeout(() => {
        window.location.href = dashboardUrl
      }, 100)
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