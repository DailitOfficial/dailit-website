'use client'

import { motion } from 'framer-motion'

interface DellaAIProps {
  onRequestAccess?: () => void
}

const aiFeatures = [
  {
    title: "Intelligent Call Routing",
    description: "95% first-call resolution",
    details: "AI analyzes caller intent, history, and context to route calls to the most qualified agent in under 2 seconds.",
    icon: "🎯",
    metric: "95% first-call resolution"
  },
  {
    title: "Real-Time Sentiment Analysis", 
    description: "40% improvement in CSAT",
    details: "Monitor customer emotions during calls and provide agents with real-time coaching to improve outcomes.",
    icon: "💬",
    metric: "40% improvement in CSAT"
  },
  {
    title: "Predictive Analytics",
    description: "30% cost reduction", 
    details: "Forecast call volumes, agent requirements, and customer needs with 98% accuracy using machine learning.",
    icon: "📊",
    metric: "30% cost reduction"
  },
  {
    title: "Automated Call Summaries",
    description: "85% time savings",
    details: "Generate detailed call summaries with action items, follow-ups, and key insights within seconds of call completion.",
    icon: "📝",
    metric: "85% time savings"
  }
]

const industryUseCases = [
  {
    industry: "Sales Teams",
    useCase: "Lead qualification and follow-up automation",
    improvement: "45% increase in qualified leads"
  },
  {
    industry: "Customer Support", 
    useCase: "Issue resolution and escalation management",
    improvement: "60% faster resolution times"
  },
  {
    industry: "Healthcare",
    useCase: "Patient triage and appointment scheduling",
    improvement: "80% reduction in wait times"
  }
]

const DellaAI = ({ onRequestAccess }: DellaAIProps) => {
  return (
    <section id="della-ai" className="py-24 bg-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-normal bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-200 mb-6">
            Powered by AI
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-cal-sans font-normal text-gray-900 mb-6">
            Meet DailQ AI
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our advanced AI engine that transforms every customer interaction into an opportunity 
            for better service, higher satisfaction, and increased revenue.
          </p>
        </div>

        {/* AI Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {aiFeatures.map((feature, index) => (
            <div key={index} className="group">
              <div className="relative p-6 bg-gradient-to-br from-gray-25 to-white rounded-xl border border-gray-200 hover:border-accent-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start mb-4">
                  <div className="text-2xl mr-4 mt-1">{feature.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-cal-sans font-normal text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-normal bg-success-50 text-success-700 mb-4">
                      {feature.metric}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">{feature.details}</p>
                
                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent-50/0 to-accent-50/0 group-hover:from-accent-50/30 group-hover:to-accent-50/10 transition-all duration-300 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>

        {/* Industry Use Cases */}
        <div className="mb-20">
          <h3 className="text-2xl sm:text-3xl font-cal-sans font-normal text-gray-900 mb-4 text-center">
            Industry Applications
          </h3>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            See how DailQ AI adapts to different industries and use cases
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {industryUseCases.map((useCase, index) => (
              <div key={index} className="text-center p-6 bg-gray-25 rounded-xl border border-gray-100">
                <h4 className="text-xl font-cal-sans font-normal text-gray-900 mb-4">
                  {useCase.industry}
                </h4>
                <p className="text-gray-600 mb-4">{useCase.useCase}</p>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-normal bg-accent-50 text-accent-700">
                  {useCase.improvement}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-purple-50/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-blue-200/50" />
            <div className="relative p-6 sm:p-8 lg:p-12">
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-cal-sans font-normal text-gray-900 mb-3 sm:mb-4 px-2 sm:px-0">
                Ready to Experience AI-Powered Communication?
              </h3>
              <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-xl sm:max-w-2xl mx-auto px-4 sm:px-0">
                Join forward-thinking companies that are already using DailQ AI to transform their customer communications.
              </p>
              
              <div className="flex justify-center">
                <button 
                  onClick={onRequestAccess}
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  Request Access
                  <svg className="ml-2 w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default DellaAI 