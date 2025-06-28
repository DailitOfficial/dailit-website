'use client'

import { motion } from 'framer-motion'

interface AboutProps {
  onRequestAccess?: () => void
}

const companyMetrics = [
  { value: "99.9%", label: "Uptime", subtext: "Reliable service" },
  { value: "24/7", label: "Support", subtext: "Always here to help" },
  { value: "Simple", label: "Setup", subtext: "Ready in minutes" },
  { value: "Fair", label: "Pricing", subtext: "No hidden fees" }
]

const ourStory = {
  title: "Our Story",
  content: [
    "We started Dail it because we were frustrated with expensive, complicated phone systems that only big companies could afford. Every small business deserves access to professional communication tools.",
    "Our team has experience building communication platforms, but we wanted to do things differently. Instead of adding complexity, we focused on simplicity. Instead of hidden fees, we chose transparency.",
    "We're building Dail it to be the communication platform we always wished existed - powerful enough for enterprises, simple enough for startups, and affordable for everyone in between."
  ]
}

const ourMission = {
  title: "Our Mission",
  description: "To make professional communication simple, affordable, and accessible to businesses of all sizes. We believe every company deserves the tools to communicate effectively, without the complexity or cost that traditionally comes with enterprise solutions."
}

const whyDifferent = {
  title: "Why We're Different",
  points: [
    {
      title: "No Hidden Fees",
      description: "What you see is what you pay. No surprise charges, no fine print, no gotchas."
    },
    {
      title: "Simple by Design", 
      description: "We believe powerful features should be easy to use. Complexity is the enemy of good communication."
    },
    {
      title: "Built for Everyone",
      description: "From solo entrepreneurs to growing teams, our platform scales with your business needs."
    }
  ]
}

export function About({ onRequestAccess }: AboutProps) {
  return (
    <section id="about" className="relative py-16 sm:py-20 lg:py-24 overflow-hidden scroll-mt-16">
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
            🚀 Modern Communication Platform
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-cal-sans font-normal text-gray-900 mb-6 leading-tight">
            Building the Future of
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Simple Communications
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            We're building a communication platform that combines enterprise features with startup simplicity. 
            Our mission is to make powerful communication tools accessible to businesses of all sizes.
          </p>
        </motion.div>

        {/* Company Metrics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {companyMetrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 group-hover:border-blue-300/50 transition-all duration-300" />
              <div className="relative p-6 text-center">
                <div className="text-3xl sm:text-4xl font-cal-sans font-normal text-gray-900 mb-2">
                  {metric.value}
                </div>
                <div className="text-sm font-medium text-gray-900 mb-1">
                  {metric.label}
                </div>
                <div className="text-xs text-blue-600">
                  {metric.subtext}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

                 {/* Our Story */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6, delay: 0.3 }}
           className="mb-20"
         >
           <div className="relative">
             <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-sm rounded-2xl border border-gray-200/50" />
             <div className="relative p-8 lg:p-12">
               <h3 className="text-2xl sm:text-3xl lg:text-4xl font-cal-sans font-normal text-gray-900 mb-8 text-center">
                 {ourStory.title}
               </h3>
               
               <div className="max-w-4xl mx-auto space-y-6">
                 {ourStory.content.map((paragraph, index) => (
                   <motion.p
                     key={index}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ duration: 0.6, delay: index * 0.2 }}
                     className="text-lg text-gray-600 leading-relaxed"
                   >
                     {paragraph}
                   </motion.p>
                 ))}
               </div>
             </div>
           </div>
         </motion.div>

                 {/* Our Mission */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6, delay: 0.4 }}
           className="mb-20"
         >
           <div className="relative">
             <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-sm rounded-2xl border border-gray-200/50" />
             <div className="relative p-8 lg:p-12 text-center">
               <h3 className="text-2xl sm:text-3xl lg:text-4xl font-cal-sans font-normal text-gray-900 mb-8">
                 {ourMission.title}
               </h3>
               
               <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto">
                 {ourMission.description}
               </p>
             </div>
           </div>
         </motion.div>

                 {/* Why We're Different */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6, delay: 0.5 }}
           className="mb-20"
         >
           <div className="text-center mb-12">
             <h3 className="text-2xl sm:text-3xl lg:text-4xl font-cal-sans font-normal text-gray-900 mb-4">
               {whyDifferent.title}
             </h3>
             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
               We're not just another communication platform. Here's what makes us different.
             </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {whyDifferent.points.map((point, index) => (
               <motion.div
                 key={index}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.5, delay: index * 0.1 }}
                 className="relative group"
               >
                 <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 group-hover:border-blue-300/50 transition-all duration-300" />
                 <div className="relative p-8 text-center">
                   <h4 className="text-xl font-cal-sans font-normal text-gray-900 mb-4">
                     {point.title}
                   </h4>
                   <p className="text-gray-600 leading-relaxed">
                     {point.description}
                   </p>
                 </div>
               </motion.div>
             ))}
           </div>
         </motion.div>


      </div>
    </section>
  )
} 