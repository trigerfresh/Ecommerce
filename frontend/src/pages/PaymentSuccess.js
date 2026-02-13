import { useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useEffect } from 'react'
import api from '../api'

const PaymentSuccess = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { clearCart } = useCart()
  const { order } = location.state

  useEffect(() => {
    if (!order) navigate('/')
  }, [order, navigate])

  return (
    <div className="text-center my-5">
      <h1>Payment Successful 🎉</h1>
      <p>Your order ID: {order._id}</p>
      <button
        className="btn btn-primary"
        onClick={() => navigate(`/invoice/${order._id}`)}
      >
        Download Invoice
      </button>
    </div>
  )
}

export default PaymentSuccess
