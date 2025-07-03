'use client'

import { useState, useEffect } from 'react'
import { Button } from './ui/Button'

interface RequestAccessModalProps {
  isOpen: boolean
  onClose: () => void
}

const RequestAccessModal = ({ isOpen, onClose }: RequestAccessModalProps) => {
  const [formData, setFormData] = useState({
    businessName: '',
    fullName: '',
    email: '',
    industry: '',
    numberOfUsers: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [supabaseFunctions, setSupabaseFunctions] = useState<any>(null)

  useEffect(() => {
    const loadSupabase = async () => {
      try {
        const supabaseModule = await import('../lib/supabase')
        setSupabaseFunctions(supabaseModule)
      } catch (error) {
        console.error('Error loading Supabase:', error)
      }
    }
    
    if (isOpen) {
      loadSupabase()
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      if (!supabaseFunctions) {
        throw new Error('Supabase not loaded')
      }

      // Save lead to Supabase
      const result = await supabaseFunctions.createLead({
        business_name: formData.businessName,
        full_name: formData.fullName,
        email: formData.email,
        industry: formData.industry,
        number_of_users: formData.numberOfUsers,
        source: 'request_access_modal'
      })

      console.log('Lead saved successfully:', result)
      setIsSubmitted(true)
    } catch (err: any) {
      console.error('Error saving lead:', err)
      
      // More detailed error messages
      let errorMessage = 'Something went wrong. Please try again.'
      
      if (err.message) {
        console.error('Error details:', err.message)
        
        // Check for specific error types
        if (err.message.includes('JWT')) {
          errorMessage = 'Authentication error. Please refresh the page and try again.'
        } else if (err.message.includes('table') || err.message.includes('relation')) {
          errorMessage = 'Database configuration error. Please contact support.'
        } else if (err.message.includes('network') || err.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        } else if (err.message.includes('duplicate') || err.message.includes('unique')) {
          errorMessage = 'An account with this email already exists. Please use a different email.'
        } else if (err.message.includes('policy')) {
          errorMessage = 'Access permission error. Please contact support.'
        }
      }
      
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleClose = () => {
    setIsSubmitted(false)
    setIsSubmitting(false)
    setError(null)
    setFormData({
      businessName: '',
      fullName: '',
      email: '',
      industry: '',
      numberOfUsers: ''
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-25 via-white to-white rounded-2xl" />
        
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:bg-white transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative p-6 sm:p-8">
          {!isSubmitted ? (
            <>
              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-normal bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-200 mb-4">
                  <span className="relative flex h-1.5 w-1.5 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent-500"></span>
                  </span>
                  Request Access
                </div>
                <h2 className="font-cal-sans font-normal text-2xl lg:text-3xl text-gray-900 mb-3">
                  Join the Future of Business Communications
                </h2>
                <p className="text-gray-600 text-sm">
                  Tell us about your business and we'll get you set up with Dialit.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="businessName" className="block text-sm font-normal text-gray-700 mb-1">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    required
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors font-normal text-sm"
                    placeholder="Enter your business name"
                  />
                </div>

                <div>
                  <label htmlFor="fullName" className="block text-sm font-normal text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors font-normal text-sm"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-normal text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors font-normal text-sm"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label htmlFor="industry" className="block text-sm font-normal text-gray-700 mb-1">
                    Industry *
                  </label>
                  <select
                    id="industry"
                    name="industry"
                    required
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors font-normal text-sm"
                  >
                    <option value="">Select your industry</option>
                    <option value="technology">Technology</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Finance</option>
                    <option value="retail">Retail</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="education">Education</option>
                    <option value="real-estate">Real Estate</option>
                    <option value="consulting">Consulting</option>
                    <option value="legal">Legal</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="numberOfUsers" className="block text-sm font-normal text-gray-700 mb-1">
                    Number of Users *
                  </label>
                  <select
                    id="numberOfUsers"
                    name="numberOfUsers"
                    required
                    value={formData.numberOfUsers}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors font-normal text-sm"
                  >
                    <option value="">Select number of users</option>
                    <option value="1-10">1-10 users</option>
                    <option value="11-50">11-50 users</option>
                    <option value="51-100">51-100 users</option>
                    <option value="101-500">101-500 users</option>
                    <option value="500+">500+ users</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full bg-primary hover:bg-primary-800 text-white border-0 font-normal mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </form>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-cal-sans font-normal text-2xl text-gray-900 mb-3">
                Request Submitted!
              </h2>
              <p className="text-gray-600 text-sm mb-6">
                Thank you for your interest in Dialit. Our sales team will be in touch ASAP to get you set up.
              </p>
              <Button
                onClick={handleClose}
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 font-normal"
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RequestAccessModal 