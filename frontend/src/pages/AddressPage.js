import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.js'
import api from '../api.js'

const AddressPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [addresses, setAddresses] = useState([]) // Saved addresses
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [form, setForm] = useState({
    name: '',
    number: '',
    pincode: '',
    locality: '',
    houseAddress: '',
    city: '',
    state: '',
    addressType: 'Home',
    landmark: '',
    alternateNumber: '',
  })

  // Fetch saved addresses
  useEffect(() => {
    if (!user?._id) return
    api
      .get(`/address/get-address/${user._id}`)
      .then((res) => {
        const saved = res.data.addresses || []
        setAddresses(saved)
        if (saved.length > 0) setSelectedAddress(saved[0])
      })
      .catch(console.error)
  }, [user])

  // Auto-select saved address if name or number matches
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })

    const match = addresses.find(
      (addr) =>
        (name === 'name' && addr.name === value) ||
        (name === 'number' && addr.number.toString() === value),
    )
    setSelectedAddress(match || null)
  }

  const handleContinue = async (e) => {
    e.preventDefault()

    let addressToUse = selectedAddress
    const isFormFilled =
      form.name || form.number || form.pincode || form.houseAddress

    // If form is filled, save new address
    if (isFormFilled) {
      try {
        const res = await api.post('/address/add-address', {
          ...form,
          userId: user._id,
        })
        addressToUse = res.data.address
      } catch (err) {
        console.error(err)
        return alert('Failed to save address')
      }
    }

    if (!addressToUse) return alert('Please select or add an address')
    navigate('/order-summary', { state: { address: addressToUse } })
  }

  return (
    <div className="container my-4">
      <h3 className="mb-3">Delivery Address</h3>

      {/* Saved addresses container */}
      {addresses.length > 0 && (
        <div className="mb-4">
          <h5>Saved Address</h5>
          <div className="d-flex flex-column gap-2">
            {addresses.map((addr) => (
              <div
                key={addr._id}
                className={`card p-3 ${
                  selectedAddress?._id === addr._id ? 'border-primary' : ''
                }`}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedAddress(addr)}
              >
                <strong>{addr.name}</strong> ({addr.number})
                <br />
                {addr.houseAddress}, {addr.locality}, {addr.city} -{' '}
                {addr.pincode}
                <br />
                <small>{addr.addressType}</small>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Address Form */}
      <div className="mb-4">
        <h5>Add / Edit Address</h5>
        <form onSubmit={handleContinue}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <input
                name="name"
                className="form-control"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <input
                name="number"
                className="form-control"
                placeholder="Mobile Number"
                value={form.number}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <input
                name="pincode"
                className="form-control"
                placeholder="Pincode"
                value={form.pincode}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <input
                name="locality"
                className="form-control"
                placeholder="Locality"
                value={form.locality}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-12 mb-3">
              <textarea
                name="houseAddress"
                className="form-control"
                placeholder="House No, Building, Street"
                value={form.houseAddress}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="col-md-6 mb-3">
              <input
                name="city"
                className="form-control"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <input
                name="state"
                className="form-control"
                placeholder="State"
                value={form.state}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <select
                name="addressType"
                className="form-control"
                value={form.addressType}
                onChange={handleChange}
              >
                <option value="Home">Home</option>
                <option value="Work">Work</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <input
                name="landmark"
                className="form-control"
                placeholder="Landmark (optional)"
                value={form.landmark}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <input
                name="alternateNumber"
                className="form-control"
                placeholder="Alternate Phone (optional)"
                value={form.alternateNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            Proceed to Order Summary
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddressPage
