import mongoose from 'mongoose'

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Use Types.ObjectId
      required: true,
      ref: 'User',
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
  },
  { timestamps: true }, // plural, correct
)

const Wishlist = mongoose.model('Wishlist', wishlistSchema) // ✅ model, not Schema
export default Wishlist
