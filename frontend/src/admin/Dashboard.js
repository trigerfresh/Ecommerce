import { useEffect, useState } from 'react'
import api from '../api.js'
import { Modal, Button } from 'react-bootstrap'

const Dashboard = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editItem, setEditItem] = useState(null) // For editing

  const fetchItems = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/all-items')
      setItems(res.data.products || [])
    } catch (err) {
      console.error('Failed to fetch items:', err)
      setError('Failed to fetch items')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const deleteItem = async (id) => {
    try {
      await api.delete(`/admin/products/${id}`)
      setItems(items.filter((p) => p._id !== id))
      alert('Item deleted successfully')
    } catch (err) {
      console.error('Failed to delete item:', err)
      alert('Failed to delete item')
    }
  }

  const saveEdit = async () => {
    try {
      const res = await api.put(`/admin/products/${editItem._id}`, editItem)
      setItems(
        items.map((p) => (p._id === editItem._id ? res.data.product : p)),
      )
      setEditItem(null)
      alert('Item updated successfully')
    } catch (err) {
      console.error('Failed to update item:', err)
      alert('Failed to update item')
    }
  }

  return (
    <div className="container my-4">
      <h3>Admin Dashboard</h3>

      {/* Loading and error states */}
      {loading && <p>Loading items...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Items Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Type</th>
              <th>Title</th>
              <th>Category</th>
              <th>Image</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((p) => (
                <tr key={p._id}>
                  <td>{p.type || 'product'}</td>
                  <td>{p.title?.shortTitle || p.title?.longTitle || '-'}</td>
                  <td>{p.category || p.redirectCategory || '-'}</td>
                  <td>
                    {p.url ? (
                      <img
                        src={p.url}
                        alt={p.title?.shortTitle || 'Item'}
                        style={{
                          width: '80px',
                          height: '80px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                        }}
                      />
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>{p.price?.mrp ?? '-'}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => setEditItem(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteItem(p._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Item Modal */}
      <Modal
        show={!!editItem}
        onHide={() => setEditItem(null)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit {editItem?.type || 'Item'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editItem && (
            <>
              {/* Short Title */}
              <input
                className="form-control mb-2"
                placeholder="Short Title"
                value={editItem.title?.shortTitle || ''}
                onChange={(e) =>
                  setEditItem({
                    ...editItem,
                    title: { ...editItem.title, shortTitle: e.target.value },
                  })
                }
              />

              {/* Long Title */}
              <input
                className="form-control mb-2"
                placeholder="Long Title"
                value={editItem.title?.longTitle || ''}
                onChange={(e) =>
                  setEditItem({
                    ...editItem,
                    title: { ...editItem.title, longTitle: e.target.value },
                  })
                }
              />

              {/* Price */}
              <div className="d-flex gap-2 mb-2">
                <input
                  className="form-control"
                  placeholder="MRP"
                  type="number"
                  value={editItem.price?.mrp || ''}
                  onChange={(e) =>
                    setEditItem({
                      ...editItem,
                      price: { ...editItem.price, mrp: e.target.value },
                    })
                  }
                />
                <input
                  className="form-control"
                  placeholder="Discount"
                  type="number"
                  value={editItem.price?.discount || ''}
                  onChange={(e) =>
                    setEditItem({
                      ...editItem,
                      price: { ...editItem.price, discount: e.target.value },
                    })
                  }
                />
              </div>

              {/* Image */}
              <input
                className="form-control mb-2"
                placeholder="Image URL"
                value={editItem.url || ''}
                onChange={(e) =>
                  setEditItem({ ...editItem, url: e.target.value })
                }
              />

              {/* Category */}
              <input
                className="form-control mb-2"
                placeholder="Category"
                value={editItem.category || editItem.redirectCategory || ''}
                onChange={(e) =>
                  setEditItem({
                    ...editItem,
                    category:
                      editItem.type === 'product' ? e.target.value : undefined,
                    redirectCategory:
                      editItem.type === 'banner' ? e.target.value : undefined,
                  })
                }
              />
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditItem(null)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Dashboard
