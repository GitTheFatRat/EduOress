import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import AuthCard from '../../components/auth/AuthCard.jsx'
import PasswordToggle from '../../components/auth/PasswordToggle.jsx'
import FormField from '../../components/ui/FormField.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { homePath } from '../../lib/authService.js'
import { demoAccounts } from '../../data/users.js'

const emailOk = (v) => /^\S+@\S+\.\S+$/.test(v.trim())

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [show, setShow] = useState(false)

  if (user) return <Navigate to={location.state?.from?.pathname ?? homePath(user.role)} replace />

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    const next = {}
    if (!emailOk(form.email)) next.email = 'Nhập email hợp lệ, ví dụ ten@email.com.'
    if (!form.password) next.password = 'Nhập mật khẩu.'
    setErrors(next)
    setFormError('')
    if (Object.keys(next).length) return
    const res = login(form.email, form.password)
    if (!res.ok) return setFormError(res.error)
    navigate(location.state?.from?.pathname ?? homePath(res.user.role), { replace: true })
  }

  return (
    <AuthCard
      title="Đăng nhập"
      subtitle="Đăng nhập để xem khóa học đã đăng ký và tiếp tục bài đang học."
      footer={<>Chưa có tài khoản? <Link to="/dang-ky" className="font-medium text-brand hover:underline">Đăng ký</Link></>}
    >
      <form onSubmit={submit} noValidate className="space-y-4">
        {formError && <p role="alert" className="rounded-lg bg-sale/10 px-3.5 py-2.5 text-[13px] text-sale">{formError}</p>}
        <FormField label="Email" type="email" autoComplete="email" value={form.email} onChange={set('email')} error={errors.email} />
        <FormField
          label="Mật khẩu"
          type={show ? 'text' : 'password'}
          autoComplete="current-password"
          value={form.password}
          onChange={set('password')}
          error={errors.password}
          right={<PasswordToggle shown={show} onToggle={() => setShow((v) => !v)} />}
        />
        <div className="text-right">
          <Link to="/quen-mat-khau" className="text-[13px] text-brand hover:underline">Quên mật khẩu?</Link>
        </div>
        <button className="h-11 w-full rounded-full bg-brand text-sm font-medium text-white transition hover:bg-brand-dark">Đăng nhập</button>
      </form>

      <div className="mt-6 rounded-lg bg-surface p-4">
        <p className="text-xs font-medium">Tài khoản mẫu để demo (mật khẩu 123456)</p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {demoAccounts.map((a) => (
            <button
              key={a.email}
              type="button"
              onClick={() => { setForm({ email: a.email, password: a.password }); setErrors({}); setFormError('') }}
              className="rounded-full border border-line bg-white px-3 py-1 text-xs hover:border-brand hover:text-brand"
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </AuthCard>
  )
}
