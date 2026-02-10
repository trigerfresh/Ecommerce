// src/admin/AdminLayout.js
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AdminLayout = () => {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  return (
    <div>
      {/* Fixed-top Admin Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top w-100">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/admin/dashboard">
            Admin Panel
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#adminNavbar"
            aria-controls="adminNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="adminNavbar">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    location.pathname === '/admin/dashboard' ? 'active' : ''
                  }`}
                  to="/admin/dashboard"
                >
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    location.pathname === '/admin/users' ? 'active' : ''
                  }`}
                  to="/admin/users"
                >
                  Users
                </Link>
              </li>
              <li className="nav-item dropdown">
                <Link
                  className={`nav-link dropdown-toggle ${
                    location.pathname.startsWith('/admin/products')
                      ? 'active'
                      : ''
                  }`}
                  to="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Products
                </Link>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/admin/products/add">
                      Add Product
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/admin/products">
                      All Products
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>

            <span className="navbar-text me-3">Hi, {user?.fname}</span>
            <button className="btn btn-outline-light" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main content with top padding to prevent overlap */}
      <div
        className="container-fluid"
        style={{ paddingTop: '70px' }} // Adjust according to navbar height
      >
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout
