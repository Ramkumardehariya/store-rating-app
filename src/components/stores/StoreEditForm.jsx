import React, { useState, useEffect } from 'react'
import { X, Save, AlertCircle } from 'lucide-react'
import { storeService } from '../../services/storeService'
import { useAuth } from '../../contexts/AuthContext'

const StoreEditForm = ({ store, onClose, onUpdate }) => {
  const { user, isAdmin, isStoreOwner } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    owner_id: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (store) {
      setFormData({
        name: store.name || '',
        email: store.email || '',
        address: store.address || '',
        owner_id: store.owner_id || ''
      })
    }
  }, [store])

  const validateForm = () => {
    const newErrors = {}

    // Validate name if provided and user is admin
    if (isAdmin && formData.name && formData.name !== store.name) {
      if (formData.name.length < 20 || formData.name.length > 60) {
        newErrors.name = 'Store name must be between 20 and 60 characters'
      }
    }

    // Validate email if provided
    if (formData.email && formData.email !== store.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Invalid email format'
      }
    }

    // Validate address if provided
    if (formData.address && formData.address !== store.address) {
      if (formData.address.length > 400) {
        newErrors.address = 'Address must not exceed 400 characters'
      }
    }

    // Check if any changes were made
    const hasChanges = 
      formData.name !== store.name ||
      formData.email !== store.email ||
      formData.address !== store.address ||
      formData.owner_id !== store.owner_id

    if (!hasChanges) {
      newErrors.general = 'No changes detected'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setErrors({})
    setSuccessMessage('')

    try {
      // Build update data with only changed fields
      const updateData = {}
      
      if (formData.name !== store.name) updateData.name = formData.name
      if (formData.email !== store.email) updateData.email = formData.email
      if (formData.address !== store.address) updateData.address = formData.address
      if (formData.owner_id !== store.owner_id) updateData.owner_id = formData.owner_id

      const response = await storeService.updateStore(store.id, updateData)
      
      setSuccessMessage('Store updated successfully!')
      
      // Call parent callback to refresh data
      if (onUpdate) {
        onUpdate(response.store)
      }

      // Close modal after a short delay
      setTimeout(() => {
        onClose()
      }, 1500)

    } catch (error) {
      console.error('Error updating store:', error)
      const errorData = error.response?.data
      
      if (errorData?.details) {
        const fieldErrors = {}
        errorData.details.forEach(detail => {
          fieldErrors[detail.field] = detail.message
        })
        setErrors(fieldErrors)
      } else {
        setErrors({ 
          general: errorData?.error || 'Failed to update store. Please try again.' 
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const canEditField = (field) => {
    if (isAdmin) return true
    
    if (isStoreOwner) {
      // Store owners can edit email and address only
      return field === 'email' || field === 'address'
    }
    
    return false
  }

  const isFieldDisabled = (field) => {
    return !canEditField(field)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-semibold text-gray-900">
            Edit Store
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center space-x-2">
            <Save className="h-5 w-5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {errors.general && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <span>{errors.general}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Store Name - Admin only */}
          {isAdmin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Store Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                placeholder="Enter store name (20-60 characters)"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Only administrators can change the store name
              </p>
            </div>
          )}

          {/* Store Email - Admin & Store Owner */}
          {(isAdmin || isStoreOwner) && (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Store Email {isAdmin ? '*' : '(Optional)'}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                placeholder="store@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
              {isStoreOwner && (
                <p className="mt-1 text-xs text-gray-500">
                  As a store owner, you can update the email address
                </p>
              )}
            </div>
          )}

          {/* Store Address - Admin & Store Owner */}
          {(isAdmin || isStoreOwner) && (
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Store Address *
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={loading}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                placeholder="Enter store address (max 400 characters)"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>
          )}

          {/* Store Owner - Admin only */}
          {isAdmin && (
            <div>
              <label htmlFor="owner_id" className="block text-sm font-medium text-gray-700 mb-2">
                Assigned Store Owner *
              </label>
              <select
                id="owner_id"
                name="owner_id"
                value={formData.owner_id}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
              >
                <option value="">Select a store owner</option>
                <option value={store.owner_id}>{store.owner_name} (Current)</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Only administrators can reassign store ownership
              </p>
            </div>
          )}

          {/* Role Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Your Permissions:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {isAdmin && (
                <>
                  <li>✓ Can update store name</li>
                  <li>✓ Can update store email</li>
                  <li>✓ Can update store address</li>
                  <li>✓ Can reassign store ownership</li>
                </>
              )}
              {isStoreOwner && (
                <>
                  <li>✓ Can update store email</li>
                  <li>✓ Can update store address</li>
                  <li>✗ Cannot change store name</li>
                  <li>✗ Cannot reassign ownership</li>
                </>
              )}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StoreEditForm
