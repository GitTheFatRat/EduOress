import { useState } from 'react'
import DataTable from '../../components/ui/DataTable.jsx'
import PageHeader from '../../components/ui/PageHeader.jsx'
import FormField from '../../components/ui/FormField.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { useConfirm } from '../../components/ui/Modal.jsx'
import { btnPrimary, btnSmDanger, card } from '../../components/ui/styles.js'
import { useNotifications } from '../../hooks/useData.js'
import { dateTimeVN } from '../../lib/format.js'

const audiences = { ALL: 'Tất cả người dùng', PROVIDER: 'Nhà cung cấp', CUSTOMER: 'Khách hàng' }
const types = { SYSTEM: 'Hệ thống', COURSE: 'Khóa học', PROMOTION: 'Ưu đãi', PAYMENT: 'Thanh toán' }

export default function NotificationManagement() {
  const n = useNotifications()
  const [confirmUI, ask] = useConfirm()
  const [form, setForm] = useState({ audience: 'ALL', type: 'SYSTEM', title: '', body: '' })
  const [err, setErr] = useState({})
  const [sent, setSent] = useState(false)
  const set = (k) => (e) => { setSent(false); setForm({ ...form, [k]: e.target.value }) }
  const history = n.items.filter((x) => audiences[x.audience]).sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const submit = (e) => {
    e.preventDefault()
    const next = {}
    if (form.title.trim().length < 3) next.title = 'Nhập tiêu đề.'
    if (form.body.trim().length < 10) next.body = 'Nội dung cần ít nhất 10 ký tự.'
    setErr(next)
    if (Object.keys(next).length) return
    n.notify(form.audience, form.title.trim(), form.body.trim(), form.type)
    setForm({ ...form, title: '', body: '' })
    setSent(true)
  }

  return (
    <>
      <PageHeader title="Quản lý thông báo" subtitle="Gửi thông báo đến nhà cung cấp hoặc khách hàng. Người nhận thấy ở mục Thông báo." />
      <form onSubmit={submit} noValidate className={`${card} grid gap-5 p-6 md:grid-cols-2`}>
        <FormField as="select" label="Gửi đến" value={form.audience} onChange={set('audience')}>{Object.entries(audiences).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</FormField>
        <FormField as="select" label="Loại" value={form.type} onChange={set('type')}>{Object.entries(types).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</FormField>
        <FormField label="Tiêu đề" value={form.title} onChange={set('title')} error={err.title} className="md:col-span-2" />
        <FormField as="textarea" rows={4} label="Nội dung" value={form.body} onChange={set('body')} error={err.body} className="md:col-span-2" />
        <div className="flex items-center gap-3 md:col-span-2">
          <button className={btnPrimary}>Gửi thông báo</button>
          {sent && <p role="status" className="text-[13px] text-free">Đã gửi thông báo.</p>}
        </div>
      </form>
      <h2 className="mb-3 mt-8 font-display text-base font-bold">Đã gửi</h2>
      <DataTable rows={history} empty="Chưa gửi thông báo nào." columns={[
        { header: 'Thời gian', cell: (x) => dateTimeVN(x.createdAt) },
        { header: 'Người nhận', cell: (x) => <Badge tone="brand">{audiences[x.audience]}</Badge> },
        { header: 'Nội dung', cell: (x) => <div><p className="font-medium">{x.title}</p><p className="text-xs text-muted">{x.body}</p></div> },
        { header: '', className: 'text-right', cell: (x) => <button className={btnSmDanger} onClick={() => ask(`Xóa thông báo "${x.title}"? Người nhận sẽ không còn thấy.`, () => n.remove(x.id), { danger: true, okLabel: 'Xóa' })}>Xóa</button> },
      ]} />
      {confirmUI}
    </>
  )
}
