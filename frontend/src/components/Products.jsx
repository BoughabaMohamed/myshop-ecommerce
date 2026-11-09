
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from './ProductCard'
import { useCart } from '../CartContext'

function Products() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const carouselRef = useRef(null)
  const { addToCart } = useCart()

  useEffect(() => {
    fetch('http://localhost:3000/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load products')
        }

        return response.json()
      })
      .then((data) => {
        setProducts(data)
      })
      .catch((error) => {
        console.error(error)
        setError('Unable to load products.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const categories = useMemo(() => {
    return [...new Set(
      products.map((product) => product.category).filter(Boolean)
    )]
  }, [products])

  const filteredProducts = products.filter((product) => {
    const matchName = product.name
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchCategory =
      category === 'all' || product.category === category

    return matchName && matchCategory
  })

  function scrollCarousel(direction) {
    const carousel = carouselRef.current
    if (!carousel) return

    const firstCard = carousel.querySelector('.carousel-card')
    if (!firstCard) return

    const cardWidth = firstCard.getBoundingClientRect().width
    const gap = 24
    const step = cardWidth + gap

    const maxScroll = carousel.scrollWidth - carousel.clientWidth
    const currentScroll = carousel.scrollLeft

    if (direction === 1) {
      if (currentScroll >= maxScroll - 5) {
        carousel.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        carousel.scrollBy({ left: step, behavior: 'smooth' })
      }
    } else {
      if (currentScroll <= 5) {
        carousel.scrollTo({ left: maxScroll, behavior: 'smooth' })
      } else {
        carousel.scrollBy({ left: -step, behavior: 'smooth' })
      }
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
          <p className="text-sm font-semibold tracking-wider text-blue-100 mb-3">
            MYSHOP STORE
          </p>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Our Products
          </h1>

          <p className="mt-3 text-blue-100 text-sm sm:text-base">
            Discover our collection of quality products at the best prices.
          </p>
        </div>
      </section>

      {/* Search and Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-5">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_250px] gap-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search product..."
                className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            >
              <option value="all">All Categories</option>

              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between gap-4 mb-7">
          <div>
            <p className="text-sm font-semibold text-blue-600 mb-2">
              EXPLORE OUR STORE
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              All Products
            </h2>
          </div>

          <Link
            to="/"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition whitespace-nowrap"
          >
            ← Back Home
          </Link>
        </div>

        {loading ? (
          <p className="text-center py-12 text-gray-500">
            Loading products...
          </p>
        ) : error ? (
          <p className="text-center py-12 text-red-500">
            {error}
          </p>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-700">
              No products found
            </h2>

            <p className="text-gray-500 mt-2">
              Try another search or category.
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Previous button */}
            <button
              type="button"
              onClick={() => scrollCarousel(-1)}
              aria-label="Previous products"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10
           w-10 h-10 flex items-center justify-center
           rounded-full bg-white shadow-lg
           border border-gray-200
           hover:text-blue-600 hover:border-blue-300
           transition"
            >
              ←
            </button>

            {/* Carousel */}
            <div
              ref={carouselRef}
              className="flex gap-5 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-5 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="carousel-card flex-none w-[250px] sm:w-[280px] snap-start"
                >
                  <ProductCard
                    product={product}
                    onAdd={() => addToCart(product)}
                  />
                </div>
              ))}
            </div>

            {/* Next button */}
            <button
              type="button"
              onClick={() => scrollCarousel(1)}
              aria-label="Next products"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10
           w-10 h-10 flex items-center justify-center
           rounded-full bg-white shadow-lg
           border border-gray-200
           hover:text-blue-600 hover:border-blue-300
           transition"
            >
              →
            </button>
          </div>
        )}
      </main>
    </>
  )
}

export default Products
