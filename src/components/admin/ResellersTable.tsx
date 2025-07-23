'use client'

import { useState, useEffect } from 'react'
import { getResellers, getManagers, createReseller, updateReseller, type Reseller, type Manager } from '../../../admin/lib/supabase-admin'
import AddResellerModal from './AddResellerModal'

export default function ResellersTable() {
  const [resellers, setResellers] = useState<Reseller[]>([])
  const [managers, setManagers] = useState<Manager[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [newReseller, setNewReseller] = useState({
    name: '',
    email: '',
    phone: '',
    manager_id: '',
    notes: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [resellersData, managersData] = await Promise.all([
        getResellers(),
        getManagers()
      ])
      setResellers(resellersData)
      setManagers(managersData.filter(m => m.is_active))
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddReseller = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      await createReseller(newReseller)
      setNewReseller({ name: '', email: '', phone: '', manager_id: '', notes: '' })
      setShowAddModal(false)
      await loadData()
    } catch (error) {
      console.error('Error adding reseller:', error)
      alert('Failed to add reseller')
    } finally {
      setSubmitting(false)
    }
  }

  const toggleResellerStatus = async (reseller: Reseller) => {
    try {
      await updateReseller(reseller.id, { is_active: !reseller.is_active })
      await loadData()
    } catch (error) {
      console.error('Error updating reseller status:', error)
      alert('Failed to update reseller status')
    }
  }

  const getManagerName = (managerId: string) => {
    const manager = managers.find(m => m.id === managerId)
    return manager ? manager.name : 'Unknown Manager'
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Resellers</h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm sm:text-base w-full sm:w-auto"
            disabled={managers.length === 0}
          >
            Add Reseller
          </button>
        </div>
        {managers.length === 0 && (
          <p className="text-sm text-gray-500 mt-2">
            You need to add at least one active manager before adding resellers.
          </p>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                Phone
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Manager
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {resellers.map((reseller) => (
              <tr key={reseller.id}>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 truncate max-w-32 sm:max-w-none">{reseller.name}</div>
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 truncate max-w-32 sm:max-w-none">{reseller.email}</div>
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                  <div className="text-sm text-gray-900">{reseller.phone || '-'}</div>
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                  <div className="text-sm text-gray-900 truncate max-w-24">{getManagerName(reseller.manager_id)}</div>
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    reseller.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {reseller.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => toggleResellerStatus(reseller)}
                    className={`text-xs sm:text-sm px-2 sm:px-3 py-1 rounded ${
                      reseller.is_active
                        ? 'text-red-600 hover:text-red-900'
                        : 'text-green-600 hover:text-green-900'
                    }`}
                  >
                    {reseller.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {resellers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No resellers found. Add your first reseller to get started.
          </div>
        )}
      </div>

      <AddResellerModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddReseller}
        newReseller={newReseller}
        setNewReseller={setNewReseller}
        managers={managers}
        submitting={submitting}
      />
    </div>
  )
}