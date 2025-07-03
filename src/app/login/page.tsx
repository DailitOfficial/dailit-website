'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isPWA, setIsPWA] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    // Check if running as PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const isInWebAppiOS = (window.navigator as any).standalone
    const isPWAInstalled = isStandalone || isInWebAppiOS
    setIsPWA(isPWAInstalled)
    
    // Check if user is already logged in
    const checkAuthState = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        // User is logged in, redirect appropriately
        const loginState = localStorage.getItem('dailit-login-state')
        if (loginState === 'logged-in') {
          window.location.href = 'https://portal.dailit.com'
        }
      }
    }
    
    checkAuthState()
  }, [])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    
    try {
      // Use Supabase auth for real authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        console.error('Login error:', error)
        setErrors({ general: error.message || 'Invalid email or password. Please try again.' })
        setIsLoading(false)
        return
      }

      if (data.user) {
        // Set login state in localStorage
        localStorage.setItem('dailit-login-state', 'logged-in')
        
        // Dispatch custom event to notify PWA wrapper
        const loginEvent = new CustomEvent('loginStateChange', {
          detail: { isLoggedIn: true }
        })
        window.dispatchEvent(loginEvent)
        
        // Check if admin user for proper redirect
        try {
          const { data: adminData } = await supabase
            .from('admin_users')
            .select('*')
            .eq('email', formData.email)
            .eq('is_active', true)
            .single()

          if (adminData) {
            // Admin user - redirect to admin dashboard
            window.location.href = '/admin'
          } else {
            // Regular user - redirect to portal
            window.location.href = 'https://portal.dailit.com'
          }
        } catch (adminError) {
          // If admin check fails, default to portal
          window.location.href = 'https://portal.dailit.com'
        }
      }
    } catch (error) {
      console.error('Authentication error:', error)
      setErrors({ general: 'Network error. Please check your connection and try again.' })
      setIsLoading(false)
    }
  }

  const handleBrowseAsGuest = () => {
    // Redirect to main website for browsing
    window.location.href = '/'
  }

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setErrors({ email: 'Please enter your email address first' })
      return
    }

    if (!validateEmail(formData.email)) {
      setErrors({ email: 'Please enter a valid email address' })
      return
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/login`
      })

      if (error) {
        setErrors({ general: error.message })
      } else {
        setErrors({})
        alert('Password reset email sent! Check your inbox.')
      }
    } catch (error) {
      setErrors({ general: 'Failed to send password reset email. Please try again.' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md mx-auto"
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
          {/* PWA Header */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                  <span className="text-gray-900 font-cal-sans font-medium text-xl">D</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full" />
              </div>
              <div className="ml-3">
                <h1 className="text-white font-cal-sans font-semibold text-xl">Dail it.</h1>
                {isPWA && (
                  <p className="text-gray-300 text-xs">Business Phone System</p>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            {/* Welcome Message */}
            <div className="text-center mb-8">
              <h2 className="font-cal-sans font-bold text-gray-900 text-2xl mb-2">
                {isPWA ? 'Welcome Back' : 'Sign In'}
              </h2>
              <p className="text-gray-600 text-sm">
                {isPWA 
                  ? 'Access your communication portal' 
                  : 'Sign in to access your account'
                }
              </p>
            </div>

            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                <p className="text-sm text-red-700">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-5">
                <div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all ${
                      errors.email ? 'ring-2 ring-red-300 bg-red-50' : ''
                    }`}
                    placeholder="Email address"
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 ml-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`w-full px-5 py-4 pr-14 bg-gray-50 border-0 rounded-2xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all ${
                        errors.password ? 'ring-2 ring-red-300 bg-red-50' : ''
                      }`}
                      placeholder="Password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-gray-600"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-6 w-6" />
                      ) : (
                        <EyeIcon className="h-6 w-6" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600 ml-1">{errors.password}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                    className="w-5 h-5 text-purple-600 bg-gray-50 border-gray-300 rounded-lg focus:ring-purple-500 focus:ring-2"
                    disabled={isLoading}
                  />
                  <span className="ml-3 text-sm text-gray-600">Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* PWA-specific options */}
            {isPWA && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleBrowseAsGuest}
                  className="w-full text-gray-600 hover:text-gray-800 py-3 text-base font-medium flex items-center justify-center border border-gray-300 rounded-2xl hover:bg-gray-50 transition-all"
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0 9c-1.657 0-3-4.03-3-9s1.343-9 3-9m0 9c1.657 0 3 4.03 3 9s-1.343 9-3-9" />
                  </svg>
                  Browse Website
                </button>
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">
                New to Dail it?{' '}
                <span className="text-purple-600 font-medium">Contact your administrator</span>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 