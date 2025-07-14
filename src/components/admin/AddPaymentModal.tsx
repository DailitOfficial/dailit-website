'use client'

import type { SubscriptionUser } from '../../../admin/lib/supabase-admin'

interface AddPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => Promise<void>
  newPayment: {
    user_id: string
    amount: string
    payment_date: string
    payment_method: 'cash' | 'bank_transfer' | 'check' | 'online' | 'other'
    notes: string
  }
  setNewPayment: React.Dispatch<React.SetStateAction<{
    user_id: string
    amount: string
    payment_date: string
    payment_method: 'cash' | 'bank_transfer' | 'check' | 'online' | 'other'
    notes: string
  }>>
  subscriptionUsers: SubscriptionUser[]
  submitting: boolean
}

export default function AddPaymentModal({
  isOpen,
  onClose,
  onSubmit,
  newPayment,
  setNewPayment,
  subscriptionUsers,
  submitting
}: AddPaymentModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg text-gray-900 mb-4">Add Payment</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User *
            </label>
            <select
              value={newPayment.user_id}
              onChange={(e) => setNewPayment(prev => ({ ...prev, user_id: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select User</option>
              {subscriptionUsers.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (Rs.) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={newPayment.amount}
              onChange={(e) => setNewPayment(prev => ({ ...prev, amount: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount in Rupees"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Date *
            </label>
            <input
              type="date"
              value={newPayment.payment_date}
              onChange={(e) => setNewPayment(prev => ({ ...prev, payment_date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method *
            </label>
            <select
              value={newPayment.payment_method}
              onChange={(e) => setNewPayment(prev => ({ ...prev, payment_method: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="check">Check</option>
              <option value="online">Online</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={newPayment.notes}
              onChange={(e) => setNewPayment(prev => ({ ...prev, notes: e.target.value }))}
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
              {submitting ? 'Adding...' : 'Add Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}