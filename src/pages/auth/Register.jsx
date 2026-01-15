import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, MapPin, AlertCircle, Store, CheckCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    role: 'user'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState({})
  const [passwordStrength, setPasswordStrength] = useState(0)
  
  const { register, loading, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

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

    // Check password strength
    if (name === 'password') {
      checkPasswordStrength(value)
    }
  }

  const checkPasswordStrength = (password) => {
    let strength = 0
    const requirements = {
      length: password.length >= 8 && password.length <= 16,
      uppercase: /[A-Z]/.test(password),
      specialChar: /[!@#$%^&*]/.test(password)
    }

    strength = Object.values(requirements).filter(Boolean).length
    setPasswordStrength(strength)
  }

  const validateForm = () => {
    const errors = {}

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Full name is required'
    } else if (formData.name.length < 20 || formData.name.length > 60) {
      errors.name = 'Name must be between 20 and 60 characters'
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 8 || formData.password.length > 16) {
      errors.password = 'Password must be between 8 and 16 characters'
    } else if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter and one special character'
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    // Address validation
    if (!formData.address.trim()) {
      errors.address = 'Address is required'
    } else if (formData.address.length > 400) {
      errors.address = 'Address must not exceed 400 characters'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
  e.preventDefault()
  setError('')
  console.log('Form submitted with data:', formData)

  if (!validateForm()) {
    console.log('Form validation failed')
    return
  }

  const { confirmPassword, ...submitData } = formData
  console.log('Sending to backend:', submitData)
  
  try {
    const result = await register(submitData)
    console.log('Registration result:', result)
    
    if (result.success) {
      navigate('/login', { replace: true })
    } else {
      setError(result.error)
    }
  } catch (err) {
    console.error('Registration error:', err)
    setError('Network error. Please check if backend is running.')
  }
}

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0: return 'bg-gray-200'
      case 1: return 'bg-red-500'
      case 2: return 'bg-yellow-500'
      case 3: return 'bg-green-500'
      default: return 'bg-gray-200'
    }
  }

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0: return 'Very Weak'
      case 1: return 'Weak'
      case 2: return 'Medium'
      case 3: return 'Strong'
      default: return 'Very Weak'
    }
  }

  const passwordRequirements = [
    { label: '8-16 characters', met: formData.password.length >= 8 && formData.password.length <= 16 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(formData.password) },
    { label: 'One special character', met: /[!@#$%^&*]/.test(formData.password) }
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Registration Form */}
        <form className="space-y-6 card" onSubmit={handleSubmit}>
          {/* Form Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h3>
            <p className="text-sm text-gray-600">Join our community today</p>
          </div>
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
                    Registration Failed
                  </h3>
                  <div className="mt-1 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Name Field */}
            <div className="group">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="h-3 w-3 text-gray-500" />
                  </div>
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`input-field pl-12 ${
                    validationErrors.name ? 'border-red-300 bg-red-50' : ''
                  }`}
                  placeholder="Enter your full name (20-60 characters)"
                />
              </div>
              {validationErrors.name && (
                <div className="mt-2 flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                  <p className="text-sm text-red-600">{validationErrors.name}</p>
                </div>
              )}
              <p className="mt-2 text-xs text-gray-500">
                {formData.name.length}/60 characters
              </p>
            </div>

            {/* Email Field */}
            <div className="group">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                    <Mail className="h-3 w-3 text-gray-500" />
                  </div>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input-field pl-12 ${
                    validationErrors.email ? 'border-red-300 bg-red-50' : ''
                  }`}
                  placeholder="name@example.com"
                />
              </div>
              {validationErrors.email && (
                <div className="mt-2 flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                  <p className="text-sm text-red-600">{validationErrors.email}</p>
                </div>
              )}
            </div>

            {/* Address Field */}
            <div className="group">
              <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                Address
              </label>
              <div className="relative">
                <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none">
                  <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                    <MapPin className="h-3 w-3 text-gray-500" />
                  </div>
                </div>
                <textarea
                  id="address"
                  name="address"
                  rows="3"
                  value={formData.address}
                  onChange={handleChange}
                  className={`input-field pl-12 resize-none ${
                    validationErrors.address ? 'border-red-300 bg-red-50' : ''
                  }`}
                  placeholder="Enter your complete address"
                />
              </div>
              {validationErrors.address && (
                <div className="mt-2 flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                  <p className="text-sm text-red-600">{validationErrors.address}</p>
                </div>
              )}
              <p className="mt-2 text-xs text-gray-500">
                {formData.address.length}/400 characters
              </p>
            </div>

            {/* Role Selection */}
            <div className="group">
              <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                Account Type
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input-field"
              >
                <option value="user">Regular User</option>
                <option value="store_owner">Store Owner</option>
              </select>
              <p className="mt-2 text-xs text-gray-500">
                {formData.role === 'store_owner' 
                  ? 'Store owners can register and manage their stores'
                  : 'Regular users can browse and rate stores'
                }
              </p>
            </div>

            {/* Password Field */}
            <div className="group">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
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
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`input-field pl-12 pr-12 ${
                    validationErrors.password ? 'border-red-300 bg-red-50' : ''
                  }`}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center group"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                    {showPassword ? (
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
                      passwordStrength === 3 ? 'text-green-600' :
                      passwordStrength === 2 ? 'text-yellow-600' :
                      passwordStrength === 1 ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                      style={{ width: `${(passwordStrength / 3) * 100}%` }}
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
                Confirm Password
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
                  placeholder="Confirm your password"
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

          {/* Terms and Conditions */}
          <div className="flex items-center pt-2">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded-md"
            />
            <label htmlFor="terms" className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer">
              I agree to the{' '}
              <a href="#" className="font-medium text-primary-600 hover:text-primary-700">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="font-medium text-primary-600 hover:text-primary-700">
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex justify-center py-3.5 disabled:opacity-50"
            >
              <span className="flex items-center">
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Creating account...</span>
                  </>
                ) : (
                  <>
                    <User className="h-4 w-4 mr-2" />
                    Create Account
                  </>
                )}
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">Already have an account?</span>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              to="/login"
              className="btn-secondary w-full flex justify-center py-3.5"
            >
              <span className="flex items-center">
                <Lock className="h-4 w-4 mr-2" />
                Sign in to your account
              </span>
            </Link>
          </div>
        </form>

        {/* Additional Info */}
        <div className="text-center pt-4">
          <div className="card inline-flex items-center justify-center p-4">
            <p className="text-xs text-gray-600">
              Your personal information will be handled in accordance with our{' '}
              <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register