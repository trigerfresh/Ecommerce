import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.js'
import api from '../api.js'

const SelectAddressPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)

  useEffect(() => {
    if (!user?._id) return

    api
      .get(`/address/get-address/${user._id}`)
      .then((res) => {
        const list = res.data.addresses || []
        setAddresses(list)

        // ✅ Auto-select first address
        if (list.length > 0) {
          setSelectedAddress(list[0])
        }
      })
      .catch((err) => console.error(err))
  }, [user])

  const handleContinue = () => {
    if (!selectedAddress) return

    navigate('/order-summary', {
      state: { address: selectedAddress },
    })
  }

  if (addresses.length === 0) {
    return (
      <div className="container my-4 text-center">
        <h4>No Saved Address</h4>
        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate('/address')}
        >
          Add New Address
        </button>
      </div>
    )
  }

  return (
    <div className="container my-4">
      <h4 className="mb-3">Select Delivery Address</h4>

      {/* ✅ Carousel */}
      <div id="addressCarousel" className="carousel slide" data-bs-ride="false">
        <div className="carousel-inner">
          {addresses.map((addr, index) => (
            <div
              key={addr._id}
              className={`carousel-item ${index === 0 ? 'active' : ''}`}
            >
              <div
                className={`card p-3 ${
                  selectedAddress?._id === addr._id ? 'border-primary' : ''
                }`}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedAddress(addr)}
              >
                <h6>
                  {addr.name} ({addr.number})
                </h6>
                <p className="mb-1">
                  {addr.houseAddress}, {addr.locality}
                </p>
                <p className="mb-1">
                  {addr.city}, {addr.state} - {addr.pincode}
                </p>
                <small className="text-muted">{addr.addressType}</small>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        {addresses.length > 1 && (
          <>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#addressCarousel"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" />
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#addressCarousel"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" />
            </button>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 d-flex gap-3">
        <button className="btn btn-primary" onClick={handleContinue}>
          Deliver Here
        </button>

        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate('/address')}
        >
          Add New Address
        </button>
      </div>
    </div>
  )
}

export default SelectAddressPage
