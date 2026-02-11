import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const { cart } = useCart() || { cart: [] } // safe fallback
  const location = useLocation()

  if (user?.role === 'admin' || location.pathname.startsWith('/admin')) {
    return null
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          MyShop
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            {user ? (
              <>
                <li className="nav-item">
                  <span className="nav-link">Hi, {user.fname}</span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={logout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                {/* <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li> */}
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">
                    Signup
                  </Link>
                </li>
              </>
            )}

            <li className="nav-item">
              <Link className="nav-link position-relative" to="/checkout">
                Cart
                {cart.length > 0 && (
                  <span
                    className="badge bg-danger rounded-circle position-absolute"
                    style={{ top: '0px', right: '-10px', fontSize: '0.75rem' }}
                  >
                    {cart.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
