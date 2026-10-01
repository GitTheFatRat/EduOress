import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MailCheck } from 'lucide-react'
import AuthCard from '../../components/auth/AuthCard.jsx'
import FormField from '../../components/ui/FormField.jsx'

const emailOk = (v) => /^\S+@\S+\.\S+$/.test(v.trim())

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (!emailOk(email)) return setError('Nhập email hợp lệ, ví dụ ten@email.com.')
    setError('')
    setSent(true)
  }

  if (sent) {
    return (
      <AuthCard title="Kiểm tra email của bạn" footer={<Link to="/dang-nhap" className="font-medium text-brand hover:underline">Quay lại đăng nhập</Link>}>
        <div className="flex gap-3">
          <MailCheck className="mt-0.5 h-5 w-5 shrink-0 text-free" aria-hidden />
          <p className="text-[13px] leading-6 text-ink/80">
            Nếu <strong>{email.trim()}</strong> đã đăng ký, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu trong ít phút. Đây là bản demo nên chưa gửi email thật.
          </p>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="Quên mật khẩu"
      subtitle="Nhập email đã đăng ký, chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu."
      footer={<Link to="/dang-nhap" className="font-medium text-brand hover:underline">Quay lại đăng nhập</Link>}
    >
      <form onSubmit={submit} noValidate className="space-y-4">
        <FormField label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
        <button className="h-11 w-full rounded-full bg-brand text-sm font-medium text-white transition hover:bg-brand-dark">Gửi hướng dẫn</button>
      </form>
    </AuthCard>
  )
}
