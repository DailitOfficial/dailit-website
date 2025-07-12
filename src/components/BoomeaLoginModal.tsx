'use client'

import { useState } from 'react'
import { Button } from './ui/Button'
import { boomeaAuthService, type BoomeaLoginCredentials } from '../services/boomeaAuth'

interface BoomeaLoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToRequestAccess: () => void
}

const BoomeaLoginModal = ({ isOpen, onClose, onSwitchToRequestAccess }: BoomeaLoginModalProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setShowSuccess(false)

    try {
      const credentials: BoomeaLoginCredentials = {
        email: formData.email,
        password: formData.password
      }

      console.log('🔐 Starting Boomea authentication...')

      // Step 1: Authenticate with Boomea API
      const authResult = await boomeaAuthService.login(credentials)

      if (!authResult.success) {
        setError(authResult.error || 'Login failed. Please try again.')
        setIsLoading(false)
        return
      }

      if (!authResult.token) {
        setError('Authentication failed. No session token received.')
        setIsLoading(false)
        return
      }

      console.log('✅ Authentication successful, preparing redirect...')

      // Step 2: Store authentication data
      boomeaAuthService.storeAuthData(authResult.token, formData.email, authResult.user)

      // Step 3: Show success message
      setShowSuccess(true)
      setError(null)
      setIsLoading(false)
      
      // Step 4: Redirect to Boomea dashboard with improved method
      if (authResult.teamSlug) {
        console.log('🏢 Using team slug for redirect:', authResult.teamSlug)
        boomeaAuthService.redirectToDashboardWithTeam(authResult.teamSlug)
      } else {
        console.log('🔄 Using fallback redirect')
        boomeaAuthService.redirectToDashboard('general')
      }

      // Step 5: Close the modal and reset form
      handleClose()
      
    } catch (err: any) {
      console.error('Login error:', err)
      setError('An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleClose = () => {
    setFormData({ email: '', password: '' })
    setError(null)
    setIsLoading(false)
    setShowSuccess(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Sign In to Boomea</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Authentication Successful!
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Your credentials have been verified with Boomea.</p>
                  <p className="mt-1">You will be redirected to Boomea's login page where you can sign in with the same credentials.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Boomea Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter your Boomea email"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Boomea Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter your Boomea password"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Verifying Credentials...' : 'Sign In to Boomea'}
          </Button>
        </form>

        {/* Info Box */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                How it works
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>We verify your credentials with Boomea, then redirect you to their login page where you can sign in with the same credentials.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have a Boomea account?{' '}
            <button
              onClick={onSwitchToRequestAccess}
              className="text-primary hover:text-primary-800 font-medium transition-colors"
            >
              Request Access
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default BoomeaLoginModal