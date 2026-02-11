import Product from '../models/productSchema.js'

export const adminAddProduct = async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      type: req.body.type || 'product', // default type is 'product', can also be 'banner'
    })

    await product.save()
    res.status(201).json({ message: 'Product added', product })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const adminUpdateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
    if (!updated) return res.status(404).json({ message: 'Item not found' })
    res.json({ message: 'Product updated', product: updated })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const adminDeleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ message: 'Item not found' })
    res.json({ message: 'Product deleted', product: deleted })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const allAdminItems = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 })
    res.json({ products })
    console.log(products)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
