import { useEffect, useState } from 'react'
import api from '../../api'
import { Table, Spinner, Button, Stack } from 'react-bootstrap'

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
    try {
      await api.patch(`/admin/orders/soft-delete/${id}`)
      fetchOrders(currentPage)
    } catch (error) {
      console.error('Failed to soft delete order', error)
    }
  }

  const handleRestore = async (id) => {
    try {
      await api.patch(`/admin/orders/restore/${id}`)
      fetchOrders(currentPage)
    } catch (error) {
      console.error('Failed to restore order', error)
    }
  }

  const handleCompleteAndInvoice = async (id) => {
    try {
      // Mark order completed
      await api.patch(`/admin/orders/complete/${id}`)

      // Download invoice (GET with blob)
      const res = await api.get(`/admin/invoice/${id}`, {
        responseType: 'blob', // needed for file download :contentReference[oaicite:2]{index=2}
      })

      const blob = new Blob([res.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `invoice_${id}.pdf`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up object URL
      window.URL.revokeObjectURL(url)

      // Refresh list to show updated status
      fetchOrders(currentPage)
    } catch (err) {
      console.error('Failed to complete or download invoice', err)
      alert('Failed to complete order or download invoice')
    }
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
                {order.products.map((item, idx) => (
                  <div key={idx} className="d-flex align-items-center mb-2">
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
                    <span>
                      {item.quantity} ×{' '}
                      {item.productDetails?.title?.shortTitle ||
                        '(Product removed)'}
                    </span>
                  </div>
                ))}
              </td>

              <td>₹{order.totalAmount}</td>
              <td>{order.paymentMode}</td>
              <td>{order.paymentStatus}</td>
              <td>{order.orderStatus}</td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>

              <td>
                {!order.isDeleted ? (
                  <Stack direction="horizontal" gap={2}>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleCompleteAndInvoice(order._id)}
                    >
                      Complete & Invoice
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleSoftDelete(order._id)}
                    >
                      Inactive
                    </Button>
                  </Stack>
                ) : (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleRestore(order._id)}
                  >
                    Restore
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
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        >
          Previous
        </Button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

export default AdminOrders
