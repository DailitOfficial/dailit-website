'use client'

import { useState, useEffect } from 'react'
import { getManagers, createManager, updateManager, type Manager } from '../../../admin/lib/supabase-admin'
import AddManagerModal from './AddManagerModal'

export default function ManagersTable() {
  const [managers, setManagers] = useState<Manager[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [newManager, setNewManager] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  })

  useEffect(() => {
    loadManagers()
  }, [])

  const loadManagers = async () => {
    try {
      const data = await getManagers()
      setManagers(data)
    } catch (error) {
      console.error('Error loading managers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddManager = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      await createManager(newManager)
      setNewManager({ name: '', email: '', phone: '', notes: '' })
      setShowAddModal(false)
      await loadManagers()
    } catch (error) {
      console.error('Error adding manager:', error)
      alert('Failed to add manager')
    } finally {
      setSubmitting(false)
    }
  }

  const toggleManagerStatus = async (manager: Manager) => {
    try {
      await updateManager(manager.id, { is_active: !manager.is_active })
      await loadManagers()
    } catch (error) {
      console.error('Error updating manager status:', error)
      alert('Failed to update manager status')
    }
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
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg text-gray-900">Managers</h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add Manager
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
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
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {managers.map((manager) => (
              <tr key={manager.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{manager.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{manager.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{manager.phone || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    manager.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {manager.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => toggleManagerStatus(manager)}
                    className={`text-sm px-3 py-1 rounded ${
                      manager.is_active
                        ? 'text-red-600 hover:text-red-900'
                        : 'text-green-600 hover:text-green-900'
                    }`}
                  >
                    {manager.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {managers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No managers found. Add your first manager to get started.
          </div>
        )}
      </div>

      <AddManagerModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddManager}
        newManager={newManager}
        setNewManager={setNewManager}
        submitting={submitting}
      />
    </div>
  )
}