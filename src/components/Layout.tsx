import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const showBack = location.pathname !== '/' && location.pathname !== '/login'

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="sticky top-0 z-10 bg-orange-500 text-white shadow">
        <div className="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            {showBack && (
              <button onClick={() => navigate(-1)} className="text-xl">&larr;</button>
            )}
            <h1 className="text-lg font-bold">家庭厨房</h1>
          </div>
          {profile && (
            <button
              onClick={() => navigate('/login')}
              className="text-sm bg-orange-600 px-3 py-1 rounded-full"
            >
              {profile.name}
            </button>
          )}
        </div>
      </header>
      <main className="max-w-lg mx-auto">
        <Outlet />
      </main>
    </div>
  )
}
