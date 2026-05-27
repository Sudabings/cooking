import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { profile, profiles, login, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogin = (p: typeof profiles[number]) => {
    login(p)
    navigate('/')
  }

  if (profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-800">当前用户</h1>
        <div className="text-5xl mb-4">
          {profile.name === '自己' ? '🧑' : '👶'}
        </div>
        <p className="text-xl font-semibold">{profile.name}</p>
        <button
          onClick={() => { logout(); }}
          className="text-orange-500 underline"
        >
          切换用户
        </button>
        <button
          onClick={() => navigate('/')}
          className="mt-4 bg-orange-500 text-white px-8 py-3 rounded-xl text-lg font-semibold"
        >
          进入厨房
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-8 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">🍳 家庭厨房</h1>
      <p className="text-gray-500 mb-4">选择你的身份</p>
      <div className="flex gap-8">
        {profiles.map(p => (
          <button
            key={p.id}
            onClick={() => handleLogin(p)}
            className="flex flex-col items-center gap-3 bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl active:scale-95 transition-all"
          >
            <span className="text-5xl">
              {p.name === '自己' ? '🧑' : '👶'}
            </span>
            <span className="text-lg font-semibold">{p.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
