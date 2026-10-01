import { useState } from 'react'
import { Link } from 'react-router-dom'
import FormField from '../../components/ui/FormField.jsx'
import { StatusBadge } from '../../components/ui/Badge.jsx'
import { btnPrimary, card, container } from '../../components/ui/styles.js'
import { useAuth } from '../../hooks/useAuth.js'
import { useProviders } from '../../hooks/useData.js'

export default function BecomeProvider() {
  const { user } = useAuth()
  const providers = useProviders()
  const mine = providers.items.find((p) => p.userId === user.id)
  const [form, setForm] = useState({ name: '', contact: '', bio: '' })
  const [err, setErr] = useState({})
  const [again, setAgain] = useState(false)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const next = {}
    if (form.name.trim().length < 2) next.name = 'Nhập tên hiển thị.'
    if (form.contact.trim().length < 6) next.contact = 'Nhập số điện thoại hoặc thông tin liên hệ.'
    if (form.bio.trim().length < 20) next.bio = 'Mô tả ít nhất 20 ký tự về khóa học dự kiến.'
    setErr(next)
    if (Object.keys(next).length) return
    const data = { name: form.name.trim(), contact: form.contact.trim(), bio: form.bio.trim(), email: user.email, status: 'PENDING', rejectReason: '' }
    if (mine) providers.update(mine.id, data)
    else providers.add({ userId: user.id, ...data })
    setAgain(false)
  }

  let body
  if (user.role === 'PROVIDER' || mine?.status === 'APPROVED') {
    body = <p className="text-[13px]">Bạn đã là nhà cung cấp. <Link to="/provider" className="font-medium text-brand hover:underline">Vào bảng điều khiển</Link></p>
  } else if (mine && !(mine.status === 'REJECTED' && again)) {
    body = (
      <div className="space-y-3 text-[13px]">
        <p className="flex items-center gap-2">Trạng thái đăng ký: <StatusBadge status={mine.status} /></p>
        {mine.status === 'PENDING' && <p className="text-muted">Quản trị viên đang xem xét. Bạn sẽ nhận thông báo khi có kết quả.</p>}
        {mine.status === 'REJECTED' && (
          <>
            <p className="text-sale">Lý do: {mine.rejectReason}</p>
            <button className={btnPrimary} onClick={() => { setForm({ name: mine.name, contact: mine.contact, bio: mine.bio }); setAgain(true) }}>Chỉnh sửa và gửi lại</button>
          </>
        )}
      </div>
    )
  } else {
    body = (
      <form onSubmit={submit} noValidate className="space-y-5">
        <FormField label="Tên hiển thị (cá nhân hoặc đơn vị)" value={form.name} onChange={set('name')} error={err.name} />
        <FormField label="Thông tin liên hệ" value={form.contact} onChange={set('contact')} error={err.contact} hint="Số điện thoại hoặc email công việc." />
        <FormField as="textarea" rows={4} label="Mô tả khóa học dự kiến cung cấp" value={form.bio} onChange={set('bio')} error={err.bio} />
        <button className={btnPrimary}>Gửi đăng ký</button>
      </form>
    )
  }

  return (
    <div className={`${container} max-w-2xl py-10`}>
      <h1 className="text-2xl font-bold">Trở thành nhà cung cấp</h1>
      <p className="mt-1.5 text-[13px] text-muted">Đăng khóa học của bạn lên EduPress. Quản trị viên sẽ duyệt đăng ký trước khi bạn bắt đầu.</p>
      <div className={`${card} mt-6 p-6`}>{body}</div>
    </div>
  )
}
