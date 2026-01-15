import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, AlertCircle, Store } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState({})
  
  const { login, loading, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

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
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      errors.password = 'Password is required'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      return
    }

    const result = await login(formData.email, formData.password)
    
    if (result.success) {
      // Success - redirect to intended page or home
      const from = location.state?.from?.pathname || '/'
      navigate(from, { replace: true })
    } else {
      setError(result.error)
    }
  }

  const handleDemoLogin = (role) => {
    const demoAccounts = {
      admin: { email: 'admin@store.com', password: 'Admin123!' },
      store_owner: { email: 'owner@store.com', password: 'Owner123!' },
      user: { email: 'user@store.com', password: 'User123!' }
    }

    const account = demoAccounts[role]
    if (account) {
      setFormData(account)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Demo Accounts */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Quick Access - Demo Accounts
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={() => handleDemoLogin('admin')}
              className="btn-secondary text-xs py-2.5 px-3"
            >
              <span className="font-medium">Admin</span>
            </button>
            <button
              onClick={() => handleDemoLogin('store_owner')}
              className="btn-secondary text-xs py-2.5 px-3"
            >
              <span className="font-medium">Store Owner</span>
            </button>
            <button
              onClick={() => handleDemoLogin('user')}
              className="btn-secondary text-xs py-2.5 px-3"
            >
              <span className="font-medium">Regular User</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form className="space-y-6 card" onSubmit={handleSubmit}>
          {/* Form Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <Lock className="h-4 w-4 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Secure Login</h3>
            <p className="text-sm text-gray-600">Enter your credentials to continue</p>
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
                    Authentication Failed
                  </h3>
                  <div className="mt-1 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
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
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`input-field pl-12 pr-12 ${
                    validationErrors.password ? 'border-red-300 bg-red-50' : ''
                  }`}
                  placeholder="••••••••"
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
              {validationErrors.password && (
                <div className="mt-2 flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                  <p className="text-sm text-red-600">{validationErrors.password}</p>
                </div>
              )}
            </div>
          </div>

          {/* Remember me and Forgot password */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded-md"
              />
              <label htmlFor="remember-me" className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer">
                Keep me signed in
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-primary-600 hover:text-primary-700">
                Forgot password?
              </a>
            </div>
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
                    <span className="ml-2">Logging in...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Log in
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
              <span className="px-4 bg-white text-gray-500 font-medium">New to StoreRatings?</span>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              to="/register"
              className="btn-secondary w-full flex justify-center py-3.5"
            >
              <span className="flex items-center">
                <Store className="h-4 w-4 mr-2" />
                Create your account
              </span>
            </Link>
          </div>
        </form>

        {/* Additional Info */}
        <div className="text-center pt-4">
          <div className="card inline-flex items-center justify-center p-4">
            <p className="text-xs text-gray-600">
              Protected by reCAPTCHA and subject to the{' '}
              <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                Privacy Policy
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                Terms of Service
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login