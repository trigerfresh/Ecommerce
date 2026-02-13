import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api.js'
import { useAuth } from '../context/AuthContext.js'
import Table from 'react-bootstrap/Table'

const EditOrder = () => {
  const { orderId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [order, setOrder] = useState(null)
  const [products, setProducts] = useState([]) // editable products
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/get-user-order/${orderId}`)
        if (res.data.success) {
          const ord = res.data.order
          setOrder(ord)
          // Map to format suitable for editing
          setProducts(
            ord.products.map((item) => ({
              ...item,
              // attach details from productDetails
              details: ord.productDetails.find((p) => p._id === item.productId),
            })),
          )
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [orderId])

  if (loading) return <p className="text-center mt-4">Loading order…</p>
  if (!order) return <p className="text-center mt-4">Order not found</p>

  const handleQuantityChange = (idx, q) => {
    if (q < 1) return
    const updated = [...products]
    updated[idx].quantity = q
    setProducts(updated)
  }

  const handleRemove = (idx) => {
    const updated = products.filter((_, i) => i !== idx)
    setProducts(updated)
  }

  const handleSave = async () => {
    try {
      await api.patch(`/orders/update-pending/${order._id}`, {
        products: products.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      })
      navigate('/my-orders')
    } catch (err) {
      console.error(err)
    }
  }

  const totalAmount = products.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )

  return (
    <div className="container my-4">
      <h3 className="mb-4">Edit Order #{order._id}</h3>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item, idx) => (
            <tr key={idx}>
              <td>{item.details?.title?.shortTitle}</td>
              <td>₹{item.price}</td>
              <td>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(idx, parseInt(e.target.value))
                  }
                  className="form-control w-auto"
                />
              </td>
              <td>₹{item.price * item.quantity}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleRemove(idx)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="text-end mt-3">
        <h5>Total Amount: ₹{totalAmount}</h5>
        <button className="btn btn-primary me-2" onClick={handleSave}>
          Save Changes
        </button>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </div>
    </div>
  )
}

export default EditOrder
