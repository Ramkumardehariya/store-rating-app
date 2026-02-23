import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { Store, User, LogOut, Menu, ArrowRight } from "lucide-react"

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  console.log("header user:", user, "isAuthenticated:", isAuthenticated)

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <header className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex justify-between items-center h-18 py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 text-black hover:opacity-90 transition">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-lg">
              <Store className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-black">StoreRatings</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 font-medium">
            <Link to="/stores" className="text-gray-700 hover:text-emerald-600 transition-colors text-sm">
              Stores
            </Link>

            {isAuthenticated && user ? (
              <>
                {user.role === "user" && <Link to="/my-ratings" className="text-gray-700 hover:text-emerald-600 transition-colors text-sm">My Ratings</Link>}
                {(user.role === "admin") && <Link to="/admin/dashboard" className="text-gray-700 hover:text-emerald-600 transition-colors text-sm">Dashboard</Link>}
                {(user.role === "store_owner" || user.role === "storeowner") && (
                  <Link to="/store-owner/dashboard" className="text-gray-700 hover:text-emerald-600 transition-colors text-sm">My Store</Link>
                )}

                <div className="flex items-center space-x-3 pl-6 border-l border-gray-200">
                  <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 transition-colors text-sm">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{user.name}</span>
                  </Link>
                  <Link to="/update-password" className="text-gray-600 hover:text-emerald-600 transition-colors text-xs">
                    Update Password
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition text-sm"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition text-sm font-medium">
                  Login
                </Link>
                <Link to="/register" className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 transition text-sm font-medium shadow-sm">
                  <span>Sign up</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition">
            <Menu className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header;