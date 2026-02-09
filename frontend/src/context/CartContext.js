// src/context/CartContext.js
import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const { user } = useAuth()
  const [cart, setCart] = useState([])

  // Load cart from localStorage for guests
  useEffect(() => {
    const storedCart = localStorage.getItem('cart')
    if (storedCart) setCart(JSON.parse(storedCart))
  }, [])

  // Save cart for guests whenever cart changes
  useEffect(() => {
    // ✅ stringify to ensure dependency comparison works correctly
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [JSON.stringify(cart)]) // <-- safer than [cart]

  const addToCart = (product) => {
    if (!product?._id) return
    const exists = cart.find((item) => item._id === product._id)
    if (exists) {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      )
    } else {
      setCart((prevCart) => [...prevCart, { ...product, quantity: 1 }])
    }
  }

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId))
  }

  const clearCart = () => setCart([])

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
