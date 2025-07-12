import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Validate input
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // For development/testing purposes, we'll simulate password reset
    console.log('Development mode: Simulating password reset for:', email)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simulate successful password reset
    const data = {
      success: true,
      message: 'Password reset email sent successfully'
    }
    
    /*
    // Uncomment this when Boomea API is ready
    // Make request to Boomea password reset endpoint
    const response = await fetch('https://app.boomea.com/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Dailit-Client/1.0'
      },
      body: JSON.stringify({ email }),
    })

    const data = await response.json()
    */

    /*
    if (!response.ok) {
      let errorMessage = data.message || 'Failed to send password reset email'
      
      if (response.status === 404) {
        errorMessage = 'Email address not found. Please check your email or contact your administrator.'
      } else if (response.status === 429) {
        errorMessage = 'Too many reset attempts. Please try again later.'
      }

      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: response.status }
      )
    }

    // If reset request successful
    if (data.success || response.status === 200) {
      return NextResponse.json({
        success: true,
        message: 'Password reset email sent. Please check your inbox.'
      })
    } else {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to send password reset email' },
        { status: 400 }
      )
    }
    */

    // Development mode - always return success
    if (data.success) {
      return NextResponse.json({
        success: true,
        message: 'Password reset email sent. Please check your inbox.'
      })
    } else {
      return NextResponse.json(
        { success: false, message: 'Failed to send password reset email' },
        { status: 400 }
      )
    }

  } catch (error: any) {
    console.error('Password reset API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Network error. Please try again.' 
      },
      { status: 500 }
    )
  }
} 