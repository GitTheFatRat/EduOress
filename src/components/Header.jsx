import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { BookOpen, ChevronDown, LogOut, Menu, Search, X } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.js'
import { useNotificationsFor } from '../hooks/useData.js'

const nav = [
  { to: '/', label: 'Trang chủ', end: true },
  { to: '/khoa-hoc', label: 'Khóa học' },
  { to: '/blog', label: 'Blog' },
]
const pages = [
  { to: '/faq', label: 'Câu hỏi thường gặp' },
  { to: '/lien-he', label: 'Liên hệ' },
]

function accountLinks(role) {
  const learner = [
    { to: '/hoc-tap', label: 'Khóa học của tôi' },
    { to: '/ho-so', label: 'Hồ sơ cá nhân' },
    { to: '/thong-bao', label: 'Thông báo' },
  ]
  if (role === 'ADMIN') return [{ to: '/admin', label: 'Trang quản trị' }]
  if (role === 'PROVIDER') return [{ to: '/provider', label: 'Bảng điều khiển nhà cung cấp' }, ...learner]
  return [...learner, { to: '/tro-thanh-ncc', label: 'Trở thành nhà cung cấp' }]
}

const linkClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-[13px] font-medium transition-colors hover:text-brand ${
    isActive ? 'bg-surface text-brand' : 'text-ink'
  }`

export function Logo({ className = '' }) {
  return (
    <Link to="/" className={`flex items-center gap-1.5 font-display text-xl font-bold ${className}`}>
      <BookOpen className="h-6 w-6 text-brand" aria-hidden />
      EduPress
    </Link>
  )
}

export default function Header() {
  const { user, logout } = useAuth()
  const { unread } = useNotificationsFor(user)
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')

  const doLogout = () => {
    logout()
    setOpen(false)
    navigate('/')
  }
  const doSearch = (e) => {
    e.preventDefault()
    setSearchOpen(false)
    navigate(query.trim() ? `/khoa-hoc?q=${encodeURIComponent(query.trim())}` : '/khoa-hoc')
  }
  const links = user ? accountLinks(user.role) : []

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1140px] items-center justify-between px-4">
        <Logo />

        <nav aria-label="Menu chính" className="hidden items-center gap-1 md:flex">
          {nav.map((i) => (
            <NavLink key={i.to} to={i.to} end={i.end} className={linkClass}>{i.label}</NavLink>
          ))}
          <div className="group relative">
            <button className="flex items-center gap-1 rounded-md px-3 py-2 text-[13px] font-medium hover:text-brand" aria-haspopup="true">
              Trang <ChevronDown className="h-3.5 w-3.5" aria-hidden />
            </button>
            <div className="invisible absolute left-0 top-full min-w-48 rounded-lg border border-line bg-white p-1.5 opacity-0 shadow-lift transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
              {pages.map((p) => (
                <Link key={p.to} to={p.to} className="block rounded-md px-3 py-2 text-[13px] hover:bg-surface hover:text-brand">{p.label}</Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="group relative hidden md:block">
              <button className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 text-[13px] font-medium hover:bg-surface" aria-haspopup="true">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-soft font-display font-bold text-brand" aria-hidden>
                  {user.fullName.trim().split(/\s+/).slice(-1)[0][0]}
                </span>
                <span className="max-w-32 truncate">{user.fullName}</span>
                <ChevronDown className="h-3.5 w-3.5" aria-hidden />
              </button>
              <div className="invisible absolute right-0 top-full w-64 rounded-lg border border-line bg-white p-1.5 opacity-0 shadow-lift transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                <p className="truncate px-3 py-2 text-xs text-muted">{user.email}</p>
                {links.map((l) => (
                  <Link key={l.to} to={l.to} className="flex items-center justify-between rounded-md px-3 py-2 text-[13px] hover:bg-surface hover:text-brand">
                    {l.label}
                    {l.to === '/thong-bao' && unread > 0 && <span className="rounded-full bg-brand px-1.5 text-[11px] text-white">{unread}</span>}
                  </Link>
                ))}
                <button onClick={doLogout} className="mt-1 flex w-full items-center gap-2 rounded-md border-t border-line px-3 py-2.5 text-left text-[13px] hover:bg-surface hover:text-brand">
                  <LogOut className="h-3.5 w-3.5" aria-hidden /> Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <div className="hidden items-center gap-1 text-[13px] font-medium sm:flex">
              <Link to="/dang-nhap" className="hover:text-brand">Đăng nhập</Link>
              <span className="text-muted" aria-hidden>/</span>
              <Link to="/dang-ky" className="hover:text-brand">Đăng ký</Link>
            </div>
          )}
          <button
            onClick={() => setSearchOpen((v) => !v)}
            aria-label="Tìm kiếm khóa học"
            aria-expanded={searchOpen}
            className="grid h-9 w-9 place-items-center rounded-full border border-brand text-brand transition hover:bg-brand hover:text-white"
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Đóng menu' : 'Mở menu'}
            aria-expanded={open}
            className="grid h-9 w-9 place-items-center rounded-md md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-line bg-white">
          <form role="search" className="mx-auto flex max-w-[1140px] items-center gap-2 px-4 py-3" onSubmit={doSearch}>
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Từ khóa tìm kiếm"
              placeholder="Tìm khóa học, ví dụ: React, Figma..."
              className="h-10 flex-1 rounded-full border border-line px-4 text-sm outline-none focus:border-brand"
            />
            <button className="h-10 rounded-full bg-brand px-5 text-sm font-medium text-white hover:bg-brand-dark">Tìm</button>
          </form>
        </div>
      )}

      {open && (
        <nav aria-label="Menu di động" className="border-t border-line bg-white px-4 py-3 md:hidden">
          <ul className="flex flex-col">
            {[...nav, ...pages, ...links].map((i) => (
              <li key={i.to}>
                <NavLink to={i.to} end={i.end} onClick={() => setOpen(false)} className={({ isActive }) => `block rounded-md px-3 py-2.5 text-sm ${isActive ? 'bg-surface text-brand' : ''}`}>
                  {i.label}
                </NavLink>
              </li>
            ))}
            <li className="mt-2 flex gap-2 border-t border-line pt-3">
              {user ? (
                <button onClick={doLogout} className="flex-1 rounded-full border border-brand py-2 text-center text-sm text-brand">Đăng xuất</button>
              ) : (
                <>
                  <Link to="/dang-nhap" onClick={() => setOpen(false)} className="flex-1 rounded-full border border-brand py-2 text-center text-sm text-brand">Đăng nhập</Link>
                  <Link to="/dang-ky" onClick={() => setOpen(false)} className="flex-1 rounded-full bg-brand py-2 text-center text-sm text-white">Đăng ký</Link>
                </>
              )}
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
