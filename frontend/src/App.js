// src/App.js
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Checkout from './pages/Checkout'
import AddressPage from './pages/AddressPage.js'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import ProductDetails from './pages/ProductDetails'
import OrderSummary from './pages/OrderSummary.js'
import SelectAddressPage from './pages/SelectAddressPage.js'

// Protected Route
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  if (!user)
    return (
      <Navigate
        to="/login"
        replace
        state={{ redirectTo: window.location.pathname }}
      />
    )
  return children
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar />
          <div className="container mt-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/address"
                element={
                  <ProtectedRoute>
                    <AddressPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/select-address"
                element={
                  <ProtectedRoute>
                    {' '}
                    <SelectAddressPage />{' '}
                  </ProtectedRoute>
                }
              />

              <Route
                path="/order-summary"
                element={
                  <ProtectedRoute>
                    <OrderSummary />
                  </ProtectedRoute>
                }
              />
              <Route path="/product/:id" element={<ProductDetails />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
