import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, username, password, rememberMe } = body

    // Validate input
    if (!email && !username) {
      return NextResponse.json(
        { success: false, message: 'Email or username is required' },
        { status: 400 }
      )
    }

    if (!password) {
      return NextResponse.json(
        { success: false, message: 'Password is required' },
        { status: 400 }
      )
    }

    // Prepare login data for Boomea
    const loginData = {
      email: email || username,
      password,
      remember: rememberMe || true
    }

    // For development/testing purposes, we'll simulate a successful login
    // In production, this should be replaced with actual Boomea API call
    console.log('Development mode: Simulating Boomea login for:', loginData.email)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // For now, accept any email/password combination for testing
    // In production, this should validate against Boomea
    const data = {
      success: true,
      token: 'dev-token-' + Date.now(),
      user: {
        email: loginData.email,
        name: loginData.email.split('@')[0],
        id: 'dev-user-' + Date.now()
      }
    }
    
    /* 
    // Uncomment this when Boomea API is ready
    // Make request to Boomea login endpoint
    const response = await fetch('https://app.boomea.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Dailit-Client/1.0'
      },
      body: JSON.stringify(loginData),
    })

    // Check if response is JSON
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Non-JSON response from Boomea:', {
        status: response.status,
        statusText: response.statusText,
        contentType: contentType,
        url: response.url
      })
      
      // Try to get the response text for debugging
      const responseText = await response.text()
      console.error('Response body:', responseText.substring(0, 500)) // Log first 500 chars
      
      return NextResponse.json(
        { 
          success: false, 
          message: 'Boomea service is currently unavailable. Please try again later or contact support.' 
        },
        { status: 503 }
      )
    }

    let data
    try {
      data = await response.json()
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid response from authentication service. Please try again.' 
        },
        { status: 500 }
      )
    }

    if (!response.ok) {
      // Handle specific error cases
      let errorMessage = data.message || `Login failed: ${response.status}`
      
      if (response.status === 401) {
        errorMessage = 'Invalid email or password'
      } else if (response.status === 403) {
        errorMessage = 'Account access denied. Please contact your administrator.'
      } else if (response.status === 429) {
        errorMessage = 'Too many login attempts. Please try again later.'
      }

      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: response.status }
      )
    }
    */

    // If login successful (development mode)
    if (data.success || data.token) {
      return NextResponse.json({
        success: true,
        message: 'Login successful',
        token: data.token,
        user: data.user,
        redirectUrl: 'https://app.boomea.com/dashboard'
      })
    } else {
      return NextResponse.json(
        { success: false, message: 'Login failed' },
        { status: 400 }
      )
    }

  } catch (error: any) {
    console.error('Login API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Network error. Please check your connection and try again.' 
      },
      { status: 500 }
    )
  }
} 