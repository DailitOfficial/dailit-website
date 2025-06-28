import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface Lead {
  id: string
  business_name: string
  full_name: string
  email: string
  industry: string
  number_of_users: string
  source: string
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  notes?: string
  created_at: string
  updated_at: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  company?: string
  message: string
  source: string
  status: 'new' | 'responded' | 'closed'
  created_at: string
  updated_at: string
}

export interface LeadActivity {
  id: string
  lead_id?: string
  contact_id?: string
  activity_type: 'email_sent' | 'call_made' | 'demo_scheduled' | 'follow_up' | 'note_added'
  description?: string
  created_at: string
  created_by?: string
}

// Helper functions for lead management
export const createLead = async (leadData: {
  business_name: string
  full_name: string
  email: string
  industry: string
  number_of_users: string
  source?: string
}) => {
  const { data, error } = await supabase
    .from('leads')
    .insert([leadData])
    .select()
    .single()

  if (error) {
    console.error('Error creating lead:', error)
    throw error
  }

  return data
}

export const createContactSubmission = async (contactData: {
  name: string
  email: string
  company?: string
  message: string
  source?: string
}) => {
  const { data, error } = await supabase
    .from('contact_submissions')
    .insert([contactData])
    .select()
    .single()

  if (error) {
    console.error('Error creating contact submission:', error)
    throw error
  }

  return data
}

export const addLeadActivity = async (activityData: {
  lead_id?: string
  contact_id?: string
  activity_type: LeadActivity['activity_type']
  description?: string
  created_by?: string
}) => {
  const { data, error } = await supabase
    .from('lead_activities')
    .insert([activityData])
    .select()
    .single()

  if (error) {
    console.error('Error adding lead activity:', error)
    throw error
  }

  return data
}

// Admin functions (for future use)
export const getLeads = async (status?: Lead['status']) => {
  let query = supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching leads:', error)
    throw error
  }

  return data
}

export const getContactSubmissions = async (status?: ContactSubmission['status']) => {
  let query = supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching contact submissions:', error)
    throw error
  }

  return data
}

export const updateLeadStatus = async (leadId: string, status: Lead['status'], notes?: string) => {
  const updateData: any = { status }
  if (notes) updateData.notes = notes

  const { data, error } = await supabase
    .from('leads')
    .update(updateData)
    .eq('id', leadId)
    .select()
    .single()

  if (error) {
    console.error('Error updating lead status:', error)
    throw error
  }

  return data
}

// Admin user interface
export interface AdminUser {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'super_admin'
  is_active: boolean
  last_login?: string
  created_at: string
  updated_at: string
}

// Authentication functions
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Error signing in:', error)
    throw error
  }

  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    console.error('Error getting current user:', error)
    throw error
  }

  return user
}

export const getCurrentAdminUser = async () => {
  const user = await getCurrentUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('email', user.email)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error getting admin user:', error)
    return null
  }

  return data as AdminUser
}

export const updateLastLogin = async (email: string) => {
  const { error } = await supabase
    .from('admin_users')
    .update({ last_login: new Date().toISOString() })
    .eq('email', email)

  if (error) {
    console.error('Error updating last login:', error)
  }
}

// Listen to auth state changes
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback)
} 