// src/pages/Checkout.js
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Checkout = () => {
  const { cart, addToCart, removeFromCart, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  // Increase quantity
  const handleIncrease = (item) => {
    addToCart(item.product, 1) // always increase by 1
  }

  // Decrease quantity
  const handleDecrease = (item) => {
    if (item.quantity === 1) {
      removeFromCart(item._id)
    } else {
      addToCart(item.product, -1) // decrease by 1
    }
  }

  // Calculate total price
  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.product?.price?.mrp || 0) * item.quantity,
    0,
  )

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { redirectTo: '/checkout' } })
    } else {
      navigate('/address')
    }
  }

  if (!cart.length)
    return <p className="text-center mt-4">Your cart is empty</p>

  return (
    <div className="container my-4">
      <h2 className="mb-4 text-center">Your Cart</h2>
      <div className="row">
        {cart.map((item) => (
          <div key={item._id} className="col-md-6 mb-3">
            <div className="card p-2 d-flex flex-row align-items-center">
              <img
                src={item.product?.url || 'https://via.placeholder.com/100'}
                alt={item.product?.title?.shortTitle || 'Product'}
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
              <div className="ms-3 flex-grow-1">
                <h5>{item.product?.title?.shortTitle || 'Product Name'}</h5>
                <p className="mb-1">Price: ₹{item.product?.price?.mrp || 0}</p>
                <div className="d-flex align-items-center">
                  <button
                    className="btn btn-sm btn-secondary me-2"
                    onClick={() => handleDecrease(item)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="btn btn-sm btn-secondary ms-2"
                    onClick={() => handleIncrease(item)}
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => removeFromCart(item._id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="text-end mt-4">
        <h4>Total: ₹{totalPrice}</h4>
        <button className="btn btn-primary" onClick={handleCheckout}>
          Proceed to Checkout
        </button>
        <button className="btn btn-secondary ms-2" onClick={clearCart}>
          Clear Cart
        </button>
      </div>
    </div>
  )
}

export default Checkout
