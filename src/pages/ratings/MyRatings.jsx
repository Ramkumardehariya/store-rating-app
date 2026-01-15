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
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Ratings</h1>
          <p className="text-gray-600 mt-1">
            Manage and view all your store ratings
          </p>
        </div>
        
        <Link
          to="/stores"
          className="btn-primary"
        >
          Browse More Stores
        </Link>
      </div>

      {/* Stats Overview */}
      {ratings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-gray-600">Total Ratings</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.average}</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-gray-900">
              {Math.max(...Object.values(stats.distribution))}
            </div>
            <div className="text-gray-600">Most Given</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-gray-900">
              {ratings.length > 0 ? new Date(Math.max(...ratings.map(r => new Date(r.created_at)))).toLocaleDateString() : 'N/A'}
            </div>
            <div className="text-gray-600">Last Rated</div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="card p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search your rated stores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 input-field"
              />
            </div>
          </div>

          {/* Rating Filter */}
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="input-field"
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
              className="input-field"
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
          <div className="mt-3 flex items-center space-x-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-800">
                Search: {searchTerm}
              </span>
            )}
            {ratingFilter !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-800">
                {ratingFilter} Stars
              </span>
            )}
            <button
              onClick={() => {
                setSearchTerm('')
                setRatingFilter('all')
              }}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={loadUserRatings}
              className="text-red-700 hover:text-red-800 font-medium text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Ratings List */}
      {filteredRatings.length > 0 ? (
        <div className="space-y-4">
          {filteredRatings.map((rating) => (
            <div key={rating.id} className="card hover:shadow-md transition-shadow duration-200">
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                {/* Store Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <Link
                        to={`/stores/${rating.store_id}`}
                        className="group"
                      >
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                          {rating.store_name}
                        </h3>
                      </Link>
                      
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{rating.store_address}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Rated on {new Date(rating.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Rating Display/Edit */}
                    <div className="flex flex-col items-end space-y-2">
                      {editingRating === rating.id ? (
                        <div className="text-center">
                          <RatingStars
                            rating={editRatingValue}
                            onRatingChange={setEditRatingValue}
                            interactive={true}
                            size="md"
                          />
                          <div className="flex space-x-2 mt-2">
                            <button
                              onClick={() => handleUpdateRating(rating.id, editRatingValue)}
                              disabled={editRatingValue === 0}
                              className="text-sm text-green-600 hover:text-green-700 font-medium disabled:opacity-50"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="text-center">
                            <RatingStars rating={rating.rating} size="md" />
                            <div className="text-sm text-gray-600 mt-1">
                              {rating.rating} star{rating.rating !== 1 ? 's' : ''}
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={() => startEditing(rating)}
                              className="text-primary-600 hover:text-primary-700 p-1 rounded transition-colors"
                              title="Edit rating"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteRating(rating.id)}
                              className="text-red-600 hover:text-red-700 p-1 rounded transition-colors"
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
                    <div className="bg-gray-50 rounded-lg p-3 mt-3">
                      <div className="flex items-start space-x-2">
                        <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700 text-sm">{rating.comment}</p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center space-x-4 mt-4 pt-3 border-t border-gray-200">
                    <Link
                      to={`/stores/${rating.store_id}`}
                      className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Store</span>
                    </Link>
                    
                    {rating.store_owner_response && (
                      <button className="flex items-center space-x-1 text-green-600 hover:text-green-700 font-medium text-sm">
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
        <div className="text-center py-12">
          {ratings.length === 0 ? (
            // No ratings at all
            <>
              <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Ratings Yet
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                You haven't rated any stores yet. Start exploring stores and share your experiences to help others.
              </p>
              <Link
                to="/stores"
                className="btn-primary"
              >
                Browse Stores
              </Link>
            </>
          ) : (
            // No ratings match filters
            <>
              <Filter className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Matching Ratings
              </h3>
              <p className="text-gray-600 mb-6">
                No ratings match your current search criteria. Try adjusting your filters.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setRatingFilter('all')
                }}
                className="btn-primary"
              >
                Clear Filters
              </button>
            </>
          )}
        </div>
      )}

      {/* Rating Distribution Chart */}
      {ratings.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Your Rating Distribution
          </h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = stats.distribution[stars]
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0
              
              return (
                <div key={stars} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 w-16">
                    <span className="text-sm text-gray-600 w-4">{stars}</span>
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  </div>
                  
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-yellow-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center space-x-2 w-20">
                    <span className="text-sm text-gray-600">
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="card">
            <div className="text-2xl font-bold text-green-600">
              {stats.distribution[5]}
            </div>
            <div className="text-sm text-gray-600">5 Star Ratings</div>
          </div>
          <div className="card">
            <div className="text-2xl font-bold text-blue-600">
              {stats.distribution[4]}
            </div>
            <div className="text-sm text-gray-600">4 Star Ratings</div>
          </div>
          <div className="card">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.distribution[3]}
            </div>
            <div className="text-sm text-gray-600">3 Star Ratings</div>
          </div>
          <div className="card">
            <div className="text-2xl font-bold text-red-600">
              {stats.distribution[2] + stats.distribution[1]}
            </div>
            <div className="text-sm text-gray-600">Critical Ratings</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyRatings