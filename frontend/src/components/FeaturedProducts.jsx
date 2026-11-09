
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from './ProductCard'
import { useCart } from '../CartContext'

function FeaturedProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const { addToCart } = useCart()
  const carouselRef = useRef(null)

  useEffect(() => {
    fetch('http://localhost:3000/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load products')
        }
        return response.json()
      })
      .then((data) => setProducts(data))
      .catch((error) => {
        console.error(error)
        setError('Unable to load products.')
      })
      .finally(() => setLoading(false))
  }, [])

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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
      {/* TITLE */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-blue-600 font-semibold text-sm mb-2">
            OUR PRODUCTS
          </p>

          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Featured Products
          </h2>

          <p className="text-gray-500 mt-2">
            Check out some of our popular products.
          </p>
        </div>

        <Link
          to="/products"
          className="text-blue-600 font-semibold hover:text-blue-700 transition"
        >
          View All →
        </Link>
      </div>

      {/* PRODUCTS CAROUSEL */}
      <div className="relative">
        {loading ? (
          <p className="text-center py-12 text-gray-500">
            Loading products...
          </p>
        ) : error ? (
          <p className="text-center py-12 text-red-500">
            {error}
          </p>
        ) : products.length === 0 ? (
          <p className="text-center py-12 text-gray-500">
            No products found.
          </p>
        ) : (
          <>
            <button
              type="button"
              onClick={() => scrollCarousel(-1)}
              aria-label="Previous products"
              className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 text-gray-700 hover:bg-blue-600 hover:text-white transition duration-300"
            >
              &#10094;
            </button>

            <div
              ref={carouselRef}
              className="flex gap-5 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-5 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {products.slice(0, 8).map((product) => (
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

            <button
              type="button"
              onClick={() => scrollCarousel(1)}
              aria-label="Next products"
              className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 text-gray-700 hover:bg-blue-600 hover:text-white transition duration-300"
            >
              &#10095;
            </button>
          </>
        )}
      </div>
    </section>
  )
}

export default FeaturedProducts
