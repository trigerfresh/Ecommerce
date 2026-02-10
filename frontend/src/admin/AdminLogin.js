import { useState } from 'react'
import { useAuth } from '../context/AuthContext.js'
import { useNavigate } from 'react-router-dom'

const AdminLogin = () => {
  const { adminLogin } = useAuth() // we won't rely on user from context immediately
  const navigate = useNavigate()

  const [form, setForm] = useState({ phone: '', password: '' })
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const user = await adminLogin(form)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid phone or password')
    }
  }

  return (
    <form className="container mt-5 w-25" onSubmit={submit}>
      <h3>Admin Login</h3>
      {error && <p className="text-danger">{error}</p>}

      <input
        type="tel"
        className="form-control mb-2"
        placeholder="Phone"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      <input
        className="form-control mb-2"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button className="btn btn-dark w-100">Login</button>
    </form>
  )
}

export default AdminLogin
