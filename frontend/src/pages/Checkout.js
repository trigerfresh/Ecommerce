import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Checkout = () => {
  const { cart, addToCart, removeFromCart, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleIncrease = (item) => {
    addToCart(item.product, 1)
  }

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      addToCart(item.product, -1)
    }
  }

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
                src={item.product?.url}
                alt={item.product?.title?.shortTitle}
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />

              <div className="ms-3 flex-grow-1">
                <h5>{item.product?.title?.shortTitle}</h5>
                <p>Price: ₹{item.product?.price?.mrp}</p>

                <div className="d-flex align-items-center">
                  <button
                    className="btn btn-sm btn-secondary me-2"
                    disabled={item.quantity <= 1}
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

              {/* ✅ Correct remove */}
              <button
                className="btn btn-danger btn-sm"
                onClick={() => removeFromCart(item.product._id)}
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
