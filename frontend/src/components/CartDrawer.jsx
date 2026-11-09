import { useCart } from '../CartContext'

function CartDrawer() {
  const {
    cart,
    cartCount,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
  } = useCart()

  if (!isCartOpen) return null

  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 z-[60] bg-black/50"
      />

      {/* DRAWER */}
      <aside className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-white shadow-2xl">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Your Cart
            </h2>

            <p className="text-sm text-gray-500">
              {cartCount} items
            </p>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-xl hover:bg-gray-200"
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        {/* CART ITEMS */}
        <div className="flex-1 overflow-y-auto p-5">

          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <span className="mb-4 text-5xl">🛒</span>

              <h3 className="text-lg font-semibold text-slate-900">
                Your cart is empty
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Add some products to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 border-b border-gray-100 pb-5"
                >

                  {/* IMAGE */}
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-gray-50 p-2">
                    <img
                      src={`http://localhost:3000/uploads/${item.image}`}
                      alt={item.name}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  {/* DETAILS */}
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-slate-900">
                      {item.name}
                    </h3>

                    <p className="mt-1 font-bold text-blue-600">
                      {item.price} DH
                    </p>

                    {/* QUANTITY */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-1">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="font-bold text-gray-600"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>

                        <span className="text-sm font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="font-bold text-gray-600"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-sm font-medium text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        {cart.length > 0 && (
          <div className="border-t border-gray-100 p-5">

            <div className="mb-4 flex items-center justify-between">
              <span className="font-semibold text-gray-600">
                Subtotal
              </span>

              <span className="text-xl font-bold text-slate-900">
                {cartTotal.toFixed(2)} DH
              </span>
            </div>

            <a
              href="/cart"
              onClick={() => setIsCartOpen(false)}
              className="block w-full rounded-xl bg-blue-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
            >
              View Cart & Checkout
            </a>

            <button
              onClick={() => setIsCartOpen(false)}
              className="mt-3 w-full rounded-xl border border-gray-200 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
  )
}

export default CartDrawer