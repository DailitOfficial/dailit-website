import { ReactNode } from 'react'

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  className?: string
  onClick?: () => void
  href?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export interface NavItem {
  name: string
  href: string
}

export interface ContactForm {
  name: string
  email: string
  company?: string
  phone?: string
  message: string
}

export interface Service {
  id: string
  title: string
  description: string
  features: string[]
  price?: string
  icon: ReactNode
}

export type ComparisonValue = 
  | '✅ Included' 
  | '✅ Available' 
  | '✅ AI-Powered' 
  | '✅ Native' 
  | '✅ Basic AI' 
  | '✅ AI Assistant' 
  | '✅ AI Suite' 
  | '✅ Specialized' 
  | '✅ Multiple Options' 
  | '❌ Limited' 
  | '❌ No' 
  | '❌ Not Available' 
  | '❌ Business Hours' 
  | '❌ Paid Tiers' 
  | '🔄 Coming Soon'

export interface ComparisonFeature {
  feature: string
  dailit: ComparisonValue
  openphone: ComparisonValue
  googlevoice: ComparisonValue
  ringcentral: ComparisonValue
  callhippo: ComparisonValue
}

export interface Advantage {
  title: string
  description: string
  icon: string
  highlight?: boolean
}

export interface Industry {
  title: string
  description: string
  icon: string
  useCase: string
}

export interface ContactFormData {
  companyName: string
  contactName: string
  email: string
  phone?: string
  companySize: string
  currentSystem: string
  requirements: string
  contactMethod: string
}

export interface Testimonial {
  id: string
  content: string
  author: string
  title: string
  company: string
  rating: number
  avatar?: string
}

export interface CaseStudy {
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

export interface BlogPost {
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

export interface CalculatorInputs {
  employees: number
  features: string[]
  currentBill: number
  callVolume: number
  internationalCalls: boolean
}

export interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  popular?: boolean
} 