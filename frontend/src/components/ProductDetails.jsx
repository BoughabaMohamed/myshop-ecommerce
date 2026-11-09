
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCart } from '../CartContext'

function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const { addToCart } = useCart()

  useEffect(() => {
    setLoading(true)
    setError(false)

    fetch('http://localhost:3000/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load products')
        }

        return response.json()
      })
      .then((data) => {
        const foundProduct = data.find(
          (item) => String(item.id) === String(id)
        )

        setProduct(foundProduct || null)
      })
      .catch((error) => {
        console.error(error)
        setError(true)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-center text-gray-500">
          Loading product...
        </p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center bg-white rounded-2xl border border-gray-100 p-8">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-500 mb-6">
            Could not load the product.
          </p>
          <Link to="/products" className="text-blue-600 font-semibold hover:text-blue-700">
            ← Back to Products
          </Link>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center bg-white rounded-2xl border border-gray-100 p-8">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Product not found
          </h2>
          <p className="text-gray-500 mb-6">
            The product you are looking for does not exist.
          </p>
          <Link
            to="/products"
            className="inline-block rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 transition"
          >
            Back to Products
          </Link>
        </div>
      </main>
    )
  }

  const inStock = Number(product.stock) > 0

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 text-center">
          <p className="text-sm font-semibold tracking-wider text-blue-100 mb-3">
            MYSHOP STORE
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold">
            Product Details
          </h1>
        </div>
      </section>

      {/* Product Details */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-8 lg:p-10">

          <Link
            to="/products"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 mb-8 transition"
          >
            ← Back to Products
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

            {/* Product Image */}
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-10 min-h-[300px] flex items-center justify-center overflow-hidden">
              <img
                src={`http://localhost:3000/uploads/${product.image}`}
                alt={product.name}
                className="max-w-full w-full max-w-md h-72 sm:h-96 object-contain transition duration-300 hover:scale-105"
              />
            </div>

            {/* Product Information */}
            <div>
              <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full mb-5">
                {product.category}
              </span>

              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-5">
                {product.name}
              </h2>

              <p className="text-gray-500 leading-relaxed mb-6">
                {product.description || 'No description available.'}
              </p>

              <p className="text-3xl font-bold text-blue-600 mb-5">
                {product.price} DH
              </p>

              <div className="mb-7">
                <span className="text-sm text-gray-500 mr-2">
                  Availability:
                </span>

                <span className={`text-sm font-semibold ${inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {inStock ? `In Stock (${product.stock})` : 'Out of stock'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => addToCart(product)}
                disabled={!inStock}
                className="w-full sm:w-auto rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-8 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>

              <div className="mt-6">
                <Link
                  to="/products"
                  className="text-sm text-gray-500 hover:text-blue-600 transition"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  )
}

export default ProductDetails
