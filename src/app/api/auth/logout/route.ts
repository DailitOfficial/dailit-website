import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Make request to Boomea logout endpoint
    const response = await fetch('https://app.boomea.com/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Dailit-Client/1.0'
      },
    })

    // Always return success for logout, even if Boomea logout fails
    // This ensures local state is cleared regardless of server response
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })

  } catch (error: any) {
    console.error('Logout API error:', error)
    
    // Still return success to ensure local state is cleared
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })
  }
} 