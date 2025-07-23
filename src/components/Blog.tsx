'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Container } from './ui/Container'
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card'
import { Button } from './ui/Button'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  publishDate: string
  category: string
  readTime: number
  featured?: boolean
  image?: string
}

interface ResourceDownload {
  id: string
  title: string
  description: string
  type: 'PDF' | 'Excel' | 'Checklist' | 'Documentation'
  downloadUrl: string
  icon: string
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'VoIP vs Traditional Phone Systems: Complete 2025 Guide',
    excerpt: 'Discover why 89% of businesses are switching to VoIP and how to choose the right system for your company.',
    content: 'Complete comparison guide...',
    author: 'Sarah Johnson',
    publishDate: '2024-01-15',
    category: 'VoIP Guides',
    readTime: 8,
    featured: true,
    image: '/blog/voip-guide-2025.jpg'
  },
  {
    id: '2',
    title: 'Microsoft Teams Integration: Setup Guide for Small Business',
    excerpt: 'Step-by-step guide to integrating your phone system with Microsoft Teams in under 30 minutes.',
    content: 'Setup guide content...',
    author: 'Mike Chen',
    publishDate: '2024-01-10',
    category: 'Integration Tutorials',
    readTime: 12,
    featured: true,
    image: '/blog/teams-integration.jpg'
  },
  {
    id: '3',
    title: 'How to Reduce Business Communication Costs by 60%',
    excerpt: 'Real-world strategies and case studies showing how businesses cut communication costs without sacrificing quality.',
    content: 'Cost reduction strategies...',
    author: 'Lisa Rodriguez',
    publishDate: '2024-01-08',
    category: 'Cost Savings Tips',
    readTime: 6,
    featured: true,
    image: '/blog/cost-reduction.jpg'
  },
  {
    id: '4',
    title: 'API Integration Guide: Connecting VoIP with Your CRM',
    excerpt: 'Learn how to automate call logging, click-to-dial, and customer data synchronization with unlimited API access.',
    content: 'API integration tutorial...',
    author: 'David Park',
    publishDate: '2024-01-05',
    category: 'Integration Tutorials',
    readTime: 15,
    featured: false,
    image: '/blog/api-integration.jpg'
  },
  {
    id: '5',
    title: 'Small Business Phone System Checklist for 2025',
    excerpt: 'Essential features every small business needs in their phone system to stay competitive.',
    content: 'Checklist content...',
    author: 'Emily Wilson',
    publishDate: '2024-01-03',
    category: 'VoIP Guides',
    readTime: 5,
    featured: false,
    image: '/blog/phone-checklist.jpg'
  }
]

const categories = [
  'All Posts',
  'VoIP Guides',
  'Cost Savings Tips',
  'Integration Tutorials',
  'Industry News',
  'Case Studies'
]

const resourceDownloads: ResourceDownload[] = [
  {
    id: '1',
    title: '2025 Business VoIP Buyer\'s Guide',
    description: 'Complete 25-page guide covering everything you need to know before choosing a VoIP provider.',
    type: 'PDF',
    downloadUrl: '/downloads/voip-buyers-guide-2025.pdf',
    icon: '📖'
  },
  {
    id: '2',
    title: 'ROI Calculator Spreadsheet',
    description: 'Calculate your potential savings with VoIP vs traditional phone systems. Pre-loaded with industry benchmarks.',
    type: 'Excel',
    downloadUrl: '/downloads/voip-roi-calculator.xlsx',
    icon: '📊'
  },
  {
    id: '3',
    title: 'Teams Integration Checklist',
    description: 'Step-by-step checklist to ensure smooth Microsoft Teams phone system integration.',
    type: 'Checklist',
    downloadUrl: '/downloads/teams-integration-checklist.pdf',
    icon: '✅'
  },
  {
    id: '4',
    title: 'API Documentation',
    description: 'Complete developer documentation for Dail it\'s unlimited API access with code examples.',
    type: 'Documentation',
    downloadUrl: '/downloads/api-documentation.pdf',
    icon: '🔧'
  }
]

export function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All Posts')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPosts = blogPosts.filter(post => {
    const categoryMatch = selectedCategory === 'All Posts' || post.category === selectedCategory
    const searchMatch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    return categoryMatch && searchMatch
  })

  const featuredPosts = blogPosts.filter(post => post.featured)

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
    <section id="blog" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Resources & Insights
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
            Expert guides, tutorials, and resources to help you make the most of your business communications.
          </p>
        </motion.div>

        {/* Featured Articles */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-12 lg:mb-16"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8">Featured Articles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {featuredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card variant="bordered" className="h-full hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <div className="text-4xl">📱</div>
                  </div>
                  <CardContent className="p-4 sm:p-5 lg:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs sm:text-sm font-medium w-fit">
                        {post.category}
                      </span>
                      <span className="text-gray-500 text-xs sm:text-sm">{post.readTime} min read</span>
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2">
                      {post.title}
                    </h4>
                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="text-xs sm:text-sm text-gray-500">
                        By {post.author} • {new Date(post.publishDate).toLocaleDateString()}
                      </div>
                      <Button variant="outline" size="sm" className="w-fit">
                        Read More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Blog Search and Categories */}
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
                placeholder="Search articles..."
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
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                    selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* All Articles */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-8 sm:mb-12 lg:mb-16"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8">
            {selectedCategory === 'All Posts' ? 'All Articles' : selectedCategory}
            <span className="text-gray-500 text-base sm:text-lg ml-2">({filteredPosts.length})</span>
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                variants={cardVariants}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
              >
                <Card variant="bordered" className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-4 sm:p-5 lg:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                      <span className="bg-secondary/10 text-secondary px-2 py-1 rounded text-xs sm:text-sm font-medium w-fit">
                        {post.category}
                      </span>
                      <span className="text-gray-500 text-xs sm:text-sm">{post.readTime} min read</span>
                    </div>
                    <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                      {post.title}
                    </h4>
                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="text-xs sm:text-sm text-gray-500">
                        By {post.author} • {new Date(post.publishDate).toLocaleDateString()}
                      </div>
                      <Button variant="outline" size="sm" className="w-fit">
                        Read More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Resource Downloads */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8">Free Resources</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {resourceDownloads.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card variant="elevated" className="h-full hover:shadow-xl transition-shadow">
                  <CardContent className="p-4 sm:p-5 lg:p-6 text-center">
                    <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{resource.icon}</div>
                    <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold mb-2 sm:mb-3 inline-block">
                      {resource.type}
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">
                      {resource.title}
                    </h4>
                    <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
                      {resource.description}
                    </p>
                    <Button size="sm" className="w-full text-xs sm:text-sm" href={resource.downloadUrl}>
                      Download Free
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 sm:mt-12 lg:mt-16"
        >
          <Card variant="elevated" className="bg-gradient-to-r from-primary to-secondary text-white">
            <CardContent className="p-6 sm:p-8 lg:p-12 text-center">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
                Stay Updated with VoIP Insights
              </h3>
              <p className="text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto px-4 sm:px-0">
                Get weekly tips, guides, and industry updates delivered to your inbox. 
                Join 5,000+ business leaders improving their communications.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-gray-900 border-0 focus:ring-2 focus:ring-white/30 text-sm sm:text-base"
                />
                <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 text-sm sm:text-base px-4 sm:px-6">
                  Subscribe
                </Button>
              </div>
              
              <p className="text-xs sm:text-sm opacity-75 mt-3 sm:mt-4">
                No spam. Unsubscribe anytime.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </section>
  )
}