import { useState } from 'react'
import { useAuth } from '../context/AuthContext.js'
import { Link, useNavigate } from 'react-router-dom'

const Signup = () => {
  const { signup } = useAuth()

  const navigate = useNavigate()

  const [form, setForm] = useState({
    fname: '',
    lname: '',
    phone: '',
    email: '',
    gender: '',
    password: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    await signup(form)
    navigate('/')
  }
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <form
        onSubmit={handleSubmit}
        className="p-4 border rounded shadow-sm"
        style={{ maxWidth: '400px', width: '100%' }}
      >
        <h3 className="mb-3 text-center">Create Account</h3>

        <div className="mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="First Name"
            value={form.fname}
            onChange={(e) => setForm({ ...form, fname: e.target.value })}
            required
          />
        </div>

        <div className="mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Last Name"
            value={form.lname}
            onChange={(e) => setForm({ ...form, lname: e.target.value })}
            required
          />
        </div>

        <div className="mb-2">
          <input
            type="tel"
            className="form-control"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
        </div>

        <div className="mb-2">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        <div className="mb-2">
          <select
            className="form-select"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100 mb-2">
          Sign Up
        </button>

        <div className="text-center small">
          Already have an account?{' '}
          <Link to="/login" className="text-decoration-none">
            Login
          </Link>
        </div>
      </form>
    </div>
  )
}

export default Signup
