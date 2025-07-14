'use client'

import type { SubscriptionUser, Manager, Reseller } from '../../../admin/lib/supabase-admin'

interface UserTableProps {
  users: SubscriptionUser[]
  onEditUser: (user: SubscriptionUser) => void
  onDeleteUser: (userId: string, userName: string) => void
  deletingUser: string | null
  managers: Manager[]
  resellers: Reseller[]
}

export default function UserTable({ users, onEditUser, onDeleteUser, deletingUser, managers, resellers }: UserTableProps) {
  const getManagerName = (managerId?: string) => {
    if (!managerId) return 'N/A'
    const manager = managers.find(m => m.id === managerId)
    return manager ? manager.name : 'N/A'
  }

  const getResellerName = (resellerId?: string) => {
    if (!resellerId) return 'N/A'
    const reseller = resellers.find(r => r.id === resellerId)
    return reseller ? reseller.name : 'N/A'
  }

  const getParentAccountName = (parentAccountId?: string) => {
    if (!parentAccountId) return 'N/A'
    const parentUser = users.find(u => u.id === parentAccountId)
    return parentUser ? parentUser.name : 'N/A'
  }
  return (
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
              VoIP Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Expiry Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Manager/Reseller
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Parent Account
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
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {user.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.phone}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.voip_number_id || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.expiry_date ? new Date(user.expiry_date).toLocaleDateString() : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div>
                  <div>Manager: {getManagerName(user.manager_id)}</div>
                  <div>Reseller: {getResellerName(user.reseller_id)}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {getParentAccountName(user.parent_account_id)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  user.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : user.status === 'expired'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {user.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onEditUser(user)}
                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  Edit
                </button>
                <button
                    onClick={() => onDeleteUser(user.id, user.name)}
                    disabled={deletingUser === user.id}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingUser === user.id ? 'Deleting...' : 'Delete'}
                  </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}