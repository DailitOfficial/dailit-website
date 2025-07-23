'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Container } from './ui/Container'
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card'
import { Button } from './ui/Button'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  popular?: boolean
}

const faqData: FAQItem[] = [
  // Setup & Getting Started
  {
    id: '1',
    question: 'How long does setup take?',
    answer: 'Most businesses are up and running in 15 minutes. Our setup wizard guides you through number porting, user creation, and device configuration. For more complex integrations like Teams, allow 30 minutes.',
    category: 'Setup & Getting Started',
    popular: true
  },
  {
    id: '2',
    question: 'Can I keep my existing phone numbers?',
    answer: 'Yes, we handle number portability for free. The process typically takes 3-5 business days. We can also provide temporary numbers so your business never goes offline during the transition.',
    category: 'Setup & Getting Started',
    popular: true
  },
  {
    id: '3',
    question: 'What equipment do I need?',
    answer: 'You can use any SIP-compatible phone, our mobile app, or your computer with our web app. We also offer hardware recommendations and can ship pre-configured phones if needed.',
    category: 'Setup & Getting Started'
  },
  {
    id: '4',
    question: 'Do you provide training for my team?',
    answer: 'Yes, we include free onboarding training via video call for all plans. We also provide comprehensive documentation, video tutorials, and ongoing support.',
    category: 'Setup & Getting Started'
  },
  {
    id: '5',
    question: 'Can I test the service before committing?',
    answer: 'Absolutely! We offer a 30-day free trial with full access to all features. No credit card required to start your trial.',
    category: 'Setup & Getting Started'
  },

  // Pricing & Billing
  {
    id: '6',
    question: 'Is there a contract?',
    answer: 'No contracts required. You can cancel anytime with 30 days notice. We believe in earning your business through great service, not locking you in.',
    category: 'Pricing & Billing',
    popular: true
  },
  {
    id: '7',
    question: 'Are there any hidden fees?',
    answer: 'Never. Our pricing is completely transparent. What you see is what you pay - no setup fees, no surprise charges, no hidden costs.',
    category: 'Pricing & Billing',
    popular: true
  },
  {
    id: '8',
    question: 'How does billing work?',
    answer: 'Billing is monthly in advance. You only pay for active users. Add or remove users anytime and we prorate the billing automatically.',
    category: 'Pricing & Billing'
  },
  {
    id: '9',
    question: 'Do you offer discounts for annual payment?',
    answer: 'Yes, save 15% when you pay annually. We also offer special pricing for non-profits and educational institutions.',
    category: 'Pricing & Billing'
  },

  // Features & Capabilities
  {
    id: '10',
    question: 'What call recording options are available?',
    answer: 'All plans include unlimited call recording with automatic transcription, cloud storage, and compliance features. Recordings are encrypted and can be accessed via web portal or API.',
    category: 'Features & Capabilities',
    popular: true
  },
  {
    id: '11',
    question: 'Does it work with Microsoft Teams?',
    answer: 'Yes, we offer native Teams integration including Direct Routing, Teams Phone, and unified messaging. Your Teams becomes your complete phone system.',
    category: 'Features & Capabilities',
    popular: true
  },
  {
    id: '12',
    question: 'Can I use my mobile phone?',
    answer: 'Yes, our mobile apps for iOS and Android give you full access to all features. Make and receive calls using your business number from anywhere.',
    category: 'Features & Capabilities'
  },
  {
    id: '13',
    question: 'What about international calling?',
    answer: 'We offer competitive international rates and unlimited international calling plans. Rates start at $0.02/minute for most destinations.',
    category: 'Features & Capabilities'
  },
  {
    id: '14',
    question: 'Is call center functionality included?',
    answer: 'Basic call center features like queues, auto-attendant, and reporting are included free. Advanced features like workforce management are available as add-ons.',
    category: 'Features & Capabilities'
  },
  {
    id: '15',
    question: 'Can I send and receive faxes?',
    answer: 'Yes, we offer cloud faxing with email integration, API access, and secure transmission. Receive faxes as PDFs in your email or access via web portal.',
    category: 'Features & Capabilities'
  },

  // Technical Support
  {
    id: '16',
    question: 'What support do you provide?',
    answer: '24/7 phone, email, and chat support with real humans - no bots. Average response time is under 2 minutes for urgent issues.',
    category: 'Technical Support',
    popular: true
  },
  {
    id: '17',
    question: 'What is your uptime guarantee?',
    answer: 'We guarantee 99.9% uptime with SLA credits if we don\'t meet this standard. Our redundant infrastructure ensures maximum reliability.',
    category: 'Technical Support'
  },
  {
    id: '18',
    question: 'Do you provide emergency support?',
    answer: 'Yes, emergency support is available 24/7 for all customers. Critical issues are escalated immediately to our senior technical team.',
    category: 'Technical Support'
  },
  {
    id: '19',
    question: 'How do you handle data security?',
    answer: 'We are SOC 2 Type II certified with end-to-end encryption, secure data centers, and compliance with HIPAA, GDPR, and other regulations.',
    category: 'Technical Support'
  },

  // API & Integrations
  {
    id: '20',
    question: 'Is API access really unlimited?',
    answer: 'Yes, completely unlimited API access is included with all plans. Build as many integrations as you need without additional charges.',
    category: 'API & Integrations',
    popular: true
  },
  {
    id: '21',
    question: 'What CRM systems do you integrate with?',
    answer: 'We integrate with Salesforce, HubSpot, Microsoft Dynamics, Pipedrive, and many others. Plus unlimited custom integrations via our API.',
    category: 'API & Integrations'
  },
  {
    id: '22',
    question: 'Do you provide API documentation?',
    answer: 'Yes, comprehensive API documentation with code examples, SDKs, and sandbox environment for testing. Developer support is also available.',
    category: 'API & Integrations'
  }
]

const categories = [
  'All Categories',
  'Setup & Getting Started',
  'Pricing & Billing',
  'Features & Capabilities',
  'Technical Support',
  'API & Integrations'
]

export function FAQ() {
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [searchTerm, setSearchTerm] = useState('')
  const [openItems, setOpenItems] = useState<string[]>(['1', '6', '10']) // Open popular ones by default

  const filteredFAQs = faqData.filter(faq => {
    const categoryMatch = selectedCategory === 'All Categories' || faq.category === selectedCategory
    const searchMatch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    return categoryMatch && searchMatch
  })

  const popularFAQs = faqData.filter(faq => faq.popular)

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  return (
    <section id="faq" className="py-12 sm:py-16 lg:py-20 bg-white">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-gray-900 mb-3 sm:mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
            Get instant answers to common questions about Dail it. 
            Can't find what you're looking for? Our support team is here to help.
          </p>
        </motion.div>

        {/* Popular FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-12 lg:mb-16"
        >
          <h3 className="text-xl sm:text-2xl font-normal text-gray-900 mb-4 sm:mb-6 lg:mb-8">Most Popular Questions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {popularFAQs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -3 }}
              >
                <div onClick={() => toggleItem(faq.id)}>
                  <Card variant="bordered" className="h-full hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4 sm:p-5 lg:p-6">
                      <div className="flex items-start justify-between mb-2 sm:mb-3">
                        <h4 className="font-normal text-gray-900 flex-1 pr-3 sm:pr-4 text-sm sm:text-base">
                          {faq.question}
                        </h4>
                        <span className="text-primary text-lg sm:text-xl flex-shrink-0">
                          {openItems.includes(faq.id) ? '−' : '+'}
                        </span>
                      </div>
                      <AnimatePresence>
                        {openItems.includes(faq.id) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Search and Categories */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-10 lg:mb-12"
        >
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="w-full">
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:max-w-md px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-xs sm:text-sm ${
                    selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* All FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-12 lg:mb-16"
        >
          <h3 className="text-xl sm:text-2xl font-normal text-gray-900 mb-4 sm:mb-6 lg:mb-8">
            {selectedCategory === 'All Categories' ? 'All Questions' : selectedCategory}
            <span className="text-gray-500 text-base sm:text-lg ml-2">({filteredFAQs.length})</span>
          </h3>
          
          <Card variant="bordered">
            <CardContent className="p-0">
              {filteredFAQs.map((faq, index) => (
                <div key={faq.id}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    <button
                      onClick={() => toggleItem(faq.id)}
                      className="w-full p-4 sm:p-5 lg:p-6 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 pr-3 sm:pr-4">
                          <h4 className="font-normal text-gray-900 mb-1 text-sm sm:text-base">
                            {faq.question}
                          </h4>
                          <span className="text-xs sm:text-sm text-primary font-medium">
                            {faq.category}
                          </span>
                        </div>
                        <span className="text-primary text-lg sm:text-xl flex-shrink-0">
                          {openItems.includes(faq.id) ? '−' : '+'}
                        </span>
                      </div>
                    </button>
                    
                    <AnimatePresence>
                      {openItems.includes(faq.id) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 sm:px-5 lg:px-6 pb-4 sm:pb-5 lg:pb-6">
                            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Support CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card variant="elevated" className="bg-gradient-to-r from-secondary to-primary text-white">
            <CardContent className="p-6 sm:p-8 lg:p-12 text-center">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-normal mb-3 sm:mb-4">
                Still Have Questions?
              </h3>
              <p className="text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto px-4 sm:px-0">
                Our support team is available 24/7 to help you get the answers you need. 
                Average response time is under 2 minutes.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 text-sm sm:text-base"
                  href="tel:1-800-DAIL-IT"
                >
                  Call 1-800-DAIL-IT
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="bg-transparent border-white/30 text-white hover:bg-white/10 text-sm sm:text-base"
                  href="#contact"
                >
                  Contact Support
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mt-6 sm:mt-8 text-xs sm:text-sm opacity-75">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white rounded-full"></div>
                  <span>24/7 Human Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white rounded-full"></div>
                  <span>2-Minute Response Time</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white rounded-full"></div>
                  <span>No Chatbots</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </section>
  )
}