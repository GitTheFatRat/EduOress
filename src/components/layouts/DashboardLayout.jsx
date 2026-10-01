import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LogOut, Menu, X } from 'lucide-react'
import { Logo } from '../Header.jsx'
import { useAuth } from '../../hooks/useAuth.js'

export default function DashboardLayout({ title, nav }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-surface lg:grid lg:grid-cols-[256px_1fr]">
      <aside className={`${open ? 'block' : 'hidden'} fixed inset-y-0 left-0 z-50 w-64 overflow-y-auto border-r border-line bg-white lg:sticky lg:top-0 lg:block lg:h-screen`}>
        <div className="flex h-16 items-center justify-between border-b border-line px-5">
          <Logo />
          <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Đóng menu"><X className="h-5 w-5" /></button>
        </div>
        <p className="px-5 pt-5 text-xs font-semibold uppercase tracking-wide text-muted">{title}</p>
        <nav aria-label={title} className="mt-2 px-3 pb-6">
          {nav.map((item, i) =>
            item.section ? (
              <p key={i} className="px-2 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wide text-muted">{item.section}</p>
            ) : (
              <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setOpen(false)}
                className={({ isActive }) => `mb-0.5 flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition ${isActive ? 'bg-brand-soft text-brand' : 'hover:bg-surface'}`}>
                {item.icon && <item.icon className="h-4 w-4" aria-hidden />}
                <span className="flex-1">{item.label}</span>
                {item.badge ? <span className="rounded-full bg-brand px-1.5 text-[11px] text-white">{item.badge}</span> : null}
              </NavLink>
            ))}
        </nav>
      </aside>
      {open && <button aria-label="Đóng menu" className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setOpen(false)} />}

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-white px-4 lg:px-8">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Mở menu"><Menu className="h-5 w-5" /></button>
          <Link to="/" className="hidden text-[13px] text-muted hover:text-brand lg:block">← Về trang chủ</Link>
          <div className="flex items-center gap-3 text-[13px]">
            <span className="hidden font-medium sm:inline">{user?.fullName}</span>
            <button onClick={() => { logout(); navigate('/') }} className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 hover:border-brand hover:text-brand">
              <LogOut className="h-3.5 w-3.5" aria-hidden /> Đăng xuất
            </button>
          </div>
        </header>
        <main className="min-w-0 flex-1 p-4 lg:p-8"><Outlet /></main>
      </div>
    </div>
  )
}
