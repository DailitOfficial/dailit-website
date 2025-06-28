import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

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

// Password reset for admin users only
export const resetPasswordForAdmin = async (email: string) => {
  try {
    console.log('Attempting password reset for:', email)
    
    // First, check if the email exists in admin_users table and is active
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('email, is_active, full_name')
      .eq('email', email)
      .eq('is_active', true)
      .single()

    console.log('Admin user query result:', { adminUser, adminError })

    if (adminError) {
      console.error('Database error checking admin user:', adminError)
      
      // Check if it's a table not found error
      if (adminError.message?.includes('relation "admin_users" does not exist')) {
        return {
          success: false,
          message: 'Admin system not properly configured. Please run the database setup first.'
        }
      }
      
      // Check if it's a permission error
      if (adminError.message?.includes('permission denied') || adminError.message?.includes('RLS')) {
        return {
          success: false,
          message: 'Database permission error. Please check your RLS policies.'
        }
      }
      
      return {
        success: false,
        message: `Database error: ${adminError.message}`
      }
    }

    if (!adminUser) {
      console.log('No admin user found for email:', email)
      return {
        success: false,
        message: 'Email not found in admin users. Only existing admin accounts can reset passwords.'
      }
    }

    console.log('Admin user found, sending reset email...')

    // If admin user exists and is active, send reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin`
    })

    if (error) {
      console.error('Error sending reset email:', error)
      return {
        success: false,
        message: error.message || 'Failed to send reset email.'
      }
    }

    console.log('Reset email sent successfully')
    return {
      success: true,
      message: 'Password reset email sent successfully.'
    }
  } catch (err: any) {
    console.error('Reset password error:', err)
    return {
      success: false,
      message: err.message || 'An unexpected error occurred.'
    }
  }
} 