import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import api from '../api'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const { user } = useAuth()
  const [cart, setCart] = useState([])

  useEffect(() => {
    if (user) {
      fetchCart()
    } else {
      setCart([])
    }
  }, [user])

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart/get-items')
      setCart(res.data.items)
    } catch (err) {
      console.error(err)
      setCart([])
    }
  }

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

  // ✅ FIXED
  const removeFromCart = async (productId) => {
    try {
      await api.delete('/cart/remove-item', {
        data: { productId },
      })
      fetchCart()
    } catch (err) {
      console.error(err)
    }
  }

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
