import { useEffect, useState } from 'react'
import api from '../api.js'

const AdminProductList = () => {
  const [products, setProducts] = useState([])

  const fetchProducts = async () => {
    const res = await api.get('/products/get-Products')
    setProducts(res.data.products)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const deleteProduct = async (id) => {
    await api.delete(`/admin/products/${id}`)
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
              <td>{p.url}</td>
              <td>{p.price.mrp}</td>
              <td>
                <button onClick={() => deleteProduct(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminProductList
