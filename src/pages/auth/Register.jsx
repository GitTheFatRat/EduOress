import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import AuthCard from '../../components/auth/AuthCard.jsx'
import PasswordToggle from '../../components/auth/PasswordToggle.jsx'
import FormField from '../../components/ui/FormField.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { homePath } from '../../lib/authService.js'

const emailOk = (v) => /^\S+@\S+\.\S+$/.test(v.trim())

export default function Register() {
  const { user, register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [show, setShow] = useState(false)

  if (user) return <Navigate to={homePath(user.role)} replace />

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    const next = {}
    if (form.fullName.trim().length < 2) next.fullName = 'Nhập họ và tên của bạn.'
    if (!emailOk(form.email)) next.email = 'Nhập email hợp lệ, ví dụ ten@email.com.'
    if (form.password.length < 6) next.password = 'Mật khẩu cần ít nhất 6 ký tự.'
    if (form.confirm !== form.password) next.confirm = 'Mật khẩu xác nhận chưa khớp.'
    setErrors(next)
    if (Object.keys(next).length) return
    const res = register(form)
    if (!res.ok) return setErrors({ [res.field ?? 'email']: res.error })
    navigate('/', { replace: true })
  }

  const toggle = <PasswordToggle shown={show} onToggle={() => setShow((v) => !v)} />
  const type = show ? 'text' : 'password'

  return (
    <AuthCard
      title="Tạo tài khoản"
      subtitle="Đăng ký miễn phí để học khóa học hoặc trở thành nhà cung cấp."
      footer={<>Đã có tài khoản? <Link to="/dang-nhap" className="font-medium text-brand hover:underline">Đăng nhập</Link></>}
    >
      <form onSubmit={submit} noValidate className="space-y-4">
        <FormField label="Họ và tên" autoComplete="name" value={form.fullName} onChange={set('fullName')} error={errors.fullName} />
        <FormField label="Email" type="email" autoComplete="email" value={form.email} onChange={set('email')} error={errors.email} />
        <FormField label="Mật khẩu" type={type} autoComplete="new-password" value={form.password} onChange={set('password')} error={errors.password} hint="Ít nhất 6 ký tự." right={toggle} />
        <FormField label="Xác nhận mật khẩu" type={type} autoComplete="new-password" value={form.confirm} onChange={set('confirm')} error={errors.confirm} />
        <button className="h-11 w-full rounded-full bg-brand text-sm font-medium text-white transition hover:bg-brand-dark">Đăng ký</button>
      </form>
    </AuthCard>
  )
}
