'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase, clearAuthState } from '@/lib/supabase'
import AdminLogin from '@/components/AdminLogin'
import AdminDashboard from '@/components/AdminDashboard'
import type { User } from '@supabase/supabase-js'
import type { AdminUser } from '@/lib/supabase'

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [isProcessingAuth, setIsProcessingAuth] = useState(false)

  // Simple timeout to prevent hanging
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log('Authentication timeout - setting authLoading to false')
      setAuthLoading(false)
    }, 10000) // 10 seconds max

    return () => clearTimeout(timeout)
  }, [])

  // Check authentication status
  const checkAuthStatus = useCallback(async () => {
    if (isProcessingAuth) {
      console.log('Already processing auth, skipping...')
      return
    }

    setIsProcessingAuth(true)
    console.log('Checking authentication status...')

    try {
      // Get current session with better error handling
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('Session error:', sessionError)
        
        // Handle specific refresh token errors
        if (sessionError.message?.includes('Refresh Token Not Found') || 
            sessionError.message?.includes('Invalid Refresh Token')) {
          console.log('Refresh token error - clearing session and redirecting to login')
          // Clear all authentication state
          await clearAuthState()
          setUser(null)
          setAdminUser(null)
          return
        }
        
        setUser(null)
        setAdminUser(null)
        return
      }

      if (!session?.user) {
        console.log('No authenticated user found')
        setUser(null)
        setAdminUser(null)
        return
      }

      console.log('Found authenticated user:', session.user.email)
      setUser(session.user)

      // Check if user is admin with direct supabase call
      console.log('Checking admin status directly...')
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', session.user.email)
        .eq('is_active', true)
        .single()

      if (adminError) {
        console.error('Admin check error:', adminError)
        // If it's a "not found" error, that's expected for non-admin users
        if (adminError.code !== 'PGRST116') { // PGRST116 is "not found"
          console.error('Unexpected admin check error:', adminError)
        }
        setAdminUser(null)
        return
      }

      if (adminData) {
        console.log('Admin user found:', adminData.email, adminData.role)
        setAdminUser(adminData)
        
        // Update last login (non-blocking)
        supabase
          .from('admin_users')
          .update({ last_login: new Date().toISOString() })
          .eq('email', session.user.email)
          .then(({ error }) => {
            if (error) {
              console.warn('Failed to update last login:', error)
            }
          })
      } else {
        console.log('User is authenticated but not an admin')
        setAdminUser(null)
      }

    } catch (error) {
      console.error('Error in checkAuthStatus:', error)
      
      // Handle refresh token errors in catch block too
      if (error instanceof Error && (
        error.message?.includes('Refresh Token Not Found') || 
        error.message?.includes('Invalid Refresh Token')
      )) {
        console.log('Refresh token error in catch block - clearing session')
        await clearAuthState()
      }
      
      setUser(null)
      setAdminUser(null)
    } finally {
      setIsProcessingAuth(false)
      setAuthLoading(false)
    }
  }, [isProcessingAuth])

  // Listen for auth changes
  useEffect(() => {
    // Initial check
    checkAuthStatus()

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, !!session)
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // Wait a moment for session to be fully established
        setTimeout(() => {
          checkAuthStatus()
        }, 500)
      } else if (event === 'SIGNED_OUT') {
        console.log('Auth state change - user signed out')
        setUser(null)
        setAdminUser(null)
        setAuthLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [checkAuthStatus])

  // Handle login success
  const handleLoginSuccess = () => {
    console.log('Login success callback - checking auth status')
    // Don't call checkAuthStatus immediately - let the auth state change handler do it
    // This prevents race conditions
  }

  // Handle logout
  const handleLogout = async () => {
    console.log('Logging out...')
    try {
      await clearAuthState()
      setUser(null)
      setAdminUser(null)
    } catch (error) {
      console.error('Logout error:', error)
      // Even if logout fails, clear the state
      setUser(null)
      setAdminUser(null)
    }
  }

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6b35] mx-auto"></div>
            <p className="mt-4 text-sm text-gray-600">
              {isProcessingAuth ? 'Checking authentication...' : 'Loading...'}
          </p>
          </div>
        </div>
      </div>
    )
  }

  // Show login form if not authenticated or not admin
  if (!user || !adminUser) {
    return (
      <AdminLogin 
        onLoginSuccess={handleLoginSuccess}
      />
    )
  }

  // Show admin dashboard
  return (
    <AdminDashboard 
      adminUser={adminUser}
      onLogout={handleLogout}
    />
  )
} 