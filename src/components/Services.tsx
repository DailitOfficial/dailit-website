'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from './ui/Card'

const solutions = [
  {
    icon: "📞",
    title: "Professional Business Phone System",
    problem: "Tired of mixing personal and business calls?",
    solution: "Get a dedicated business line that works everywhere",
    description: "Separate your business from personal communications with a professional phone system that follows you anywhere. No more missed opportunities or unprofessional impressions.",
    benefits: [
      "Dedicated business phone number",
      "Professional caller ID and voicemail",
      "Call forwarding to any device",
      "Works on mobile, desktop, and desk phones"
    ],
    color: "bg-blue-500",
    useCase: "Perfect for entrepreneurs and small business owners"
  },
  {
    icon: "🏢",
    title: "Complete Call Center Solution", 
    problem: "Need to handle high call volumes professionally?",
    solution: "Enterprise-grade call center without the enterprise cost",
    description: "Transform your business into a professional call center with intelligent routing, queue management, and real-time analytics. Scale from 1 to 1000+ agents seamlessly.",
    benefits: [
      "Intelligent call routing and distribution",
      "Real-time agent dashboards and analytics",
      "Professional hold music and messaging",
      "Advanced reporting and call monitoring"
    ],
    color: "bg-orange-500",
    useCase: "Ideal for customer service teams and sales organizations"
  },
  {
    icon: "🤖",
    title: "AI-Powered Communication Intelligence",
    problem: "Struggling to keep up with customer communications?",
    solution: "Let AI handle routine tasks and provide insights",
    description: "DailQ AI automates call routing, transcribes conversations, and provides real-time insights to help your team work smarter, not harder.",
    benefits: [
      "Automated call routing with 95% accuracy",
      "Real-time call transcription and summaries",
      "Sentiment analysis and coaching alerts",
      "Predictive analytics for demand planning"
    ],
    color: "bg-purple-500",
    useCase: "Essential for data-driven businesses and remote teams"
  },
  {
    icon: "💬",
    title: "Unified Messaging Platform",
    problem: "Juggling calls, texts, and emails across platforms?",
    solution: "All your business communications in one place",
    description: "Streamline customer interactions with SMS, MMS, voice calls, and fax all accessible from a single, unified interface that works across all your devices.",
    benefits: [
      "SMS and MMS from your business number",
      "Unified inbox for all communications",
      "Team collaboration and message sharing",
      "Automated responses and scheduling"
    ],
    color: "bg-green-500",
    useCase: "Perfect for service businesses and appointment-based companies"
  },
  {
    icon: "🔗",
    title: "Seamless Business Integrations",
    problem: "Wasting time switching between different tools?",
    solution: "Connect your phone system to your existing workflow",
    description: "Integrate with your CRM, help desk, and business tools to create a seamless workflow. Automatically log calls, sync contacts, and trigger actions.",
    benefits: [
      "Native CRM integrations (Salesforce, HubSpot)",
      "Automated call logging and contact sync",
      "Click-to-call from any application",
      "Custom workflow automation"
    ],
    color: "bg-indigo-500",
    useCase: "Must-have for sales teams and customer service departments"
  },
  {
    icon: "🔒",
    title: "Enterprise Security & Compliance",
    problem: "Concerned about communication security and compliance?",
    solution: "Bank-level security with industry compliance built-in",
    description: "Rest easy knowing your communications are protected with enterprise-grade security, compliance certifications, and comprehensive audit trails.",
    benefits: [
      "SOC 2 Type II certified infrastructure",
      "HIPAA and GDPR compliance ready",
      "End-to-end encryption for all communications",
      "Comprehensive audit logs and reporting"
    ],
    color: "bg-red-500",
    useCase: "Critical for healthcare, finance, and regulated industries"
  }
]

const stats = [
  { number: "99.9%", label: "Uptime SLA", description: "Reliable service you can count on" },
  { number: "< 50ms", label: "Call Latency", description: "Crystal clear voice quality" },
  { number: "24/7", label: "Expert Support", description: "Real humans when you need help" },
  { number: "50+", label: "Countries", description: "Global reach, local presence" }
]

