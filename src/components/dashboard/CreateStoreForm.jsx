import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Store, AlertCircle, CheckCircle } from 'lucide-react'
import { storeService } from '../../services/storeService'
import { userService } from '../../services/userService'

const CreateStoreForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    owner_id: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [storeOwners, setStoreOwners] = useState([])

  const navigate = useNavigate()

  React.useEffect(() => {
    loadStoreOwners()
  }, [])

  const loadStoreOwners = async () => {
    try {
      const response = await userService.getAllUsers({ role: 'store_owner' })
      setStoreOwners(response.users || [])
    } catch (error) {
      console.error('Error loading store owners:', error)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Name validation: 20-60 characters
    if (!formData.name) {
      newErrors.name = 'Store name is required'
    } else if (formData.name.length < 20 || formData.name.length > 60) {
      newErrors.name = 'Store name must be between 20 and 60 characters'
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Store email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Address validation: max 400 characters
    if (!formData.address) {
      newErrors.address = 'Address is required'
    } else if (formData.address.length > 400) {
      newErrors.address = 'Address must not exceed 400 characters'
    }

    // Owner validation
    if (!formData.owner_id) {
      newErrors.owner_id = 'Store owner is required'
    } else if (!storeOwners.find(owner => owner.id === parseInt(formData.owner_id))) {
      newErrors.owner_id = 'Please select a valid store owner'
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
      const result = await storeService.createStore(formData)
      
      if (result.success) {
        setSuccessMessage('Store created successfully!')
        setTimeout(() => {
          navigate('/admin/dashboard')
        }, 2000)
      } else {
        setErrors({ general: result.error })
      }
    } catch (error) {
      setErrors({ general: 'Failed to create store. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <Store className="h-6 w-6 text-primary-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Create New Store</h2>
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
            {/* Store Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Store Name *
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
                placeholder="Enter store name (20-60 chars)"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.name.length}/60 characters
              </p>
            </div>

            {/* Store Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Store Email *
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
                placeholder="Enter store email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Store Owner Field */}
            <div>
              <label htmlFor="owner_id" className="block text-sm font-medium text-gray-700">
                Store Owner *
              </label>
              <select
                id="owner_id"
                name="owner_id"
                required
                value={formData.owner_id}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                  errors.owner_id ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select a store owner</option>
                {storeOwners.map(owner => (
                  <option key={owner.id} value={owner.id}>
                    {owner.name} ({owner.email})
                  </option>
                ))}
              </select>
              {errors.owner_id && (
                <p className="mt-1 text-sm text-red-600">{errors.owner_id}</p>
              )}
              {storeOwners.length === 0 && (
                <p className="mt-1 text-sm text-yellow-600">
                  No store owners available. Please create a store owner first.
                </p>
              )}
            </div>
          </div>

          {/* Address Field */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Store Address *
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
              placeholder="Enter store address"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {formData.address.length}/400 characters
            </p>
          </div>

          {/* Store Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Store Information:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Store name must be between 20-60 characters</li>
              <li>• Store email must be unique and valid</li>
              <li>• Each store owner can only manage one store</li>
              <li>• Store address helps users locate the store</li>
              <li>• Users can rate stores from 1-5 stars</li>
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
              disabled={isLoading || storeOwners.length === 0}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Store...' : 'Create Store'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateStoreForm
