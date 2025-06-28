'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Container } from './ui/Container'
import { Card } from './ui/Card'
import { Button } from './ui/Button'

type ComparisonValue = string

interface ComparisonFeature {
  feature: string
  dailit: ComparisonValue
  openphone: ComparisonValue
  googlevoice: ComparisonValue
  ringcentral: ComparisonValue
  callhippo: ComparisonValue
}

const comparisonData: ComparisonFeature[] = [
  {
    feature: 'Unlimited Domestic Calling',
    dailit: '✅ Included',
    openphone: '✅ Included',
    googlevoice: '✅ Included',
    ringcentral: '✅ Included',
    callhippo: '✅ Included'
  },
  {
    feature: 'Professional Caller ID',
    dailit: '✅ Included',
    openphone: '✅ Included',
    googlevoice: '✅ Included',
    ringcentral: '✅ Included',
    callhippo: '✅ Included'
  },
  {
    feature: 'E911 Registration',
    dailit: '✅ Included',
    openphone: '✅ Included',
    googlevoice: '✅ Included',
    ringcentral: '✅ Included',
    callhippo: '✅ Included'
  },
  {
    feature: 'Call Recording',
    dailit: '✅ Available',
    openphone: '✅ Available',
    googlevoice: '✅ Available',
    ringcentral: '✅ Available',
    callhippo: '✅ Available'
  },
  {
    feature: 'Voicemail Transcription',
    dailit: '✅ AI-Powered',
    openphone: '✅ AI-Powered',
    googlevoice: '✅ AI-Powered',
    ringcentral: '✅ Available',
    callhippo: '✅ Available'
  },
  {
    feature: 'Microsoft Teams Integration',
    dailit: '✅ Native',
    openphone: '❌ Limited',
    googlevoice: '✅ Native',
    ringcentral: '✅ Native',
    callhippo: '❌ No'
  },
  {
    feature: 'SMS/MMS Messaging',
    dailit: '✅ Included',
    openphone: '✅ Included',
    googlevoice: '✅ Included',
    ringcentral: '✅ Included',
    callhippo: '✅ Included'
  },
  {
    feature: 'API Access',
    dailit: '✅ Unlimited FREE',
    openphone: '❌ Limited',
    googlevoice: '❌ Limited',
    ringcentral: '❌ Paid Tiers',
    callhippo: '❌ Limited'
  },
  {
    feature: 'Call Center Features',
    dailit: '✅ Basic FREE',
    openphone: '❌ Not Available',
    googlevoice: '❌ Limited',
    ringcentral: '✅ Available',
    callhippo: '✅ Specialized'
  },
  {
    feature: 'AI Features',
    dailit: '🔄 DailQ AI',
    openphone: '✅ Sona AI Agent',
    googlevoice: '✅ Basic AI',
    ringcentral: '✅ AI Assistant',
    callhippo: '✅ AI Suite'
  },
  {
    feature: 'Faxing Solutions',
    dailit: '✅ Multiple Options',
    openphone: '❌ Not Available',
    googlevoice: '❌ Not Available',
    ringcentral: '✅ Available',
    callhippo: '❌ Limited'
  },
  {
    feature: 'Multi-Device Support',
    dailit: '✅ Up to 4 per user',
    openphone: '✅ Multiple',
    googlevoice: '✅ Multiple',
    ringcentral: '✅ Multiple',
    callhippo: '✅ Multiple'
  },
  {
    feature: '24/7 Support',
    dailit: '✅ Included',
    openphone: '❌ Business Hours',
    googlevoice: '❌ Limited',
    ringcentral: '✅ Available',
    callhippo: '✅ Available'
  }
]

const providers = [
  { key: 'dailit', name: 'Dail it', highlight: true },
  { key: 'openphone', name: 'OpenPhone', highlight: false },
  { key: 'googlevoice', name: 'Google Voice', highlight: false },
  { key: 'ringcentral', name: 'RingCentral', highlight: false },
  { key: 'callhippo', name: 'CallHippo', highlight: false }
]

const keyFeatures = [
  {
    icon: "📞",
    title: "Smart Call Management",
    description: "AI-powered routing and intelligent call handling",
    benefits: [
      "Auto-attendant with voice recognition",
      "Smart call routing based on context",
      "Queue management with priority handling",
      "Real-time call analytics"
    ]
  },
  {
    icon: "💬",
    title: "Unified Messaging",
    description: "All communication channels in one platform",
    benefits: [
      "SMS, MMS, and voice in single interface",
      "Team collaboration on conversations",
      "Message templates and automation",
      "Cross-platform synchronization"
    ]
  },
  {
    icon: "🤖",
    title: "DailQ AI Assistant",
    description: "Advanced AI that understands your business",
    benefits: [
      "Natural conversation understanding",
      "Automated call summaries",
      "Sentiment analysis and insights",
      "Predictive customer routing"
    ]
  },
  {
    icon: "🔗",
    title: "Seamless Integrations",
    description: "Connect with tools you already use",
    benefits: [
      "Native Microsoft Teams integration",
      "CRM synchronization",
      "Unlimited API access included",
      "Custom workflow automation"
    ]
  }
]

// Rotating feature titles
const rotatingFeatures = [
  "Communication Solutions",
  "Business Phone Systems", 
  "Team Collaboration Tools",
  "Customer Experience Platforms",
  "Unified Communications"
]

