
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Popup from '../components/Popup'

const API_URL = 'http://localhost:3000'

function AdminLogin() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const [popup, setPopup] = useState({
    isOpen: false,
    type: 'error',
    title: '',
    message: '',
  })

  const openPopup = (type, title, message) => {
    setPopup({
      isOpen: true,
      type,
      title,
      message,
    })
  }

  const closePopup = () => {
    setPopup((previousPopup) => ({
      ...previousPopup,
      isOpen: false,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email.trim() || !password) {
      openPopup(
        'warning',
        'Missing Information',
        'Please enter your email and password.'
      )
      return
    }

    try {
      setLoading(true)

      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed. Please try again.')
      }

      if (!data.token || !data.user) {
        throw new Error('Invalid login response.')
      }

      if (data.user.role !== 'admin') {
        throw new Error('Access denied! Admin account required.')
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      navigate('/admin')
    } catch (err) {
      openPopup(
        'error',
        'Login Failed',
        err.message || 'Something went wrong.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

     {/* Header */}
<header className="bg-white border-b border-gray-200 sticky top-0 z-40">
  <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center h-16">

      <Link to="/admin/login">
        <h2 className="text-xl sm:text-2xl font-bold text-blue-600">
          MyShop Admin
        </h2>
      </Link>

    </div>
  </nav>
</header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-12 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-4xl mb-3">🔐</div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Admin Login
          </h1>
          <p className="text-blue-100">
            Sign in to access the administration panel
          </p>
        </div>
      </section>

      {/* Login Form */}
      <main className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">

          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🛡️</div>
            <h2 className="text-2xl font-bold text-gray-800">
              Admin Access
            </h2>
            <p className="text-gray-500 mt-2">
              Enter your admin credentials below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                autoComplete="username"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>

          </form>

          <div className="text-center mt-6">
            <Link to="/" className="text-blue-600 hover:underline">
              ← Back to Home
            </Link>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-3">MyShop</h3>
            <p className="text-sm">
              Your trusted online shopping website.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Quick Links</h3>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/" className="hover:text-white">Home</Link>
              <Link to="/products" className="hover:text-white">Products</Link>
              <Link to="/contact" className="hover:text-white">Contact</Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Support</h3>
            <p className="text-sm">support@myshop.com</p>
            <p className="text-sm">Phone: +212 600 000 000</p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Location</h3>
            <p className="text-sm mt-2">📍 Casablanca, Morocco</p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-gray-700 text-center text-sm">
          © 2026 MyShop. All Rights Reserved.
        </div>
      </footer>

      {/* Shared Popup */}
      <Popup
        isOpen={popup.isOpen}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        onConfirm={closePopup}
        onCancel={closePopup}
      />

    </div>
  )
}

export default AdminLogin
