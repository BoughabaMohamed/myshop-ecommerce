
import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

function AdminLayout() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('authToken')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')

    sessionStorage.removeItem('token')
    sessionStorage.removeItem('authToken')
    sessionStorage.removeItem('accessToken')
    sessionStorage.removeItem('user')

    navigate('/admin/login')
  }

  const linkClass = ({ isActive }) =>
    `transition ${
      isActive
        ? 'text-blue-600 font-semibold'
        : 'text-gray-600 hover:text-blue-600'
    }`

  const mobileLinkClass = ({ isActive }) =>
    `block py-3 transition ${
      isActive
        ? 'text-blue-600 font-semibold'
        : 'text-gray-600 hover:text-blue-600'
    }`

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <NavLink to="/admin" onClick={closeMenu}>
              <h2 className="text-xl sm:text-2xl font-bold text-blue-600">
                MyShop Admin
              </h2>
            </NavLink>

            {/* Desktop Navigation */}
            <ul className="hidden md:flex items-center gap-6 text-sm font-medium">

              <li>
                <NavLink to="/" className={linkClass}>
                  Home
                </NavLink>
              </li>

              <li>
                <NavLink to="/admin" end className={linkClass}>
                  Products
                </NavLink>
              </li>

              <li>
                <NavLink to="/admin/categories" className={linkClass}>
                  Categories
                </NavLink>
              </li>

              <li>
                <NavLink to="/admin/users" className={linkClass}>
                  Users
                </NavLink>
              </li>

              <li>
                <NavLink to="/admin/orders" className={linkClass}>
                  Orders
                </NavLink>
              </li>

              <li>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-600 transition"
                >
                  Logout
                </button>
              </li>

            </ul>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="md:hidden flex flex-col justify-center items-center gap-1.5 w-10 h-10 text-gray-700"
            >
              {menuOpen ? (
                <span className="text-3xl leading-none">×</span>
              ) : (
                <>
                  <span className="w-6 h-0.5 bg-gray-700 rounded"></span>
                  <span className="w-6 h-0.5 bg-gray-700 rounded"></span>
                  <span className="w-6 h-0.5 bg-gray-700 rounded"></span>
                </>
              )}
            </button>

          </div>

          {/* Mobile Navigation Menu */}
          {menuOpen && (
            <div className="md:hidden border-t border-gray-200 py-3">

              <ul className="text-sm font-medium">

                <li>
                  <NavLink to="/" className={mobileLinkClass} onClick={closeMenu}>
                    Home
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/admin" end className={mobileLinkClass} onClick={closeMenu}>
                    Products
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/admin/categories" className={mobileLinkClass} onClick={closeMenu}>
                    Categories
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/admin/users" className={mobileLinkClass} onClick={closeMenu}>
                    Users
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/admin/orders" className={mobileLinkClass} onClick={closeMenu}>
                    Orders
                  </NavLink>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="py-3 text-red-500 hover:text-red-600 transition"
                  >
                    Logout
                  </button>
                </li>

              </ul>
            </div>
          )}

        </div>

      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

    </div>
  )
}

export default AdminLayout
