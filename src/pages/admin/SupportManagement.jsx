import { useState } from 'react'
import DataTable from '../../components/ui/DataTable.jsx'
import PageHeader from '../../components/ui/PageHeader.jsx'
import FormField from '../../components/ui/FormField.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { StatusBadge } from '../../components/ui/Badge.jsx'
import { btnOutline, btnPrimary, btnSm } from '../../components/ui/styles.js'
import { useTickets } from '../../hooks/useData.js'
import { dateTimeVN } from '../../lib/format.js'
import { statusMeta } from '../../lib/status.js'

const STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']

export default function SupportManagement() {
  const tickets = useTickets()
  const [filter, setFilter] = useState('ALL')
  const [open, setOpen] = useState(null)
  const rows = [...tickets.items].filter((t) => filter === 'ALL' || t.status === filter).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const save = () => { tickets.update(open.id, { reply: open.reply.trim(), status: open.status }); setOpen(null) }

  return (
    <>
      <PageHeader title="Hỗ trợ kỹ thuật" subtitle="Yêu cầu từ trang Liên hệ và từ người dùng."
        actions={<select aria-label="Lọc trạng thái" value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-full border border-line bg-white px-3 py-1.5 text-[13px]">
          <option value="ALL">Tất cả</option>{STATUSES.map((s) => <option key={s} value={s}>{statusMeta[s].label}</option>)}</select>} />
      <DataTable rows={rows} empty="Không có yêu cầu nào." columns={[
        { header: 'Thời gian', cell: (t) => dateTimeVN(t.createdAt) },
        { header: 'Người gửi', cell: (t) => <div><p className="font-medium">{t.userName}</p><p className="text-xs text-muted">{t.email}</p></div> },
        { header: 'Tiêu đề', key: 'subject' },
        { header: 'Trạng thái', cell: (t) => <StatusBadge status={t.status} /> },
        { header: '', className: 'text-right', cell: (t) => <button className={btnSm} onClick={() => setOpen({ ...t, reply: t.reply ?? '' })}>Xử lý</button> },
      ]} />
      <Modal open={Boolean(open)} onClose={() => setOpen(null)} title={open?.subject} wide
        footer={<><button className={btnOutline} onClick={() => setOpen(null)}>Hủy</button><button className={btnPrimary} onClick={save}>Lưu</button></>}>
        {open && <div className="space-y-4">
          <p className="rounded-lg bg-surface p-3.5 leading-6">{open.message}</p>
          <FormField as="textarea" rows={4} label="Phản hồi" value={open.reply} onChange={(e) => setOpen({ ...open, reply: e.target.value })} hint={`Gửi tới ${open.email}`} />
          <FormField as="select" label="Trạng thái" value={open.status} onChange={(e) => setOpen({ ...open, status: e.target.value })}>
            {STATUSES.map((s) => <option key={s} value={s}>{statusMeta[s].label}</option>)}</FormField>
        </div>}
      </Modal>
    </>
  )
}
