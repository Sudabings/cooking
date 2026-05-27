import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type { Profile } from '../types'

interface AuthContextType {
  profile: Profile | null
  profiles: Profile[]
  login: (p: Profile) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(() => {
    const saved = localStorage.getItem('profile')
    return saved ? JSON.parse(saved) : null
  })
  const [profiles, setProfiles] = useState<Profile[]>([])

  useEffect(() => {
    supabase.from('profiles').select('*').then(({ data }) => {
      if (data) setProfiles(data)
    })
  }, [])

  const login = (p: Profile) => {
    setProfile(p)
    localStorage.setItem('profile', JSON.stringify(p))
  }

  const logout = () => {
    setProfile(null)
    localStorage.removeItem('profile')
  }

  return (
    <AuthContext.Provider value={{ profile, profiles, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
