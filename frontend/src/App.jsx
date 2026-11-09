
import { Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import FeaturedProducts from './components/FeaturedProducts'
import CartDrawer from './components/CartDrawer'
import Toast from './components/Toast'
import Cart from './components/Cart'
import Products from './components/Products'
import CTA from './components/CTA'
import Footer from './components/Footer'
import ProductDetails from './components/ProductDetails'
import Contact from './components/Contact'

import { useCart } from './CartContext'

// Admin components
import AdminLayout from './admin/components/AdminLayout'
import AdminProtectedRoute from './admin/components/AdminProtectedRoute'

// Admin pages
import AdminLogin from './admin/pages/AdminLogin'
import AdminProducts from './admin/pages/AdminProducts'
import AdminCategories from './admin/pages/AdminCategories'
import AdminUsers from './admin/pages/AdminUsers'
import AdminOrders from './admin/pages/AdminOrders'

function Home() {
  return (
    <>
      <Hero />
      <Features />
      <FeaturedProducts />
      <CTA />
    </>
  )
}

function Storefront() {
  const { toast, setToast } = useCart()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      <Footer />
      <CartDrawer />

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast({ message: '', type: 'success' })
        }
      />
    </div>
  )
}

function App() {
  return (
    <Routes>
      {/* Admin login */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected admin pages */}
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>
      </Route>

      {/* Storefront */}
      <Route path="/*" element={<Storefront />} />
    </Routes>
  )
}

export default App
