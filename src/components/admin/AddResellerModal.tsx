'use client'

import { useState } from 'react'
import type { Manager } from '../../../admin/lib/supabase-admin'

interface AddResellerModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => Promise<void>
  newReseller: {
    name: string
    email: string
    phone: string
    manager_id: string
    notes: string
  }
  setNewReseller: React.Dispatch<React.SetStateAction<{
    name: string
    email: string
    phone: string
    manager_id: string
    notes: string
  }>>
  managers: Manager[]
  submitting: boolean
}

export default function AddResellerModal({
  isOpen,
  onClose,
  onSubmit,
  newReseller,
  setNewReseller,
  managers,
  submitting
}: AddResellerModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl text-gray-900 mb-6">Add New Reseller</h2>
          
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="manager_id" className="block text-sm font-medium text-gray-700 mb-1">
                Manager *
              </label>
              <select
                id="manager_id"
                value={newReseller.manager_id}
                onChange={(e) => setNewReseller({ ...newReseller, manager_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a manager</option>
                {managers.map((manager) => (
                  <option key={manager.id} value={manager.id}>
                    {manager.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                id="name"
                value={newReseller.name}
                onChange={(e) => setNewReseller({ ...newReseller, name: e.target.value })}
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
                value={newReseller.email}
                onChange={(e) => setNewReseller({ ...newReseller, email: e.target.value })}
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
                value={newReseller.phone}
                onChange={(e) => setNewReseller({ ...newReseller, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                value={newReseller.notes}
                onChange={(e) => setNewReseller({ ...newReseller, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? 'Adding...' : 'Add Reseller'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}