export function FeatureComparison() {
  const [currentFeature, setCurrentFeature] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % rotatingFeatures.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const getValueStyle = (value: ComparisonValue, isHighlight: boolean) => {
    const baseClass = "text-sm font-medium"
    
    if (value.startsWith('✅')) {
      return `${baseClass} ${isHighlight ? 'text-success-600' : 'text-green-600'}`
    }
    if (value.startsWith('❌')) {
      return `${baseClass} text-red-500`
    }
    if (value.startsWith('🔄')) {
      return `${baseClass} text-orange-500`
    }
    return baseClass
  }

  return (
    <section id="features" className="relative overflow-hidden scroll-mt-16">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-25/50 via-white to-primary-25/30"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-primary-100/20 to-accent-100/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-accent-100/20 to-primary-100/20 rounded-full blur-3xl"></div>
      
      <div className="relative w-full px-4 sm:px-6 lg:px-8 pt-0 pb-0">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="font-cal-sans font-normal tracking-tight text-gray-900 text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-3 sm:mb-4 max-w-4xl mx-auto">
            Compare Leading{' '}
            <span className="relative">
              <motion.span
                key={currentFeature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-primary"
              >
                {rotatingFeatures[currentFeature]}
              </motion.span>
            </span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl sm:max-w-4xl mx-auto leading-relaxed sm:leading-relaxed lg:leading-relaxed font-normal mb-4 sm:mb-6 px-2 sm:px-0">
            See why businesses choose Dail it for their communication needs. Compare features, pricing, and capabilities side-by-side with industry leaders.
          </p>

          {/* Feature Pills */}
          <div className="mb-6 sm:mb-8 mt-4 sm:mt-6 w-screen overflow-hidden -ml-4 sm:-ml-6 lg:-ml-8">
            <div className="flex gap-3 sm:gap-4 animate-scroll">
              {[
                { color: 'bg-blue-500', text: 'Enterprise Features' },
                { color: 'bg-green-500', text: 'Unlimited API Access' },
                { color: 'bg-purple-500', text: 'Native Teams Integration' },
                { color: 'bg-orange-500', text: '24/7 Support Included' },
                { color: 'bg-red-500', text: 'No Hidden Fees' },
                { color: 'bg-indigo-500', text: 'DailQ AI Assistant' }
              ].concat([
                { color: 'bg-blue-500', text: 'Enterprise Features' },
                { color: 'bg-green-500', text: 'Unlimited API Access' },
                { color: 'bg-purple-500', text: 'Native Teams Integration' },
                { color: 'bg-orange-500', text: '24/7 Support Included' },
                { color: 'bg-red-500', text: 'No Hidden Fees' },
                { color: 'bg-indigo-500', text: 'DailQ AI Assistant' }
              ]).map((item, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 shadow-sm border border-gray-200/30 flex-shrink-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-gray-700">
                    <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 ${item.color} rounded-full`}></div>
                    <span className="text-xs sm:text-xs">{item.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Key Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 sm:mb-16"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
            {keyFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative p-4 sm:p-5 lg:p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/30 hover:border-primary-300/50 transition-all duration-300 hover:shadow-lg h-full">
                  <div className="text-xl sm:text-2xl mb-3">{feature.icon}</div>
                  <h3 className="font-cal-sans font-normal text-gray-900 text-base sm:text-lg lg:text-xl mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <ul className="space-y-1 sm:space-y-1.5">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                        <div className="w-1 h-1 bg-primary rounded-full flex-shrink-0 mt-1.5"></div>
                        <span className="leading-relaxed">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Hover Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-50/0 to-accent-50/0 group-hover:from-primary-50/30 group-hover:to-accent-50/10 transition-all duration-300 pointer-events-none" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-8 sm:mb-12"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/30 overflow-hidden shadow-lg">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gradient-to-r from-gray-50/80 to-gray-50/50">
                    <th className="text-left p-4 font-cal-sans font-normal text-gray-900 text-lg">Feature</th>
                    {providers.map((provider) => (
                      <th 
                        key={provider.key} 
                        className={`text-center p-4 font-cal-sans font-normal text-lg ${
                          provider.highlight 
                            ? 'bg-gradient-to-br from-primary to-primary-700 text-white' 
                            : 'text-gray-900'
                        }`}
                      >
                        {provider.name}
                        {provider.highlight && (
                          <div className="text-xs font-normal mt-1 opacity-90">Recommended</div>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, index) => (
                    <motion.tr
                      key={row.feature}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="p-4 font-normal text-gray-900">{row.feature}</td>
                      {providers.map((provider) => (
                        <td key={provider.key} className="p-4 text-center">
                          <span className={getValueStyle(row[provider.key as keyof ComparisonFeature] as ComparisonValue, provider.highlight)}>
                            {row[provider.key as keyof ComparisonFeature] as string}
                          </span>
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4 p-4">
              {comparisonData.map((row, index) => (
                <motion.div
                  key={row.feature}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="bg-white/80 backdrop-blur-sm border border-gray-200/30 rounded-xl p-4"
                >
                  <h4 className="font-cal-sans font-normal text-gray-900 mb-3 text-lg">{row.feature}</h4>
                  <div className="space-y-2">
                    {providers.map((provider) => (
                      <div key={provider.key} className="flex justify-between items-center py-1">
                        <span className={`font-medium ${provider.highlight ? 'text-primary' : 'text-gray-600'}`}>
                          {provider.name}
                        </span>
                        <span className={getValueStyle(row[provider.key as keyof ComparisonFeature] as ComparisonValue, provider.highlight)}>
                          {row[provider.key as keyof ComparisonFeature] as string}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <div className="bg-gradient-to-br from-primary-50/50 to-accent-50/30 backdrop-blur-sm rounded-2xl border border-gray-200/30 p-6 sm:p-8 max-w-4xl mx-auto">
            <h3 className="font-cal-sans font-normal text-gray-900 text-xl sm:text-2xl lg:text-3xl mb-4">
              Why Leading Businesses Choose Dail it
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6">
              {[
                { value: "50%", label: "Cost Savings vs Competitors" },
                { value: "99.9%", label: "Uptime Guarantee" },
                { value: "24/7", label: "Support Included" },
                { value: "FREE", label: "API Access" }
              ].map((stat, index) => (
                <div key={index} className="text-center px-2">
                  <div className="font-cal-sans font-normal text-xl sm:text-2xl lg:text-3xl text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 leading-tight">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  )
} 