import { useState } from 'react'
import { Link } from 'react-router-dom'
import FormField from '../../components/ui/FormField.jsx'
import { StatusBadge } from '../../components/ui/Badge.jsx'
import { btnDanger, card, container } from '../../components/ui/styles.js'
import { useAuth } from '../../hooks/useAuth.js'
import { useDeletions } from '../../hooks/useData.js'

export default function DeleteAccount() {
  const { user } = useAuth()
  const deletions = useDeletions()
  const last = [...deletions.items].reverse().find((r) => r.userId === user.id)
  const [reason, setReason] = useState('')
  const [confirm, setConfirm] = useState('')
  const [err, setErr] = useState({})
  const blocked = last && (last.status === 'PENDING' || !last.status)

  const submit = (e) => {
    e.preventDefault()
    const next = {}
    if (reason.trim().length < 5) next.reason = 'Nhập lý do ít nhất 5 ký tự.'
    if (confirm.trim().toUpperCase() !== 'XÓA') next.confirm = 'Gõ chữ XÓA để xác nhận.'
    setErr(next)
    if (Object.keys(next).length) return
    deletions.add({ userId: user.id, userName: user.fullName, email: user.email, reason: reason.trim(), status: 'PENDING' })
    setReason(''); setConfirm('')
  }

  return (
    <div className={`${container} max-w-2xl py-10`}>
      <h1 className="text-2xl font-bold">Yêu cầu xóa tài khoản</h1>
      <p className="mt-1.5 text-[13px] leading-6 text-muted">Khi được chấp nhận, tài khoản của bạn sẽ bị vô hiệu hóa và bạn không thể đăng nhập nữa. Các khóa học đã đăng ký sẽ không còn truy cập được.</p>
      <div className={`${card} mt-6 p-6`}>
        {blocked ? (
          <div className="space-y-2 text-[13px]">
            <p className="flex items-center gap-2">Yêu cầu của bạn: <StatusBadge status="PENDING" /></p>
            <p className="text-muted">Quản trị viên sẽ xử lý yêu cầu. Bạn vẫn dùng tài khoản bình thường trong thời gian chờ.</p>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-5">
            {last?.status === 'REJECTED' && <p className="rounded-lg bg-surface px-4 py-3 text-[13px]">Yêu cầu trước đã bị từ chối. Bạn có thể gửi lại nếu vẫn muốn xóa.</p>}
            <FormField as="textarea" rows={4} label="Lý do xóa tài khoản" value={reason} onChange={(e) => setReason(e.target.value)} error={err.reason} />
            <FormField label='Gõ "XÓA" để xác nhận' value={confirm} onChange={(e) => setConfirm(e.target.value)} error={err.confirm} />
            <button className={btnDanger}>Gửi yêu cầu xóa</button>
          </form>
        )}
      </div>
      <Link to="/ho-so" className="mt-6 inline-block text-[13px] text-muted hover:text-brand">← Quay lại hồ sơ</Link>
    </div>
  )
}
