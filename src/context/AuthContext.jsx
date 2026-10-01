import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import * as auth from '../lib/authService.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => auth.getSession())
  const [users, setUsers] = useState(() => auth.getUsers())

  const login = useCallback((email, password) => {
    const res = auth.login(email, password)
    if (res.ok) setUser(res.user)
    return res
  }, [])

  const register = useCallback((data) => {
    const res = auth.register(data)
    if (res.ok) { setUser(res.user); setUsers(auth.getUsers()) }
    return res
  }, [])

  const logout = useCallback(() => {
    auth.clearSession()
    setUser(null)
  }, [])

  const updateUser = useCallback((id, patch) => {
    auth.patchUser(id, patch)
    setUsers(auth.getUsers())
    setUser((u) => (u && u.id === id ? auth.getSession() : u))
  }, [])

  const changePassword = useCallback((current, next) => {
    if (!user || !auth.checkPassword(user.id, current)) return { ok: false, error: 'Mật khẩu hiện tại chưa đúng.' }
    updateUser(user.id, { password: next })
    return { ok: true }
  }, [user, updateUser])

  const value = useMemo(
    () => ({ user, users, login, register, logout, updateUser, changePassword }),
    [user, users, login, register, logout, updateUser, changePassword])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth phải nằm trong <AuthProvider>')
  return ctx
}
