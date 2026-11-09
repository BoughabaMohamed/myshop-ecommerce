import { Link } from 'react-router-dom'

function ProductCard({ product, onAdd }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* PRODUCT IMAGE */}
<Link
  to={`/product/${product.id}`}
  className="flex h-56 items-center justify-center overflow-hidden bg-gray-50 p-5"
>
  <img
    src={`http://localhost:3000/uploads/${product.image}`}
    alt={product.name}
    className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
  />
</Link>

      {/* PRODUCT INFO */}
      <div className="p-5">

        <p className="mb-2 text-sm text-blue-600">
          {product.category}
        </p>

        <Link
  to={`/product/${product.id}`}
  className="mb-3 block line-clamp-1 text-lg font-semibold text-slate-900 transition hover:text-blue-600"
>
  {product.name}
</Link>
          

        <div className="mb-4 flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">
            {product.price} DH
          </span>

          <span className="text-sm text-gray-500">
            Stock: {product.stock}
          </span>
        </div>

        <button
          onClick={onAdd}
          disabled={Number(product.stock) <= 0}
          className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {Number(product.stock) <= 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>

      </div>
    </div>
  )
}

export default ProductCard