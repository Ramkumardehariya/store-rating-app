import React from 'react'
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
  Heart
} from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Stores', path: '/stores' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ]

  const userLinks = [
    { name: 'My Ratings', path: '/my-ratings' },
    { name: 'Profile', path: '/profile' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' }
  ]

  const storeOwnerLinks = [
    { name: 'Store Dashboard', path: '/store-owner/dashboard' },
    { name: 'Add Store', path: '/stores/create' },
    { name: 'Store Guidelines', path: '/guidelines' },
    { name: 'Support', path: '/support' }
  ]

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
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Store className="h-8 w-8 text-primary-400" />
              <span className="text-2xl font-bold">StoreRatings</span>
            </Link>
            <p className="text-gray-400 mb-4 leading-relaxed">
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
                    className={`text-gray-400 hover:text-white transition-colors ${social.color}`}
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* User Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">User Resources</h3>
            <ul className="space-y-2">
              {userLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Store Owner Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">For Store Owners</h3>
            <ul className="space-y-2">
              {storeOwnerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-primary-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-400">Email Us</p>
                <a 
                  href="mailto:support@storeratings.com"
                  className="text-white hover:text-primary-400 transition-colors"
                >
                  support@storeratings.com
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-primary-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-400">Call Us</p>
                <a 
                  href="tel:+11234567890"
                  className="text-white hover:text-primary-400 transition-colors"
                >
                  +1 (123) 456-7890
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-primary-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-400">Visit Us</p>
                <p className="text-white">
                  123 Business Ave, Suite 100<br />
                  City, State 12345
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-lg font-semibold mb-2 text-white">
              Stay Updated
            </h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for the latest store reviews and platform updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-gray-400">
              <span>&copy; {currentYear} StoreRatings. All rights reserved.</span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center space-x-1">
                <span>Made with</span>
                <Heart className="h-4 w-4 text-red-500 fill-current" />
                <span>by our team</span>
              </span>
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-6 text-sm">
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookies"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Cookie Policy
              </Link>
            </div>

            {/* Back to Top Button */}
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 group"
              aria-label="Back to top"
            >
              <span className="text-sm">Back to top</span>
              <ArrowUp className="h-4 w-4 group-hover:transform group-hover:-translate-y-1 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile App Promotion */}
      <div className="bg-primary-600">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-white text-sm text-center sm:text-left">
              📱 Get our mobile app for a better experience
            </p>
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-white text-primary-600 hover:bg-gray-100 font-medium rounded-lg text-sm transition-colors duration-200">
                Download iOS
              </button>
              <button className="px-4 py-2 bg-white text-primary-600 hover:bg-gray-100 font-medium rounded-lg text-sm transition-colors duration-200">
                Download Android
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer