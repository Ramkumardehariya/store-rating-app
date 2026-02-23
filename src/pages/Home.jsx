import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Star, Store, Users, Award, TrendingUp, MapPin, Shield } from 'lucide-react'

const Home = () => {
  const { isAuthenticated, user } = useAuth()

  const features = [
    {
      icon: <Store className="h-8 w-8 text-emerald-600" />,
      title: 'Discover Stores',
      description: 'Find and explore various stores in your area with detailed information and ratings.'
    },
    {
      icon: <Star className="h-8 w-8 text-emerald-600" />,
      title: 'Rate & Review',
      description: 'Share your experiences by rating stores and helping others make informed decisions.'
    },
    {
      icon: <Users className="h-8 w-8 text-emerald-600" />,
      title: 'Community Driven',
      description: 'Join a community of users who value honest feedback and quality service.'
    },
    {
      icon: <Shield className="h-8 w-8 text-emerald-600" />,
      title: 'Quality Assurance',
      description: 'Trust in verified ratings and reviews from real customers.'
    }
  ]

  const stats = [
    {
      icon: <Store className="h-6 w-6 text-emerald-600" />,
      value: '100+',
      label: 'Stores Listed'
    },
    {
      icon: <Star className="h-6 w-6 text-emerald-600" />,
      value: '1,000+',
      label: 'Ratings Given'
    },
    {
      icon: <Users className="h-6 w-6 text-emerald-600" />,
      value: '500+',
      label: 'Happy Users'
    }
  ]

  return (
    <div className="space-y-24 max-w-[1200px] mx-auto">
      {/* Hero Section */}
      <section className="text-center space-y-8 px-6 py-16">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
            Find the Best Stores
            <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Based on Real Ratings
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover top-rated stores, share your experiences, and help others find 
            <span className="font-semibold text-emerald-600"> quality services </span>
            in your community.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          {!isAuthenticated ? (
            <>
              <Link to="/register" className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition text-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                <span>Get Started</span>
                <TrendingUp className="h-5 w-5" />
              </Link>
              <Link to="/stores" className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-emerald-300 hover:bg-emerald-50 transition text-lg font-medium">
                Browse Stores
              </Link>
            </>
          ) : (
            <div className="space-y-6">
              <p className="text-xl text-gray-700">
                Welcome back, <span className="font-semibold text-emerald-600">{user?.name}</span>!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/stores" className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition text-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  <span>Browse Stores</span>
                  <MapPin className="h-5 w-5" />
                </Link>
                <Link to="/my-ratings" className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-emerald-300 hover:bg-emerald-50 transition text-lg font-medium">
                  My Ratings
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose StoreRatings
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to discover and evaluate the best stores in your area
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center space-y-6 border border-gray-100">
              <div className="flex justify-center">
                <div className="bg-emerald-50 p-4 rounded-xl">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-12 border border-emerald-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="bg-white p-3 rounded-xl shadow-sm">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-gray-700 font-medium text-lg">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home