import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Star, 
  Store, 
  MapPin, 
  Calendar, 
  Search, 
  Filter,
  Edit,
  Trash2,
  MessageSquare,
  Eye
} from 'lucide-react'
import RatingStars from '../../components/ratings/RatingStars'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { ratingService } from '../../services/ratingService'
import { useAuth } from '../../contexts/AuthContext'

const MyRatings = () => {
  const [ratings, setRatings] = useState([])
  const [filteredRatings, setFilteredRatings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [editingRating, setEditingRating] = useState(null)
  const [editRatingValue, setEditRatingValue] = useState(0)

  const { user } = useAuth()

  useEffect(() => {
    loadUserRatings()
  }, [])

  useEffect(() => {
    filterAndSortRatings()
  }, [ratings, searchTerm, ratingFilter, sortBy])

  const loadUserRatings = async () => {
    try {
      setLoading(true)
      const response = await ratingService.getUserRatings()
      setRatings(response.ratings || [])
    } catch (err) {
      setError('Failed to load your ratings. Please try again later.')
      console.error('Error loading user ratings:', err)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortRatings = () => {
    let filtered = [...ratings]

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(rating =>
        rating.store_name?.toLowerCase().includes(term) ||
        rating.store_address?.toLowerCase().includes(term)
      )
    }

    // Apply rating filter
    if (ratingFilter !== 'all') {
      const ratingValue = parseInt(ratingFilter)
      filtered = filtered.filter(rating => rating.rating === ratingValue)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at)
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at)
        case 'highest':
          return b.rating - a.rating
        case 'lowest':
          return a.rating - b.rating
        case 'store_name':
          return (a.store_name || '').localeCompare(b.store_name || '')
        default:
          return 0
      }
    })

    setFilteredRatings(filtered)
  }

  const handleUpdateRating = async (ratingId, newRating) => {
    try {
      const rating = ratings.find(r => r.id === ratingId)
      if (!rating) return

      await ratingService.submitRating({
        store_id: rating.store_id,
        rating: newRating
      })

      // Update local state
      setRatings(prev => prev.map(r =>
        r.id === ratingId ? { ...r, rating: newRating } : r
      ))
      
      setEditingRating(null)
      setEditRatingValue(0)
      
    } catch (err) {
      console.error('Error updating rating:', err)
      setError('Failed to update rating. Please try again.')
    }
  }

  const handleDeleteRating = async (ratingId) => {
    if (!window.confirm('Are you sure you want to delete this rating?')) {
      return
    }

    try {
      // Note: You might need to add a delete rating endpoint to your backend
      // For now, we'll set the rating to 0 (which effectively removes it)
      const rating = ratings.find(r => r.id === ratingId)
      if (rating) {
        await ratingService.submitRating({
          store_id: rating.store_id,
          rating: 0 // Or implement proper delete endpoint
        })
      }

      // Remove from local state
      setRatings(prev => prev.filter(r => r.id !== ratingId))
      
    } catch (err) {
      console.error('Error deleting rating:', err)
      setError('Failed to delete rating. Please try again.')
    }
  }

  const startEditing = (rating) => {
    setEditingRating(rating.id)
    setEditRatingValue(rating.rating)
  }

  const cancelEditing = () => {
    setEditingRating(null)
    setEditRatingValue(0)
  }

  const getRatingStats = () => {
    const total = ratings.length
    const average = total > 0 
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)
      : 0
    
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    ratings.forEach(rating => {
      distribution[rating.rating]++
    })

    return { total, average, distribution }
  }

  const stats = getRatingStats()

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            My Ratings
          </h1>
          <p className="text-xl text-gray-600 mt-3 max-w-2xl">
            Manage and view all your store ratings
          </p>
        </div>
        
        <Link
          to="/stores"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <Store className="h-4 w-4 mr-2" />
          Browse More Stores
        </Link>
      </div>

      {/* Stats Overview */}
      {ratings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {stats.total}
            </div>
            <div className="text-gray-600 mt-2">Total Ratings</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {stats.average}
            </div>
            <div className="text-gray-600 mt-2">Average Rating</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {Math.max(...Object.values(stats.distribution))}
            </div>
            <div className="text-gray-600 mt-2">Most Given</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {ratings.length > 0 ? new Date(Math.max(...ratings.map(r => new Date(r.created_at)))).toLocaleDateString() : 'N/A'}
            </div>
            <div className="text-gray-600 mt-2">Last Rated</div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search your rated stores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-4 py-3 input-field text-lg"
              />
            </div>
          </div>

          {/* Rating Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="input-field text-lg"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field text-lg"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
              <option value="store_name">Store Name</option>
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || ratingFilter !== 'all') && (
          <div className="mt-4 flex items-center space-x-3">
            <span className="text-sm text-gray-600 font-medium">Active filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-800 font-medium">
                Search: {searchTerm}
              </span>
            )}
            {ratingFilter !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-800 font-medium">
                {ratingFilter} Stars
              </span>
            )}
            <button
              onClick={() => {
                setSearchTerm('')
                setRatingFilter('all')
              }}
              className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="font-medium">{error}</span>
            <button
              onClick={loadUserRatings}
              className="text-red-700 hover:text-red-800 font-medium text-sm transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Ratings List */}
      {filteredRatings.length > 0 ? (
        <div className="space-y-6">
          {filteredRatings.map((rating) => (
            <div key={rating.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                {/* Store Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <Link
                        to={`/stores/${rating.store_id}`}
                        className="group"
                      >
                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                          {rating.store_name}
                        </h3>
                      </Link>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2 text-gray-600">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-5 w-5 text-emerald-600" />
                          <span>{rating.store_address}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-5 w-5 text-emerald-600" />
                          <span>
                            Rated on {new Date(rating.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Rating Display/Edit */}
                    <div className="flex flex-col items-end space-y-3">
                      {editingRating === rating.id ? (
                        <div className="text-center">
                          <RatingStars
                            rating={editRatingValue}
                            onRatingChange={setEditRatingValue}
                            interactive={true}
                            size="lg"
                          />
                          <div className="flex space-x-3 mt-3">
                            <button
                              onClick={() => handleUpdateRating(rating.id, editRatingValue)}
                              disabled={editRatingValue === 0}
                              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm disabled:opacity-50"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="text-center">
                            <RatingStars rating={rating.rating} size="lg" />
                            <div className="text-sm text-gray-600 mt-2 font-medium">
                              {rating.rating} star{rating.rating !== 1 ? 's' : ''}
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={() => startEditing(rating)}
                              className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"
                              title="Edit rating"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteRating(rating.id)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                              title="Delete rating"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Rating Comment (if available) */}
                  {rating.comment && (
                    <div className="bg-gray-50 rounded-xl p-4 mt-4">
                      <div className="flex items-start space-x-3">
                        <div className="bg-emerald-100 p-2 rounded-lg">
                          <MessageSquare className="h-4 w-4 text-emerald-600" />
                        </div>
                        <p className="text-gray-700 leading-relaxed">{rating.comment}</p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center space-x-4 mt-6 pt-4 border-t border-gray-200">
                    <Link
                      to={`/stores/${rating.store_id}`}
                      className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Store</span>
                    </Link>
                    
                    {rating.store_owner_response && (
                      <button className="flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium transition-colors">
                        <MessageSquare className="h-4 w-4" />
                        <span>Owner Responded</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          {ratings.length === 0 ? (
            // No ratings at all
            <>
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
                <Star className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                No Ratings Yet
              </h3>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                You haven't rated any stores yet. Start exploring stores and share your experiences to help others.
              </p>
              <Link
                to="/stores"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Store className="h-5 w-5 mr-2" />
                Browse Stores
              </Link>
            </>
          ) : (
            // No ratings match filters
            <>
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
                <Filter className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                No Matching Ratings
              </h3>
              <p className="text-xl text-gray-600 mb-8">
                No ratings match your current search criteria. Try adjusting your filters.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setRatingFilter('all')
                }}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Clear Filters
              </button>
            </>
          )}
        </div>
      )}

      {/* Rating Distribution Chart */}
      {ratings.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Your Rating Distribution
          </h3>
          <div className="space-y-4">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = stats.distribution[stars]
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0
              
              return (
                <div key={stars} className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 w-20">
                    <span className="text-sm text-gray-600 w-4 font-medium">{stars}</span>
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  </div>
                  
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center space-x-3 w-24">
                    <span className="text-sm text-gray-600 font-medium">
                      {count}
                    </span>
                    <span className="text-sm text-gray-400">
                      ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {ratings.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
            <div className="text-3xl font-bold text-green-600">
              {stats.distribution[5]}
            </div>
            <div className="text-sm text-gray-600 mt-2">5 Star Ratings</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {stats.distribution[4]}
            </div>
            <div className="text-sm text-gray-600 mt-2">4 Star Ratings</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {stats.distribution[3]}
            </div>
            <div className="text-sm text-gray-600 mt-2">3 Star Ratings</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
            <div className="text-3xl font-bold text-red-600">
              {stats.distribution[2] + stats.distribution[1]}
            </div>
            <div className="text-sm text-gray-600 mt-2">Critical Ratings</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyRatings