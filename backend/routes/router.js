import express from 'express'
import {
  getProducts,
  getProductsById,
  addProduct,
  getProductById,
} from '../controllers/product_controller.js'

import {
  addItem,
  removeItem,
  removeAllItem,
  getCartItems,
} from '../controllers/cart_controller.js'

import {
  addItem as addItemWishlist,
  removeItem as removeItemWishlist,
  getWishlistItems,
} from '../controllers/wishlist_controller.js'

import {
  signup,
  loginWithMobileNumber,
  isExistPhone,
  login,
  logout,
  authentication,
  updateUserInfo,
  updateEmail,
} from '../controllers/user_controller.js'

import {
  addNewAddress,
  getAddress,
  deleteAddress,
} from '../controllers/address_controller.js'

import {
  completeOrder,
  getOrderDetails,
} from '../controllers/order_controller.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// ===== User Account routes =====
// public
router.post('/accounts/signup', signup)
router.post('/accounts/login', login)
router.post('/accounts/login-with-phone', loginWithMobileNumber)
router.post('/accounts/check-phone', isExistPhone)

// protected
router.post('/accounts/authentication', auth, authentication)
router.post('/accounts/logout', auth, logout)
router.post('/accounts/update-user-info', auth, updateUserInfo)
router.post('/accounts/update-email', auth, updateEmail)

// ===== Product routes =====
router.get('/products/get-products', getProducts)
router.get('/products/get-products/:categoryName', getProductsById)
router.get('/products/get-product/:id', getProductById)
router.post('/products/add-product', addProduct)

// ===== Cart routes =====
router.post('/cart/add-item', addItem)
router.delete('/cart/remove-item', removeItem)
router.delete('/cart/clear-cart', removeAllItem)
router.get('/cart/get-items/:id', getCartItems)

// ===== Wishlist routes =====
router.post('/wishlist/add-item', addItemWishlist)
router.delete('/wishlist/remove-item', removeItemWishlist)
router.get('/wishlist/get-items/:id', getWishlistItems)

// ===== Address routes =====
router.post('/address/add-address', addNewAddress)
router.get('/address/get-address/:id', getAddress)
router.delete('/address/delete-address/:id', deleteAddress)

// ===== Order routes =====
router.post('/orders/complete-order', completeOrder)
router.post('/orders/get-order-details', getOrderDetails)

export default router
