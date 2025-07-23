'use client'

import { useState, useEffect } from 'react'
import { 
  getLeads, 
  getContactSubmissions, 
  updateLeadStatus, 
  updateContactStatus,
  getSubscriptionUsers,
  getReconciliationSummary,
  getUsersExpiringSoon,
  getPaymentSummary,
  getParentAccountHierarchy,
  getDashboardStats,
  createSubscriptionUser,
  updateSubscriptionUser,
  deleteSubscriptionUser,
  createPayment,
  getManagers,
  getResellers,
  sendRenewalReminder,
  createSubmission,
  getSubmissions
} from '../../../admin/lib/supabase-admin'
import type { 
  AdminUser, 
  SubscriptionUser, 
  ReconciliationSummary, 
  UserExpiringSoon, 
  Payment,
  Manager,
  Reseller 
} from '../../../admin/lib/supabase-admin'
import type { Lead, ContactSubmission } from '../../lib/supabase'
import AddUserModal from './AddUserModal'
import EditUserModal from './EditUserModal'
import AddPaymentModal from './AddPaymentModal'
import DeleteConfirmationModal from './DeleteConfirmationModal'
import SubmissionEntryModal from './SubmissionEntryModal'
import UserTable from './UserTable'
import LeadsTable from './LeadsTable'
import ContactsTable from './ContactsTable'
import ManagersTable from './ManagersTable'
import ResellersTable from './ResellersTable'

interface AdminDashboardProps {
  adminUser: AdminUser
  onLogout: () => void
}

export default function AdminDashboard({ adminUser, onLogout }: AdminDashboardProps) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [contacts, setContacts] = useState<ContactSubmission[]>([])
  const [subscriptionUsers, setSubscriptionUsers] = useState<SubscriptionUser[]>([])
  const [reconciliationSummary, setReconciliationSummary] = useState<ReconciliationSummary[]>([])
  const [usersExpiringSoon, setUsersExpiringSoon] = useState<UserExpiringSoon[]>([])
  const [paymentSummary, setPaymentSummary] = useState<any[]>([])
  const [parentAccounts, setParentAccounts] = useState<any[]>([])
  const [dashboardStats, setDashboardStats] = useState<any>({})
  const [managers, setManagers] = useState<Manager[]>([])
  const [resellers, setResellers] = useState<Reseller[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'contacts' | 'users' | 'payments' | 'reconciliation' | 'expiry' | 'managers' | 'resellers'>('overview')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false)
  
  // Form states
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    subscription_start_date: '',
    renewal_date: '',
    expiry_date: '',
    manager_id: '',
    reseller_id: '',
    parent_account_id: '',
    voip_number: '',
    payment_amount: '',
    notes: ''
  })
  
  const [newPayment, setNewPayment] = useState<{
    user_id: string
    amount: string
    payment_date: string
    payment_method: 'cash' | 'bank_transfer' | 'check' | 'online' | 'other'
    notes: string
  }>({
    user_id: '',
    amount: '',
    payment_date: '',
    payment_method: 'cash',
    notes: ''
  })
  
  const [submitting, setSubmitting] = useState(false)
  const [sendingReminder, setSendingReminder] = useState<string | null>(null)
  const [editingUser, setEditingUser] = useState<SubscriptionUser | null>(null)
  const [showEditUserModal, setShowEditUserModal] = useState(false)
  const [deletingUser, setDeletingUser] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState<{id: string, name: string} | null>(null)
  const [showSubmissionModal, setShowSubmissionModal] = useState(false)
  const [submissions, setSubmissions] = useState<any[]>([])
  
  // Filter and search states
  const [userSearchTerm, setUserSearchTerm] = useState('')
  const [userStatusFilter, setUserStatusFilter] = useState<'all' | 'active' | 'inactive' | 'expired'>('all')
  const [userManagerFilter, setUserManagerFilter] = useState<string>('all')
  const [paymentDateFilter, setPaymentDateFilter] = useState({ start: '', end: '' })
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<'all' | 'cash' | 'bank_transfer' | 'check' | 'other'>('all')
  const [leadStatusFilter, setLeadStatusFilter] = useState<'all' | 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'>('all')
  const [contactStatusFilter, setContactStatusFilter] = useState<'all' | 'new' | 'responded' | 'resolved'>('all')
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('Loading dashboard data...')

      // Load leads
      const leadsData = await getLeads()
      console.log('Leads loaded:', leadsData.length)
      setLeads(leadsData)

      // Load contact submissions
      const contactsData = await getContactSubmissions()
      console.log('Contacts loaded:', contactsData.length)
      setContacts(contactsData)

      // Load reconciliation system data
      try {
        const [usersData, reconciliationData, expiringData, paymentsData, accountsData, statsData, managersData, resellersData, submissionsData] = await Promise.all([
          getSubscriptionUsers(),
          getReconciliationSummary(),
          getUsersExpiringSoon(),
          getPaymentSummary(),
          getParentAccountHierarchy(),
          getDashboardStats(),
          getManagers(),
          getResellers(),
          getSubmissions()
        ])

        setSubscriptionUsers(usersData || [])
        setReconciliationSummary(reconciliationData || [])
        setUsersExpiringSoon(expiringData || [])
        setPaymentSummary(paymentsData || [])
        setParentAccounts(accountsData || [])
        setDashboardStats(statsData || {})
        setManagers(managersData || [])
        setResellers(resellersData || [])
        setSubmissions(submissionsData || [])

        console.log('Reconciliation data loaded successfully')
      } catch (reconciliationError: any) {
        console.warn('Reconciliation system data not available:', reconciliationError.message)
        // Don't throw error, just log warning as reconciliation system might not be set up yet
      }

    } catch (err: any) {
      console.error('Error loading dashboard data:', err)
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleLeadStatusUpdate = async (leadId: string, newStatus: Lead['status'], notes?: string) => {
    try {
      setUpdatingId(leadId)
      await updateLeadStatus(leadId, newStatus)
      
      // Update local state
      setLeads(prev => prev.map(lead => 
        lead.id === leadId 
          ? { ...lead, status: newStatus, notes: notes || lead.notes }
          : lead
      ))
    } catch (err: any) {
      console.error('Error updating lead status:', err)
      setError(err.message || 'Failed to update lead status')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleContactStatusUpdate = async (contactId: string, newStatus: ContactSubmission['status']) => {
    try {
      setUpdatingId(contactId)
      await updateContactStatus(contactId, newStatus)
      
      // Update local state
      setContacts(prev => prev.map(contact => 
        contact.id === contactId 
          ? { ...contact, status: newStatus }
          : contact
      ))
    } catch (err: any) {
      console.error('Error updating contact status:', err)
      setError(err.message || 'Failed to update contact status')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    // Basic validation
    if (!newUser.name.trim() || !newUser.email.trim() || !newUser.phone.trim() || !newUser.expiry_date || !newUser.subscription_start_date || !newUser.renewal_date || !newUser.payment_amount.trim()) {
      setError('Please fill in all required fields')
      setTimeout(() => setError(null), 5000)
      return
    }
    
    if (isNaN(parseFloat(newUser.payment_amount)) || parseFloat(newUser.payment_amount) <= 0) {
      setError('Please enter a valid payment amount')
      setTimeout(() => setError(null), 5000)
      return
    }
    
    try {
      setSubmitting(true)
      setError(null)
      const userData = {
        ...newUser,
        subscription_start_date: new Date(newUser.subscription_start_date).toISOString(),
        renewal_date: new Date(newUser.renewal_date).toISOString(),
        expiry_date: new Date(newUser.expiry_date).toISOString(),
        status: 'active' as const,
        payment_amount: newUser.payment_amount ? parseFloat(newUser.payment_amount) : undefined
      }
      
      const createdUser = await createSubscriptionUser(userData)
      setSubscriptionUsers(prev => [...prev, createdUser])
      
      // Create initial payment for the user
      const paymentData = {
        user_id: createdUser.id,
        amount: parseFloat(newUser.payment_amount),
        payment_date: new Date().toISOString(),
        payment_method: 'cash' as const,
        collected_by_id: adminUser.id,
        notes: 'Initial payment during user creation'
      }
      
      await createPayment(paymentData)
      
      // Reset form and close modal
      setNewUser({
        name: '',
        email: '',
        phone: '',
        subscription_start_date: '',
        renewal_date: '',
        expiry_date: '',
        manager_id: '',
        reseller_id: '',
        parent_account_id: '',
        voip_number: '',
        payment_amount: '',
        notes: ''
      })
      setShowAddUserModal(false)
      
      // Refresh data
      await loadDashboardData()
      setSuccessMessage('User added successfully!')
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      console.error('Error adding user:', err)
      setError(err.message || 'Failed to add user')
      setTimeout(() => setError(null), 5000)
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!newPayment.user_id || !newPayment.amount || !newPayment.payment_date || !newPayment.payment_method) {
      setError('Please fill in all required payment fields')
      setTimeout(() => setError(null), 5000)
      return
    }
    
    if (isNaN(parseFloat(newPayment.amount)) || parseFloat(newPayment.amount) <= 0) {
      setError('Please enter a valid payment amount')
      setTimeout(() => setError(null), 5000)
      return
    }
    
    try {
      setSubmitting(true)
      setError(null)
      const paymentData = {
        ...newPayment,
        amount: parseFloat(newPayment.amount),
        payment_date: new Date(newPayment.payment_date).toISOString(),
        collected_by_id: adminUser.id
      }
      
      await createPayment(paymentData)
      
      // Reset form and close modal
      setNewPayment({
        user_id: '',
        amount: '',
        payment_date: '',
        payment_method: 'cash',
        notes: ''
      })
      setShowAddPaymentModal(false)
      
      // Refresh data
      await loadDashboardData()
      setSuccessMessage('Payment added successfully!')
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      console.error('Error adding payment:', err)
      setError(err.message || 'Failed to add payment')
      setTimeout(() => setError(null), 5000)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSendReminder = async (userId: string, userName: string) => {
    try {
      setSendingReminder(userId)
      const result = await sendRenewalReminder(userId, 'email')
      
      if (result.success) {
        // Update local state to reflect the reminder was sent
        setUsersExpiringSoon(prev => prev.map(user => 
          user.id === userId 
            ? { ...user, last_reminder_date: new Date().toISOString() }
            : user
        ))
        
        // Show success message
        setError(null)
        setSuccessMessage(`Reminder sent to ${userName} successfully!`)
        setTimeout(() => setSuccessMessage(null), 3000)
      }
    } catch (err: any) {
      console.error('Error sending reminder:', err)
      setError(err.message || 'Failed to send reminder')
    } finally {
      setSendingReminder(null)
    }
  }

  const handleEditUser = (user: SubscriptionUser) => {
    setEditingUser(user)
    setShowEditUserModal(true)
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return
    
    // Basic validation
    if (!editingUser.name.trim() || !editingUser.email.trim() || !editingUser.phone?.trim() || !editingUser.expiry_date) {
      setError('Please fill in all required fields')
      setTimeout(() => setError(null), 5000)
      return
    }
    
    try {
      setSubmitting(true)
      setError(null)
      const updatedUser = await updateSubscriptionUser(editingUser.id, editingUser)
      
      // Update local state
      setSubscriptionUsers(prev => prev.map(user => 
        user.id === editingUser.id ? updatedUser : user
      ))
      
      setShowEditUserModal(false)
      setEditingUser(null)
      await loadDashboardData()
      setSuccessMessage('User updated successfully!')
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      console.error('Error updating user:', err)
      setError(err.message || 'Failed to update user')
      setTimeout(() => setError(null), 5000)
    } finally {
      setSubmitting(false)
    }
  }

  const handleCreateSubmission = async (submissionData: {
    manager_id: string
    amount: number
    submission_date: string
    notes?: string
  }) => {
    try {
      setSubmitting(true)
      setError(null)
      
      const newSubmission = await createSubmission(submissionData)
      
      // Update local state
      setSubmissions(prev => [newSubmission, ...prev])
      
      setShowSubmissionModal(false)
      await loadDashboardData() // Refresh reconciliation data
      setSuccessMessage('Submission recorded successfully!')
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      console.error('Error creating submission:', err)
      setError(err.message || 'Failed to record submission')
      setTimeout(() => setError(null), 5000)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteUser = (userId: string, userName: string) => {
    setUserToDelete({ id: userId, name: userName })
    setShowDeleteModal(true)
  }

  const confirmDeleteUser = async () => {
    if (!userToDelete) return
    
    try {
      setDeletingUser(userToDelete.id)
      setError(null)
      
      // Delete user from database
      await deleteSubscriptionUser(userToDelete.id)
      
      // Remove from local state
      setSubscriptionUsers(prev => prev.filter(user => user.id !== userToDelete.id))
      setSuccessMessage(`User "${userToDelete.name}" deleted successfully!`)
      setTimeout(() => setSuccessMessage(null), 3000)
      
      // Close modal
      setShowDeleteModal(false)
      setUserToDelete(null)
    } catch (err: any) {
      console.error('Error deleting user:', err)
      setError(err.message || 'Failed to delete user')
      setTimeout(() => setError(null), 5000)
    } finally {
      setDeletingUser(null)
    }
  }

  const cancelDeleteUser = () => {
    setShowDeleteModal(false)
    setUserToDelete(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  // Filter functions
  const filteredUsers = subscriptionUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                         (user.phone && user.phone.includes(userSearchTerm))
    
    const matchesStatus = userStatusFilter === 'all' || user.status === userStatusFilter
    
    const matchesManager = userManagerFilter === 'all' || user.manager_id === userManagerFilter
    
    return matchesSearch && matchesStatus && matchesManager
  })

  const filteredPayments = paymentSummary.filter(payment => {
    const paymentDate = new Date(payment.payment_date)
    const startDate = paymentDateFilter.start ? new Date(paymentDateFilter.start) : null
    const endDate = paymentDateFilter.end ? new Date(paymentDateFilter.end) : null
    
    const matchesDateRange = (!startDate || paymentDate >= startDate) && 
                            (!endDate || paymentDate <= endDate)
    
    const matchesMethod = paymentMethodFilter === 'all' || payment.payment_method === paymentMethodFilter
    
    return matchesDateRange && matchesMethod
  })

  const filteredLeads = leads.filter(lead => {
    return leadStatusFilter === 'all' || lead.status === leadStatusFilter
  })

  const filteredContacts = contacts.filter(contact => {
    return contactStatusFilter === 'all' || contact.status === contactStatusFilter
  })

  // Export functions
  const exportToCSV = (data: any[], filename: string, headers: string[]) => {
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header.toLowerCase().replace(/\s+/g, '_')] || ''
        return `"${String(value).replace(/"/g, '""')}"`
      }).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleExportUsers = async () => {
    setExporting(true)
    try {
      const headers = ['Name', 'Email', 'Phone', 'Status', 'Expiry_Date', 'Manager_Reseller', 'Notes']
      const exportData = filteredUsers.map(user => ({
        name: user.name,
        email: user.email,
        phone: user.phone,
        status: user.status,
        expiry_date: new Date(user.expiry_date).toLocaleDateString(),
        manager_reseller: managers.find(m => m.id === user.manager_id)?.name || 'N/A',
        notes: user.notes || ''
      }))
      exportToCSV(exportData, 'subscription_users', headers)
    } catch (error) {
      console.error('Export failed:', error)
      setError('Failed to export users data')
    } finally {
      setExporting(false)
    }
  }

  const handleExportPayments = async () => {
    setExporting(true)
    try {
      const headers = ['User_Name', 'Amount', 'Payment_Date', 'Payment_Method', 'Collector_Name', 'Collector_Type', 'Notes']
      const exportData = filteredPayments.map(payment => ({
        user_name: payment.user_name,
        amount: payment.amount,
        payment_date: new Date(payment.payment_date).toLocaleDateString(),
        payment_method: payment.payment_method,
        collector_name: payment.collector_name,
        collector_type: payment.collector_type,
        notes: payment.notes || ''
      }))
      exportToCSV(exportData, 'payments', headers)
    } catch (error) {
      console.error('Export failed:', error)
      setError('Failed to export payments data')
    } finally {
      setExporting(false)
    }
  }

  const handleExportReconciliation = async () => {
    setExporting(true)
    try {
      const headers = ['Name', 'Type', 'Total_Collected', 'Total_Submitted', 'Amount_Owed', 'Payment_Count', 'Submission_Count']
      const exportData = reconciliationSummary.map(item => ({
        name: item.name,
        type: item.type,
        total_collected: item.total_collected || 0,
        total_submitted: item.total_submitted || 0,
        amount_owed: item.amount_owed || 0,
        payment_count: item.payment_count || 0,
        submission_count: item.submission_count || 0
      }))
      exportToCSV(exportData, 'reconciliation_summary', headers)
    } catch (error) {
      console.error('Export failed:', error)
      setError('Failed to export reconciliation data')
    } finally {
      setExporting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'contacted': return 'bg-yellow-100 text-yellow-800'
      case 'qualified': return 'bg-purple-100 text-purple-800'
      case 'converted': return 'bg-green-100 text-green-800'
      case 'lost': return 'bg-red-100 text-red-800'
      case 'responded': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 space-y-3 sm:space-y-0">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-cal-sans font-medium">D</span>
              </div>
              <h1 className="text-lg sm:text-xl font-cal-sans text-gray-900">
                Dail it Admin Dashboard
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <span className="text-sm text-gray-600">
                Welcome, {adminUser.full_name}
              </span>
              <button
                onClick={onLogout}
                className="w-full sm:w-auto bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-2 sm:space-x-8 overflow-x-auto scrollbar-hide pb-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="hidden sm:inline">Users ({subscriptionUsers.length})</span>
              <span className="sm:hidden">Users</span>
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ${
                activeTab === 'payments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="hidden sm:inline">Payments ({paymentSummary.length})</span>
              <span className="sm:hidden">Payments</span>
            </button>
            <button
              onClick={() => setActiveTab('reconciliation')}
              className={`py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ${
                activeTab === 'reconciliation'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="hidden sm:inline">Reconciliation</span>
              <span className="sm:hidden">Recon</span>
            </button>
            <button
              onClick={() => setActiveTab('expiry')}
              className={`py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ${
                activeTab === 'expiry'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="hidden sm:inline">Expiring ({usersExpiringSoon.length})</span>
              <span className="sm:hidden">Expiry</span>
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={`py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ${
                activeTab === 'leads'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="hidden sm:inline">Leads ({leads.length})</span>
              <span className="sm:hidden">Leads</span>
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ${
                activeTab === 'contacts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="hidden sm:inline">Contacts ({contacts.length})</span>
              <span className="sm:hidden">Contacts</span>
            </button>
            <button
              onClick={() => setActiveTab('managers')}
              className={`py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ${
                activeTab === 'managers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="hidden sm:inline">Managers ({managers.length})</span>
              <span className="sm:hidden">Managers</span>
            </button>
            <button
              onClick={() => setActiveTab('resellers')}
              className={`py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ${
                activeTab === 'resellers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Resellers
            </button>
          </nav>
        </div>

        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-700">{successMessage}</p>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-green-700 underline text-sm mt-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-700 underline text-sm mt-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* User Metrics */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium opacity-90">Total Users</h3>
                    <p className="text-3xl">{dashboardStats.totalUsers || 0}</p>
                    <p className="text-sm opacity-75">{dashboardStats.activeUsers || 0} active</p>
                  </div>
                  <div className="text-4xl opacity-80">👥</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium opacity-90">Leads</h3>
                    <p className="text-3xl">{leads.length}</p>
                    <p className="text-sm opacity-75">{leads.filter(lead => lead.status === 'new').length} new</p>
                  </div>
                  <div className="text-4xl opacity-80">🎯</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium opacity-90">Contacts</h3>
                    <p className="text-3xl">{contacts.length}</p>
                    <p className="text-sm opacity-75">{contacts.filter(contact => contact.status === 'new').length} new</p>
                  </div>
                  <div className="text-4xl opacity-80">📞</div>
                </div>
              </div>
            </div>

            {/* Status Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                      {dashboardStats.activeUsers || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Expiring Soon</span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">
                      {usersExpiringSoon.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Expired</span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                      {dashboardStats.expiredUsers || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">New</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                      {leads.filter(l => l.status === 'new').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Qualified</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                      {leads.filter(l => l.status === 'qualified').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Converted</span>
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm font-medium">
                      {leads.filter(l => l.status === 'converted').length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Managers</span>
                    <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm font-medium">
                      {dashboardStats.activeManagers || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Parent Accounts</span>
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm font-medium">
                      {parentAccounts.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Submissions</span>
                    <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-sm font-medium">
                      {submissions.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                <button
                  onClick={() => setActiveTab('users')}
                  className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <div className="text-2xl mb-2">👥</div>
                  <span className="text-sm font-medium text-blue-700">Manage Users</span>
                </button>
                <button
                  onClick={() => setActiveTab('leads')}
                  className="flex flex-col items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                >
                  <div className="text-2xl mb-2">🎯</div>
                  <span className="text-sm font-medium text-orange-700">View Leads</span>
                </button>
                <button
                  onClick={() => setActiveTab('payments')}
                  className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <div className="text-2xl mb-2">💰</div>
                  <span className="text-sm font-medium text-green-700">Payments</span>
                </button>
                <button
                  onClick={() => setActiveTab('contacts')}
                  className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                >
                  <div className="text-2xl mb-2">📞</div>
                  <span className="text-sm font-medium text-purple-700">Contacts</span>
                </button>
                <button
                  onClick={() => setActiveTab('expiry')}
                  className="flex flex-col items-center p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <div className="text-2xl mb-2">⏰</div>
                  <span className="text-sm font-medium text-red-700">Expiring</span>
                </button>
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="flex flex-col items-center p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                >
                  <div className="text-2xl mb-2">➕</div>
                  <span className="text-sm font-medium text-indigo-700">Add User</span>
                </button>
              </div>
            </div>

            {/* Recent Activity & Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                </div>
                <div className="p-6 space-y-4">
                  {/* Recent Leads */}
                  {leads.slice(0, 3).map((lead) => (
                    <div key={`lead-${lead.id}`} className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                      <div className="text-orange-600">🎯</div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">New lead: {lead.full_name}</p>
                        <p className="text-xs text-gray-600">{lead.business_name}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </div>
                  ))}
                  
                  {/* Recent Contacts */}
                  {contacts.slice(0, 2).map((contact) => (
                    <div key={`contact-${contact.id}`} className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                      <div className="text-purple-600">📞</div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Contact: {contact.name}</p>
                        <p className="text-xs text-gray-600">{contact.email}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                        {contact.status}
                      </span>
                    </div>
                  ))}
                  
                  {leads.length === 0 && contacts.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No recent activity</p>
                  )}
                </div>
              </div>

              {/* Alerts & Notifications */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Alerts & Notifications</h3>
                </div>
                <div className="p-6 space-y-4">
                  {/* Expiring Users Alert */}
                  {usersExpiringSoon.length > 0 && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="text-yellow-600 mr-3">⚠️</div>
                        <div>
                          <h4 className="text-sm font-medium text-yellow-800">
                            {usersExpiringSoon.length} Users Expiring Soon
                          </h4>
                          <p className="text-xs text-yellow-700 mt-1">
                            Review and send renewal reminders
                          </p>
                        </div>
                        <button
                          onClick={() => setActiveTab('expiry')}
                          className="ml-auto text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                        >
                          View →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* New Leads Alert */}
                  {leads.filter(l => l.status === 'new').length > 0 && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="text-blue-600 mr-3">🎯</div>
                        <div>
                          <h4 className="text-sm font-medium text-blue-800">
                            {leads.filter(l => l.status === 'new').length} New Leads
                          </h4>
                          <p className="text-xs text-blue-700 mt-1">
                            Require follow-up action
                          </p>
                        </div>
                        <button
                          onClick={() => setActiveTab('leads')}
                          className="ml-auto text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* New Contacts Alert */}
                  {contacts.filter(c => c.status === 'new').length > 0 && (
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="text-purple-600 mr-3">📞</div>
                        <div>
                          <h4 className="text-sm font-medium text-purple-800">
                            {contacts.filter(c => c.status === 'new').length} New Contacts
                          </h4>
                          <p className="text-xs text-purple-700 mt-1">
                            Awaiting response
                          </p>
                        </div>
                        <button
                          onClick={() => setActiveTab('contacts')}
                          className="ml-auto text-purple-600 hover:text-purple-800 text-sm font-medium"
                        >
                          View →
                        </button>
                      </div>
                    </div>
                  )}

                  {usersExpiringSoon.length === 0 && 
                   leads.filter(l => l.status === 'new').length === 0 && 
                   contacts.filter(c => c.status === 'new').length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">✅</div>
                      <p className="text-gray-500">All caught up!</p>
                      <p className="text-sm text-gray-400">No urgent items require attention</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Subscription Users</h2>
              <div className="flex space-x-3">
                <button
                  onClick={handleExportUsers}
                  disabled={exporting}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {exporting ? 'Exporting...' : 'Export CSV'}
                </button>
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add User
                </button>
              </div>
            </div>

            {/* Search and Filter Controls */}
            <div className="bg-white p-4 rounded-lg shadow space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search Users</label>
                  <input
                    type="text"
                    placeholder="Search by name, email, or phone..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status Filter</label>
                  <select
                    value={userStatusFilter}
                    onChange={(e) => setUserStatusFilter(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manager/Reseller</label>
                  <select
                    value={userManagerFilter}
                    onChange={(e) => setUserManagerFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Managers</option>
                    {managers.map(manager => (
                      <option key={manager.id} value={manager.id}>{manager.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setUserSearchTerm('')
                      setUserStatusFilter('all')
                      setUserManagerFilter('all')
                    }}
                    className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Showing {filteredUsers.length} of {subscriptionUsers.length} users
              </div>
            </div>

            <UserTable
              users={filteredUsers}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
              deletingUser={deletingUser}
              managers={managers}
              resellers={resellers}
            />
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Payment Analytics & Management</h2>
              <div className="flex space-x-3">
                <button
                  onClick={handleExportPayments}
                  disabled={exporting}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {exporting ? 'Exporting...' : 'Export CSV'}
                </button>
                <button
                  onClick={() => setShowAddPaymentModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Payment
                </button>
              </div>
            </div>

            {/* Payment Analytics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* This Month Revenue */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium opacity-90">This Month Revenue</h3>
                    <p className="text-2xl font-bold">
                      Rs. {paymentSummary
                        .filter(p => {
                          const paymentDate = new Date(p.payment_date)
                          const currentDate = new Date()
                          return paymentDate.getMonth() === currentDate.getMonth() && 
                                 paymentDate.getFullYear() === currentDate.getFullYear()
                        })
                        .reduce((sum, p) => sum + Number(p.amount), 0)
                        .toLocaleString()}
                    </p>
                    <p className="text-sm opacity-75">
                      {paymentSummary.filter(p => {
                        const paymentDate = new Date(p.payment_date)
                        const currentDate = new Date()
                        return paymentDate.getMonth() === currentDate.getMonth() && 
                               paymentDate.getFullYear() === currentDate.getFullYear()
                      }).length} payments
                    </p>
                  </div>
                  <div className="text-4xl opacity-80">💰</div>
                </div>
              </div>

              {/* Monthly Active Users */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium opacity-90">Monthly Active Users</h3>
                    <p className="text-2xl font-bold">
                      {new Set(paymentSummary
                        .filter(p => {
                          const paymentDate = new Date(p.payment_date)
                          const currentDate = new Date()
                          return paymentDate.getMonth() === currentDate.getMonth() && 
                                 paymentDate.getFullYear() === currentDate.getFullYear()
                        })
                        .map(p => p.user_id)).size}
                    </p>
                    <p className="text-sm opacity-75">paying users</p>
                  </div>
                  <div className="text-4xl opacity-80">👤</div>
                </div>
              </div>

              {/* Average Payment */}
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium opacity-90">Avg Payment</h3>
                    <p className="text-2xl font-bold">
                      Rs. {paymentSummary.length > 0 
                        ? (paymentSummary.reduce((sum, p) => sum + Number(p.amount), 0) / paymentSummary.length).toFixed(0)
                        : '0'}
                    </p>
                    <p className="text-sm opacity-75">per transaction</p>
                  </div>
                  <div className="text-4xl opacity-80">📊</div>
                </div>
              </div>

              {/* Total Revenue */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium opacity-90">Total Revenue</h3>
                    <p className="text-2xl font-bold">
                      Rs. {paymentSummary.reduce((sum, p) => sum + Number(p.amount), 0).toLocaleString()}
                    </p>
                    <p className="text-sm opacity-75">{paymentSummary.length} total payments</p>
                  </div>
                  <div className="text-4xl opacity-80">💎</div>
                </div>
              </div>
            </div>

            {/* Payment Method Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods (This Month)</h3>
                <div className="space-y-3">
                  {['cash', 'bank_transfer', 'check', 'online', 'other'].map(method => {
                    const methodPayments = paymentSummary.filter(p => {
                      const paymentDate = new Date(p.payment_date)
                      const currentDate = new Date()
                      return p.payment_method === method &&
                             paymentDate.getMonth() === currentDate.getMonth() && 
                             paymentDate.getFullYear() === currentDate.getFullYear()
                    })
                    const methodTotal = methodPayments.reduce((sum, p) => sum + Number(p.amount), 0)
                    const methodCount = methodPayments.length
                    
                    return (
                      <div key={method} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 capitalize">{method.replace('_', ' ')}</span>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">Rs. {methodTotal.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">{methodCount} payments</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
                <div className="space-y-3">
                  {[0, 1, 2, 3, 4, 5].map(monthsAgo => {
                    const targetDate = new Date()
                    targetDate.setMonth(targetDate.getMonth() - monthsAgo)
                    
                    const monthPayments = paymentSummary.filter(p => {
                      const paymentDate = new Date(p.payment_date)
                      return paymentDate.getMonth() === targetDate.getMonth() && 
                             paymentDate.getFullYear() === targetDate.getFullYear()
                    })
                    
                    const monthTotal = monthPayments.reduce((sum, p) => sum + Number(p.amount), 0)
                    const monthUsers = new Set(monthPayments.map(p => p.user_id)).size
                    
                    return (
                      <div key={monthsAgo} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {targetDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </span>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">Rs. {monthTotal.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">{monthUsers} users</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Payment Filter Controls */}
            <div className="bg-white p-4 rounded-lg shadow space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={paymentDateFilter.start}
                    onChange={(e) => setPaymentDateFilter(prev => ({ ...prev, start: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={paymentDateFilter.end}
                    onChange={(e) => setPaymentDateFilter(prev => ({ ...prev, end: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <select
                    value={paymentMethodFilter}
                    onChange={(e) => setPaymentMethodFilter(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Methods</option>
                    <option value="cash">Cash</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="check">Check</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Showing {filteredPayments.length} of {paymentSummary.length} payments
                </div>
                <button
                  onClick={() => {
                    setPaymentDateFilter({ start: '', end: '' })
                    setPaymentMethodFilter('all')
                  }}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collector</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{payment.user_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-green-600">Rs. {Number(payment.amount).toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{new Date(payment.payment_date).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {payment.payment_method}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{payment.collector_name}</div>
                          <div className="text-sm text-gray-500">{payment.collector_type}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">{payment.notes || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Reconciliation Tab */}
        {activeTab === 'reconciliation' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Financial Reconciliation</h2>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowSubmissionModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Record Submission
                </button>
                <button
                  onClick={handleExportReconciliation}
                  disabled={exporting}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {exporting ? 'Exporting...' : 'Export CSV'}
                </button>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager/Reseller</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collected</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owed</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payments</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submissions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reconciliationSummary.map((item) => (
                      <tr key={`${item.name}-${item.type}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            item.type === 'manager' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
                          }`}>
                            {item.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-green-600">Rs. {Number(item.total_collected || 0).toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-blue-600">Rs. {Number(item.total_submitted || 0).toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${
                            Number(item.amount_owed || 0) > 0 ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            Rs. {Number(item.amount_owed || 0).toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.payment_count || 0}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.submission_count || 0}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Expiry Tab */}
        {activeTab === 'expiry' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Users Expiring Soon</h2>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager/Reseller</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Reminder</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {usersExpiringSoon.map((user) => {
                      const daysUntilExpiry = Math.ceil((new Date(user.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                      
                      return (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">VoIP: {user.voip_number || 'N/A'}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.email}</div>
                            <div className="text-sm text-gray-500">{user.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{new Date(user.expiry_date).toLocaleDateString()}</div>
                            <div className="text-sm text-gray-500">
                              {daysUntilExpiry < 0 ? `Expired ${Math.abs(daysUntilExpiry)} days ago` : 
                               daysUntilExpiry === 0 ? 'Expires today' :
                               `${daysUntilExpiry} days remaining`}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              daysUntilExpiry < 0 ? 'bg-red-100 text-red-800' :
                              daysUntilExpiry <= 3 ? 'bg-red-100 text-red-800' :
                              daysUntilExpiry <= 7 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {user.expiry_status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.manager_name || user.reseller_name || 'N/A'}</div>
                            <div className="text-sm text-gray-500">Manager/Reseller</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {user.last_reminder_date ? new Date(user.last_reminder_date).toLocaleDateString() : 'Never'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              onClick={() => handleSendReminder(user.id, user.name)}
                              disabled={sendingReminder === user.id}
                              className="text-blue-600 hover:text-blue-900 mr-3 disabled:opacity-50"
                            >
                              {sendingReminder === user.id ? 'Sending...' : 'Send Reminder'}
                            </button>
                            <button className="text-green-600 hover:text-green-900">Renew</button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Leads Tab */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Leads Management</h2>
            </div>

            {/* Lead Filter Controls */}
            <div className="bg-white p-4 rounded-lg shadow space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status Filter</label>
                  <select
                    value={leadStatusFilter}
                    onChange={(e) => setLeadStatusFilter(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="converted">Converted</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => setLeadStatusFilter('all')}
                    className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Clear Filter
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Showing {filteredLeads.length} of {leads.length} leads
              </div>
            </div>

            <LeadsTable
              leads={filteredLeads}
              onUpdateLeadStatus={handleLeadStatusUpdate}
              updatingId={updatingId || undefined}
              getStatusColor={getStatusColor}
              formatDate={formatDate}
            />
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Contacts Management</h2>
            </div>

            {/* Contact Filter Controls */}
            <div className="bg-white p-4 rounded-lg shadow space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status Filter</label>
                  <select
                    value={contactStatusFilter}
                    onChange={(e) => setContactStatusFilter(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="new">New</option>
                    <option value="responded">Responded</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => setContactStatusFilter('all')}
                    className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Clear Filter
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Showing {filteredContacts.length} of {contacts.length} contacts
              </div>
            </div>

            <ContactsTable
              contacts={filteredContacts}
              onUpdateContactStatus={handleContactStatusUpdate}
              updatingId={updatingId || undefined}
              getStatusColor={getStatusColor}
              formatDate={formatDate}
            />
          </div>
        )}

        {/* Managers Tab */}
        {activeTab === 'managers' && (
          <div className="space-y-6">
            <ManagersTable />
          </div>
        )}

        {/* Resellers Tab */}
        {activeTab === 'resellers' && (
          <div className="space-y-6">
            <ResellersTable />
          </div>
        )}
      </div>

      {/* Modals */}
      <AddUserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onSubmit={handleAddUser}
        newUser={newUser}
        setNewUser={setNewUser}
        managers={managers}
        subscriptionUsers={subscriptionUsers}
        submitting={submitting}
      />

      <AddPaymentModal
        isOpen={showAddPaymentModal}
        onClose={() => setShowAddPaymentModal(false)}
        onSubmit={handleAddPayment}
        newPayment={newPayment}
        setNewPayment={setNewPayment}
        subscriptionUsers={subscriptionUsers}
        submitting={submitting}
      />

      <EditUserModal
        isOpen={showEditUserModal}
        onClose={() => {
          setShowEditUserModal(false);
          setEditingUser(null);
        }}
        onSubmit={handleUpdateUser}
        editingUser={editingUser}
        setEditingUser={setEditingUser}
        managers={managers}
        subscriptionUsers={subscriptionUsers}
        submitting={submitting}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={cancelDeleteUser}
        onConfirm={confirmDeleteUser}
        userName={userToDelete?.name || ''}
        submitting={submitting}
      />

      <SubmissionEntryModal
        isOpen={showSubmissionModal}
        onClose={() => setShowSubmissionModal(false)}
        onSubmit={handleCreateSubmission}
        managers={managers}
        resellers={resellers}
        submitting={submitting}
      />
    </div>
  )
}