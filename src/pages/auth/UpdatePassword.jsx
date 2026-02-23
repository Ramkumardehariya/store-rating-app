import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const UpdatePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    password: '',
    confirmPassword: ''
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState({})
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { updatePassword, logout } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear specific field error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    setError('')
    setSuccess('')
  }

  const validateForm = () => {
    const errors = {}

    // Current password validation
    if (!formData.currentPassword) {
      errors.currentPassword = 'Current password is required'
    }

    // New password validation
    if (!formData.password) {
      errors.password = 'New password is required'
    } else if (formData.password.length < 8 || formData.password.length > 16) {
      errors.password = 'Password must be between 8 and 16 characters'
    } else if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter and one special character'
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    // Check if new password is same as current
    if (formData.currentPassword === formData.password) {
      errors.password = 'New password must be different from current password'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    
    try {
      const result = await updatePassword({
        currentPassword: formData.currentPassword,
        password: formData.password
      })
      
      if (result.success) {
        setSuccess('Password updated successfully! You will be logged out for security.')
        setTimeout(() => {
          logout()
          navigate('/login', { replace: true })
        }, 2000)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Network error. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: 'Very Weak', color: 'bg-gray-200' }
    
    let strength = 0
    const requirements = {
      length: password.length >= 8 && password.length <= 16,
      uppercase: /[A-Z]/.test(password),
      specialChar: /[!@#$%^&*]/.test(password)
    }

    strength = Object.values(requirements).filter(Boolean).length

    const strengthMap = {
      0: { text: 'Very Weak', color: 'bg-gray-200' },
      1: { text: 'Weak', color: 'bg-red-500' },
      2: { text: 'Medium', color: 'bg-yellow-500' },
      3: { text: 'Strong', color: 'bg-green-500' }
    }

    return strengthMap[strength] || strengthMap[0]
  }

  const passwordRequirements = [
    { label: '8-16 characters', met: formData.password.length >= 8 && formData.password.length <= 16 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(formData.password) },
    { label: 'One special character', met: /[!@#$%^&*]/.test(formData.password) }
  ]

  const passwordStrength = getPasswordStrength(formData.password)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Update Password Form */}
        <form className="space-y-6 card" onSubmit={handleSubmit}>
          {/* Form Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <Lock className="h-4 w-4 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Update Password</h3>
            <p className="text-sm text-gray-600">Secure your account with a new password</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-semibold text-green-800">
                    Success
                  </h3>
                  <div className="mt-1 text-sm text-green-700">
                    <p>{success}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-semibold text-red-800">
                    Update Failed
                  </h3>
                  <div className="mt-1 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Current Password Field */}
            <div className="group">
              <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                    <Lock className="h-3 w-3 text-gray-500" />
                  </div>
                </div>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className={`input-field pl-12 pr-12 ${
                    validationErrors.currentPassword ? 'border-red-300 bg-red-50' : ''
                  }`}
                  placeholder="Enter your current password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center group"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                </button>
              </div>
              {validationErrors.currentPassword && (
                <div className="mt-2 flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                  <p className="text-sm text-red-600">{validationErrors.currentPassword}</p>
                </div>
              )}
            </div>

            {/* New Password Field */}
            <div className="group">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                    <Lock className="h-3 w-3 text-gray-500" />
                  </div>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showNewPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`input-field pl-12 pr-12 ${
                    validationErrors.password ? 'border-red-300 bg-red-50' : ''
                  }`}
                  placeholder="Create a new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center group"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                </button>
              </div>
              
              {/* Password Strength */}
              {formData.password && (
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-600 font-medium">Password strength:</span>
                    <span className={`text-xs font-semibold ${
                      passwordStrength.strength === 3 ? 'text-green-600' :
                      passwordStrength.strength === 2 ? 'text-yellow-600' :
                      passwordStrength.strength === 1 ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.strength / 3) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Password Requirements */}
              <div className="mt-3 space-y-2">
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    {req.met ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-gray-300" />
                    )}
                    <span className={`text-sm font-medium ${req.met ? 'text-green-600' : 'text-gray-500'}`}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>

              {validationErrors.password && (
                <div className="mt-2 flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                  <p className="text-sm text-red-600">{validationErrors.password}</p>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="group">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                    <Lock className="h-3 w-3 text-gray-500" />
                  </div>
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`input-field pl-12 pr-12 ${
                    validationErrors.confirmPassword ? 'border-red-300 bg-red-50' : ''
                  }`}
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center group"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <div className="mt-2 flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                  <p className="text-sm text-red-600">{validationErrors.confirmPassword}</p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex justify-center py-3.5 disabled:opacity-50"
            >
              <span className="flex items-center">
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Updating password...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Update Password
                  </>
                )}
              </span>
            </button>
          </div>

          {/* Cancel Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary w-full"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdatePassword
