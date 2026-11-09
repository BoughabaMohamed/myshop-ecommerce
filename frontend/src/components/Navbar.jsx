
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../CartContext'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { cartCount } = useCart()

  const navLinkClass = ({ isActive }) =>
    `transition ${
      isActive
        ? 'font-semibold text-blue-600'
        : 'text-gray-600 hover:text-blue-600'
    }`

  const mobileLinkClass = ({ isActive }) =>
    `block rounded-xl px-4 py-3 transition ${
      isActive
        ? 'bg-blue-50 font-semibold text-blue-600'
        : 'hover:bg-gray-50'
    }`

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">

          {/* LOGO */}
          <Link to="/" onClick={closeMenu} className="flex items-center gap-3">
            <div className="h-11 w-11 overflow-hidden rounded-xl sm:h-12 sm:w-12">
              <img
                src="/images/logo.png"
                alt="MyShop Logo"
                className="h-full w-full object-contain"
              />
            </div>

            <span className="text-2xl font-bold text-slate-900">
              My<span className="text-blue-600">Shop</span>
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden items-center gap-8 md:flex">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>

            <NavLink to="/products" className={navLinkClass}>
              Products
            </NavLink>

            <NavLink to="/cart" className={navLinkClass}>
              Cart
            </NavLink>

            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">

            <Link
              to="/cart"
              className="hidden items-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-gray-700 transition hover:bg-blue-50 hover:text-blue-600 sm:flex"
            >
              🛒
              <span>Cart: {cartCount}</span>
            </Link>

            {/* MOBILE MENU */}
            <div className="relative md:hidden">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-xl"
              >
                {menuOpen ? '×' : '☰'}
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-14 w-56 rounded-2xl border border-gray-100 bg-white p-3 shadow-xl">

                  <NavLink
                    to="/"
                    end
                    onClick={closeMenu}
                    className={mobileLinkClass}
                  >
                    🏠 Home
                  </NavLink>

                  <NavLink
                    to="/products"
                    onClick={closeMenu}
                    className={mobileLinkClass}
                  >
                    🛍 Products
                  </NavLink>

                  <NavLink
                    to="/cart"
                    onClick={closeMenu}
                    className={mobileLinkClass}
                  >
                    🛒 Cart ({cartCount})
                  </NavLink>

                  <NavLink
                    to="/contact"
                    onClick={closeMenu}
                    className={mobileLinkClass}
                  >
                    📞 Contact
                  </NavLink>

                </div>
              )}
            </div>

          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
