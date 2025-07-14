'use client'

import { useState, useEffect } from 'react'
import type { Manager, Reseller } from '../../../admin/lib/supabase-admin'
import { getResellersByManager } from '../../../admin/lib/supabase-admin'

interface SubmissionEntryModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (submissionData: {
    manager_id: string
    reseller_id?: string
    amount: number
    submission_date: string
    notes?: string
  }) => Promise<void>
  managers: Manager[]
  resellers: Reseller[]
  submitting: boolean
}

export default function SubmissionEntryModal({
  isOpen,
  onClose,
  onSubmit,
  managers,
  resellers,
  submitting
}: SubmissionEntryModalProps) {
  const [formData, setFormData] = useState({
    manager_id: '',
    reseller_id: '',
    amount: '',
    submission_date: new Date().toISOString().split('T')[0],
    notes: ''
  })
  const [availableResellers, setAvailableResellers] = useState<Reseller[]>([])
  const [loadingResellers, setLoadingResellers] = useState(false)

  useEffect(() => {
    if (formData.manager_id) {
      setLoadingResellers(true)
      getResellersByManager(formData.manager_id)
        .then(setAvailableResellers)
        .catch(console.error)
        .finally(() => setLoadingResellers(false))
    } else {
      setAvailableResellers([])
      setFormData(prev => ({ ...prev, reseller_id: '' }))
    }
  }, [formData.manager_id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.manager_id || !formData.amount) return

    await onSubmit({
      manager_id: formData.manager_id,
      reseller_id: formData.reseller_id || undefined,
      amount: parseFloat(formData.amount),
      submission_date: formData.submission_date,
      notes: formData.notes || undefined
    })

    // Reset form
    setFormData({
      manager_id: '',
      reseller_id: '',
      amount: '',
      submission_date: new Date().toISOString().split('T')[0],
      notes: ''
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg text-gray-900 mb-4">Record Submission</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Manager *
            </label>
            <select
              value={formData.manager_id}
              onChange={(e) => setFormData(prev => ({ ...prev, manager_id: e.target.value, reseller_id: '' }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Manager</option>
              {managers.map(manager => (
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
              value={formData.reseller_id}
              onChange={(e) => setFormData(prev => ({ ...prev, reseller_id: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!formData.manager_id || loadingResellers}
            >
              <option value="">Select Reseller (Optional)</option>
              {availableResellers.map(reseller => (
                <option key={reseller.id} value={reseller.id}>
                  {reseller.name}
                </option>
              ))}
            </select>
            {loadingResellers && (
              <p className="text-sm text-gray-500 mt-1">Loading resellers...</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Submitted Amount (Rs.) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount in Rupees"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Submission Date *
            </label>
            <input
              type="date"
              value={formData.submission_date}
              onChange={(e) => setFormData(prev => ({ ...prev, submission_date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Optional notes about this submission"
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
              disabled={submitting || !formData.manager_id || !formData.amount}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {submitting ? 'Recording...' : 'Record Submission'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}