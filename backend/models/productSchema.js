import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['product', 'banner'],
      default: 'product',
    },

    title: {
      shortTitle: String,
      longTitle: String,
    },

    price: {
      mrp: Number,
      cost: Number,
      discount: Number,
    },

    qty: Number,

    category: {
      type: String,
      enum: ['electronics', 'furniture'],
    },

    redirectCategory: {
      type: String,
      enum: ['electronics', 'furniture'],
    },

    discount: String,
    tagline: String,

    url: String,
    detailUrl: String,

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
)

const Product = mongoose.model('Product', productSchema)
export default Product
