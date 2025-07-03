'use client'

import { useState, useEffect } from 'react'
import { Button } from './ui/Button'

interface HeroProps {
  onRequestAccess?: () => void
}

const Hero = ({ onRequestAccess }: HeroProps) => {
  const [currentTagline, setCurrentTagline] = useState(0)
  
  const taglines = [
    "Smarter. Faster. Clearer.",
    "Hosted. Routed. Delivered.",
    "Connect. Collaborate. Close.",
    "Call. Text. Automate.",
    "Track. Route. Resolve.",
    "Answer. Analyze. Act.",
    "Click. Speak. Scale.",
    "Secure. Stable. Streamlined.",
    "Simplified. Unified. Amplified.",
    "Modern. Mobile. Managed."
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTagline((prev) => (prev + 1) % taglines.length)
    }, 3000)
    
    return () => clearInterval(interval)
  }, [taglines.length])

  return (
    <section className="relative overflow-hidden bg-white hero-full-height hero-mobile-full flex flex-col">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-25 via-white to-white" />
      
      <div className="relative w-full px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
        {/* Main content, centered vertically */}
        <div className="flex-1 flex flex-col justify-center pt-16 md:pt-8">
          <div className="text-center">
            {/* Announcement Badge */}
            <div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-normal bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-200 mb-4 sm:mb-6">
              <span className="relative flex h-1.5 w-1.5 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent-500"></span>
              </span>
              <span className="hidden sm:inline">Exclusive Beta • Invitation Only</span>
              <span className="sm:hidden">Beta • Invite Only</span>
            </div>

            {/* Animated Headline */}
            <div className="font-cal-sans font-normal tracking-tight text-gray-900 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-4 sm:mb-6 max-w-4xl mx-auto">
              <div className="mb-1 sm:mb-2">Business Communications</div>
              <div className="grid overflow-hidden">
                {taglines.map((tagline, index) => (
                  <div
                    key={index}
                    style={{ gridColumn: 1, gridRow: 1 }}
                    className={`transition-all duration-700 ease-in-out ${
                      index === currentTagline
                        ? 'opacity-100 translate-y-0'
                        : index < currentTagline
                        ? 'opacity-0 -translate-y-full'
                        : 'opacity-0 translate-y-full'
                    }`}
                  >
                    <span className="bg-gradient-to-r from-accent-600 to-accent-500 bg-clip-text text-transparent">
                      {tagline}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Subheadline */}
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto leading-relaxed font-normal mb-6 sm:mb-8 px-2 sm:px-0">
              A modern VoIP solution built for the way today's teams communicate — smooth conversations, fast connections, and{' '}
              <span className="font-normal text-gray-900">flexible virtual numbers</span>, all in a{' '}
              <span className="font-normal text-gray-900">unified workspace</span>{' '}
              designed for real business. With a touch of AI, Dialit keeps things running — even when you're not.
            </p>

            {/* Animated Communication Features */}
            <div className="mb-6 sm:mb-8 mt-3 sm:mt-4 md:mt-6 w-screen overflow-hidden -ml-4 sm:-ml-6 lg:-ml-8">
              <div className="animate-[scroll_20s_linear_infinite] flex gap-3 sm:gap-4 md:gap-6 whitespace-nowrap pl-4 sm:pl-6 lg:pl-8">
                {/* Feature Pills */}
                {[
                  { color: 'bg-blue-500', text: 'Voice & VoIP Calling' },
                  { color: 'bg-green-500', text: 'SMS & MMS Messaging' },
                  { color: 'bg-purple-500', text: 'AI Call Transcription' },
                  { color: 'bg-orange-500', text: 'Call Center Operations' },
                  { color: 'bg-red-500', text: 'Fax & eFax Services' },
                  { color: 'bg-indigo-500', text: 'DailQ AI Automation' }
                ].concat([
                  { color: 'bg-blue-500', text: 'Voice & VoIP Calling' },
                  { color: 'bg-green-500', text: 'SMS & MMS Messaging' },
                  { color: 'bg-purple-500', text: 'AI Call Transcription' },
                  { color: 'bg-orange-500', text: 'Call Center Operations' },
                  { color: 'bg-red-500', text: 'Fax & eFax Services' },
                  { color: 'bg-indigo-500', text: 'DailQ AI Automation' }
                ]).map((item, index) => (
                  <div key={index} className="bg-white/80 backdrop-blur-sm rounded-full px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 shadow-sm border border-gray-200/30 flex-shrink-0">
                    <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 text-xs text-gray-700">
                      <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 ${item.color} rounded-full`}></div>
                      <span className="text-[10px] sm:text-xs">{item.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Cards - Responsive Layout */}
            <div className="mb-6 sm:mb-8">
              {/* Desktop Layout - Single Row */}
              <div className="hidden lg:flex justify-center items-center gap-8 xl:gap-12 max-w-6xl mx-auto">
                <div className="flex items-center gap-4 min-w-fit">
                  <div className="w-12 h-12 rounded-lg border-2 border-primary/20 flex items-center justify-center">
                    <img src="/ai.png" alt="AI Integration" className="w-10 h-10" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-cal-sans font-normal text-gray-900 text-base">DailQ AI Integration</h3>
                    <p className="text-sm text-gray-600">AI-powered routing</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 min-w-fit">
                  <div className="w-12 h-12 rounded-lg border-2 border-accent/20 flex items-center justify-center">
                    <img src="/callcenter.png" alt="Call Center" className="w-10 h-10" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-cal-sans font-normal text-gray-900 text-base">Call Center Ready</h3>
                    <p className="text-sm text-gray-600">Complete contact center</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 min-w-fit">
                  <div className="w-12 h-12 rounded-lg border-2 border-success/20 flex items-center justify-center">
                    <img src="/anywhere.png" alt="Works Anywhere" className="w-10 h-10" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-cal-sans font-normal text-gray-900 text-base">Works Anywhere</h3>
                    <p className="text-sm text-gray-600">Internet connection required</p>
                  </div>
                </div>
              </div>

              {/* Tablet Layout - Stacked but Compact */}
              <div className="hidden sm:grid lg:hidden grid-cols-1 gap-3 max-w-md mx-auto">
                <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm rounded-xl p-3 border border-gray-200/30">
                  <div className="w-8 h-8 rounded-lg border-2 border-primary/20 flex items-center justify-center flex-shrink-0">
                    <img src="/ai.png" alt="AI Integration" className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-cal-sans font-normal text-gray-900 text-sm">DailQ AI Integration</h3>
                    <p className="text-xs text-gray-600">AI-powered routing</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm rounded-xl p-3 border border-gray-200/30">
                  <div className="w-8 h-8 rounded-lg border-2 border-accent/20 flex items-center justify-center flex-shrink-0">
                    <img src="/callcenter.png" alt="Call Center" className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-cal-sans font-normal text-gray-900 text-sm">Call Center Ready</h3>
                    <p className="text-xs text-gray-600">Complete contact center</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm rounded-xl p-3 border border-gray-200/30">
                  <div className="w-8 h-8 rounded-lg border-2 border-success/20 flex items-center justify-center flex-shrink-0">
                    <img src="/anywhere.png" alt="Works Anywhere" className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-cal-sans font-normal text-gray-900 text-sm">Works Anywhere</h3>
                    <p className="text-xs text-gray-600">Internet connection required</p>
                  </div>
                </div>
              </div>

              {/* Mobile Layout - Stacked Grid */}
              <div className="sm:hidden grid grid-cols-1 gap-2 max-w-sm mx-auto px-4">
                <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-xl p-2.5 border border-gray-200/30">
                  <div className="w-6 h-6 rounded-lg border-2 border-primary/20 flex items-center justify-center flex-shrink-0">
                    <img src="/ai.png" alt="AI Integration" className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-cal-sans font-normal text-gray-900 text-xs">DailQ AI Integration</h3>
                    <p className="text-[10px] text-gray-600">AI-powered routing</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-xl p-2.5 border border-gray-200/30">
                  <div className="w-6 h-6 rounded-lg border-2 border-accent/20 flex items-center justify-center flex-shrink-0">
                    <img src="/callcenter.png" alt="Call Center" className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-cal-sans font-normal text-gray-900 text-xs">Call Center Ready</h3>
                    <p className="text-[10px] text-gray-600">Complete contact center</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-xl p-2.5 border border-gray-200/30">
                  <div className="w-6 h-6 rounded-lg border-2 border-success/20 flex items-center justify-center flex-shrink-0">
                    <img src="/anywhere.png" alt="Works Anywhere" className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-cal-sans font-normal text-gray-900 text-xs">Works Anywhere</h3>
                    <p className="text-[10px] text-gray-600">Internet connection required</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Group: CTA Button + Trust Indicators */}
        <div className="pb-4">
          {/* CTA Section */}
          <div className="max-w-md mx-auto px-4 sm:px-0 mb-4">
            <div className="flex justify-center">
              <Button 
                variant="primary"
                size="md"
                className="bg-primary hover:bg-primary-800 text-white border-0 font-normal w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={onRequestAccess}
              >
                Request Access
              </Button>
            </div>
          </div>
          {/* Trust Indicators */}
          <div className="relative">
            <div className="bg-white/90 backdrop-blur-sm border-t border-gray-200/30 py-2 sm:py-3 md:py-4 rounded-t-xl">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-6 text-[10px] sm:text-xs md:text-sm text-gray-600">
                  <div className="flex items-center gap-1 sm:gap-2">
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-success-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                    <span className="whitespace-nowrap font-medium">SOC 2 Compliant</span>
                </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-success-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                    <span className="whitespace-nowrap font-medium">99.9% Uptime SLA</span>
                </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-success-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                    <span className="whitespace-nowrap font-medium">24/7 Enterprise Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Geometric Pattern - Hidden on Mobile */}
        <div className="hidden sm:block absolute top-20 right-10 w-24 sm:w-32 h-24 sm:h-32 opacity-5">
          <svg viewBox="0 0 100 100" className="w-full h-full text-accent">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        
        {/* Subtle Circles - Responsive Positioning */}
        <div className="hidden sm:block absolute top-1/3 left-1/4 w-2 h-2 rounded-full bg-primary/10"></div>
        <div className="hidden sm:block absolute top-2/3 right-1/3 w-1.5 h-1.5 rounded-full bg-accent/10"></div>
        <div className="hidden sm:block absolute bottom-1/3 left-1/3 w-1 h-1 rounded-full bg-success/10"></div>
        
        {/* Gradient Orbs - Responsive Sizing */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] sm:w-[250px] md:w-[400px] h-[200px] sm:h-[250px] md:h-[400px] bg-gradient-to-br from-accent-50/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-[150px] sm:w-[200px] md:w-[300px] h-[150px] sm:h-[200px] md:h-[300px] bg-gradient-to-tl from-primary-50/20 to-transparent rounded-full blur-3xl"></div>
      </div>
    </section>
  )
}

export default Hero 