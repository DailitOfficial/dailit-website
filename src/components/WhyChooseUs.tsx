'use client'

import { motion } from 'framer-motion'

interface Advantage {
  title: string
  description: string
  icon: string
  highlight?: boolean
}

const advantages: Advantage[] = [
  {
    title: 'Enterprise Features',
    description: 'Professional capabilities at small business prices',
    icon: '🏢',
    highlight: true
  },
  {
    title: 'No Hidden Fees',
    description: 'Transparent pricing with all essentials included',
    icon: '💰',
    highlight: false
  },
  {
    title: 'Unlimited API',
    description: 'Free API access means no integration limits',
    icon: '🔗',
    highlight: true
  },
  {
    title: 'Native Teams',
    description: 'Seamless Microsoft Teams integration built-in',
    icon: '🎯',
    highlight: false
  },
  {
    title: '24/7 Support',
    description: 'Real human experts available around the clock',
    icon: '⚡',
    highlight: true
  },
  {
    title: 'Quick Setup',
    description: 'Get started in 15 minutes with full onboarding',
    icon: '🔧',
    highlight: false
  }
]

export function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="relative overflow-hidden scroll-mt-16">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-25/30 via-white to-primary-25/20"></div>
      
      <div className="relative w-full px-4 sm:px-6 lg:px-8 pt-0 pb-16 sm:pb-20 lg:pb-24">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="font-cal-sans font-normal tracking-tight text-gray-900 text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 max-w-3xl mx-auto">
            Why Choose Dail it
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed font-normal px-2 sm:px-0">
            Built for modern businesses that demand reliability, flexibility, and growth without the enterprise price tag.
          </p>
        </motion.div>

        {/* Advantages Grid - Compact */}
                 <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6, delay: 0.2 }}
           className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 max-w-7xl mx-auto"
         >
          {advantages.map((advantage, index) => (
            <motion.div
              key={advantage.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group"
            >
                             <div className={`relative p-3 sm:p-4 lg:p-5 bg-white/80 backdrop-blur-sm rounded-xl border transition-all duration-300 hover:shadow-md h-full ${
                 advantage.highlight 
                   ? 'border-primary-200/50 bg-gradient-to-br from-primary-25/30 to-white' 
                   : 'border-gray-200/30 hover:border-primary-200/50'
               }`}>
                 <div className="flex items-start gap-2 sm:gap-3">
                   <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-base sm:text-lg ${
                     advantage.highlight 
                       ? 'bg-primary-100/50 text-primary' 
                       : 'bg-gray-100 text-gray-600'
                   }`}>
                     {advantage.icon}
                   </div>
                   <div className="flex-1 min-w-0">
                     <h3 className={`font-cal-sans font-normal text-sm sm:text-base lg:text-lg mb-1 ${
                       advantage.highlight ? 'text-primary' : 'text-gray-900'
                     }`}>
                       {advantage.title}
                     </h3>
                     <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                       {advantage.description}
                     </p>
                   </div>
                 </div>
                
                {/* Subtle hover effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-50/0 to-accent-50/0 group-hover:from-primary-50/20 group-hover:to-accent-50/10 transition-all duration-300 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
} 