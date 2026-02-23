import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Store, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  ArrowUp,
  Heart,
  Send,
  ChevronRight
} from 'lucide-react'

const Footer = () => {
  const currentYear = 2026
  const [email, setEmail] = useState('')

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubscribe = (e) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email)
    setEmail('')
  }

  const socialLinks = [
    { 
      name: 'Facebook', 
      icon: Facebook, 
      url: 'https://facebook.com',
      color: 'hover:text-blue-600'
    },
    { 
      name: 'Twitter', 
      icon: Twitter, 
      url: 'https://twitter.com',
      color: 'hover:text-blue-400'
    },
    { 
      name: 'Instagram', 
      icon: Instagram, 
      url: 'https://instagram.com',
      color: 'hover:text-pink-600'
    },
    { 
      name: 'LinkedIn', 
      icon: Linkedin, 
      url: 'https://linkedin.com',
      color: 'hover:text-blue-700'
    }
  ]

  return (
    <footer className="bg-gray-50 text-gray-700 border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-lg">
                <Store className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">StoreRatings</span>
            </Link>
            <p className="text-gray-600 mb-8 leading-relaxed text-sm max-w-sm">
              Discover the best stores based on real customer ratings. Share your experiences and help others make informed decisions.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-emerald-600 hover:border-emerald-300 transition-all duration-200"
                    aria-label={social.name}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h3 className="text-sm font-semibold mb-6 text-gray-900 uppercase tracking-wider">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/stores"
                  className="text-gray-600 hover:text-emerald-600 transition-colors duration-200 flex items-center group"
                >
                  <ChevronRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Browse Stores
                </Link>
              </li>
              <li>
                <Link
                  to="/my-ratings"
                  className="text-gray-600 hover:text-emerald-600 transition-colors duration-200 flex items-center group"
                >
                  <ChevronRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  My Ratings
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-600 hover:text-emerald-600 transition-colors duration-200 flex items-center group"
                >
                  <ChevronRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-600 hover:text-emerald-600 transition-colors duration-200 flex items-center group"
                >
                  <ChevronRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* User & Legal Column */}
          <div>
            <h3 className="text-sm font-semibold mb-6 text-gray-900 uppercase tracking-wider">Account</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/profile"
                  className="text-gray-600 hover:text-emerald-600 transition-colors duration-200 flex items-center group"
                >
                  <ChevronRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/store-owner/dashboard"
                  className="text-gray-600 hover:text-emerald-600 transition-colors duration-200 flex items-center group"
                >
                  <ChevronRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Store Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-600 hover:text-emerald-600 transition-colors duration-200 flex items-center group"
                >
                  <ChevronRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-600 hover:text-emerald-600 transition-colors duration-200 flex items-center group"
                >
                  <ChevronRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-sm font-semibold mb-6 text-gray-900 uppercase tracking-wider">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/guidelines"
                  className="text-gray-600 hover:text-emerald-600 transition-colors duration-200 flex items-center group"
                >
                  <ChevronRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Store Guidelines
                </Link>
              </li>
              <li>
                <Link
                  to="/support"
                  className="text-gray-600 hover:text-emerald-600 transition-colors duration-200 flex items-center group"
                >
                  <ChevronRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Support
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-gray-600 hover:text-emerald-600 transition-colors duration-200 flex items-center group"
                >
                  <ChevronRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-gray-600 hover:text-emerald-600 transition-colors duration-200 flex items-center group"
                >
                  <ChevronRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Blog
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-200 mt-16 pt-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stay Updated</h3>
            <p className="text-gray-600 mb-6 text-sm">
              Subscribe to our newsletter for the latest store reviews and platform updates.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-gray-900 text-sm"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 flex items-center justify-center space-x-2 text-sm font-medium shadow-sm hover:shadow-md"
              >
                <span>Subscribe</span>
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Footer Bar */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-[1200px] mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-gray-600 text-sm">
              <span>&copy; {currentYear} StoreRatings. All rights reserved.</span>
            </div>

            {/* Bottom Links */}
            <div className="flex items-center space-x-6 text-sm">
              <Link
                to="/privacy"
                className="text-gray-600 hover:text-emerald-600 transition-colors duration-200"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="text-gray-600 hover:text-emerald-600 transition-colors duration-200"
              >
                Terms
              </Link>
              <Link
                to="/cookies"
                className="text-gray-600 hover:text-emerald-600 transition-colors duration-200"
              >
                Cookies
              </Link>
              <button
                onClick={scrollToTop}
                className="flex items-center space-x-1 text-gray-600 hover:text-emerald-600 transition-colors duration-200"
                aria-label="Back to top"
              >
                <span>Back to top</span>
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer