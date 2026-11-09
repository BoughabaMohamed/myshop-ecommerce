
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">

          {/* HERO TEXT */}
          <div className="text-center lg:text-left">

            <span className="mb-5 inline-block rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
              ✨ New Collection
            </span>

            <h1 className="mb-6 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Discover the{' '}
              <span className="text-blue-600">
                Best Products
              </span>{' '}
              for You
            </h1>

            <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-gray-500 sm:text-lg lg:mx-0">
              Discover the latest Lenovo laptops,
              iPhone, Samsung Galaxy, headphones
              and more at the best prices.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">

              <Link
                to="/products"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-200 transition duration-300 hover:bg-blue-700"
              >
                Shop Now →
              </Link>

              <Link
                to="/products"
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-7 py-3.5 font-semibold transition hover:border-blue-600 hover:text-blue-600"
              >
                View Products
              </Link>

            </div>
          </div>

          {/* HERO IMAGE */}
          <div className="relative">
            <div className="flex min-h-[300px] items-center justify-center rounded-3xl bg-blue-50 p-6 sm:min-h-[400px] sm:p-10">

              <img
                src="/images/banner.jpg"
                alt="MyShop products"
                className="max-h-[400px] w-full rounded-2xl object-cover"
              />

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Hero
