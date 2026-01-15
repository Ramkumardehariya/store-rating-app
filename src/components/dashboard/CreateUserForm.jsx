import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserPlus, AlertCircle, CheckCircle } from 'lucide-react'
import { userService } from '../../services/userService'

const CreateUserForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    role: 'user'
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = {}

    // Name validation: 20-60 characters
    if (!formData.name) {
      newErrors.name = 'Name is required'
    } else if (formData.name.length < 20 || formData.name.length > 60) {
      newErrors.name = 'Name must be between 20 and 60 characters'
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Address validation: max 400 characters
    if (!formData.address) {
      newErrors.address = 'Address is required'
    } else if (formData.address.length > 400) {
      newErrors.address = 'Address must not exceed 400 characters'
    }

    // Password validation: 8-16 chars, 1 uppercase, 1 special character
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8 || formData.password.length > 16) {
      newErrors.password = 'Password must be between 8 and 16 characters'
    } else if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter and one special character'
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = 'Role is required'
    } else if (!['admin', 'user', 'store_owner'].includes(formData.role)) {
      newErrors.role = 'Invalid role selected'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const result = await userService.createUser(formData)
      
      if (result.success) {
        setSuccessMessage('User created successfully!')
        setTimeout(() => {
          navigate('/admin/dashboard')
        }, 2000)
      } else {
        setErrors({ general: result.error })
      }
    } catch (error) {
      setErrors({ general: 'Failed to create user. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <UserPlus className="h-6 w-6 text-primary-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Create New User</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* General Error */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-800">{errors.general}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <div className="ml-3">
                  <p className="text-sm text-green-800">{successMessage}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter full name (20-60 chars)"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.name.length}/60 characters
              </p>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Role Field */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                User Role *
              </label>
              <select
                id="role"
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                  errors.role ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select a role</option>
                <option value="user">Normal User</option>
                <option value="store_owner">Store Owner</option>
                <option value="admin">System Administrator</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                8-16 chars, 1 uppercase, 1 special character
              </p>
            </div>
          </div>

          {/* Address Field */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address *
            </label>
            <textarea
              id="address"
              name="address"
              required
              rows={3}
              value={formData.address}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                errors.address ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter full address"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {formData.address.length}/400 characters
            </p>
          </div>

          {/* Role Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Role Permissions:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li><strong>Normal User:</strong> Can view stores, submit ratings, update password</li>
              <li><strong>Store Owner:</strong> Can manage their store, view ratings, update password</li>
              <li><strong>System Administrator:</strong> Full access to all features and user management</li>
            </ul>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating User...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateUserForm
