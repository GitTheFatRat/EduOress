import { useState } from 'react'
import DataTable from '../../../components/ui/DataTable.jsx'
import PageHeader from '../../../components/ui/PageHeader.jsx'
import Rating from '../../../components/ui/Rating.jsx'
import { Modal } from '../../../components/ui/Modal.jsx'
import { btnOutline, btnSm } from '../../../components/ui/styles.js'
import { useCourses, useProviders } from '../../../hooks/useData.js'

export default function ProviderReviews() {
  const { courses } = useCourses()
  const [open, setOpen] = useState(null)
  const rows = useProviders().items.filter((p) => p.status === 'APPROVED' || p.status === 'SUSPENDED').map((p) => {
    const own = courses.filter((c) => c.provider === p.name)
    const count = own.reduce((n, c) => n + c.ratingCount, 0)
    const avg = count ? own.reduce((n, c) => n + c.rating * c.ratingCount, 0) / count : 0
    return { ...p, own, count, avg }
  })
  return (
    <>
      <PageHeader title="Đánh giá nhà cung cấp" subtitle="Tổng hợp từ đánh giá của học viên ở các khóa học của từng nhà cung cấp." />
      <DataTable rows={rows} columns={[
        { header: 'Nhà cung cấp', cell: (p) => <span className="font-medium">{p.name}</span> },
        { header: 'Khóa học', cell: (p) => p.own.length },
        { header: 'Số đánh giá', key: 'count' },
        { header: 'Điểm trung bình', cell: (p) => (p.count ? <span className="flex items-center gap-2"><Rating value={p.avg} />{p.avg.toFixed(1)}</span> : <span className="text-muted">Chưa có</span>) },
        { header: '', className: 'text-right', cell: (p) => <button className={btnSm} onClick={() => setOpen(p)}>Chi tiết</button> },
      ]} />
      <Modal open={Boolean(open)} onClose={() => setOpen(null)} title={open?.name} wide footer={<button className={btnOutline} onClick={() => setOpen(null)}>Đóng</button>}>
        <ul className="divide-y divide-line">
          {open?.own.map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-3 py-2.5">
              <span>{c.title}</span>
              <span className="flex shrink-0 items-center gap-2 text-xs text-muted">{c.ratingCount ? <><Rating value={c.rating} size="h-3 w-3" />{c.rating.toFixed(1)} ({c.ratingCount})</> : 'Chưa có đánh giá'}</span>
            </li>
          ))}
        </ul>
      </Modal>
    </>
  )
}
