import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.js'
import api from '../api.js'

const AddressPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [addresses, setAddresses] = useState([]) // Saved addresses
  const [selectedAddressId, setSelectedAddressId] = useState(null) // Radio button selected address
  const [form, setForm] = useState({
    name: '',
    number: '',
    houseAddress: '',
    addressType: 'Home',
  })

  // Fetch saved addresses on load
  useEffect(() => {
    if (!user?._id) return

    api
      .get(`/address/get-address/${user._id}`)
      .then((res) => {
        const saved = res.data.addresses || []

        const unique = saved.filter(
          (addr, index, self) =>
            index ===
            self.findIndex(
              (a) =>
                a.name === addr.name &&
                a.number === addr.number &&
                a.houseAddress === addr.houseAddress &&
                a.addressType === addr.addressType,
            ),
        )

        setAddresses(unique)

        if (unique.length > 0) {
          const addr = unique[0]
          setSelectedAddressId(addr._id)
          setForm({
            name: addr.name,
            number: addr.number,
            houseAddress: addr.houseAddress,
            addressType: addr.addressType || 'Home',
          })
        } else {
          setForm({
            name: `${user.fname || ''} ${user.lname || ''}`.trim(),
            number: user.phone || '',
            houseAddress: '',
            addressType: 'Home',
          })
        }
      })
      .catch(console.error)
  }, [user])

  const handleSelectAddress = (addr) => {
    setSelectedAddressId(addr._id)
    setForm({
      name: addr.name,
      number: addr.number,
      houseAddress: addr.houseAddress,
      addressType: addr.addressType || 'Home',
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    setSelectedAddressId(null) // User edited form, deselect radio
  }

  const handleContinue = async (e) => {
    e.preventDefault()

    let addressToUse = addresses.find((addr) => addr._id === selectedAddressId)

    // Check if an identical address exists
    if (!addressToUse) {
      const duplicate = addresses.find(
        (addr) =>
          addr.name === form.name &&
          addr.number === form.number &&
          addr.houseAddress === form.houseAddress &&
          addr.addressType === form.addressType,
      )
      if (duplicate) {
        addressToUse = duplicate
      } else {
        // Save new address
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
    }

    navigate('/order-summary', { state: { address: addressToUse } })
  }

  return (
    <div className="container my-4">
      <h3 className="mb-3">Delivery Address</h3>

      {/* Saved Addresses */}
      {addresses.length > 0 && (
        <div className="mb-4">
          <h5>Saved Addresses</h5>
          <div className="d-flex flex-column gap-2">
            {addresses.map((addr) => (
              <label
                key={addr._id}
                className={`card p-3 ${
                  selectedAddressId === addr._id ? 'border-primary' : ''
                }`}
                style={{ cursor: 'pointer' }}
              >
                <input
                  type="radio"
                  name="savedAddress"
                  value={addr._id}
                  checked={selectedAddressId === addr._id}
                  onChange={() => handleSelectAddress(addr)}
                  className="me-2"
                />
                <strong>{addr.name}</strong> ({addr.number})
                <br />
                {addr.houseAddress}
                <br />
                <small>{addr.addressType}</small>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Address Form */}
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
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <input
                name="number"
                className="form-control"
                placeholder="Mobile Number"
                value={form.number}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-12 mb-3">
              <textarea
                name="houseAddress"
                className="form-control"
                placeholder="House No, Building, Street"
                value={form.houseAddress}
                onChange={handleChange}
                required
              ></textarea>
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
