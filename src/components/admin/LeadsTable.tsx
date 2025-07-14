'use client'

import type { Lead } from '../../../admin/lib/supabase-admin'

interface LeadsTableProps {
  leads: Lead[]
  onUpdateLeadStatus: (leadId: string, newStatus: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost') => void
  updatingId?: string
  getStatusColor: (status: string) => string
  formatDate: (date: string) => string
}

export default function LeadsTable({ leads, onUpdateLeadStatus, updatingId, getStatusColor, formatDate }: LeadsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg text-gray-900">Leads Management</h3>
        <p className="text-sm text-gray-600">Manage leads from the Request Access form</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{lead.business_name}</div>
                    <div className="text-sm text-gray-500">{lead.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.full_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{lead.industry}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.number_of_users}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(lead.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <select
                    value={lead.status}
                    onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value as Lead['status'])}
                    disabled={updatingId === lead.id}
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          <div className="text-center py-12">
            <p className="text-gray-500">No leads found. Leads will appear here when users submit the Request Access form.</p>
          </div>
        )}
      </div>
    </div>
  )
}