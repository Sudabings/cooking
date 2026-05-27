import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import OrderDetailPage from './pages/OrderDetailPage'
import OrderHistoryPage from './pages/OrderHistoryPage'
import CartPage from './pages/CartPage'
function DishManagePage() { return <div>Admin Dishes</div> }
function CategoryManagePage() { return <div>Admin Categories</div> }

function AppRoutes() {
  const { profile } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={profile ? <Layout /> : <Navigate to="/login" />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders" element={<OrderHistoryPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route path="/admin" element={<DishManagePage />} />
        <Route path="/admin/categories" element={<CategoryManagePage />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
