import { useLocation, useNavigate } from 'react-router-dom'
import api from '../api.js'
import { useEffect } from 'react'
import { useCart } from '../context/CartContext.js'

const PaymentSuccess = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { order } = location.state
  const { cart, clearCart } = useCart()

  useEffect(() => {
    if (order) {
      api
        .patch(`/orders/update-payment/${order._id}`, {
          paymentStatus: 'Paid',
        })
        .then(() => {
          // payment completed, clear cart
          clearCart()
        })
        .catch(console.error)
    }
  }, [order])

  return (
    <div className="text-center my-5">
      <h1>Payment Received 🎉</h1>
      <p>Thank you! Your payment is successful.</p>
      <button onClick={() => navigate(`/invoice/${order._id}`)}>
        View Invoice
      </button>
    </div>
  )
}

export default PaymentSuccess
