import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  MapPin, 
  Star, 
  User, 
  ArrowLeft, 
  Phone, 
  Globe, 
  Clock,
  Edit,
  Share2
} from 'lucide-react'
import { Store } from 'lucide-react'
import RatingStars from '../../components/ratings/RatingStars'
import RatingForm from '../../components/ratings/RatingForm'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import StoreEditForm from '../../components/stores/StoreEditForm'
import { storeService } from '../../services/storeService'
import { ratingService } from '../../services/ratingService'
import { useAuth } from '../../contexts/AuthContext'

const StoreDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user, isAdmin, isStoreOwner } = useAuth()

  const [store, setStore] = useState(null)
  const [userRating, setUserRating] = useState(null)
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [showRatingForm, setShowRatingForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)

  useEffect(() => {
    if (id) {
      // Validate that id is a valid number
      const storeId = parseInt(id)
      if (isNaN(storeId) || storeId <= 0) {
        setError(`Invalid store ID: ${id}. Store ID must be a positive number.`)
        setLoading(false)
        return
      }
      loadStoreDetails()
    }
  }, [id])

  const loadStoreDetails = async () => {
    try {
      setLoading(true)
      setError('')

      console.log(`Loading store details for ID: ${id}`)
      
      // Load store details
      const storeResponse = await storeService.getStoreById(id)
      setStore(storeResponse.store)
      console.log('Store loaded successfully:', storeResponse.store)

      // Load store ratings
      const ratingsResponse = await storeService.getStoreRatings?.(id) || { ratings: [] }
      setRatings(ratingsResponse.ratings || [])

      // Load user's rating if authenticated
      if (isAuthenticated) {
        try {
          const userRatingResponse = await ratingService.getStoreWithUserRating(id)
          setUserRating(userRatingResponse.store.user_rating)
        } catch (err) {
          // User hasn't rated this store yet
          setUserRating(null)
        }
      }

    } catch (err) {
      console.error(`Error loading store details for ID ${id}:`, err)
      
      if (err.response?.status === 404) {
        setError(`Store with ID ${id} not found. It may have been deleted or the ID is incorrect.`)
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.')
      } else {
        setError('Failed to load store details. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRatingSubmit = async (rating, comment) => {
    try {
      await ratingService.submitRating({
        store_id: parseInt(id),
        rating: rating,
        comment: comment
      })
      
      setUserRating(rating)
      setShowRatingForm(false)
      
      // Reload store details to update average rating
      await loadStoreDetails()
      
    } catch (err) {
      console.error('Error submitting rating:', err)
      setError('Failed to submit rating. Please try again.')
    }
  }

  const handleShareStore = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: store.name,
          text: `Check out ${store.name} on StoreRatings`,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Store link copied to clipboard!')
    }
  }

  const handleStoreUpdate = (updatedStore) => {
    setStore(updatedStore)
    setShowEditForm(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !store) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg max-w-md mx-auto">
          <h3 className="text-lg font-medium mb-2">Store Not Found</h3>
          <p className="mb-4">{error || 'The store you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/stores')}
            className="btn-primary"
          >
            Back to Stores
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/stores')}
          className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Stores</span>
        </button>
        
        <button
          onClick={handleShareStore}
          className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors font-medium"
        >
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </button>
      </div>

      {/* Store Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Store Image (placeholder) */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center">
              <Store className="h-12 w-12 text-emerald-600" />
            </div>
          </div>

          {/* Store Info */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 leading-tight">
                  {store.name}
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm">{store.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm">Owner: {store.owner_name}</span>
                  </div>
                </div>
              </div>

              {/* Rating Section */}
              <div className="text-center">
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="h-6 w-6 text-yellow-500 fill-current" />
                  <span className="text-3xl font-bold text-gray-900">
                    {store.average_rating ? store.average_rating.toFixed(1) : '0.0'}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {store.total_ratings || 0} ratings
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              {isAuthenticated ? (
                <>
                  {userRating ? (
                    <div className="flex items-center space-x-3 bg-emerald-50 px-4 py-2 rounded-lg">
                      <span className="text-gray-700 font-medium">Your rating:</span>
                      <RatingStars rating={userRating} />
                      <button
                        onClick={() => setShowRatingForm(true)}
                        className="text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors"
                      >
                        Update
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowRatingForm(true)}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Rate This Store
                    </button>
                  )}
                </>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  state={{ from: `/stores/${id}` }}
                >
                  <Star className="h-4 w-4 mr-2" />
                  Login to Rate
                </Link>
              )}

              {/* Store owner and admin actions */}
              {(isAdmin || (isStoreOwner && user?.id === store.owner_id)) && (
                <button 
                  onClick={() => setShowEditForm(true)}
                  className="inline-flex items-center px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200 font-medium"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Store
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-8">
            {['overview', 'ratings', 'contact'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-all duration-200 ${
                  activeTab === tab
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  About This Store
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {store.description || `Welcome to ${store.name}! Located at ${store.address}, this store is owned and operated by ${store.owner_name}.`}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h4 className="text-xl font-semibold text-gray-900">Store Information</h4>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 text-gray-700">
                      <div className="bg-emerald-100 p-2 rounded-lg">
                        <User className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium">Owner</p>
                        <p>{store.owner_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-gray-700">
                      <div className="bg-emerald-100 p-2 rounded-lg">
                        <MapPin className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium">Address</p>
                        <p>{store.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-gray-700">
                      <div className="bg-emerald-100 p-2 rounded-lg">
                        <Clock className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium">Joined</p>
                        <p>{new Date(store.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-xl font-semibold text-gray-900">Rating Summary</h4>
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600 w-4 font-medium">{stars}</span>
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-300" 
                            style={{ 
                              width: `${(store.rating_distribution?.[stars] || 0) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-8 font-medium">
                          {store.rating_distribution?.[stars] || 0}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ratings' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">
                  Customer Reviews ({ratings.length})
                </h3>
              </div>

              {ratings.length > 0 ? (
                <div className="space-y-6">
                  {ratings.map((rating) => (
                    <div key={rating.id} className="border-b border-gray-200 pb-6 last:border-0">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900 text-lg">
                            {rating.user_name || 'Anonymous User'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {new Date(rating.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <RatingStars rating={rating.rating} />
                      </div>
                      {rating.comment && (
                        <p className="text-gray-700 mt-2 text-lg leading-relaxed">{rating.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                    <Star className="h-10 w-10 text-gray-400" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-3">
                    No Reviews Yet
                  </h4>
                  <p className="text-lg text-gray-600">
                    Be the first to rate this store!
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Contact Information
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 text-gray-700">
                    <div className="bg-emerald-100 p-3 rounded-lg">
                      <MapPin className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">Address</p>
                      <p className="text-lg">{store.address}</p>
                    </div>
                  </div>
                  
                  {store.email && (
                    <div className="flex items-center space-x-4 text-gray-700">
                      <div className="bg-emerald-100 p-3 rounded-lg">
                        <Globe className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">Email</p>
                        <a 
                          href={`mailto:${store.email}`}
                          className="text-emerald-600 hover:text-emerald-700 text-lg transition-colors"
                        >
                          {store.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {store.phone && (
                    <div className="flex items-center space-x-4 text-gray-700">
                      <div className="bg-emerald-100 p-3 rounded-lg">
                        <Phone className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">Phone</p>
                        <a 
                          href={`tel:${store.phone}`}
                          className="text-emerald-600 hover:text-emerald-700 text-lg transition-colors"
                        >
                          {store.phone}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Map placeholder */}
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl h-80 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-4" />
                  <p className="text-lg font-medium">Map view would be displayed here</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingForm && (
        <RatingForm
          store={store}
          userRating={userRating}
          onSubmit={handleRatingSubmit}
          onClose={() => setShowRatingForm(false)}
        />
      )}

      {/* Edit Store Modal */}
      {showEditForm && (
        <StoreEditForm
          store={store}
          onUpdate={handleStoreUpdate}
          onClose={() => setShowEditForm(false)}
        />
      )}
    </div>
  )
}

export default StoreDetail