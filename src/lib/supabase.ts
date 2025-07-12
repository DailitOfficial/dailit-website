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
  try {
    console.log('Attempting to create lead with data:', leadData)
    
    // First check if we can connect to the database
    const { data: testData, error: testError } = await supabase
      .from('leads')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.error('Database connection test failed:', testError)
      throw new Error(`Database connection failed: ${testError.message || 'Unknown error'}`)
    }
    
    // Now try to insert the lead
    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
      .single()

    if (error) {
      console.error('Error creating lead:', error)
      
      // Provide more specific error messages
      if (error.code === 'PGRST116') {
        throw new Error('Database table not found. Please contact support.')
      } else if (error.code === '42501') {
        throw new Error('Permission denied. Database configuration error.')
      } else if (error.message) {
        throw new Error(`Database error: ${error.message}`)
      } else {
        throw new Error('Unknown database error occurred')
      }
    }

    console.log('Lead created successfully:', data)
    return data
  } catch (err: any) {
    console.error('createLead function error:', err)
    throw err
  }
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

export const updateContactStatus = async (contactId: string, status: ContactSubmission['status']) => {
  const { data, error } = await supabase
    .from('contact_submissions')
    .update({ status })
    .eq('id', contactId)
    .select()
    .single()

  if (error) {
    console.error('Error updating contact status:', error)
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

// Admin Authentication functions only
// Admin sign in function
export const signInWithEmail = async (email: string, password: string) => {
  try {
    // First check if the email exists in admin_users table and is active
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('email, is_active')
      .eq('email', email)
      .eq('is_active', true)
      .maybeSingle()

    if (adminError) {
      console.error('Error checking admin user:', adminError)
      throw new Error('Database error during authentication')
    }

    if (!adminUser) {
      throw new Error('Invalid credentials or account not found')
    }

    // If admin user exists and is active, attempt sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.error('Authentication error:', error)
      throw error
    }

    // Update last login timestamp
    await updateLastLogin(email)

    return data
  } catch (err: any) {
    console.error('Sign in error:', err)
    throw err
  }
}

export const getCurrentAdminUser = async () => {
  // Get current user session directly
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  
  if (sessionError) {
    console.error('Error getting session:', sessionError)
    return null
  }
  
  if (!session?.user) {
    return null
  }

  const user = session.user
  console.log('Looking up admin user for:', user.email)

  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', user.email)
      .eq('is_active', true)
      .maybeSingle()

    if (error) {
      console.error('Error getting admin user:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      
      // Check if it's a table not found error
      if (error.message?.includes('relation "admin_users" does not exist')) {
        console.error('admin_users table does not exist')
        return null
      }
      
      // Check if it's a permission/RLS error
      if (error.message?.includes('permission denied') || error.message?.includes('RLS')) {
        console.error('RLS policy blocking access to admin_users table')
        return null
      }
      
      // For empty error objects or other issues, return null
      console.error('Unknown database error, returning null')
      return null
    }

    console.log('Admin user lookup result:', !!data, data?.email)
    return data as AdminUser
  } catch (err) {
    console.error('Exception in getCurrentAdminUser:', err)
    return null
  }
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
// Removed onAuthStateChange - old login logic

// Password reset for admin users only
export const resetPasswordForAdmin = async (email: string) => {
  try {
    console.log('Attempting password reset for:', email)
    
    // First, let's try a simple count query to see if we can access the table at all
    console.log('Testing table access...')
    const { count, error: countError } = await supabase
      .from('admin_users')
      .select('*', { count: 'exact', head: true })
    
    console.log('Table count result:', { count, countError })
    
    // Now try to get all admin users (for debugging)
    console.log('Getting all admin users...')
    const { data: allAdmins, error: allError } = await supabase
      .from('admin_users')
      .select('email, is_active, full_name')
    
    console.log('All admin users:', { allAdmins, allError })
    
    // First, check if the email exists in admin_users table and is active
    // Use .maybeSingle() instead of .single() to avoid JSON errors when no rows found
    console.log('Querying for specific admin user...')
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('email, is_active, full_name, password_reset_count')
      .eq('email', email)
      .eq('is_active', true)
      .maybeSingle()

    console.log('Admin user query result:', { adminUser, adminError })
    console.log('Full error details:', JSON.stringify(adminError, null, 2))

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
        message: `Database error: ${adminError.message || JSON.stringify(adminError)}`
      }
    }

    if (!adminUser) {
      console.log('No admin user found for email:', email)
      return {
        success: false,
        message: 'Email not found in admin users. Only existing admin accounts can reset passwords.'
      }
    }

    console.log('Admin user found:', adminUser)
    console.log('Sending reset email...')

    // If admin user exists and is active, send reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin`    })

    if (error) {
      console.error('Error sending reset email:', error)
      console.error('Reset email error details:', JSON.stringify(error, null, 2))
      return {
        success: false,
        message: error.message || 'Failed to send reset email.'
      }
    }

    console.log('Reset email sent successfully')
    
    // Update reset count in database
    try {
      await supabase
        .from('admin_users')
        .update({ 
          password_reset_count: adminUser.password_reset_count ? adminUser.password_reset_count + 1 : 1,
          last_password_reset: new Date().toISOString()
        })
        .eq('email', email)
    } catch (updateError) {
      console.log('Could not update reset count:', updateError)
      // Don't fail the reset if we can't update the count
    }

    return {
      success: true,
      message: 'Password reset email sent successfully.'
    }
  } catch (err: any) {
    console.error('Reset password error:', err)
    console.error('Error details:', JSON.stringify(err, null, 2))
    return {
      success: false,
      message: `Unexpected error: ${err.message || JSON.stringify(err)}`
    }
  }
}

// Function to record password changes in database
export const recordPasswordChange = async (
  email: string, 
  changeType: 'reset' | 'manual_update' | 'initial_setup' = 'manual_update',
  notes?: string
) => {
  try {
    // Get client IP (this is a simplified version - in production you'd get real IP)
    const clientInfo = {
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
      // Note: Getting real client IP requires server-side implementation
      ip: '127.0.0.1' // Placeholder
    }

    const { error } = await supabase.rpc('record_password_change', {
      user_email: email,
      change_type: changeType,
      changed_by_email: 'self',
      user_ip: clientInfo.ip,
      user_agent_string: clientInfo.userAgent,
      change_notes: notes || `Password ${changeType} via admin interface`
    })

    if (error) {
      console.error('Error recording password change:', error)
    } else {
      console.log('Password change recorded successfully')
    }
  } catch (err) {
    console.error('Error recording password change:', err)
  }
}

// Function to get admin password history
export const getAdminPasswordHistory = async (email?: string) => {
  try {
    let query = supabase
      .from('admin_password_activity')
      .select('*')
      .order('created_at', { ascending: false })

    if (email) {
      query = query.eq('email', email)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching password history:', error)
      throw error
    }

    return data
  } catch (err) {
    console.error('Error getting password history:', err)
    throw err
  }
}

// Function to get admin users summary with password info
export const getAdminUsersSummary = async () => {
  try {
    const { data, error } = await supabase
      .from('admin_users_summary')
      .select('*')

    if (error) {
      console.error('Error fetching admin users summary:', error)
      throw error
    }

    return data
  } catch (err) {
    console.error('Error getting admin users summary:', err)
    throw err
  }
}
