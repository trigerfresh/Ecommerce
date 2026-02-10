import Product from '../models/productSchema.js'

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find() // fetch all products
    res.json({ products }) // <-- must wrap in object
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
  const productId = req.params.id
  try {
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json(product) // returns object, not array
  } catch (err) {
    res.status(500).json({ error: err.message })
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
