'use client'

import { useState, useEffect } from 'react'
import { getLeads, getContactSubmissions, updateLeadStatus, getCurrentAdminUser, signOut, onAuthStateChange, updateLastLogin, type Lead, type ContactSubmission, type AdminUser } from '../../lib/supabase'
import AdminLogin from '../../components/AdminLogin'

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [contacts, setContacts] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'leads' | 'contacts'>('leads')
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    checkAuth()
    
    // Listen to auth state changes
    const { data: { subscription } } = onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        await checkAuth()
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false)
        setAdminUser(null)
        setAuthLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      loadData()
    }
  }, [isAuthenticated])

  const checkAuth = async () => {
    try {
      const adminUser = await getCurrentAdminUser()
      if (adminUser) {
        setAdminUser(adminUser)
        setIsAuthenticated(true)
        await updateLastLogin(adminUser.email)
      } else {
        setIsAuthenticated(false)
      }
    } catch (err) {
      console.error('Auth check error:', err)
      setIsAuthenticated(false)
    } finally {
      setAuthLoading(false)
    }
  }

  const loadData = async () => {
    try {
      setLoading(true)
      const [leadsData, contactsData] = await Promise.all([
        getLeads(),
        getContactSubmissions()
      ])
      setLeads(leadsData || [])
      setContacts(contactsData || [])
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load data. Please check your database connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (leadId: string, status: Lead['status']) => {
    try {
      await updateLeadStatus(leadId, status)
      await loadData() // Refresh data
    } catch (err) {
      console.error('Error updating status:', err)
      setError('Failed to update status.')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'contacted': return 'bg-yellow-100 text-yellow-800'
      case 'qualified': return 'bg-green-100 text-green-800'
      case 'converted': return 'bg-purple-100 text-purple-800'
      case 'lost': return 'bg-red-100 text-red-800'
      case 'responded': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setIsAuthenticated(false)
      setAdminUser(null)
    } catch (err) {
      console.error('Sign out error:', err)
    }
  }

  const handleLoginSuccess = () => {
    checkAuth()
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-white font-cal-sans font-medium text-sm">D</span>
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-accent rounded-full" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dail it Admin</h1>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">Lead Management Dashboard</p>
              {adminUser && (
                <p className="text-xs text-gray-500 mt-1">
                  Welcome back, {adminUser.full_name} ({adminUser.role})
                </p>
              )}
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={loadData}
                className="flex-1 sm:flex-none bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Refresh
              </button>
              <button
                onClick={handleSignOut}
                className="flex-1 sm:flex-none bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h3 className="text-sm sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">Total Leads</h3>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">{leads.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h3 className="text-sm sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">New Leads</h3>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">
              {leads.filter(lead => lead.status === 'new').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h3 className="text-sm sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">Contact Forms</h3>
            <p className="text-2xl sm:text-3xl font-bold text-purple-600">{contacts.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h3 className="text-sm sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">Converted</h3>
            <p className="text-2xl sm:text-3xl font-bold text-orange-600">
              {leads.filter(lead => lead.status === 'converted').length}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex px-4 sm:px-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('leads')}
                className={`py-3 sm:py-4 px-1 mr-6 sm:mr-8 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === 'leads'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Access Requests ({leads.length})
              </button>
              <button
                onClick={() => setActiveTab('contacts')}
                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === 'contacts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Contact Forms ({contacts.length})
              </button>
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === 'leads' ? (
              <>
                {/* Mobile Cards */}
                <div className="block sm:hidden space-y-4">
                  {leads.map((lead) => (
                    <div key={lead.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">{lead.business_name}</h4>
                          <p className="text-sm text-gray-600">{lead.full_name}</p>
                          <p className="text-xs text-gray-500">{lead.email}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs mb-3">
                        <div>
                          <span className="text-gray-500">Industry:</span>
                          <p className="font-medium">{lead.industry}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Users:</span>
                          <p className="font-medium">{lead.number_of_users}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">{formatDate(lead.created_at)}</span>
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusUpdate(lead.id, e.target.value as Lead['status'])}
                          className="text-xs border rounded px-2 py-1"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="converted">Converted</option>
                          <option value="lost">Lost</option>
                        </select>
                      </div>
                    </div>
                  ))}
                  {leads.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No access requests yet.
                    </div>
                  )}
                </div>

                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Business
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Industry
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Users
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {leads.map((lead) => (
                        <tr key={lead.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{lead.business_name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{lead.full_name}</div>
                            <div className="text-sm text-gray-500">{lead.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {lead.industry}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {lead.number_of_users}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                              {lead.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(lead.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <select
                              value={lead.status}
                              onChange={(e) => handleStatusUpdate(lead.id, e.target.value as Lead['status'])}
                              className="text-xs border rounded px-2 py-1"
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="qualified">Qualified</option>
                              <option value="converted">Converted</option>
                              <option value="lost">Lost</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {leads.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No access requests yet.
                    </div>
                  )}
                </div>
              </>
                          ) : (
                <>
                  {/* Mobile Cards */}
                  <div className="block sm:hidden space-y-4">
                    {contacts.map((contact) => (
                      <div key={contact.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900 text-sm">{contact.name}</h4>
                            <p className="text-xs text-gray-500">{contact.email}</p>
                            {contact.company && (
                              <p className="text-xs text-gray-500">{contact.company}</p>
                            )}
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(contact.status)}`}>
                            {contact.status}
                          </span>
                        </div>
                        <div className="mb-3">
                          <span className="text-xs text-gray-500">Message:</span>
                          <p className="text-sm text-gray-900 mt-1 line-clamp-3">{contact.message}</p>
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(contact.created_at)}
                        </div>
                      </div>
                    ))}
                    {contacts.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No contact submissions yet.
                      </div>
                    )}
                  </div>

                  {/* Desktop Table */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Company
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Message
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {contacts.map((contact) => (
                          <tr key={contact.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {contact.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {contact.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {contact.company || '-'}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                              {contact.message}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(contact.status)}`}>
                                {contact.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(contact.created_at)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {contacts.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No contact submissions yet.
                      </div>
                    )}
                  </div>
                </>
              )}
          </div>
        </div>
      </div>
    </div>
  )
} 