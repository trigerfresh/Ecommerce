// src/context/CartContext.js
import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import api from '../api'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const { user } = useAuth()
  const [cart, setCart] = useState([])

  // Fetch cart when user logs in
  useEffect(() => {
    if (user) {
      fetchCart()
    } else {
      // Clear cart if user logs out
      setCart([])
    }
  }, [user])

  // Fetch cart items from backend
  const fetchCart = async () => {
    try {
      const res = await api.get('/cart/get-items') // backend uses token to identify user
      setCart(res.data.items)
    } catch (err) {
      console.error(err)
      setCart([])
    }
  }

  // Add item to cart
  const addToCart = async (product, quantity = 1) => {
    try {
      await api.post('/cart/add-item', {
        productId: product._id,
        quantity,
      })
      fetchCart()
    } catch (err) {
      console.error(err)
    }
  }

  // Remove item from cart
  const removeFromCart = async (cartItemId) => {
    try {
      await api.delete('/cart/remove-item', {
        data: { cartItemId },
      })
      fetchCart()
    } catch (err) {
      console.error(err)
    }
  }

  // Clear cart
  const clearCart = async () => {
    try {
      await api.delete('/cart/clear-cart')
      setCart([])
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
