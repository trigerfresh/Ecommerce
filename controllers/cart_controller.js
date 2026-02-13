import Cart from '../models/cartSchema.js'

/* ================= ADD ITEM ================= */
export const addItem = async (req, res) => {
  try {
    const userId = req.user._id
    const { productId, quantity } = req.body

    if (!productId || quantity === undefined) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const existing = await Cart.findOne({ userId, productId })

    if (existing) {
      existing.quantity += quantity

      // 🚀 Prevent quantity from going below 1
      if (existing.quantity < 1) {
        await Cart.deleteOne({ userId, productId })
      } else {
        await existing.save()
      }
    } else {
      await Cart.create({
        userId,
        productId,
        quantity,
      })
    }

    res.status(200).json({ message: 'Cart updated' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* ================= REMOVE ITEM ================= */
export const removeItem = async (req, res) => {
  try {
    const userId = req.user._id
    const { productId } = req.body

    await Cart.deleteOne({ userId, productId })

    res.status(200).json({ message: 'Product removed' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* ================= CLEAR CART ================= */
export const removeAllItem = async (req, res) => {
  try {
    const userId = req.user._id
    await Cart.deleteMany({ userId })
    res.status(200).json({ message: 'All products removed' })
  } catch (err) {
    res.status(500).json({ message: 'CLEAR_CART_ERROR' })
  }
}

/* ================= GET CART ================= */
export const getCartItems = async (req, res) => {
  try {
    const userId = req.user._id

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
          _id: 1, // keep cart item id
          quantity: 1,
          product: '$productDetails',
        },
      },
    ])

    res.status(200).json({ items: cartItems })
  } catch (err) {
    res.status(500).json({ message: 'GET_CART_ERROR' })
  }
}
