import mongoose from 'mongoose'
import Wishlist from '../models/wishlistSchema.js'

export const addItem = async (req, res) => {
  try {
    const wishlist = new Wishlist(req.body)
    await wishlist.save()
    res.status(201).json({ message: 'Wishlist added' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const removeItem = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.body.userId)
    const productId = new mongoose.Types.ObjectId(req.body.productId)

    const result = await Wishlist.deleteOne({ userId, productId })

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Wishlist item not found' })
    }

    res.status(200).json({ message: 'Item removed successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
}

export const getWishlistItems = async (req, res) => {
  try {
    // Convert userId param to ObjectId
    const uId = new mongoose.Types.ObjectId(req.params.id)

    // Find wishlist items for this user and populate product details
    const items = await Wishlist.aggregate([
      {
        $match: { userId: uId }, // matches ObjectId
      },
      {
        $lookup: {
          from: 'products', // must match your collection name exactly
          localField: 'productId', // field in wishlist
          foreignField: '_id', // field in products
          as: 'productDetails',
        },
      },
      {
        $unwind: {
          path: '$productDetails',
          preserveNullAndEmptyArrays: true, // still return wishlist even if product is missing
        },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          productId: 1,
          createdAt: 1,
          updatedAt: 1,
          productDetails: 1,
        },
      },
    ])

    res.status(200).json({ items })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
}