export function Services() {
  const [currentSolution, setCurrentSolution] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSolution((prev) => (prev + 1) % solutions.length)
    }, 4000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="services" className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-25 via-white to-white" />
      
      <div className="relative w-full px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 pb-0">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          {/* Announcement Badge */}
          <div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-normal bg-primary-50 text-primary-700 ring-1 ring-inset ring-primary-200 mb-6 sm:mb-8">
            <span className="relative flex h-1.5 w-1.5 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary-500"></span>
            </span>
            <span>Communication Solutions</span>
          </div>

          {/* Main Headline */}
          <h2 className="font-cal-sans font-normal tracking-tight text-gray-900 text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-3 sm:mb-4 max-w-4xl mx-auto">
            <div className="mb-1 sm:mb-2">Modern Business Communication</div>
            <div className="relative h-12 sm:h-16 md:h-20 lg:h-24 overflow-hidden">
              {solutions.map((solution, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    index === currentSolution
                      ? 'opacity-100 translate-y-0'
                      : index < currentSolution
                      ? 'opacity-0 -translate-y-full'
                      : 'opacity-0 translate-y-full'
                  }`}
                >
                  <span className="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                    {solution.title.split(' ').slice(-2).join(' ')}
                  </span>
                </div>
              ))}
            </div>
          </h2>

          {/* Subheadline */}
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl sm:max-w-4xl mx-auto leading-relaxed sm:leading-relaxed lg:leading-relaxed font-normal mb-4 sm:mb-6 px-2 sm:px-0">
            Stop juggling multiple communication tools and missing important calls. Our unified platform brings{' '}
            <span className="font-normal text-gray-900">voice, messaging, and AI</span> together in one{' '}
            <span className="font-normal text-gray-900">professional solution</span>{' '}
            that grows with your business.
          </p>

          {/* Animated Solution Pills */}
          <div className="mb-6 sm:mb-8 mt-4 sm:mt-6 w-screen overflow-hidden -ml-4 sm:-ml-6 lg:-ml-8">
            <div className="animate-[scroll_25s_linear_infinite] flex gap-4 sm:gap-6 whitespace-nowrap pl-4 sm:pl-6 lg:pl-8">
              {solutions.concat(solutions).map((solution, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 shadow-sm border border-gray-200/30 flex-shrink-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-gray-700">
                    <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 ${solution.color} rounded-full`}></div>
                    <span className="text-xs sm:text-xs">{solution.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card variant="bordered" className="h-full hover:shadow-lg transition-all duration-300 group bg-white/50 backdrop-blur-sm border-gray-200/30">
                <CardContent className="p-6 sm:p-8">
                  {/* Icon and Problem Statement */}
                  <div className="text-center mb-6">
                    <div className="text-3xl sm:text-4xl mb-4">{solution.icon}</div>
                    <div className="text-xs sm:text-sm text-gray-500 mb-2">{solution.problem}</div>
                    <h3 className="font-cal-sans font-normal text-gray-900 text-lg sm:text-xl mb-2">
                      {solution.title}
                  </h3>
                    <div className="text-sm font-medium text-primary-600 mb-4">{solution.solution}</div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base text-center">
                    {solution.description}
                  </p>

                  {/* Benefits List */}
                  <ul className="space-y-3 mb-6">
                    {solution.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start">
                        <div className="w-5 h-5 bg-success-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <svg className="w-3 h-3 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700 text-sm leading-relaxed">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Use Case */}
                  <div className="bg-gray-50/50 rounded-lg p-3 border border-gray-200/30">
                    <div className="text-xs text-gray-500 mb-1">Best For:</div>
                    <div className="text-sm text-gray-700 font-medium">{solution.useCase}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-12"
        >
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/30 p-6 sm:p-8">
            <div className="text-center mb-6">
              <h3 className="font-cal-sans font-normal text-gray-900 text-xl sm:text-2xl mb-2">
                Trusted by Growing Businesses
          </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Join thousands of companies that rely on our platform daily
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="font-cal-sans font-normal text-2xl sm:text-3xl lg:text-4xl text-gray-900 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm sm:text-base font-medium text-gray-700 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    {stat.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>


      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Geometric Pattern */}
        <div className="hidden sm:block absolute top-20 right-10 w-24 sm:w-32 h-24 sm:h-32 opacity-5">
          <svg viewBox="0 0 100 100" className="w-full h-full text-primary">
            <defs>
              <pattern id="solutions-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#solutions-grid)" />
          </svg>
        </div>
        
        {/* Subtle Circles */}
        <div className="hidden sm:block absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-primary/10"></div>
        <div className="hidden sm:block absolute top-3/4 right-1/4 w-1.5 h-1.5 rounded-full bg-accent/10"></div>
        <div className="hidden sm:block absolute bottom-1/4 left-1/2 w-1 h-1 rounded-full bg-success/10"></div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-0 -translate-x-1/2 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-gradient-to-br from-primary-50/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 translate-x-1/3 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-gradient-to-tl from-accent-50/20 to-transparent rounded-full blur-3xl"></div>
      </div>
    </section>
  )
} 