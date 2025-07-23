'use client'

import { useState } from 'react'

interface AddManagerModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => Promise<void>
  newManager: {
    name: string
    email: string
    phone: string
    notes: string
  }
  setNewManager: React.Dispatch<React.SetStateAction<{
    name: string
    email: string
    phone: string
    notes: string
  }>>
  submitting: boolean
}

export default function AddManagerModal({
  isOpen,
  onClose,
  onSubmit,
  newManager,
  setNewManager,
  submitting
}: AddManagerModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Add New Manager</h2>
          
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                id="name"
                value={newManager.name}
                onChange={(e) => setNewManager({ ...newManager, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                id="email"
                value={newManager.email}
                onChange={(e) => setNewManager({ ...newManager, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                value={newManager.phone}
                onChange={(e) => setNewManager({ ...newManager, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                value={newManager.notes}
                onChange={(e) => setNewManager({ ...newManager, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 text-sm sm:text-base"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm sm:text-base"
              >
                {submitting ? 'Adding...' : 'Add Manager'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}