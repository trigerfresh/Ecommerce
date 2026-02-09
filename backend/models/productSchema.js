import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  title: { shortTitle: String, longTitle: String },
  price: { mrp: Number, cost: Number, discount: Number },
  qty: Number,
  category: String,
  discount: String,
  tagline: String,
  url: String,
  detailUrl: String,
})

const Product = mongoose.model('Product', productSchema)
export default Product
