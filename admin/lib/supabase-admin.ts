import { createClient } from '@supabase/supabase-js'
import type { User } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

// Check for placeholder values that haven't been replaced
if (supabaseUrl.includes('REPLACE_WITH_YOUR_SUPABASE') || 
    supabaseUrl.includes('your-project-id') ||
    supabaseAnonKey.includes('REPLACE_WITH_YOUR_SUPABASE') ||
    supabaseAnonKey.includes('your-anon-key')) {
  throw new Error('Supabase credentials contain placeholder values. Please replace them with your actual Supabase project credentials from https://app.supabase.com')
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
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Error signing in:', error)
      
      // Provide more specific error messages
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Invalid email or password. Please check your credentials and try again.')
      } else if (error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to authentication service. Please check your Supabase configuration.')
      } else {
        throw new Error(`Authentication failed: ${error.message}`)
      }
    }

    return data
  } catch (error: any) {
    // Handle network errors or configuration issues
    if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
      throw new Error('Unable to connect to Supabase. Please verify your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local are correct.')
    }
    throw error
  }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

export const getCurrentUser = async () => {
  // First check if session exists to avoid AuthSessionMissingError
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  
  if (sessionError) {
    console.error('Error getting session:', sessionError)
    throw sessionError
  }
  
  if (!session) {
    return null
  }

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
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback)
}

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
      redirectTo: `${window.location.origin}/admin`
    })

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

// Admin-specific data management functions
export const getLeads = async (status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost') => {
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

export const getContactSubmissions = async (status?: 'new' | 'responded' | 'closed') => {
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

export const updateLeadStatus = async (leadId: string, status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost') => {
  const { data, error } = await supabase
    .from('leads')
    .update({ status })
    .eq('id', leadId)
    .select()
    .single()

  if (error) {
    console.error('Error updating lead status:', error)
    throw error
  }

  return data
}

export const updateContactStatus = async (contactId: string, status: 'new' | 'responded' | 'closed') => {
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

// Functions for creating and managing leads and contact submissions
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

// Reconciliation System Types
export interface SubscriptionUser {
  id: string
  name: string
  email: string
  phone?: string
  subscription_start_date: string
  renewal_date: string
  expiry_date: string
  status: 'active' | 'expired' | 'expiring_soon'
  assigned_manager_id?: string // Keep for backward compatibility
  manager_id?: string // New separate manager field
  reseller_id?: string // New separate reseller field
  parent_account_id?: string
  voip_number_id?: string
  voip_number?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  user_id: string
  amount: number
  payment_date: string
  payment_method: 'cash' | 'bank_transfer' | 'check' | 'online' | 'other'
  collected_by_id: string
  notes?: string
  created_at: string
}

// Separate interfaces for managers and resellers
export interface Manager {
  id: string
  name: string
  email: string
  phone?: string
  is_active: boolean
  notes?: string
  created_at: string
  updated_at: string
}

export interface Reseller {
  id: string
  name: string
  email: string
  phone?: string
  manager_id: string
  is_active: boolean
  notes?: string
  created_at: string
  updated_at: string
}

export interface ReconciliationSummary {
  id: string
  name: string
  type: 'manager' | 'reseller'
  email: string
  phone?: string
  total_collected: number
  total_submitted: number
  amount_owed: number
  payment_count: number
  submission_count: number
}

export interface Submission {
  id: string
  manager_id: string
  amount: number
  submission_date: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface UserExpiringSoon {
  id: string
  name: string
  email: string
  phone?: string
  expiry_date: string
  days_until_expiry: number
  expiry_status: string
  manager_name?: string
  reseller_name?: string
  voip_number?: string
  parent_account_name?: string
  last_reminder_date?: string
}

// Reconciliation System Functions
export const getSubscriptionUsers = async (status?: 'active' | 'expired' | 'expiring_soon') => {
  let query = supabase
    .from('subscription_users')
    .select('*')
    .order('expiry_date', { ascending: true })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching subscription users:', error)
    throw error
  }

  return data
}

export const getReconciliationSummary = async () => {
  const { data, error } = await supabase
    .from('reconciliation_summary')
    .select('*')
    .order('amount_owed', { ascending: false })

  if (error) {
    console.error('Error fetching reconciliation summary:', error)
    throw error
  }

  return data as ReconciliationSummary[]
}

export const getUsersExpiringSoon = async (days?: number) => {
  if (days) {
    const { data, error } = await supabase
      .rpc('get_users_expiring_within_days', { days_param: days })

    if (error) {
      console.error('Error fetching users expiring within days:', error)
      throw error
    }

    return data as UserExpiringSoon[]
  } else {
    const { data, error } = await supabase
      .from('users_expiring_soon')
      .select('*')
      .order('expiry_date', { ascending: true })

    if (error) {
      console.error('Error fetching users expiring soon:', error)
      throw error
    }

    return data as UserExpiringSoon[]
  }
}

export const getPaymentSummary = async () => {
  const { data, error } = await supabase
    .from('payment_summary')
    .select('*')
    .order('payment_date', { ascending: false })

  if (error) {
    console.error('Error fetching payment summary:', error)
    throw error
  }

  return data
}

export const getParentAccountHierarchy = async () => {
  try {
    // Get all subscription users to build hierarchy
    const { data: users, error } = await supabase
      .from('subscription_users')
      .select('id, name, email, parent_account_id')

    if (error) {
      console.error('Error fetching users for hierarchy:', error)
      throw error
    }

    if (!users) {
      return []
    }

    // Build parent account hierarchy
    const parentAccounts = users
      .filter(user => !user.parent_account_id) // Users without parent (top-level accounts)
      .map(parent => {
        const children = users.filter(user => user.parent_account_id === parent.id)
        return {
          id: parent.id,
          name: parent.name,
          email: parent.email,
          child_count: children.length,
          children: children.map(child => ({
            id: child.id,
            name: child.name,
            email: child.email
          }))
        }
      })
      .sort((a, b) => b.child_count - a.child_count) // Sort by child count descending

    return parentAccounts
  } catch (error) {
    console.error('Error building parent account hierarchy:', error)
    // Return empty array instead of throwing to prevent dashboard crash
    return []
  }
}

// Functions for separate managers and resellers
export const getManagers = async () => {
  const { data, error } = await supabase
    .from('managers')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching managers:', error)
    throw error
  }

  return data as Manager[]
}

export const getResellers = async () => {
  const { data, error } = await supabase
    .from('resellers')
    .select('*, managers(name)')
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching resellers:', error)
    throw error
  }

  return data as (Reseller & { managers: { name: string } })[]
}

export const getResellersByManager = async (managerId: string) => {
  const { data, error } = await supabase
    .from('resellers')
    .select('*')
    .eq('manager_id', managerId)
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching resellers by manager:', error)
    throw error
  }

  return data as Reseller[]
}

