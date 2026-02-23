import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Store, 
  Star, 
  TrendingUp, 
  Search,
  Plus,
  Eye,
  Edit,
  Calendar,
  Award,
  Activity
} from 'lucide-react'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { storeService } from '../../services/storeService'
import { ratingService } from '../../services/ratingService'
import { useAuth } from '../../contexts/AuthContext'

const UserDashboard = () => {
  const [stats, setStats] = useState(null)
  const [recentRatings, setRecentRatings] = useState([])
  const [recommendedStores, setRecommendedStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  const { user } = useAuth()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load user's ratings
      const ratingsResponse = await ratingService.getUserRatings()
      setRecentRatings(ratingsResponse.ratings || [])
      
      // Load recommended stores (highest rated)
      const storesResponse = await storeService.getAllStores({
        sortBy: 'average_rating',
        sortOrder: 'desc',
        limit: 5
      })
      setRecommendedStores(storesResponse.stores || [])

      // Calculate stats
      const totalRatings = ratingsResponse.ratings?.length || 0
      const avgRating = totalRatings > 0 
        ? (ratingsResponse.ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings).toFixed(1)
        : 0

      setStats({
        totalRatings,
        averageRating: avgRating,
        totalStores: storesResponse.total || 0,
        recentActivity: totalRatings > 0 ? 'Active' : 'New'
      })

    } catch (err) {
      setError('Failed to load dashboard data. Please try again later.')
      console.error('Error loading dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStarRating = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
        }`}
      />
    ))
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
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 mt-1">
            Discover and rate your favorite stores
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Link
            to="/stores"
            className="btn-primary flex items-center space-x-2"
          >
            <Search className="h-4 w-4" />
            <span>Browse Stores</span>
          </Link>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={loadDashboardData}
              className="text-red-700 hover:text-red-800 font-medium text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Ratings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRatings}</p>
                <p className="text-sm text-gray-600">Your contributions</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating Given</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
                <p className="text-sm text-gray-600">Your rating style</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Store className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available Stores</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStores}</p>
                <p className="text-sm text-gray-600">To explore</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Activity className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Activity Status</p>
                <p className="text-2xl font-bold text-gray-900">{stats.recentActivity}</p>
                <p className="text-sm text-gray-600">Your level</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="card">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {['overview', 'my-ratings', 'recommended'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Ratings */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Your Recent Ratings</h3>
                  <Link
                    to="/my-ratings"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    View All
                  </Link>
                </div>
                <div className="space-y-3">
                  {recentRatings.length > 0 ? (
                    recentRatings.slice(0, 3).map((rating) => (
                      <div key={rating.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <Store className="h-4 w-4 text-primary-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{rating.store_name}</p>
                            <p className="text-sm text-gray-600">{new Date(rating.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {getStarRating(rating.rating)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <Star className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">No ratings yet</p>
                      <p className="text-sm text-gray-400">Start rating stores to see them here</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recommended Stores */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recommended Stores</h3>
                  <Link
                    to="/stores"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Browse All
                  </Link>
                </div>
                <div className="space-y-3">
                  {recommendedStores.length > 0 ? (
                    recommendedStores.map((store) => (
                      <div key={store.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <Store className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{store.name}</p>
                            <p className="text-sm text-gray-600">{store.address}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1 text-yellow-600">
                            <Star className="h-3 w-3 fill-current" />
                            <span className="text-sm font-medium">{store.average_rating || 0}</span>
                          </div>
                          <Link
                            to={`/stores/${store.id}`}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <Store className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">No stores available</p>
                      <p className="text-sm text-gray-400">Check back later for new stores</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'my-ratings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">All Your Ratings</h3>
                <Link
                  to="/my-ratings"
                  className="btn-primary flex items-center space-x-2"
                >
                  <Eye className="h-4 w-4" />
                  <span>View Detailed</span>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentRatings.length > 0 ? (
                  recentRatings.map((rating) => (
                    <div key={rating.id} className="card">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">{rating.store_name}</h4>
                        <div className="flex items-center space-x-1">
                          {getStarRating(rating.rating)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{rating.store_address}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{new Date(rating.created_at).toLocaleDateString()}</span>
                        <Link
                          to={`/stores/${rating.store_id}`}
                          className="text-primary-600 hover:text-primary-700"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      No Ratings Yet
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Start rating stores to see your rating history here.
                    </p>
                    <Link
                      to="/stores"
                      className="btn-primary"
                    >
                      Browse Stores
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'recommended' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Top Rated Stores</h3>
                <Link
                  to="/stores"
                  className="btn-primary flex items-center space-x-2"
                >
                  <Search className="h-4 w-4" />
                  <span>Browse All</span>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedStores.map((store) => (
                  <div key={store.id} className="card">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{store.name}</h4>
                      <div className="flex items-center space-x-1 text-yellow-600">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="font-medium">{store.average_rating || 0}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{store.address}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{store.total_ratings || 0} ratings</span>
                      <Link
                        to={`/stores/${store.id}`}
                        className="btn-primary text-sm py-1 px-3"
                      >
                        Rate Store
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
