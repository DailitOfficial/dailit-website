'use client'

import { useState, useEffect } from 'react'
import type { SubscriptionUser, Manager, Reseller } from '../../../admin/lib/supabase-admin'
import { getResellersByManager } from '../../../admin/lib/supabase-admin'

interface EditUserModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => Promise<void>
  editingUser: SubscriptionUser | null
  setEditingUser: React.Dispatch<React.SetStateAction<SubscriptionUser | null>>
  managers: Manager[]
  subscriptionUsers: any[]
  submitting: boolean
}

export default function EditUserModal({
  isOpen,
  onClose,
  onSubmit,
  editingUser,
  setEditingUser,
  managers,
  subscriptionUsers,
  submitting
}: EditUserModalProps) {
  const [resellers, setResellers] = useState<Reseller[]>([])
  const [loadingResellers, setLoadingResellers] = useState(false)

  // Load resellers when manager changes
  useEffect(() => {
    const loadResellers = async () => {
      if (!editingUser?.manager_id) {
        setResellers([])
        return
      }

      try {
        setLoadingResellers(true)
        const resellerData = await getResellersByManager(editingUser.manager_id)
        setResellers(resellerData)
      } catch (error) {
        console.error('Error loading resellers:', error)
        setResellers([])
      } finally {
        setLoadingResellers(false)
      }
    }

    loadResellers()
  }, [editingUser?.manager_id])

  if (!isOpen || !editingUser) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md sm:max-w-lg lg:max-w-xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg text-gray-900 mb-4">Edit User</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={editingUser.name}
              onChange={(e) => setEditingUser(prev => prev ? { ...prev, name: e.target.value } : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={editingUser.email}
              onChange={(e) => setEditingUser(prev => prev ? { ...prev, email: e.target.value } : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone *
            </label>
            <input
              type="tel"
              value={editingUser.phone || ''}
              onChange={(e) => setEditingUser(prev => prev ? { ...prev, phone: e.target.value } : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subscription Start Date *
            </label>
            <input
              type="date"
              value={editingUser.subscription_start_date ? new Date(editingUser.subscription_start_date).toISOString().split('T')[0] : ''}
              onChange={(e) => setEditingUser(prev => prev ? { ...prev, subscription_start_date: e.target.value } : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Renewal Date *
            </label>
            <input
              type="date"
              value={editingUser.renewal_date ? new Date(editingUser.renewal_date).toISOString().split('T')[0] : ''}
              onChange={(e) => setEditingUser(prev => prev ? { ...prev, renewal_date: e.target.value } : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date *
            </label>
            <input
              type="date"
              value={editingUser.expiry_date ? new Date(editingUser.expiry_date).toISOString().split('T')[0] : ''}
              onChange={(e) => setEditingUser(prev => prev ? { ...prev, expiry_date: e.target.value } : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              VoIP Number
            </label>
            <input
              type="text"
              value={editingUser.voip_number || ''}
              onChange={(e) => setEditingUser(prev => prev ? { ...prev, voip_number: e.target.value } : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter VoIP number"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Manager
            </label>
            <select
              value={editingUser.manager_id || ''}
              onChange={(e) => {
                const managerId = e.target.value
                setEditingUser(prev => prev ? { 
                  ...prev, 
                  manager_id: managerId,
                  reseller_id: '' // Reset reseller when manager changes
                } : null)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Manager</option>
              {managers.filter(m => m.is_active).map(manager => (
                <option key={manager.id} value={manager.id}>
                  {manager.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reseller
            </label>
            <select
              value={editingUser.reseller_id || ''}
              onChange={(e) => setEditingUser(prev => prev ? { ...prev, reseller_id: e.target.value } : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!editingUser.manager_id || loadingResellers}
            >
              <option value="">Select Reseller</option>
              {resellers.filter(r => r.is_active).map(reseller => (
                <option key={reseller.id} value={reseller.id}>
                  {reseller.name}
                </option>
              ))}
            </select>
            {loadingResellers && (
              <p className="text-sm text-gray-500 mt-1">Loading resellers...</p>
            )}
            {!editingUser.manager_id && (
              <p className="text-sm text-gray-500 mt-1">Please select a manager first</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parent Account
            </label>
            <select
              value={editingUser.parent_account_id || ''}
              onChange={(e) => setEditingUser(prev => prev ? { ...prev, parent_account_id: e.target.value } : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">No Parent Account</option>
              {subscriptionUsers.filter(user => user.id !== editingUser.id).map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={editingUser.notes || ''}
              onChange={(e) => setEditingUser(prev => prev ? { ...prev, notes: e.target.value } : null)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {submitting ? 'Updating...' : 'Update User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}