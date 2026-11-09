
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      <div
        className="max-w-7xl mx-auto
        px-4 sm:px-6 lg:px-8
        py-12"
      >
        <div
          className="grid grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-10"
        >
          {/* BRAND */}
          <div>
            <h2 className="text-2xl font-bold mb-4">
              My<span className="text-blue-500">Shop</span>
            </h2>

            <p className="text-gray-400 leading-relaxed">
              Your trusted online shopping website for quality
              products at great prices.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="font-semibold text-lg mb-4">
              Quick Links
            </h3>

            <div className="space-y-3">
              <Link to="/" className="block text-gray-400 hover:text-white transition">
                Home
              </Link>

              <Link to="/products" className="block text-gray-400 hover:text-white transition">
                Products
              </Link>

              <Link to="/cart" className="block text-gray-400 hover:text-white transition">
                Cart
              </Link>

              <Link to="/contact" className="block text-gray-400 hover:text-white transition">
                Contact
              </Link>
            </div>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="font-semibold text-lg mb-4">
              Contact Us
            </h3>

            <div className="space-y-3 text-gray-400">
              <p>📧 support@myshop.com</p>
              <p>📞 +212 600 000 000</p>
              <p>📍 Casablanca, Morocco</p>
            </div>
          </div>

          {/* SOCIAL */}
          <div>
            <h3 className="font-semibold text-lg mb-4">
              Follow Us
            </h3>

            <div className="flex gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="w-10 h-10 rounded-xl bg-slate-800
                flex items-center justify-center
                hover:bg-blue-600 transition"
              >
                f
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="w-10 h-10 rounded-xl bg-slate-800
                flex items-center justify-center
                hover:bg-blue-600 transition"
              >
                📷
              </a>

              <a
                href="#"
                aria-label="X"
                className="w-10 h-10 rounded-xl bg-slate-800
                flex items-center justify-center
                hover:bg-blue-600 transition"
              >
                X
              </a>
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div
          className="border-t border-slate-800
          mt-10 pt-6 text-center"
        >
          <p className="text-gray-500 text-sm">
            © 2026 MyShop. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
