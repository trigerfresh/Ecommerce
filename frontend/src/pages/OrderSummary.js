import { useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const OrderSummary = () => {
  const { cart } = useCart()
  const location = useLocation()
  const navigate = useNavigate()
  const address = location.state?.address

  // If no address is passed, redirect to address page
  if (!address) {
    navigate('/address')
    return null
  }

  const totalAmount = cart.reduce(
    (sum, item) => sum + (item.price?.mrp || 0) * item.quantity,
    0,
  )

  return (
    <div className="container my-4">
      <h3>Order Summary</h3>

      {address && (
        <div className="border p-3 mb-4">
          <h5>Delivery Address</h5>
          <p>
            <strong>{address.name}</strong> ({address.number})<br />
            {address.houseAddress}, {address.locality}, {address.city} -{' '}
            {address.pincode}
            <br />
            {address.state} | {address.addressType}
            <br />
            {address.landmark && `Landmark: ${address.landmark}`}
            <br />
            {address.alternateNumber && `Alt: ${address.alternateNumber}`}
          </p>
        </div>
      )}

      <h5>Cart Items</h5>
      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item._id}>
                <td className="d-flex align-items-center">
                  <img
                    src={item.url || 'https://via.placeholder.com/60'}
                    alt={item.name}
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'cover',
                      marginRight: '10px',
                      borderRadius: '5px',
                    }}
                  />
                </td>
                <td>
                  <span>{item.name}</span>
                </td>
                <td>{item.quantity}</td>
                <td>₹{item.price?.mrp || 0}</td>
                <td>₹{(item.price?.mrp || 0) * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h5>Total Amount: ₹{totalAmount}</h5>

      <button className="btn btn-success mt-3">Proceed to Payment</button>
    </div>
  )
}

export default OrderSummary
