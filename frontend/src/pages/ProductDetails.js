import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api.js'
import { useAuth } from '../context/AuthContext.js'
import { useCart } from '../context/CartContext.js'

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/get-product/${id}`)
        setProduct({
          ...res.data,
          _id: res.data._id || res.data.id,
          name:
            typeof res.data.title === 'string'
              ? res.data.title
              : res.data.title?.shortTitle ||
                res.data.title?.longTitle ||
                'No Name',
        })
      } catch (err) {
        console.error(err)
        setError('Failed to load product')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login', { state: { redirectTo: `/product/${id}` } })
      return
    }
    addToCart(product)
    navigate('/checkout')
  }

  if (loading) return <p className="text-center mt-4">Loading product...</p>
  if (error) return <div className="alert alert-danger">{error}</div>
  if (!product) return <p className="text-center mt-4">Product not found</p>

  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-md-5 mb-3">
          <img
            src={product.url || 'https://via.placeholder.com/400'}
            alt={product.name}
            className="img-fluid rounded"
          />
        </div>
        <div className="col-md-7">
          <h2>{product.name}</h2>
          <p className="text-muted">
            {product.tagline || 'No description available'}
          </p>

          {product.price && (
            <>
              <p className="mb-1 text-muted">
                MRP: ₹{product.price.mrp ?? 'N/A'}
              </p>
              <p className="text-success">You save ₹{product.price.discount}</p>
            </>
          )}

          <button className="btn btn-primary mt-3" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
