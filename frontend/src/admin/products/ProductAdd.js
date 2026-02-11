import { useState } from 'react'
import api from '../../api.js'

const ProductAdd = () => {
  const [form, setForm] = useState({
    type: 'product',
    title: { shortTitle: '', longTitle: '' },
    price: { mrp: '', cost: '', discount: '' },
    category: 'electronics',
    redirectCategory: 'electronics',
    tagline: '',
    url: '',
  })

  const submit = async (e) => {
    e.preventDefault()
    await api.post('/admin/products', form)
    alert('Added successfully')
  }

  return (
    <div className="d-flex justify-content-center align-items-center">
      <form
        onSubmit={submit}
        className="p-4 border rounded shadow-sm"
        style={{ maxWidth: '400px', width: '100%' }}
      >
        <div className="mb-2">
          <select onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="product">Product</option>
            <option value="banner">Banner</option>
          </select>
        </div>
        <div className="mb-2">
          <input
            placeholder="Short Title"
            onChange={(e) =>
              setForm({
                ...form,
                title: { ...form.title, shortTitle: e.target.value },
              })
            }
          />
        </div>
        <div className="mb-2">
          <input
            placeholder="Image URL"
            onChange={(e) => setForm({ ...form, url: e.target.value })}
          />
        </div>
        <div className="mb-2">
          <input
            placeholder="Price"
            type="number"
            onChange={(e) => {
              setForm({
                ...form,
                price: { ...form.price, mrp: e.target.value },
              })
            }}
          />
        </div>
        <div className="mb-2">
          <input
            placeholder="Discount"
            onChange={(e) => {
              setForm({
                ...form,
                price: { ...form.price, discount: e.target.value },
              })
            }}
          />
        </div>
        <div className="mb-2">
          <input
            placeholder="Description"
            type="text"
            onChange={(e) => {
              setForm({
                ...form,
                tagline: e.target.value,
              })
            }}
          />
        </div>
        {form.type === 'product' && (
          <>
            <div className="mb-2">
              <input
                placeholder="Long Title"
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: { ...form.title, longTitle: e.currentTarget.value },
                  })
                }
              />
            </div>

            {/* <div className="mb-2">
              <input
                placeholder="Price"
                type="number"
                onChange={(e) => {
                  setForm({
                    ...form,
                    price: { ...form.price, mrp: e.target.value },
                  })
                }}
              />
            </div> */}

            {/* <div className="mb-2">
              <input
                placeholder="Description"
                type="text"
                onChange={(e) => {
                  setForm({
                    ...form,
                    tagline: e.target.value,
                  })
                }}
              />
            </div> */}

            <div className="mb-2">
              <input
                placeholder="Cost"
                onChange={(e) => {
                  setForm({
                    ...form,
                    price: { ...form.price, cost: e.target.value },
                  })
                }}
              />
            </div>

            {/* <div className="mb-2">
              <input
                placeholder="Discount"
                onChange={(e) => {
                  setForm({
                    ...form,
                    price: { ...form.price, discount: e.target.value },
                  })
                }}
              />
            </div> */}

            <div className="mb-2">
              <select
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="electronics">Electronics</option>
                <option value="furniture">Furniture</option>
              </select>
            </div>
          </>
        )}
        {form.type === 'banner' && (
          <div className="mb-2">
            <select
              onChange={(e) =>
                setForm({ ...form, redirectCategory: e.target.value })
              }
            >
              <option value="electronics">Electronics</option>
              <option value="furniture">Furniture</option>
            </select>
          </div>
        )}{' '}
        <button
          className="btn btn-success btn-sm"
          style={{ marginLeft: '50px' }}
        >
          Add
        </button>
      </form>
    </div>
  )
}

export default ProductAdd
