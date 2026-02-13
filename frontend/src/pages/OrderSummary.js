import { useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import api from '../api'

const OrderSummary = () => {
  const { cart, clearCart } = useCart()
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const address = location.state?.address

  if (!address) {
    navigate('/address')
    return null
  }

  const totalAmount = cart.reduce(
    (sum, item) => sum + (item.product?.price?.mrp || 0) * item.quantity,
    0,
  )

  const handleProceedToPayment = async () => {
    try {
      const res = await api.post('/orders/create-order', {
        userId: user._id,
        products: cart.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
          price: item.product.price.mrp,
        })),
        addressId: address._id,
        totalAmount,
        paymentMode: 'Online',
      })

      console.log('Order created:', res.data.order)

      // simulate payment success for now
      const paymentRes = await api.get(`/update-payment/${res.data.order._id}`)
      console.log('Payment updated:', paymentRes.data.order)

      clearCart() // empty cart
      navigate(`/invoice/${res.data.order._id}`) // go to invoice page
    } catch (err) {
      console.error('Payment error:', err)
    }
  }

  return (
    <div className="container my-4">
      <h3 className="mb-3">Order Summary</h3>

      {/* Delivery Address */}
      <div className="mb-4">
        <h5>Delivery Address</h5>
        <table className="table table-bordered">
          <tbody>
            <tr>
              <th>Full Name</th>
              <td>{address.name}</td>
            </tr>
            <tr>
              <th>Phone</th>
              <td>{address.number}</td>
            </tr>
            <tr>
              <th>Address</th>
              <td>{address.houseAddress}</td>
            </tr>
            <tr>
              <th>Address Type</th>
              <td>{address.addressType}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Cart Items */}
      <div className="mb-4">
        <h5>Cart Items</h5>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item._id}>
                <td>
                  <img
                    src={item.product?.url || 'https://via.placeholder.com/60'}
                    alt={item?.title?.shortTitle}
                    style={{ width: 60, height: 60, objectFit: 'cover' }}
                  />
                </td>
                <td>{item.product?.title?.shortTitle}</td>
                <td>{item.quantity}</td>
                <td>₹{item.product?.price?.mrp}</td>
                <td>₹{item.product?.price?.mrp * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-end">
        <h5>Total Amount: ₹{totalAmount}</h5>
        <button
          className="btn btn-success mt-3"
          onClick={handleProceedToPayment}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  )
}

export default OrderSummary
