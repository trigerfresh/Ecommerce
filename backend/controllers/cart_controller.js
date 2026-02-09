import mongoose from 'mongoose'
import Cart from '../models/cartSchema.js'

// Add item to cart
// Add item to cart
export const addItem = async (req, res) => {
  try {
    console.log('Incoming request body:', req.body) // <-- add this

    const { userId, productId, quantity } = req.body

    if (!userId || !productId || !quantity) {
      console.log('Missing required fields', { userId, productId, quantity }) // <-- add this
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const uid = new mongoose.Types.ObjectId(userId)
    const pid = new mongoose.Types.ObjectId(productId)

    // Check if item already exists
    const existing = await Cart.findOne({ userId: uid, productId: pid })
    if (existing) {
      existing.quantity += quantity
      await existing.save()
      console.log('Updated existing cart item:', {
        userId,
        productId,
        quantity,
      }) // <-- add this
    } else {
      const cart = new Cart({ userId: uid, productId: pid, quantity })
      await cart.save()
      console.log('Added new cart item:', { userId, productId, quantity }) // <-- add this
    }

    res.status(201).json({ message: 'Product added' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
}

// Remove one item completely
export const removeItem = async (req, res) => {
  try {
    const { userId, productId } = req.body
    if (!userId || !productId)
      return res.status(400).json({ message: 'Missing required fields' })

    const uid = new mongoose.Types.ObjectId(userId)
    const pid = new mongoose.Types.ObjectId(productId)
    await Cart.deleteOne({ userId: uid, productId: pid })

    res.status(200).json({ message: 'Product removed' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
}

// Remove all items
export const removeAllItem = async (req, res) => {
  try {
    const { userId } = req.body
    if (!userId)
      return res.status(400).json({ message: 'Missing required fields' })

    const uid = new mongoose.Types.ObjectId(userId)
    await Cart.deleteMany({ userId: uid })
    res.status(200).json({ message: 'All products removed' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'CLEAR_CART_ERROR' })
  }
}

// Get cart items
export const getCartItems = async (req, res) => {
  try {
    const { id } = req.params
    if (!id) return res.status(400).json({ message: 'Missing user id' })

    const userId = new mongoose.Types.ObjectId(id)
    const cartItems = await Cart.aggregate([
      { $match: { userId } },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      { $unwind: '$productDetails' },
      {
        $project: {
          _id: 1,
          userId: 1,
          quantity: 1,
          product: '$productDetails',
        },
      },
    ])

    res.json({ items: cartItems })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'GET_CART_ERROR' })
  }
}
