import { seedUsers } from '../data/users.js'

const USERS_KEY = 'edupress.users'
const SESSION_KEY = 'edupress.session'

const store = () => (typeof window !== 'undefined' ? window.localStorage : globalThis.localStorage)

function read(key, fallback) {
  try {
    const raw = store()?.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}
function write(key, value) {
  try { store()?.setItem(key, JSON.stringify(value)) } catch {  }
}

export const normalizeEmail = (e) => e.trim().toLowerCase()
const PATCH_KEY = 'edupress.userPatches'
export const getUsers = () => {
  const patches = read(PATCH_KEY, {})
  return [...seedUsers, ...read(USERS_KEY, [])].map((u) => ({ ...u, ...(patches[u.id] || {}) }))
}
const publicUser = ({ password, ...rest }) => rest

export const emailExists = (email) => getUsers().some((u) => u.email === normalizeEmail(email))

export function login(email, password) {
  const u = getUsers().find((x) => x.email === normalizeEmail(email))
  if (!u || u.password !== password) return { ok: false, error: 'Email hoặc mật khẩu không đúng.' }
  if (u.status === 'DISABLED') return { ok: false, error: 'Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ hỗ trợ.' }
  const user = publicUser(u)
  write(SESSION_KEY, user)
  return { ok: true, user }
}

export function register({ fullName, email, password }) {
  if (emailExists(email)) return { ok: false, field: 'email', error: 'Email này đã được đăng ký.' }
  const u = {
    id: `u-${Date.now()}`,
    fullName: fullName.trim(),
    email: normalizeEmail(email),
    password,
    role: 'CUSTOMER',
    status: 'ACTIVE',
  }
  write(USERS_KEY, [...read(USERS_KEY, []), u])
  const user = publicUser(u)
  write(SESSION_KEY, user)
  return { ok: true, user }
}

export const getSession = () => read(SESSION_KEY, null)
export const clearSession = () => { try { store()?.removeItem(SESSION_KEY) } catch {  } }

export const homePath = (role) => (role === 'ADMIN' ? '/admin' : role === 'PROVIDER' ? '/provider' : '/')

export function patchUser(id, patch) {
  const all = read(PATCH_KEY, {})
  write(PATCH_KEY, { ...all, [id]: { ...(all[id] || {}), ...patch } })
  const session = getSession()
  if (session?.id === id) {
    const { password, ...rest } = patch
    write(SESSION_KEY, { ...session, ...rest })
  }
}

export function checkPassword(id, password) {
  return getUsers().find((u) => u.id === id)?.password === password
}
