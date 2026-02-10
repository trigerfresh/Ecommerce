import { useEffect, useState } from 'react'
import api from '../api.js'

const Dashboard = () => {
  const [products, setProducts] = useState([])

  const fetchProducts = async () => {
    const res = await api.get('/products/get-products')
    setProducts(res.data.products)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const deleteProduct = async (id) => {
    await api.delete(`/admin/products/${id}`)
    setProducts(products.filter((p) => p._id !== id))
  }

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover align-middle">
        <thead className="table-dark">
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Image</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>{p.title?.shortTitle}</td>
              <td>{p.category}</td>
              <td>
                <img
                  src={p.url}
                  alt={p.title?.shortTitle}
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                  }}
                />
              </td>

              <td>{p.price?.mrp ?? 'N/A'}</td>

              <td>
                <button
                  className="btn btn-danger mt-3"
                  onClick={() => deleteProduct(p._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Dashboard
