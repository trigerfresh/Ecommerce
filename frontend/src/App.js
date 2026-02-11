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
import AdminLogin from './admin/AdminLogin.js'
import AdminRoute from './components/AdminRoute.js'
import AdminLayout from './admin/AdminLayout.js'
import Dashboard from './admin/Dashboard.js'
import UserList from './admin/users/UserList.js'
import ProductAdd from './admin/products/ProductAdd.js'
import CategoryProducts from './pages/CategoryProducts.js'
import Footer from './components/Footer.js'

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

// function App() {
//   return (
//     <AuthProvider>
//       <CartProvider>
//         <Router>
//           <Navbar />
//           <div className="container mt-4">
//             <Routes>
//               <Route path="/" element={<Home />} />
//               <Route path="/login" element={<Login />} />
//               <Route path="/signup" element={<Signup />} />
//               <Route
//                 path="/checkout"
//                 element={
//                   <ProtectedRoute>
//                     <Checkout />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/address"
//                 element={
//                   <ProtectedRoute>
//                     <AddressPage />
//                   </ProtectedRoute>
//                 }
//               />

//               <Route
//                 path="/select-address"
//                 element={
//                   <ProtectedRoute>
//                     {' '}
//                     <SelectAddressPage />{' '}
//                   </ProtectedRoute>
//                 }
//               />

//               <Route
//                 path="/order-summary"
//                 element={
//                   <ProtectedRoute>
//                     <OrderSummary />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/category/:category"
//                 element={<CategoryProducts />}
//               />
//               <Route path="/product/:id" element={<ProductDetails />} />

//               <Route path="*" element={<Navigate to="/" replace />} />

//               <Route path="/admin/login" element={<AdminLogin />} />

//               <Route
//                 path="/admin"
//                 element={
//                   <AdminRoute>
//                     <AdminLayout />
//                   </AdminRoute>
//                 }
//               >
//                 <Route path="dashboard" element={<Dashboard />} />
//                 <Route path="users" element={<UserList />} />
//                 <Route path="products/add" element={<ProductAdd />} />
//               </Route>
//             </Routes>
//           </div>
//           <Footer />
//         </Router>
//       </CartProvider>
//     </AuthProvider>
//   )
// }

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="d-flex flex-column min-vh-100">
            {' '}
            {/* Flex container */}
            <Navbar />
            {/* Main content */}
            <div className="container mt-4 flex-grow-1">
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
                      <SelectAddressPage />
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
                <Route
                  path="/category/:category"
                  element={<CategoryProducts />}
                />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="*" element={<Navigate to="/" replace />} />

                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminLayout />
                    </AdminRoute>
                  }
                >
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="users" element={<UserList />} />
                  <Route path="products/add" element={<ProductAdd />} />
                </Route>
              </Routes>
            </div>
            {/* Sticky Footer */}
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