export const createManager = async (managerData: {
  name: string
  email: string
  phone?: string
  notes?: string
}) => {
  const { data, error } = await supabase
    .from('managers')
    .insert([managerData])
    .select()
    .single()

  if (error) {
    console.error('Error creating manager:', error)
    throw error
  }

  return data as Manager
}

export const createReseller = async (resellerData: {
  name: string
  email: string
  phone?: string
  manager_id: string
  notes?: string
}) => {
  const { data, error } = await supabase
    .from('resellers')
    .insert([resellerData])
    .select()
    .single()

  if (error) {
    console.error('Error creating reseller:', error)
    throw error
  }

  return data as Reseller
}

export const updateManager = async (managerId: string, updates: Partial<Manager>) => {
  const { data, error } = await supabase
    .from('managers')
    .update(updates)
    .eq('id', managerId)
    .select()
    .single()

  if (error) {
    console.error('Error updating manager:', error)
    throw error
  }

  return data as Manager
}

export const updateReseller = async (resellerId: string, updates: Partial<Reseller>) => {
  const { data, error } = await supabase
    .from('resellers')
    .update(updates)
    .eq('id', resellerId)
    .select()
    .single()

  if (error) {
    console.error('Error updating reseller:', error)
    throw error
  }

  return data as Reseller
}

export const createSubscriptionUser = async (userData: {
  name: string
  email: string
  phone?: string
  subscription_start_date: string
  renewal_date: string
  expiry_date: string
  status: 'active' | 'expired' | 'expiring_soon'
  assigned_manager_id?: string // Keep for backward compatibility
  manager_id?: string // New separate manager field
  reseller_id?: string // New separate reseller field
  parent_account_id?: string
  voip_number?: string
  notes?: string
  payment_amount?: number
}) => {
  const { data, error } = await supabase
    .from('subscription_users')
    .insert([userData])
    .select()
    .single()

  if (error) {
    console.error('Error creating subscription user:', error)
    throw error
  }

  // If payment_amount is provided, create an initial payment record
  if (userData.payment_amount && userData.payment_amount > 0) {
    try {
      const paymentData = {
        user_id: data.id,
        amount: userData.payment_amount,
        payment_date: userData.subscription_start_date,
        payment_method: 'other' as const,
        collected_by_id: userData.manager_id || userData.assigned_manager_id || 'admin',
        notes: 'Initial payment for subscription'
      }

      await createPayment(paymentData)
    } catch (paymentError) {
      console.error('Error creating initial payment:', paymentError)
      // Don't throw here - user creation succeeded, payment creation failed
      // In a production app, you might want to handle this differently
    }
  }

  return data
}

export const updateSubscriptionUser = async (userId: string, updates: Partial<SubscriptionUser>) => {
  const { data, error } = await supabase
    .from('subscription_users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating subscription user:', error)
    throw error
  }

  return data
}

