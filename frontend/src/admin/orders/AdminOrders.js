import { useEffect, useState } from 'react'
import api from '../../api'
import { Table, Spinner, Button } from 'react-bootstrap'

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchOrders = async (page = 1) => {
    setLoading(true)
    try {
      const res = await api.get(`/admin/orders?page=${page}&limit=3`)
      if (res.data.success) {
        setOrders(res.data.orders)
        setCurrentPage(res.data.pagination.currentPage)
        setTotalPages(res.data.pagination.totalPages)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders(currentPage)
  }, [currentPage])

  const handleSoftDelete = async (id) => {
    await api.patch(`/admin/orders/soft-delete/${id}`)
    fetchOrders(currentPage)
  }

  const handleRestore = async (id) => {
    await api.patch(`/admin/orders/restore/${id}`)
    fetchOrders(currentPage)
  }

  if (loading)
    return (
      <div className="text-center my-4">
        <Spinner animation="border" />
      </div>
    )

  return (
    <div>
      <h4 className="mb-3">All User Orders</h4>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>User</th>
            <th>Products</th>
            <th>Total Amount</th>
            <th>Payment Mode</th>
            <th>Payment Status</th>
            <th>Order Status</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order._id}
              className={order.isDeleted ? 'table-secondary' : ''}
            >
              <td>
                {order.userDetails?.fname} {order.userDetails?.lname}
              </td>

              <td>
                {order.products.map((item, i) => (
                  <div key={i}>
                    <img
                      src={
                        item.productDetails?.url ||
                        'https://via.placeholder.com/50'
                      }
                      alt={item.productDetails?.title?.shortTitle || ''}
                      style={{
                        width: '50px',
                        height: '50px',
                        objectFit: 'cover',
                        marginRight: '10px',
                      }}
                    />
                    {item.quantity} ×{' '}
                    {item.productDetails?.title?.shortTitle ||
                      '(Product removed)'}
                  </div>
                ))}
              </td>

              <td>₹{order.totalAmount}</td>
              <td>{order.paymentMode}</td>
              <td>{order.paymentStatus}</td>
              <td>{order.orderStatus}</td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>

              <td>
                {order.isDeleted ? (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleRestore(order._id)}
                  >
                    Restore
                  </Button>
                ) : (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleSoftDelete(order._id)}
                  >
                    Inactive
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-center gap-3 my-3">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Previous
        </Button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

export default AdminOrders
