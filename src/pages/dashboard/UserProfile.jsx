import React, { useState, useEffect } from 'react'
import { 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  Edit3,
  Save,
  X,
  Shield,
  Star,
  Store,
  Settings,
  Bell,
  Lock,
  LogOut
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { authService } from '../../services/authService'
import { ratingService } from '../../services/ratingService'

const UserProfile = () => {
  const { user, updatePassword, logout } = useAuth()
  const [profile, setProfile] = useState(null)
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    password: '',
    confirmPassword: ''
  })

  useEffect(() => {
  if (user) {
    loadUserData()
  }
}, [user])

const loadUserData = async () => {
  try {
    setLoading(true)
    
    // Load user profile
    const token = localStorage.getItem('token');
    const userResponse = await authService.getCurrentUser(token);
    setProfile(userResponse)
    setEditForm(userResponse)

    // Load user ratings only if role is 'user'
    if (userResponse.role === 'user') {
      const ratingsResponse = await ratingService.getUserRatings()
      setRatings(ratingsResponse.ratings || [])
    } else {
      setRatings([]) // Clear ratings for non-user roles
    }

  } catch (err) {
    setError('Failed to load profile data. Please try again later.')
    console.error('Error loading user data:', err)
  } finally {
    setLoading(false)
  }
}


  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    try {
      // Update profile logic would go here
      // await userService.updateProfile(user.id, editForm)
      setIsEditing(false)
      setSuccess('Profile updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to update profile. Please try again.')
    }
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    
    if (passwordForm.password !== passwordForm.confirmPassword) {
      setError('New passwords do not match.')
      return
    }

    try {
      const result = await updatePassword({
        currentPassword: passwordForm.currentPassword,
        password: passwordForm.password
      })

      if (result.success) {
        setSuccess('Password updated successfully!')
        setPasswordForm({
          currentPassword: '',
          password: '',
          confirmPassword: ''
        })
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to update password. Please try again.')
    }
  }

  const cancelEdit = () => {
    setEditForm(profile)
    setIsEditing(false)
  }

  const getRoleDisplay = (role) => {
    switch (role) {
      case 'admin': return { label: 'Administrator', color: 'bg-purple-100 text-purple-800' }
      case 'store_owner': return { label: 'Store Owner', color: 'bg-blue-100 text-blue-800' }
      default: return { label: 'User', color: 'bg-gray-100 text-gray-800' }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner/>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Profile Not Found</h3>
        <p className="text-gray-600">Unable to load user profile.</p>
      </div>
    )
  }

  const roleInfo = getRoleDisplay(profile.role)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">
            Manage your account settings and preferences
          </p>
        </div>
        
        <button
          onClick={logout}
          className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card space-y-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left ${
                activeTab === 'profile'
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700'
              }`}
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </button>
            
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left ${
                activeTab === 'security'
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700'
              }`}
            >
              <Lock className="h-4 w-4" />
              <span>Security</span>
            </button>
            
            <button
              onClick={() => setActiveTab('activity')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left ${
                activeTab === 'activity'
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700'
              }`}
            >
              <Star className="h-4 w-4" />
              <span>My Activity</span>
            </button>
            
            <button
              onClick={() => setActiveTab('preferences')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left ${
                activeTab === 'preferences'
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700'
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Preferences</span>
            </button>
          </div>

          {/* Quick Stats */}
          <div className="card mt-6">
            <h3 className="font-semibold text-gray-900 mb-3">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Ratings</span>
                <span className="font-medium">{ratings.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Member Since</span>
                <span className="font-medium">
                  {new Date(profile.created_at).getFullYear()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Account Role</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleInfo.color}`}>
                  {roleInfo.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="card">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>Edit Profile</span>
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={cancelEdit}
                        className="btn-secondary flex items-center space-x-2"
                      >
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                      <button
                        onClick={handleProfileUpdate}
                        className="btn-primary flex items-center space-x-2"
                      >
                        <Save className="h-4 w-4" />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  )}
                </div>

                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        disabled={!isEditing}
                        className="input-field disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={editForm.email || ''}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        disabled={!isEditing}
                        className="input-field disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      value={editForm.address || ''}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      disabled={!isEditing}
                      rows="3"
                      className="input-field disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                        <Shield className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{roleInfo.label}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Member Since
                      </label>
                      <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">
                          {new Date(profile.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
                
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value
                      })}
                      className="input-field"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.password}
                        onChange={(e) => setPasswordForm({
                          ...passwordForm,
                          password: e.target.value
                        })}
                        className="input-field"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({
                          ...passwordForm,
                          confirmPassword: e.target.value
                        })}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Password Requirements</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• 8-16 characters long</li>
                      <li>• At least one uppercase letter</li>
                      <li>• At least one special character</li>
                    </ul>
                  </div>

                  <button type="submit" className="btn-primary">
                    Update Password
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">My Activity</h2>
                
                <div className="space-y-4">
                  {ratings.length > 0 ? (
                    ratings.map((rating) => (
                      <div key={rating.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <Store className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-gray-900">{rating.store_name}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-3 w-3 ${
                                      star <= rating.rating
                                        ? 'text-yellow-500 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">
                                {new Date(rating.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            {rating.comment && (
                              <p className="text-sm text-gray-700 mt-2">{rating.comment}</p>
                            )}
                          </div>
                        </div>
                        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                          View Store
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        No Ratings Yet
                      </h4>
                      <p className="text-gray-600">
                        Start rating stores to see your activity here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Preferences</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-5 w-5 text-gray-400" />
                      <div>
                        <h4 className="font-medium text-gray-900">Email Notifications</h4>
                        <p className="text-sm text-gray-600">
                          Receive updates about your ratings and store activities
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <h4 className="font-medium text-gray-900">Marketing Emails</h4>
                        <p className="text-sm text-gray-600">
                          Receive promotional offers and store recommendations
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile