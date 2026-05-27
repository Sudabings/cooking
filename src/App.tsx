import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'

// Pages - will be created later, use lazy or placeholder for now
function HomePage() { return <div>Home</div> }
function CartPage() { return <div>Cart</div> }
function OrderHistoryPage() { return <div>Orders</div> }
function OrderDetailPage() { return <div>Order Detail</div> }
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
