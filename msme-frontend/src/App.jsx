import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/dashboard'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import SellerDashboard from './pages/seller/SellerDashboard'
import BuyerDashboard from './pages/buyer/BuyerDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import ProductDetail from './pages/buyer/ProductDetail'
import CartPage from './pages/buyer/CartPage'
import Checkout from './pages/buyer/Checkout'
import OrderSuccess from './pages/buyer/OrderSuccess'
import MyOrders from './pages/buyer/MyOrders'
import Addresses from './pages/buyer/Addresses'
import Wishlist from './pages/buyer/Wishlist'
import Profile from './pages/buyer/Profile'

import { useAuth } from './context/AuthContext'

function AppRoutes() {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/buyer" replace /> : <Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Navigate to="/buyer" replace />} />

      {/* Protected Buyer Routes */}
      <Route path="/buyer" element={user ? <BuyerDashboard /> : <Navigate to="/login" replace />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={user ? <CartPage /> : <Navigate to="/login" replace />} />
      <Route path="/checkout" element={user ? <Checkout /> : <Navigate to="/login" replace />} />
      <Route path="/order-success" element={user ? <OrderSuccess /> : <Navigate to="/login" replace />} />
      <Route path="/my-orders" element={user ? <MyOrders /> : <Navigate to="/login" replace />} />
      <Route path="/addresses" element={user ? <Addresses /> : <Navigate to="/login" replace />} />
      <Route path="/wishlist" element={user ? <Wishlist /> : <Navigate to="/login" replace />} />
      <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" replace />} />

      {/* Protected Workspace Routes */}
      <Route path="/seller" element={user ? <SellerDashboard /> : <Navigate to="/login" replace />} />
      <Route path="/admin" element={user ? <AdminDashboard /> : <Navigate to="/login" replace />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Catch-all */}
      <Route path="*" element={user ? <Navigate to="/buyer" replace /> : <Navigate to="/login" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App;
