import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Plus, Store, Grid, List } from 'lucide-react'
import StoreCard from '../../components/stores/StoreCard'
import StoreFilters from '../../components/stores/StoreFilters'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { storeService } from '../../services/storeService'
import { ratingService } from '../../services/ratingService'
import { useAuth } from '../../contexts/AuthContext'

const Stores = () => {
  const [stores, setStores] = useState([])
  const [storesWithUserRatings, setStoresWithUserRatings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    name: '',
    address: '',
    sortBy: 'name',
    sortOrder: 'asc'
  })

  const { isAuthenticated, isAdmin } = useAuth()

  useEffect(() => {
    loadStores()
  }, [filters])

  const loadStores = async () => {
    try {
      setLoading(true)
      const response = await storeService.getAllStores(filters)
      const storesData = response.stores || []
      setStores(storesData)
      
      // Load user ratings for each store if authenticated
      if (isAuthenticated) {
        const storesWithRatings = await Promise.all(
          storesData.map(async (store) => {
            try {
              const userRatingResponse = await ratingService.getStoreWithUserRating(store.id)
              return {
                ...store,
                userRating: userRatingResponse.store.user_rating
              }
            } catch (err) {
              return store
            }
          })
        )
        setStoresWithUserRatings(storesWithRatings)
      } else {
        setStoresWithUserRatings(storesData)
      }
    } catch (err) {
      setError('Failed to load stores. Please try again later.')
      console.error('Error loading stores:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setFilters(prev => ({
      ...prev,
      name: searchTerm
    }))
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setShowFilters(false)
  }

  const clearFilters = () => {
    setFilters({
      name: '',
      address: '',
      sortBy: 'name',
      sortOrder: 'asc'
    })
    setSearchTerm('')
  }

  const filteredStores = storesWithUserRatings.filter(store => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      store.name.toLowerCase().includes(term) ||
      store.address.toLowerCase().includes(term) ||
      store.owner_name?.toLowerCase().includes(term)
    )
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            All Stores
          </h1>
          <p className="text-xl text-gray-600 mt-3 max-w-2xl">
            Discover and rate your favorite stores in your community
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {isAdmin && (
            <Link
              to="/admin/create-store"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Plus className="h-4 w-4" />
              <span>Add Store</span>
            </Link>
          )}
        </div>
      </div>

      {/* Search and Controls */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search stores by name, address, or owner..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-4 py-3 input-field text-lg"
              />
            </div>
          </form>

          {/* View Controls */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-3 border-2 rounded-lg font-medium transition-all duration-200 ${
                showFilters 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
                  : 'border-gray-200 text-gray-700 hover:border-emerald-300 hover:bg-emerald-50'
              }`}
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>

            <div className="flex border-2 border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(filters.name || filters.address) && (
          <div className="mt-4 flex items-center space-x-3">
            <span className="text-sm text-gray-600 font-medium">Active filters:</span>
            {filters.name && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-800 font-medium">
                Name: {filters.name}
              </span>
            )}
            {filters.address && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-800 font-medium">
                Address: {filters.address}
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <StoreFilters 
            filters={filters} 
            onFilterChange={handleFilterChange}
            onClose={() => setShowFilters(false)}
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="font-medium">{error}</span>
            <button
              onClick={loadStores}
              className="text-red-700 hover:text-red-800 font-medium text-sm transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Stores Grid/List */}
      {filteredStores.length > 0 ? (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
            : 'space-y-6'
        }>
          {filteredStores.map((store) => (
            <StoreCard 
              key={store.id} 
              store={store} 
              viewMode={viewMode}
              userRating={store.userRating}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
            <Store className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            No stores found
          </h3>
          <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
            {filters.name || filters.address 
              ? 'Try adjusting your search criteria or filters'
              : 'There are no stores available at the moment'
            }
          </p>
          {(filters.name || filters.address) && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Clear Search & Filters
            </button>
          )}
        </div>
      )}

      {/* Load More (for pagination) */}
      {stores.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={loadStores}
            className="px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200 font-medium"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  )
}

export default Stores