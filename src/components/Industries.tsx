'use client'

import { motion } from 'framer-motion'
import { Container } from './ui/Container'
import { Card, CardContent } from './ui/Card'
import { Button } from './ui/Button'

interface Industry {
  title: string
  description: string
  icon: string
  useCase: string
}

const industries: Industry[] = [
  {
    title: 'Small & Medium Businesses',
    description: 'Perfect for growing teams that need professional communication tools without enterprise complexity.',
    icon: '🏪',
    useCase: 'Scale from 5 to 500+ employees seamlessly'
  },
  {
    title: 'Startups & Growing Companies',
    description: 'Flexible solutions that adapt as your business evolves, with transparent pricing and no hidden fees.',
    icon: '🚀',
    useCase: 'Launch professional communications from day one'
  },
  {
    title: 'Professional Services',
    description: 'Legal, healthcare, consulting firms require secure, compliant communication with call recording.',
    icon: '⚖️',
    useCase: 'HIPAA-ready with professional call recording'
  },
  {
    title: 'Retail & E-commerce',
    description: 'Multi-location support with unified messaging and customer service call management.',
    icon: '🛍️',
    useCase: 'Connect all locations with centralized management'
  },
  {
    title: 'Education & Non-profits',
    description: 'Cost-effective solutions for educational institutions and non-profit organizations.',
    icon: '🎓',
    useCase: 'Budget-friendly with enterprise features'
  },
  {
    title: 'Telecom Resellers & Partners',
    description: 'White-label opportunities and partner programs for telecom professionals and resellers.',
    icon: '🤝',
    useCase: 'Expand your service offerings with our platform'
  }
]

export function Industries() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  }

  return (
    <section className="py-20 bg-white">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-normal text-gray-900 mb-4">
            Industries We Serve
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From startups to established enterprises, Dail it adapts to your industry's 
            unique communication needs with specialized features and compliance support.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {industries.map((industry, index) => (
            <motion.div
              key={industry.title}
              variants={cardVariants}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <Card 
                variant="bordered" 
                className="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/30 group"
              >
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 text-3xl group-hover:from-primary/20 group-hover:to-secondary/20 transition-colors duration-300">
                      {industry.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-normal text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300">
                    {industry.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {industry.description}
                  </p>

                  <div className="bg-gray-50 rounded-lg p-4 group-hover:bg-primary/5 transition-colors duration-300">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-secondary rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700 font-medium">{industry.useCase}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16"
        >
          <Card variant="elevated" className="bg-gradient-to-r from-primary to-secondary text-white">
            <CardContent className="p-8 lg:p-12 text-center">
              <h3 className="text-2xl lg:text-3xl font-normal mb-4">
                Don't See Your Industry?
              </h3>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                Our flexible platform adapts to any business communication need. 
                Let's discuss how Dail it can serve your specific industry requirements.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                  href="#contact"
                >
                  Discuss Your Needs
                </Button>
                
                <div className="flex items-center justify-center gap-4 text-sm opacity-80">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Custom Solutions Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Expert Consultation</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-normal text-primary mb-1">500+</div>
              <div className="text-gray-600">Happy Clients</div>
            </div>
            <div>
              <div className="text-3xl font-normal text-primary mb-1">50+</div>
              <div className="text-gray-600">Industries Served</div>
            </div>
            <div>
              <div className="text-3xl font-normal text-primary mb-1">99.9%</div>
              <div className="text-gray-600">Uptime SLA</div>
            </div>
            <div>
              <div className="text-3xl font-normal text-primary mb-1">24/7</div>
              <div className="text-gray-600">Expert Support</div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
} 