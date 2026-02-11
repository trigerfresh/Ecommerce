import Product from '../models/productSchema.js'

export const getProducts = async (req, res) => {
  try {
    const allItems = await Product.find()
    res.json({ products: allItems })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const banner = async (req, res) => {
  try {
    const banners = await Product.find({
      type: 'banner',
    }).sort({ createdAt: -1 })

    res.json({ banners })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getProductsById = async (req, res) => {
  const cName = req.params.categoryName
  try {
    if (cName === 'top deals') {
      const result = await Product.find({}).skip(15)
      res.json(result)
    } else if (cName === 'top offers') {
      const result = await Product.find({}).skip(5)
      res.json(result)
    } else {
      const result = await Product.find({ category: cName })
      res.json(result)
    }
  } catch (err) {
    res.status(500).json({ error: err })
  }
}

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json(product)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category

    const products = await Product.find({
      type: 'product',
      category: category,
      isActive: true,
    }).sort({ createdAt: -1 })

    res.json({ products })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const addProduct = async (req, res) => {
  try {
    const product = new Product(req.body)
    await product.save()
    res.status(201).json({
      message: 'Product added successfully',
      product,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
}
