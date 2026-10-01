import { useState } from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'
import Breadcrumb from '../../components/ui/Breadcrumb.jsx'
import FormField from '../../components/ui/FormField.jsx'
import { btnPrimary, container } from '../../components/ui/styles.js'
import { useAuth } from '../../hooks/useAuth.js'
import { useTickets } from '../../hooks/useData.js'

const emailOk = (v) => /^\S+@\S+\.\S+$/.test(v.trim())
const info = [[Phone, 'Điện thoại', '(028) 1234 5678'], [Mail, 'Email', 'hotro@edupress.vn'], [MapPin, 'Địa chỉ', '123 Đường Mẫu, Quận 1, TP. Hồ Chí Minh']]

export default function Contact() {
  const { user } = useAuth()
  const tickets = useTickets()
  const [form, setForm] = useState({ name: user?.fullName ?? '', email: user?.email ?? '', subject: '', message: '' })
  const [err, setErr] = useState({})
  const [sent, setSent] = useState(false)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const next = {}
    if (form.name.trim().length < 2) next.name = 'Nhập họ và tên.'
    if (!emailOk(form.email)) next.email = 'Nhập email hợp lệ.'
    if (form.subject.trim().length < 3) next.subject = 'Nhập tiêu đề.'
    if (form.message.trim().length < 10) next.message = 'Nội dung cần ít nhất 10 ký tự.'
    setErr(next)
    if (Object.keys(next).length) return
    tickets.add({ userName: form.name.trim(), email: form.email.trim(), subject: form.subject.trim(), message: form.message.trim(), status: 'OPEN', reply: '' })
    setSent(true)
  }

  return (
    <>
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Liên hệ' }]} />
      <div className={`${container} grid gap-10 py-10 lg:grid-cols-[320px_1fr]`}>
        <div>
          <h1 className="text-2xl font-bold">Cần hỗ trợ trực tiếp?</h1>
          <p className="mt-2 text-[13px] leading-6 text-muted">Gửi tin nhắn cho chúng tôi, đội hỗ trợ sẽ phản hồi qua email trong vòng 1 ngày làm việc.</p>
          <ul className="mt-6 space-y-4">
            {info.map(([Icon, label, value]) => (
              <li key={label} className="flex gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-soft text-brand"><Icon className="h-4 w-4" aria-hidden /></span>
                <div><p className="text-xs text-muted">{label}</p><p className="text-[13px] font-medium">{value}</p></div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-card border border-line bg-white p-6">
          {sent ? (
            <div role="status" className="py-10 text-center">
              <h2 className="font-display text-lg font-bold">Đã gửi tin nhắn</h2>
              <p className="mt-2 text-[13px] text-muted">Cảm ơn bạn. Chúng tôi sẽ phản hồi qua {form.email}.</p>
              <button className={`${btnPrimary} mt-5`} onClick={() => { setSent(false); setForm({ ...form, subject: '', message: '' }) }}>Gửi tin nhắn khác</button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="grid gap-5 md:grid-cols-2">
              <h2 className="font-display text-base font-bold md:col-span-2">Liên hệ với chúng tôi</h2>
              <FormField label="Họ và tên" value={form.name} onChange={set('name')} error={err.name} />
              <FormField label="Email" type="email" value={form.email} onChange={set('email')} error={err.email} />
              <FormField label="Tiêu đề" value={form.subject} onChange={set('subject')} error={err.subject} className="md:col-span-2" />
              <FormField as="textarea" rows={5} label="Nội dung" value={form.message} onChange={set('message')} error={err.message} className="md:col-span-2" />
              <div className="md:col-span-2"><button className={btnPrimary}>Gửi tin nhắn</button></div>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
