import Product from '../models/productSchema.js'

export const adminAddProduct = async (req, res) => {
  try {
    const product = new Product(req.body)
    await product.save()
    res.status(201).json({ message: 'Product added', product })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const adminUpdateProduct = async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, req.body)
    res.json({ message: 'Product updated' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const adminDeleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.json({ message: 'Product deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
