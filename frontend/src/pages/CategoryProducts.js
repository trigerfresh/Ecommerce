import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api'
import { useCart } from '../context/CartContext'

const CategoryProducts = () => {
  const { category } = useParams()
  const { addToCart } = useCart()
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetchCategoryProducts()
  }, [category])

  const fetchCategoryProducts = async () => {
    try {
      const res = await api.get(`/products/category/${category}`)
      setProducts(res.data.products ?? [])
    } catch (err) {
      console.error(err)
      setProducts([])
    }
  }

  const handleAddToCart = (product) => {
    addToCart(product)
    alert('Added to cart')
  }

  return (
    <div className="container my-4">
      <h3 className="mb-4 text-capitalize">{category} Products</h3>
      <div className="row">
        {products.map((product) => (
          <div key={product._id} className="col-md-4 mb-4">
            <div className="card h-100 text-center">
              <img
                src={product.url}
                className="card-img-top"
                alt={product.title?.shortTitle || 'Product'}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body d-flex flex-column">
                <h5>{product.title?.shortTitle}</h5>
                <p className="text-muted small">
                  MRP: ₹{product.price?.mrp ?? 'N/A'} | Discount:{' '}
                  {product.price?.discount ?? 0}%
                </p>
                <div className="mt-auto d-flex justify-content-center gap-2">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                  <Link to={`/product/${product._id}`}>
                    <button className="btn btn-sm btn-outline-primary">
                      View
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryProducts
