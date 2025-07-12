'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { authService, type LoginCredentials } from '@/services/auth'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

type ModalView = 'login' | 'forgot-password' | 'reset-password' | 'success'

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [currentView, setCurrentView] = useState<ModalView>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    resetCode: '',
    rememberMe: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

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

  const handleLogin = async () => {
    const newErrors: Record<string, string> = {}
    
    // Check if either email or username is provided
    if (!formData.email && !formData.username) {
      newErrors.email = 'Email or username is required'
    } else if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    
    try {
      // Prepare credentials for Boomea authentication
      const credentials: LoginCredentials = {
        password: formData.password,
        rememberMe: formData.rememberMe
      }

      // Use email if provided, otherwise use username
      if (formData.email) {
        credentials.email = formData.email
      } else if (formData.username) {
        credentials.username = formData.username
      }

      // Authenticate with Boomea
      const response = await authService.login(credentials)
      
      if (response.success) {
        // Dispatch custom event to notify PWA wrapper
        const loginEvent = new CustomEvent('loginStateChange', {
          detail: { isLoggedIn: true }
        })
        window.dispatchEvent(loginEvent)
        
        // Close modal
        onClose()
        
        // Check if user is on mobile
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        
        if (isMobile) {
          // For mobile users, show a message about the redirect
          console.log('Mobile user detected - redirecting to Boomea main page')
        }
        
        // Redirect to Boomea main page (not dashboard to avoid mobile app deep linking issues)
        const redirectUrl = response.redirectUrl || 'https://app.boomea.com'
        console.log('Redirecting to:', redirectUrl)
        window.location.href = redirectUrl
      } else {
        setErrors({ general: response.message || 'Login failed. Please try again.' })
      }
    } catch (error: any) {
      console.error('Login error:', error)
      setErrors({ general: error.message || 'Network error. Please check your connection and try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setErrors({ email: 'Email is required' })
      return
    }

    if (!validateEmail(formData.email)) {
      setErrors({ email: 'Please enter a valid email address' })
      return
    }

    setIsLoading(true)
    
    try {
      // Use Boomea password reset service
      const response = await authService.resetPassword(formData.email)
      
      if (response.success) {
        setCurrentView('reset-password')
        setErrors({}) // Clear any existing errors
      } else {
        setErrors({ email: response.message || 'Failed to send reset email.' })
      }
    } catch (error: any) {
      setErrors({ general: error.message || 'Network error. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.resetCode) {
      newErrors.resetCode = 'Reset code is required'
    }
    
    if (!formData.password) {
      newErrors.password = 'New password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate API call
      setTimeout(() => {
        setCurrentView('success')
        setIsLoading(false)
        setTimeout(() => {
          setCurrentView('login')
          setFormData({
            email: formData.email,
            username: '',
            password: '',
            confirmPassword: '',
            resetCode: '',
            rememberMe: false
          })
        }, 2000)
      }, 1500)
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' })
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      resetCode: '',
      rememberMe: false
    })
    setErrors({})
    setCurrentView('login')
    setIsLoading(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const renderLoginView = () => (
    <>
      {/* App Logo and Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gray-900 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <span className="text-white font-cal-sans font-semibold text-3xl">D</span>
          <div className="absolute w-4 h-4 bg-purple-500 rounded-full ml-10 -mt-12"></div>
        </div>
        <h1 className="font-cal-sans font-bold text-gray-900 text-3xl mb-3">
          Welcome Back
        </h1>
        <p className="text-gray-500 text-base leading-relaxed">
          Sign in to access your communication portal
        </p>
      </div>

      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{errors.general}</p>
            </div>
          </div>
        </div>
      )}

      <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
        <div className="space-y-5">
          <div>
            <input
              type="text"
              id="email"
              value={formData.email || formData.username}
              onChange={(e) => {
                const value = e.target.value
                // Check if it looks like an email
                if (value.includes('@')) {
                  handleInputChange('email', value)
                  handleInputChange('username', '')
                } else {
                  handleInputChange('username', value)
                  handleInputChange('email', '')
                }
              }}
              className={`w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all ${
                errors.email ? 'ring-2 ring-red-300 bg-red-50' : ''
              }`}
              placeholder="Email or username"
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
                id="password"
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
            onClick={() => setCurrentView('forgot-password')}
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

      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm">
          New to Dail it?{' '}
          <span className="text-purple-600 font-medium">Contact your administrator</span>
        </p>
      </div>
    </>
  )

  const renderForgotPasswordView = () => (
    <>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="font-cal-sans font-bold text-gray-900 text-3xl mb-3">
          Reset Password
        </h1>
        <p className="text-gray-500 text-base leading-relaxed">
          Enter your email and we'll send you a password reset link
        </p>
      </div>

      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{errors.general}</p>
            </div>
          </div>
        </div>
      )}

      <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleForgotPassword(); }}>
        <div>
          <input
            type="email"
            id="reset-email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all ${
              errors.email ? 'ring-2 ring-red-300 bg-red-50' : ''
            }`}
            placeholder="Email address"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-600 ml-1">{errors.email}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
              Sending reset link...
            </div>
          ) : (
            'Send Reset Link'
          )}
        </button>

        <button
          type="button"
          onClick={() => setCurrentView('login')}
          className="w-full text-gray-600 hover:text-gray-800 py-3 text-base font-medium flex items-center justify-center"
          disabled={isLoading}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Sign In
        </button>
      </form>
    </>
  )

  const renderResetPasswordView = () => (
    <>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a1 1 0 001.42 0L21 7.89" />
          </svg>
        </div>
        <h1 className="font-cal-sans font-bold text-gray-900 text-3xl mb-3">
          Enter Reset Code
        </h1>
        <p className="text-gray-500 text-base leading-relaxed">
          We've sent a reset code to{' '}
          <span className="font-medium text-gray-700">{formData.email}</span>
        </p>
      </div>

      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{errors.general}</p>
            </div>
          </div>
        </div>
      )}

      <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleResetPassword(); }}>
        <div className="space-y-5">
          <div>
            <input
              type="text"
              id="reset-code"
              value={formData.resetCode}
              onChange={(e) => handleInputChange('resetCode', e.target.value)}
              className={`w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:bg-white transition-all text-center text-lg tracking-widest ${
                errors.resetCode ? 'ring-2 ring-red-300 bg-red-50' : ''
              }`}
              placeholder="000000"
              maxLength={6}
              disabled={isLoading}
            />
            {errors.resetCode && (
              <p className="mt-2 text-sm text-red-600 ml-1">{errors.resetCode}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="new-password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full px-5 py-4 pr-14 bg-gray-50 border-0 rounded-2xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:bg-white transition-all ${
                  errors.password ? 'ring-2 ring-red-300 bg-red-50' : ''
                }`}
                placeholder="New password"
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

          <div>
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirm-password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={`w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:bg-white transition-all ${
                errors.confirmPassword ? 'ring-2 ring-red-300 bg-red-50' : ''
              }`}
              placeholder="Confirm new password"
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-600 ml-1">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
              Resetting Password...
            </div>
          ) : (
            'Reset Password'
          )}
        </button>

        <button
          type="button"
          onClick={() => setCurrentView('forgot-password')}
          className="w-full text-gray-600 hover:text-gray-800 py-3 text-base font-medium flex items-center justify-center"
          disabled={isLoading}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Reset Code
        </button>
      </form>
    </>
  )

  const renderSuccessView = () => (
    <div className="text-center py-8">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="font-cal-sans font-bold text-gray-900 text-3xl mb-4">
        Password Reset Successful
      </h1>
      <p className="text-gray-500 text-base leading-relaxed mb-8">
        Your password has been successfully reset. You can now sign in with your new password.
      </p>
      <div className="flex items-center justify-center text-purple-600 text-base font-medium">
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-600 border-t-transparent mr-3"></div>
        Redirecting to sign in...
      </div>
    </div>
  )

  const getViewContent = () => {
    switch (currentView) {
      case 'login':
        return renderLoginView()
      case 'forgot-password':
        return renderForgotPasswordView()
      case 'reset-password':
        return renderResetPasswordView()
      case 'success':
        return renderSuccessView()
      default:
        return renderLoginView()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />
          
          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-md mx-auto"
            >
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Close Button */}
                {currentView !== 'success' && (
                  <button
                    onClick={handleClose}
                    className="absolute top-6 right-6 z-10 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                    disabled={isLoading}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}

                {/* Content */}
                <div className="px-8 py-10 sm:px-10 sm:py-12">
                  {getViewContent()}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
} 