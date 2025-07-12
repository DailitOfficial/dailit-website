import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    // Make request to Boomea token validation endpoint
    const response = await fetch('https://app.boomea.com/api/validate-token', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Dailit-Client/1.0'
      },
    })

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json({
        success: true,
        valid: true,
        user: data.user
      })
    } else {
      return NextResponse.json(
        { success: false, valid: false, message: 'Invalid token' },
        { status: 401 }
      )
    }

  } catch (error: any) {
    console.error('Token validation API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        valid: false,
        message: 'Token validation failed' 
      },
      { status: 500 }
    )
  }
} 