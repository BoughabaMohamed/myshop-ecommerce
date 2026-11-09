
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../CartContext'

function Cart() {
  const navigate = useNavigate()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const {
    cart,
    cartCount,
    cartTotal,
    removeFromCart,
    updateQuantity,
    clearCart,
    showToast,
  } = useCart()

  // CHECKOUT
  async function checkout() {
    if (cart.length === 0) {
      showToast('Your cart is empty!', 'warning')
      return
    }

    const address = prompt('Please enter your delivery address:')

    if (address === null) return

    if (!address.trim()) {
      showToast('Delivery address is required.', 'warning')
      return
    }

    const orderCart = cart.map((item) => ({
      id: Number(item.id),
      quantity: Number(item.quantity),
    }))

    if (
      orderCart.some(
        (item) =>
          !Number.isInteger(item.id) ||
          item.id <= 0 ||
          !Number.isInteger(item.quantity) ||
          item.quantity <= 0
      )
    ) {
      showToast(
        'Your cart contains invalid product information.',
        'error'
      )
      return
    }

    try {
      setIsCheckingOut(true)

      const response = await fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: address.trim(),
          cart: orderCart,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error while placing order.')
      }

      showToast(
        `Order placed successfully! Order ID: ${data.orderId}`,
        'success'
      )

      clearCart()
      navigate('/products')
    } catch (error) {
      console.error('Checkout error:', error)
      showToast(
        error.message || 'Error while placing order.',
        'error'
      )
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <section className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <h1 className="mb-8 text-3xl font-bold text-slate-900">
          Shopping Cart
        </h1>

        {cart.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="mb-4 text-5xl">🛒</div>

            <h2 className="text-xl font-bold text-slate-900">
              Your cart is empty
            </h2>

            <p className="mt-2 text-gray-500">
              You haven't added any products yet.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

            {/* CART PRODUCTS */}
            <div className="space-y-4 lg:col-span-2">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-sm sm:flex-row sm:items-center"
                >
                  <div className="flex h-28 w-full items-center justify-center rounded-xl bg-gray-50 p-3 sm:w-28">
                    <img
                      src={`http://localhost:3000/uploads/${item.image}`}
                      alt={item.name}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900">
                      {item.name}
                    </h3>

                    <p className="mt-2 font-semibold text-blue-600">
                      {item.price} DH
                    </p>
                  </div>

                  {/* QUANTITY */}
                  <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      className="font-bold text-gray-600"
                    >
                      −
                    </button>

                    <span className="font-semibold">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="font-bold text-gray-600"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:block sm:text-right">
                    <p className="font-bold text-slate-900">
                      {(Number(item.price) * Number(item.quantity)).toFixed(2)} DH
                    </p>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="mt-2 text-sm font-medium text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ORDER SUMMARY */}
            <div className="h-fit rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-bold text-slate-900">
                Order Summary
              </h2>

              <div className="mb-4 flex justify-between text-gray-600">
                <span>Items ({cartCount})</span>
                <span>{cartTotal.toFixed(2)} DH</span>
              </div>

              <div className="mb-6 flex justify-between border-t border-gray-100 pt-4 text-lg font-bold">
                <span>Total</span>
                <span className="text-blue-600">
                  {cartTotal.toFixed(2)} DH
                </span>
              </div>

              <button
                onClick={checkout}
                disabled={isCheckingOut || cart.length === 0}
                className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
              </button>

              <Link
                to="/products"
                className="mt-4 block text-center font-semibold text-gray-600 hover:text-blue-600"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Cart
