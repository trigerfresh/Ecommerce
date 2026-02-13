import { useEffect, useState } from 'react'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Table from 'react-bootstrap/Table'
import { Button } from 'react-bootstrap'

const UserOrders = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // ================= FETCH USER ORDERS =================
  const fetchUserOrders = async (page = 1) => {
    setLoading(true)
    try {
      const res = await api.get(`/orders/user-orders?page=${page}&limit=3`)

      if (res.data.success) {
        setOrders(res.data.orders)
        setTotalPages(res.data.pagination.totalPages)
        setCurrentPage(res.data.pagination.currentPage)
      }
    } catch (err) {
      console.error('Error fetching user orders:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchUserOrders(currentPage)
    }
  }, [user, currentPage])

  // ================= EDIT ORDER =================
  // Load order items into cart and redirect to checkout
  const handleEditOrder = async (orderId) => {
    try {
      await api.post(`/orders/load-to-cart/${orderId}`)
      navigate('/checkout') // Go to cart page to edit items
    } catch (err) {
      console.error('Failed to load order into cart:', err)
      alert('Unable to edit order')
    }
  }

  // ================= CONTINUE ORDER =================
  const handleContinueOrder = (orderId) => {
    navigate('/address', { state: { orderId } })
  }

  // ================= DOWNLOAD INVOICE =================
  const handleDownloadInvoice = async (orderId) => {
    try {
      const res = await api.get(`/orders/invoice/${orderId}`, {
        responseType: 'blob',
      })

      const blob = new Blob([res.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = `invoice_${orderId}.pdf`
      document.body.appendChild(link)
      link.click()

      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download invoice', error)
      alert('Failed to download invoice')
    }
  }

  if (loading) return <p className="text-center my-4">Loading orders...</p>

  if (!orders.length)
    return (
      <p className="text-center my-4">You have not placed any orders yet.</p>
    )

  return (
    <div className="container my-4">
      <h3 className="mb-3">My Orders</h3>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Products</th>
            <th>Total</th>
            <th>Payment Mode</th>
            <th>Payment Status</th>
            <th>Order Status</th>
            <th>Placed On</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>

              {/* PRODUCTS */}
              <td>
                {order.products.map((item) => {
                  const prod = order.productDetails.find(
                    (p) => p._id.toString() === item.productId.toString(),
                  )

                  return (
                    <div
                      key={item.productId}
                      className="d-flex align-items-center mb-2"
                    >
                      <img
                        src={prod?.url || 'https://via.placeholder.com/50'}
                        alt={prod?.title?.shortTitle}
                        style={{
                          width: '50px',
                          height: '50px',
                          objectFit: 'cover',
                          marginRight: '10px',
                        }}
                      />
                      <div>
                        <div>{prod?.title?.shortTitle || 'Product'}</div>
                        <small>Qty: {item.quantity}</small>
                      </div>
                    </div>
                  )
                })}
              </td>

              <td>₹{order.totalAmount}</td>
              <td>{order.paymentMode}</td>
              <td>{order.paymentStatus}</td>
              <td>{order.orderStatus}</td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>

              <td>
                {/* ✅ SHOW Edit + Continue for Pending */}
                {order.paymentStatus === 'Pending' &&
                  order.orderStatus === 'Pending' && (
                    <div className="d-flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEditOrder(order._id)}
                      >
                        Edit
                      </Button>

                      {/* <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleContinueOrder(order._id)}
                      >
                        Continue
                      </Button> */}
                    </div>
                  )}

                {/* ✅ SHOW Invoice for Completed */}
                {(order.paymentStatus === 'Paid' ||
                  order.orderStatus === 'Completed') && (
                  <Button
                    variant="info"
                    size="sm"
                    onClick={() => handleDownloadInvoice(order._id)}
                  >
                    Invoice
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* PAGINATION */}
      <div className="d-flex justify-content-center gap-3 my-3">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </Button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <Button
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        >
          Next
        </Button>
      </div>
    </div>
  )
}

export default UserOrders
