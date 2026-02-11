import Cart from '../models/cartSchema.js'

/* ================= ADD ITEM ================= */
export const addItem = async (req, res) => {
  try {
    const userId = req.user._id
    const { productId, quantity } = req.body

    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const existing = await Cart.findOne({ userId, productId })

    if (existing) {
      existing.quantity += quantity
      await existing.save()
    } else {
      await Cart.create({
        userId,
        productId,
        quantity,
      })
    }

    res.status(201).json({ message: 'Product added to cart' })
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
    const userId = req.user._id // ✅ fixed (no req.body.userId)

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
