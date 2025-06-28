'use client'

import { motion } from 'framer-motion'
import { Container } from './ui/Container'
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card'
import { Button } from './ui/Button'

interface CaseStudy {
  id: string
  title: string
  company: string
  problem: string
  solution: string
  results: string
  metrics?: string[]
  industry: string
  companySize: string
}

const caseStudies: CaseStudy[] = [
  {
    id: '1',
    title: 'TechStart Solutions Success Story',
    company: 'TechStart Solutions',
    industry: 'Technology Startup',
    companySize: '50 employees',
    problem: 'Expensive traditional phone system costing $3,500/month with limited features and poor scalability.',
    solution: 'Migrated to Dail it with full Microsoft Teams integration, unlimited calling, and API access.',
    results: '65% cost reduction, improved team collaboration, and seamless remote work capabilities.',
    metrics: ['65% cost reduction', '$2,275/month savings', '100% remote work ready', '15-minute setup time']
  },
  {
    id: '2',
    title: 'GreenField Consulting Transformation',
    company: 'GreenField Consulting',
    industry: 'Professional Services',
    companySize: '25 employees',
    problem: 'Missing important client calls during meetings, unprofessional voicemail system, no call recording.',
    solution: 'Implemented smart call routing, voicemail transcription, and professional call recording features.',
    results: '100% call capture rate, enhanced professional image, and improved client satisfaction.',
    metrics: ['100% call capture', '90% faster response', 'Professional image boost', 'HIPAA compliance']
  },
  {
    id: '3',
    title: 'InnovateLogistics API Integration',
    company: 'InnovateLogistics',
    industry: 'Logistics & Supply Chain',
    companySize: '100+ employees',
    problem: 'Previous VoIP provider charged $2,000/month for limited API access, restricting custom integrations.',
    solution: 'Switched to Dail it for unlimited free API access and integrated with existing logistics software.',
    results: 'Custom CRM integration, automated call logging, and $2,000/month in API savings.',
    metrics: ['$2,000/month API savings', 'Custom CRM integration', 'Automated workflows', 'Zero integration limits']
  }
]

export function CaseStudies() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  }

  return (
    <section className="py-20 bg-gray-50">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-normal text-gray-900 mb-4">
            Customer Success Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how businesses like yours have transformed their communications 
            and achieved remarkable results with Dail it.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-12"
        >
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.id}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Card variant="elevated" className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className={`grid grid-cols-1 lg:grid-cols-2 ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                  {/* Content Side */}
                  <div className={`p-8 lg:p-12 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-primary/10 px-3 py-1 rounded-full text-primary font-semibold text-sm">
                        {study.industry}
                      </div>
                      <div className="bg-secondary/10 px-3 py-1 rounded-full text-secondary font-semibold text-sm">
                        {study.companySize}
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {study.company}
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-bold text-red-600 mb-2">❌ Challenge</h4>
                        <p className="text-gray-700 leading-relaxed">{study.problem}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-primary mb-2">🔧 Solution</h4>
                        <p className="text-gray-700 leading-relaxed">{study.solution}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-secondary mb-2">✅ Results</h4>
                        <p className="text-gray-700 leading-relaxed mb-4">{study.results}</p>
                      </div>
                    </div>
                  </div>

                  {/* Metrics Side */}
                  <div className={`bg-gradient-to-br from-primary/5 to-secondary/5 p-8 lg:p-12 ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                    <h4 className="text-xl font-bold text-gray-900 mb-6">Key Metrics</h4>
                    <div className="space-y-4">
                      {study.metrics?.map((metric, metricIndex) => (
                        <motion.div
                          key={metricIndex}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: metricIndex * 0.1 }}
                          className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm"
                        >
                          <div className="w-3 h-3 bg-secondary rounded-full flex-shrink-0"></div>
                          <span className="font-semibold text-gray-900">{metric}</span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-8">
                      <Button 
                        variant="outline" 
                        className="w-full hover:bg-primary hover:text-white transition-colors"
                        href="#contact"
                      >
                        Get Similar Results
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <Card variant="bordered" className="bg-white">
            <CardContent className="p-8 lg:p-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Write Your Success Story?
              </h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Join these successful companies and discover how Dail it can transform 
                your business communications while reducing costs.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" href="#contact">
                  Start Your Transformation
                </Button>
                
                <Button variant="outline" size="lg" href="#features">
                  Compare Features
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-8 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span>Free consultation included</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span>Custom migration plan</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span>30-day money back guarantee</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </section>
  )
} 