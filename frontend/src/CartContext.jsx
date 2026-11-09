import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  // CART STATE
  const [cart, setCart] = useState(() => {
    // CLEAR CART
function clearCart() {
  setCart([])
  setIsCartOpen(false)
}
    return JSON.parse(localStorage.getItem('cart') || '[]')
  })

  // CART DRAWER STATE
  const [isCartOpen, setIsCartOpen] = useState(false)

  // TOAST STATE
  const [toast, setToast] = useState({
    message: '',
    type: 'success',
  })

  // SHOW TOAST
  function showToast(message, type = 'success') {
    setToast({ message, type })
  }

  // SAVE CART TO LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  // TOTAL CART QUANTITY
  const cartCount = cart.reduce(
    (total, item) => total + Number(item.quantity || 1),
    0
  )

  // TOTAL CART PRICE
  const cartTotal = cart.reduce(
    (total, item) =>
      total + Number(item.price) * Number(item.quantity || 1),
    0
  )

  // ADD PRODUCT
  function addToCart(product) {
    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) => Number(item.id) === Number(product.id)
      )

      if (existingProduct) {
        return currentCart.map((item) =>
          Number(item.id) === Number(product.id)
            ? { ...item, quantity: Number(item.quantity || 1) + 1 }
            : item
        )
      }

      return [...currentCart, { ...product, quantity: 1 }]
    })

    setIsCartOpen(true)
    showToast(`${product.name} added to cart!`, 'success')
  }

  // REMOVE PRODUCT
  function removeFromCart(productId) {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => Number(item.id) !== Number(productId)
      )
    )

    showToast('Product removed from cart!', 'info')
  }

  // UPDATE QUANTITY
  function updateQuantity(productId, quantity) {
    const newQuantity = Math.max(1, Number(quantity) || 1)

    setCart((currentCart) =>
      currentCart.map((item) =>
        Number(item.id) === Number(productId)
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }

  // CLEAR CART
function clearCart() {
  setCart([])
  setIsCartOpen(false)
}

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toast,
        setToast,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}