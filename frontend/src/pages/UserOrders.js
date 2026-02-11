import { useEffect, useState } from 'react'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import Table from 'react-bootstrap/Table'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'

const UserOrders = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

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
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) fetchUserOrders(currentPage)
  }, [user, currentPage])

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
            <th>Total Amount</th>
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

              <td>
                {order.products.map((item, idx) => {
                  const prod = order.productDetails.find(
                    (p) => p._id.toString() === item.productId.toString(),
                  )

                  return (
                    <div key={idx} className="d-flex align-items-center mb-2">
                      <img
                        src={prod?.url || 'https://via.placeholder.com/50'}
                        alt={prod?.title?.shortTitle || ''}
                        style={{
                          width: '50px',
                          height: '50px',
                          objectFit: 'cover',
                          marginRight: '10px',
                        }}
                      />
                      <div>
                        <div>{prod?.title?.shortTitle}</div>
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
                <Link
                  to={`/order/edit/${order._id}`}
                  className="btn btn-secondary"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-center gap-2 my-3">
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
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

export default UserOrders
