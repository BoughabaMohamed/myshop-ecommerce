
import { Link } from 'react-router-dom'

function CTA() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 pb-16">
      <div
        className="max-w-7xl mx-auto
        bg-gradient-to-r
        from-blue-600 to-cyan-500
        rounded-3xl
        px-6 sm:px-10 lg:px-16
        py-12
        text-white
        text-center"
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Ready to Start Shopping?
        </h2>

        <p className="text-blue-50 max-w-2xl mx-auto mb-7">
          Find the products you need
          and enjoy a simple shopping experience.
        </p>

        <Link
          to="/products"
          className="inline-block
          bg-white text-blue-600
          hover:bg-gray-100
          font-bold
          px-7 py-3.5
          rounded-xl
          transition"
        >
          Explore Products
        </Link>
      </div>
    </section>
  )
}

export default CTA
