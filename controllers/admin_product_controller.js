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

// export const allAdminItems = async (req, res) => {
//   try {
//     const products = await Product.find().sort({ createdAt: -1 })
//     res.json({ products })
//     console.log(products)
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// }

export const allAdminItems = async (req, res) => {
  try {
    // Read pagination params or default to page 1, 5 items per page
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const skip = (page - 1) * limit

    const totalItems = await Product.countDocuments({})

    const products = await Product.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const totalPages = Math.ceil(totalItems / limit)

    res.json({
      success: true,
      products,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        limit,
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: err.message })
  }
}
