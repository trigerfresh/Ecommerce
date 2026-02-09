import { useEffect, useState } from 'react'
import api from '../api.js'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'

const Home = () => {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const res = await api.get('/products/get-products')
        console.log('Products from API:', res.data)
        // Normalize _id and ensure title is accessible
        const normalized = res.data.products.map((p) => ({
          ...p,
          _id: p._id || p.id,
          name:
            typeof p.title === 'string'
              ? p.title
              : p.title?.shortTitle || p.title?.longTitle || 'No Name',
        }))
        setProducts(normalized)
      } catch (err) {
        console.error(err)
        setError('Failed to load products')
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const handleAddToCart = (product) => {
    if (!product || !product._id) {
      alert('Invalid product!')
      console.error('Cannot add undefined product to cart:', product)
      return
    }
    addToCart(product)
    alert(`${product.name} added to cart!`)
  }

  return (
    <div className="container my-4">
      {user && (
        <div className="alert alert-success text-center">
          Welcome back, <strong>{user.fname}</strong>!
        </div>
      )}

      {/* <h2 className="mb-4 text-center">Our Products</h2> */}

      {loading && <p className="text-center">Loading products...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {products.map((product) => (
          <div key={product._id} className="col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="card h-100">
              <img
                src={product.url || 'https://via.placeholder.com/150'}
                className="card-img-top"
                alt={product.name}
                style={{ height: '150px', objectFit: 'cover' }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text text-truncate">
                  {product.tagline || 'No description'}
                </p>

                {product.price && (
                  <p className="mb-1 text-muted small">
                    <span className="fw-bold">
                      {' '}
                      MRP: ₹{product.price.mrp ?? 'N/A'}{' '}
                    </span>
                    | Discount: {product.price.discount ?? 0}
                  </p>
                )}

                <div className="mt-auto d-flex justify-content-between align-items-center">
                  <span className="fw-bold">
                    {/* ₹{product.price?.cost ?? 'N/A'} */}
                  </span>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>

                  <Link to={`/product/${product._id}`}>
                    <button className="btn btn-sm btn-primary">View</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && products.length === 0 && (
        <p className="text-center">No products available</p>
      )}
    </div>
  )
}

export default Home
