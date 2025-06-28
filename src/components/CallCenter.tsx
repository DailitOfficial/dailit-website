'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const metrics = [
  { value: "50%", label: "Lower Costs", change: "vs competitors" },
  { value: "99.9%", label: "Uptime SLA", change: "guaranteed" },
  { value: "2.1s", label: "Avg Response", change: "industry leading" },
  { value: "24/7", label: "Live Support", change: "expert team" }
]

const callCenterSolutions = [
  "Cloud Call Center Platform",
  "Automatic Call Distribution", 
  "Live Call Monitoring",
  "Predictive Auto Dialer",
  "Real-Time Analytics",
  "Queue Management System",
  "CRM Integration Hub",
  "Multi-Level IVR"
]

const keyFeatures = [
  {
    icon: "📞",
    title: "Unified Agent Interface",
    description: "Single, intuitive dashboard to manage all call center operations with real-time visibility"
  },
  {
    icon: "🎯",
    title: "Smart Call Distribution",
    description: "Route calls to the most qualified agents based on skills, availability, and customer priority"
  },
  {
    icon: "📊",
    title: "Live Analytics Dashboard",
    description: "Monitor performance metrics, call volumes, and agent productivity in real-time"
  },
  {
    icon: "🤖",
    title: "Advanced Auto Dialer",
    description: "Predictive, progressive, and preview dialing to maximize agent productivity and connect rates"
  },
  {
    icon: "👂",
    title: "Supervisor Tools",
    description: "Listen, whisper, barge, and coach agents during live calls for quality assurance"
  },
  {
    icon: "⚡",
    title: "Queue Callback System",
    description: "Reduce wait times with intelligent callback options that maintain customer satisfaction"
  }
]

const comparisonFeatures = [
  { feature: "Cloud-Based Platform", dail: true, traditional: false },
  { feature: "Unlimited Scalability", dail: true, traditional: false },
  { feature: "Real-Time Monitoring", dail: true, traditional: true },
  { feature: "Advanced Auto Dialer", dail: true, traditional: false },
  { feature: "CRM Integration", dail: true, traditional: false },
  { feature: "Mobile Agent Access", dail: true, traditional: false },
  { feature: "DNC Compliance", dail: true, traditional: true },
  { feature: "Call Recording", dail: true, traditional: true },
  { feature: "Custom Reporting", dail: true, traditional: false },
  { feature: "24/7 Support", dail: true, traditional: false }
]

const CallCenter = () => {
  const [currentSolution, setCurrentSolution] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSolution((prev) => (prev + 1) % callCenterSolutions.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="call-center" className="relative py-8 sm:py-12 md:py-16 lg:py-20 pb-0 overflow-hidden scroll-mt-16">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="absolute top-1/4 left-1/4 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-gradient-radial from-blue-100/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-gradient-radial from-purple-100/40 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <div className="inline-flex items-center rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium bg-blue-50/80 backdrop-blur-sm text-blue-700 ring-1 ring-blue-200/50 mb-4 sm:mb-6">
            ☁️ Cloud Call Center Platform
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-cal-sans font-normal text-gray-900 mb-4 sm:mb-6 leading-tight px-2 sm:px-0">
            Enterprise Call Center
            <br />
            <span className="relative">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                {callCenterSolutions[currentSolution]}
              </span>
            </span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
            Transform your customer service operations with cloud-based call center software designed for scale, efficiency, and exceptional customer experiences.
          </p>
        </motion.div>

        {/* Metrics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-12 sm:mb-16 lg:mb-20"
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200/50 group-hover:border-blue-300/50 transition-all duration-300" />
              <div className="relative p-3 sm:p-4 md:p-6 text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-cal-sans font-normal text-gray-900 mb-1">
                {metric.value}
              </div>
                <div className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
                {metric.label}
              </div>
                <div className="text-xs font-medium text-blue-600">
                {metric.change}
              </div>
            </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Key Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16 lg:mb-20"
        >
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-cal-sans font-normal text-gray-900 mb-3 sm:mb-4 px-2 sm:px-0">
              Complete Call Center Suite
              </h3>
            <p className="text-base sm:text-lg text-gray-600 max-w-xl sm:max-w-2xl mx-auto px-4 sm:px-0">
              Everything you need to run a professional call center operation, all in one cloud-based platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {keyFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 group-hover:border-blue-300/50 transition-all duration-300" />
                <div className="relative p-6 lg:p-8">
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h4 className="text-xl font-cal-sans font-normal text-gray-900 mb-3">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                    </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16 lg:mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-cal-sans font-normal text-gray-900 mb-4">
              Why Choose Dail it Call Center?
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how our cloud-based platform compares to traditional call center solutions.
            </p>
            </div>

                <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-sm rounded-2xl border border-gray-200/50" />
            <div className="relative overflow-hidden rounded-2xl">
              {/* Desktop Table */}
              <div className="hidden lg:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200/50">
                      <th className="text-left p-6 font-cal-sans font-normal text-lg text-gray-900">Feature</th>
                      <th className="text-center p-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-medium">
                          <span>✨</span>
                          Dail it Platform
                          <span className="bg-white/20 px-2 py-1 rounded-full text-xs">Recommended</span>
                        </div>
                      </th>
                      <th className="text-center p-6 font-cal-sans font-normal text-lg text-gray-900">Traditional Systems</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100/50 last:border-0">
                        <td className="p-6 font-medium text-gray-900">{item.feature}</td>
                        <td className="p-6 text-center">
                          {item.dail ? (
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-full">✓</span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-400 rounded-full">✗</span>
                          )}
                        </td>
                        <td className="p-6 text-center">
                          {item.traditional ? (
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-full">✓</span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-400 rounded-full">✗</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                      </div>
                      
              {/* Mobile Cards */}
              <div className="lg:hidden p-6 space-y-4">
                {comparisonFeatures.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-gray-200/50">
                    <span className="font-medium text-gray-900">{item.feature}</span>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Dail it</div>
                        {item.dail ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full text-sm">✓</span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-400 rounded-full text-sm">✗</span>
                        )}
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Traditional</div>
                        {item.traditional ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full text-sm">✓</span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-400 rounded-full text-sm">✗</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                      </div>
                    </div>
                  </div>
        </motion.div>

        {/* Scrolling Features Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-16 lg:mb-20 overflow-hidden"
        >
          <div className="relative">
            <div className="flex animate-scroll-left space-x-4">
              {[...callCenterSolutions, ...callCenterSolutions].map((solution, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 backdrop-blur-sm rounded-full border border-blue-200/50 text-blue-700 font-medium whitespace-nowrap"
                >
                  {solution}
                </div>
              ))}
            </div>
          </div>
        </motion.div>


      </div>
    </section>
  )
}

export default CallCenter 