import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Store, Star, Search, Filter, Edit, Eye, Plus, AlertCircle } from 'lucide-react'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { userService } from '../../services/userService'
import { storeService } from '../../services/storeService'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    role: '',
    sortBy: 'created_at',
    sortOrder: 'desc'
  })
  const [showCreateUserModal, setShowCreateUserModal] = useState(false)
  const [showCreateStoreModal, setShowCreateStoreModal] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    loadData()
  }, [filters])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load users
      const usersResponse = await userService.getAllUsers(filters)
      setUsers(usersResponse.users || [])

      // Load stores
      const storesResponse = await storeService.getAllStores({ sortBy: 'created_at', sortOrder: 'desc' })
      setStores(storesResponse.stores || [])

    } catch (err) {
      setError('Failed to load data. Please try again later.')
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setFilters(prev => ({
      ...prev,
      name: searchTerm
    }))
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      role: '',
      sortBy: 'created_at',
      sortOrder: 'desc'
    })
    setSearchTerm('')
  }

  const filteredUsers = users.filter(user => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.address.toLowerCase().includes(term)
    )
  })

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800'
      case 'store_owner': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">
            Manage users, stores, and platform settings
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCreateStoreModal(true)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Store className="h-4 w-4" />
            <span>Add Store</span>
          </button>
          <button
            onClick={() => setShowCreateUserModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={loadData}
              className="text-red-700 hover:text-red-800 font-medium text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search users by name, email, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </form>

          {/* Filters */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="store_owner">Store Owner</option>
              <option value="user">User</option>
            </select>

            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="created_at">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="email">Sort by Email</option>
            </select>

            <select
              value={filters.sortOrder}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {(filters.role || searchTerm) && (
          <div className="mt-3 flex items-center space-x-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {filters.role && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-800">
                Role: {filters.role}
              </span>
            )}
            {searchTerm && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-800">
                Search: {searchTerm}
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Users ({filteredUsers.length})</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Store Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-xs text-gray-400 truncate max-w-xs">{user.address}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.role === 'store_owner' && user.store_rating !== undefined ? (
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-900">
                          {user.store_rating ? user.store_rating.toFixed(1) : 'No ratings'}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => navigate(`/admin/users/${user.id}`)}
                      className="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <Edit className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No users found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filters.role ? 'Try adjusting your search criteria or filters' : 'No users have been created yet'}
            </p>
            {(searchTerm || filters.role) && (
              <button onClick={clearFilters} className="btn-primary">
                Clear Search & Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateUserModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Create New User</h2>
                <button
                  onClick={() => setShowCreateUserModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              {/* User creation form would go here */}
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">User creation form component</p>
                <button
                  onClick={() => navigate('/admin/create-user')}
                  className="btn-primary mt-4"
                >
                  Go to User Creation Page
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Store Modal */}
      {showCreateStoreModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Create New Store</h2>
                <button
                  onClick={() => setShowCreateStoreModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              {/* Store creation form would go here */}
              <div className="text-center py-8">
                <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Store creation form component</p>
                <button
                  onClick={() => navigate('/admin/create-store')}
                  className="btn-primary mt-4"
                >
                  Go to Store Creation Page
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement
