'use client'

import { useState, useEffect } from 'react'
import type { Manager, Reseller } from '../../../admin/lib/supabase-admin'
import { getResellersByManager } from '../../../admin/lib/supabase-admin'

interface AddUserModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => Promise<void>
  newUser: {
    name: string
    email: string
    phone: string
    subscription_start_date: string
    renewal_date: string
    expiry_date: string
    manager_id: string
    reseller_id: string
    parent_account_id: string
    voip_number: string
    payment_amount: string
    notes: string
  }
  setNewUser: React.Dispatch<React.SetStateAction<{
    name: string
    email: string
    phone: string
    subscription_start_date: string
    renewal_date: string
    expiry_date: string
    manager_id: string
    reseller_id: string
    parent_account_id: string
    voip_number: string
    payment_amount: string
    notes: string
  }>>
  managers: Manager[]
  subscriptionUsers: any[]
  submitting: boolean
}

export default function AddUserModal({
  isOpen,
  onClose,
  onSubmit,
  newUser,
  setNewUser,
  managers,
  subscriptionUsers,
  submitting
}: AddUserModalProps) {
  const [resellers, setResellers] = useState<Reseller[]>([])
  const [loadingResellers, setLoadingResellers] = useState(false)

  useEffect(() => {
    if (newUser.manager_id) {
      loadResellers(newUser.manager_id)
    } else {
      setResellers([])
      setNewUser(prev => ({ ...prev, reseller_id: '' }))
    }
  }, [newUser.manager_id])

  const loadResellers = async (managerId: string) => {
    setLoadingResellers(true)
    try {
      const resellerData = await getResellersByManager(managerId)
      setResellers(resellerData)
    } catch (error) {
      console.error('Error loading resellers:', error)
      setResellers([])
    } finally {
      setLoadingResellers(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md sm:max-w-lg lg:max-w-xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Add New User</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={newUser.name}
              onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
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
              value={newUser.email}
              onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
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
              value={newUser.phone}
              onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
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
              value={newUser.subscription_start_date}
              onChange={(e) => setNewUser(prev => ({ ...prev, subscription_start_date: e.target.value }))}
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
              value={newUser.renewal_date}
              onChange={(e) => setNewUser(prev => ({ ...prev, renewal_date: e.target.value }))}
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
              value={newUser.expiry_date}
              onChange={(e) => setNewUser(prev => ({ ...prev, expiry_date: e.target.value }))}
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
              value={newUser.voip_number}
              onChange={(e) => setNewUser(prev => ({ ...prev, voip_number: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter VoIP number"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Amount (Rs.) *
            </label>
            <input
              type="number"
              value={newUser.payment_amount}
              onChange={(e) => setNewUser(prev => ({ ...prev, payment_amount: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter payment amount in Rupees"
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Manager
            </label>
            <select
              value={newUser.manager_id}
              onChange={(e) => setNewUser(prev => ({ ...prev, manager_id: e.target.value, reseller_id: '' }))}
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
              value={newUser.reseller_id}
              onChange={(e) => setNewUser(prev => ({ ...prev, reseller_id: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!newUser.manager_id || loadingResellers}
            >
              <option value="">
                {!newUser.manager_id ? 'Select a manager first' : loadingResellers ? 'Loading resellers...' : 'Select Reseller (Optional)'}
              </option>
              {resellers.filter(r => r.is_active).map(reseller => (
                <option key={reseller.id} value={reseller.id}>
                  {reseller.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parent Account
            </label>
            <select
              value={newUser.parent_account_id}
              onChange={(e) => setNewUser(prev => ({ ...prev, parent_account_id: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">No Parent Account</option>
              {subscriptionUsers.map(user => (
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
              value={newUser.notes}
              onChange={(e) => setNewUser(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {submitting ? 'Adding...' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}