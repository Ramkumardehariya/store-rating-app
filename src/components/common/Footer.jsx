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
  Send
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
    <footer className="bg-[#0086c9] text-white">
      {/* Main Footer Content */}
      <div className="max-w-[1080px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Store className="h-8 w-8 text-white" />
              <span className="text-2xl font-bold text-white">StoreRatings</span>
            </Link>
            <p className="text-gray-100 mb-6 leading-relaxed">
              Discover the best stores based on real customer ratings. Share your experiences and help others make informed decisions.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-200 hover:text-white transition-colors ${social.color}`}
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Home</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-200 hover:text-white transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/stores"
                  className="text-gray-200 hover:text-white transition-colors duration-200"
                >
                  Stores
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-200 hover:text-white transition-colors duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-200 hover:text-white transition-colors duration-200"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* User & Legal Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">My Ratings</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/my-ratings"
                  className="text-gray-200 hover:text-white transition-colors duration-200"
                >
                  My Ratings
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-gray-200 hover:text-white transition-colors duration-200"
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-200 hover:text-white transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-200 hover:text-white transition-colors duration-200"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Store Management Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Store Dashboard</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/store-owner/dashboard"
                  className="text-gray-200 hover:text-white transition-colors duration-200"
                >
                  Store Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/stores/create"
                  className="text-gray-200 hover:text-white transition-colors duration-200"
                >
                  Add Store
                </Link>
              </li>
              <li>
                <Link
                  to="/guidelines"
                  className="text-gray-200 hover:text-white transition-colors duration-200"
                >
                  Store Guidelines
                </Link>
              </li>
              <li>
                <Link
                  to="/support"
                  className="text-gray-200 hover:text-white transition-colors duration-200"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="border-t border-blue-300 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-white flex-shrink-0" />
              <a 
                href="mailto:support@storeratings.com"
                className="text-gray-200 hover:text-white transition-colors"
              >
                support@storeratings.com
              </a>
            </div>

            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-white flex-shrink-0" />
              <a 
                href="tel:+11234567890"
                className="text-gray-200 hover:text-white transition-colors"
              >
                +1 (123) 456-7890
              </a>
            </div>

            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-white flex-shrink-0" />
              <p className="text-gray-200">
                123 Business Ave, Suite 100, City, State 12345
              </p>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-blue-300 mt-8 pt-8">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-gray-100 mb-6">
              Subscribe to our newsletter for the latest store reviews and platform updates.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent bg-white text-gray-900"
                required
              />
              <button
                type="submit"
                className="px-6 py-2 bg-white text-[#0086c9] rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <span>Subscribe</span>
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Footer Bar */}
      <div className="bg-[#005a8a] border-t border-blue-400">
        <div className="max-w-[1080px] mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-gray-200 text-sm">
              <span>&copy; {currentYear} StoreRatings. All rights reserved.</span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center space-x-1">
                <span>Made with</span>
                <Heart className="h-4 w-4 text-red-500 fill-current" />
                <span>by Ramkumar Dehariya</span>
              </span>
            </div>

            {/* Bottom Links */}
            <div className="flex items-center space-x-6 text-sm">
              <Link
                to="/privacy"
                className="text-gray-200 hover:text-white transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-200 hover:text-white transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookies"
                className="text-gray-200 hover:text-white transition-colors duration-200"
              >
                Cookie Policy
              </Link>
              <button
                onClick={scrollToTop}
                className="flex items-center space-x-1 text-gray-200 hover:text-white transition-colors duration-200"
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