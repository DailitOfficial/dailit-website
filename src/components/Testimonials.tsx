'use client'

import { motion } from 'framer-motion'
import { Container } from './ui/Container'
import { Card, CardContent } from './ui/Card'

interface Testimonial {
  id: string
  content: string
  author: string
  title: string
  company: string
  rating: number
  avatar?: string
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    content: 'Switching to Dail it was a game-changer for our business. The call quality is crystal clear, and the features like call recording and auto-attendant have made us look so much more professional to our clients.',
    author: 'Sarah Mitchell',
    title: 'Operations Director',
    company: 'TechStart Solutions',
    rating: 5,
    avatar: 'SM'
  },
  {
    id: '2',
    content: 'The pricing is incredibly transparent and fair. No hidden fees, no surprises. We pay exactly what we expected and get so much more value than our previous provider. The API access alone saves us thousands.',
    author: 'Marcus Rodriguez',
    title: 'IT Manager',
    company: 'Growth Dynamics',
    rating: 5,
    avatar: 'MR'
  },
  {
    id: '3',
    content: 'Setting up our entire phone system took less than 20 minutes. The Microsoft Teams integration is seamless, and our team was productive from day one. Customer support has been outstanding.',
    author: 'Jennifer Chen',
    title: 'CEO',
    company: 'Innovate Labs',
    rating: 5,
    avatar: 'JC'
  },
  {
    id: '4',
    content: 'As a growing startup, we needed enterprise features without enterprise prices. Dail it delivered exactly that. The reliability and features rival systems costing 10x more.',
    author: 'David Park',
    title: 'Founder',
    company: 'StreamlineHQ',
    rating: 5,
    avatar: 'DP'
  }
]

const trustIndicators = [
  {
    metric: '10,000+',
    description: 'businesses trust Dail it',
    icon: '🏢'
  },
  {
    metric: '99.9%',
    description: 'uptime guarantee',
    icon: '⚡'
  },
  {
    metric: '24/7',
    description: 'expert support',
    icon: '🎧'
  },
  {
    metric: 'SOC 2',
    description: 'Type II certified',
    icon: '🔒'
  }
]

export function Testimonials() {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={index < rating ? 'text-yellow-400' : 'text-gray-300'}
      >
        ⭐
      </span>
    ))
  }

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
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
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. See how businesses like yours have 
            transformed their communications with Dail it.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Card variant="bordered" className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {renderStars(testimonial.rating)}
                  </div>
                  
                  {/* Testimonial Content */}
                  <blockquote className="text-gray-700 mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </blockquote>
                  
                  {/* Author Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-normal">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-normal text-gray-900">{testimonial.author}</div>
                      <div className="text-sm text-gray-600">
                        {testimonial.title}, {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card variant="elevated" className="bg-gradient-to-r from-gray-50 to-gray-100">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-normal text-gray-900 mb-2">
                  Trusted by Industry Leaders
                </h3>
                <p className="text-gray-600">
                  Join thousands of businesses that rely on Dail it for their communications
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {trustIndicators.map((indicator, index) => (
                  <motion.div
                    key={indicator.description}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-4xl mb-2">{indicator.icon}</div>
                    <div className="text-2xl lg:text-3xl font-normal text-primary mb-1">
                      {indicator.metric}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {indicator.description}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Additional Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
            <h3 className="text-xl font-normal text-gray-900 mb-4">
              Ready to Join Our Happy Customers?
            </h3>
            <p className="text-gray-600 mb-6">
              See why businesses choose Dail it for reliable, feature-rich communications
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span>Free 30-day trial</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span>No setup fees</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
} 