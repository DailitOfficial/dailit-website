'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface ContactFormData {
  name: string
  email: string
  company: string
  message: string
}

export function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
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
    
    loadSupabase()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    try {
      if (!supabaseFunctions) {
        throw new Error('Supabase not loaded')
      }

      // Save contact submission to Supabase
      await supabaseFunctions.createContactSubmission({
        name: formData.name,
        email: formData.email,
        company: formData.company || undefined,
        message: formData.message,
        source: 'contact_form'
      })
      
      console.log('Contact submission saved successfully:', formData)
      setIsSubmitted(true)
      
      // Reset form
      setFormData({ name: '', email: '', company: '', message: '' })
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000)
    } catch (err) {
      console.error('Error saving contact submission:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const contactInfo = [
    {
      title: "Get in Touch",
      description: "Have questions? We'd love to hear from you.",
      icon: "💬",
      action: "hello@dailit.com",
      href: "mailto:hello@dailit.com"
    },
    {
      title: "Schedule a Demo",
      description: "See Dail it in action with a personalized walkthrough.",
      icon: "📅",
      action: "Book a Demo",
      href: "#demo"
    },
    {
      title: "Our Location",
      description: "Proudly based in the heart of Texas.",
      icon: "📍",
      action: "Austin, TX",
      href: "#location"
    }
  ]

  return (
    <section id="contact" className="relative py-16 sm:py-20 lg:py-24 overflow-hidden scroll-mt-16">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-blue-100/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-purple-100/30 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-20"
        >
          <div className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium bg-blue-50/80 backdrop-blur-sm text-blue-700 ring-1 ring-blue-200/50 mb-6">
            📞 Get Started Today
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-cal-sans font-normal text-gray-900 mb-6 leading-tight">
            Ready to Transform Your
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Business Communications?
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Join hundreds of businesses that have already made the switch to simpler, more affordable communication.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-sm rounded-2xl border border-gray-200/50" />
            <div className="relative p-8 lg:p-10">
              <h3 className="text-2xl sm:text-3xl font-cal-sans font-normal text-gray-900 mb-2">
                Let's Talk
              </h3>
              <p className="text-gray-600 mb-8">
                Tell us about your business and we'll get back to you within 24 hours.
              </p>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6"
                >
                  <p className="text-red-700 text-sm">{error}</p>
                </motion.div>
              )}

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="text-6xl mb-4">✅</div>
                  <h4 className="text-xl font-cal-sans font-normal text-green-600 mb-2">
                    Message Sent!
                  </h4>
                  <p className="text-gray-600">
                    Thanks for reaching out. We'll get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-300"
                        placeholder="Your name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-300"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-300"
                      placeholder="Your company name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-300 resize-none"
                      placeholder="Tell us about your needs or ask any questions..."
                    />
                  </div>

                  <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        Send Message
                        <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </span>
                                          )}
                    </button>
                  </div>
                  </form>
              )}
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 group-hover:border-blue-300/50 transition-all duration-300" />
                <div className="relative p-6 lg:p-8">
                  <div className="flex items-start">
                    <div className="text-4xl mr-4 mt-1">{info.icon}</div>
                    <div className="flex-1">
                      <h4 className="text-xl font-cal-sans font-normal text-gray-900 mb-2">
                        {info.title}
                      </h4>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {info.description}
                      </p>
                      <a
                        href={info.href}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300"
                      >
                        {info.action}
                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-purple-50/80 backdrop-blur-sm rounded-2xl border border-blue-200/50" />
              <div className="relative p-6 lg:p-8">
                <h4 className="text-lg font-cal-sans font-normal text-gray-900 mb-4">
                  Why Choose Dail it?
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-cal-sans font-normal text-blue-600 mb-1">24/7</div>
                    <div className="text-sm text-gray-600">Support</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-cal-sans font-normal text-blue-600 mb-1">99.9%</div>
                    <div className="text-sm text-gray-600">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-cal-sans font-normal text-blue-600 mb-1">50%</div>
                    <div className="text-sm text-gray-600">Cost Savings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-cal-sans font-normal text-blue-600 mb-1">5min</div>
                    <div className="text-sm text-gray-600">Setup Time</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 