export const deleteSubscriptionUser = async (userId: string) => {
  const { error } = await supabase
    .from('subscription_users')
    .delete()
    .eq('id', userId)

  if (error) {
    console.error('Error deleting subscription user:', error)
    throw error
  }

  return { success: true }
}

export const createPayment = async (paymentData: {
  user_id: string
  amount: number
  payment_date: string
  payment_method: 'cash' | 'bank_transfer' | 'check' | 'online' | 'other'
  collected_by_id: string
  notes?: string
}) => {
  const { data, error } = await supabase
    .from('payments')
    .insert([paymentData])
    .select()
    .single()

  if (error) {
    console.error('Error creating payment:', error)
    throw error
  }

  return data
}

export const getDashboardStats = async () => {
  try {
    // Get overall statistics
    const { data: userStats, error: userError } = await supabase
      .from('subscription_users')
      .select('status')
    
    if (userError) throw userError

    const { data: paymentStats, error: paymentError } = await supabase
      .from('payments')
      .select('amount')
    
    if (paymentError) throw paymentError

    const { data: managerStats, error: managerError } = await supabase
      .from('managers_resellers')
      .select('id')
      .eq('is_active', true)
    
    if (managerError) throw managerError

    const totalUsers = userStats?.length || 0
    const activeUsers = userStats?.filter(u => u.status === 'active').length || 0
    const expiredUsers = userStats?.filter(u => u.status === 'expired').length || 0
    const expiringSoonUsers = userStats?.filter(u => u.status === 'expiring_soon').length || 0
    const totalPayments = paymentStats?.length || 0
    const totalAmount = paymentStats?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0
    const activeManagers = managerStats?.length || 0

    return {
      totalUsers,
      activeUsers,
      expiredUsers,
      expiringSoonUsers,
      totalPayments,
      totalAmount,
      activeManagers
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    throw error
  }
}

// Reminder functionality
export const sendRenewalReminder = async (userId: string, reminderType: 'email' | 'sms' | 'call' = 'email') => {
  try {
    // Get user details
    const { data: user, error: userError } = await supabase
      .from('subscription_users')
      .select('*')
      .eq('id', userId)
      .single()

    if (userError) throw userError
    if (!user) throw new Error('User not found')

    // Create reminder log
    const reminderData = {
      user_id: userId,
      reminder_date: new Date().toISOString(),
      reminder_type: reminderType,
      sent_to: user.email,
      sent_to_contact: user.phone || null,
      message: `Renewal reminder sent for ${user.name}. Expiry date: ${new Date(user.expiry_date).toLocaleDateString()}`,
      status: 'sent',
      created_by: 'admin' // In a real app, this would be the current admin user ID
    }

    const { data: reminder, error: reminderError } = await supabase
      .from('renewal_reminders')
      .insert([reminderData])
      .select()
      .single()

    if (reminderError) throw reminderError

    // Update user's last reminder date
    const { error: updateError } = await supabase
      .from('subscription_users')
      .update({ last_reminder_date: new Date().toISOString() })
      .eq('id', userId)

    if (updateError) throw updateError

    return {
      success: true,
      message: `${reminderType.charAt(0).toUpperCase() + reminderType.slice(1)} reminder sent to ${user.name}`,
      reminder
    }
  } catch (error) {
    console.error('Error sending renewal reminder:', error)
    throw error
  }
}

export const getReminderHistory = async (userId?: string) => {
  let query = supabase
    .from('renewal_reminders')
    .select(`
      *,
      subscription_users!inner(
        name,
        email
      )
    `)
    .order('reminder_date', { ascending: false })

  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching reminder history:', error)
    throw error
  }

  return data
}

// Submission management functions
export const createSubmission = async (submissionData: {
  manager_id: string
  amount: number
  submission_date: string
  notes?: string
}) => {
  const { data, error } = await supabase
    .from('submissions')
    .insert([submissionData])
    .select()
    .single()

  if (error) {
    console.error('Error creating submission:', error)
    throw error
  }

  return data
}

export const getSubmissions = async (managerId?: string) => {
  let query = supabase
    .from('submissions')
    .select(`
      *,
      managers_resellers!inner(
        name,
        type,
        email
      )
    `)
    .order('submission_date', { ascending: false })

  if (managerId) {
    query = query.eq('manager_id', managerId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching submissions:', error)
    throw error
  }

  return data
}

export const updateSubmission = async (submissionId: string, updates: Partial<Submission>) => {
  const { data, error } = await supabase
    .from('submissions')
    .update(updates)
    .eq('id', submissionId)
    .select()
    .single()

  if (error) {
    console.error('Error updating submission:', error)
    throw error
  }

  return data
}

export const deleteSubmission = async (submissionId: string) => {
  const { error } = await supabase
    .from('submissions')
    .delete()
    .eq('id', submissionId)

  if (error) {
    console.error('Error deleting submission:', error)
    throw error
  }

  return { success: true }
}

// Supabase client is already exported at the top of the file