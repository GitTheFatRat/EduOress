import { useState } from 'react'
import DataTable from '../../components/ui/DataTable.jsx'
import PageHeader from '../../components/ui/PageHeader.jsx'
import { StatusBadge } from '../../components/ui/Badge.jsx'
import { useConfirm } from '../../components/ui/Modal.jsx'
import { btnSmDanger } from '../../components/ui/styles.js'
import { useCourses, useEnrollments, useNotifications, useTransactions } from '../../hooks/useData.js'
import { dateTimeVN, vnd } from '../../lib/format.js'
import { methodLabels, statusMeta } from '../../lib/status.js'

export default function PaymentManagement() {
  const tx = useTransactions()
  const enrollments = useEnrollments()
  const { update: updateCourse } = useCourses()
  const { notify } = useNotifications()
  const [status, setStatus] = useState('ALL')
  const [confirmUI, ask] = useConfirm()
  const rows = tx.items.filter((t) => status === 'ALL' || t.status === status)

  const refund = (t) => ask(`Hoàn tiền ${vnd(t.amount)} cho ${t.userName}? Học viên sẽ mất quyền học khóa "${t.courseTitle}".`, () => {
    tx.update(t.id, { status: 'REFUNDED' })
    enrollments.removeWhere((e) => e.transactionId === t.id)
    updateCourse(t.courseId, (c) => ({ students: Math.max((c.students || 0) - 1, 0) }))
    notify(t.userId, 'Giao dịch đã được hoàn tiền', `Bạn đã được hoàn ${vnd(t.amount)} cho khóa "${t.courseTitle}".`, 'PAYMENT')
  }, { danger: true, okLabel: 'Hoàn tiền' })

  return (
    <>
      <PageHeader title="Thanh toán" subtitle="Theo dõi giao dịch của khách hàng."
        actions={
          <select aria-label="Lọc trạng thái" value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-full border border-line bg-white px-3 py-1.5 text-[13px]">
            <option value="ALL">Tất cả trạng thái</option>
            {['SUCCESS', 'FAILED', 'REFUNDED'].map((s) => <option key={s} value={s}>{statusMeta[s].label}</option>)}
          </select>} />
      <DataTable rows={rows} columns={[
        { header: 'Thời gian', cell: (t) => dateTimeVN(t.createdAt) },
        { header: 'Khách hàng', key: 'userName' },
        { header: 'Khóa học', key: 'courseTitle' },
        { header: 'Số tiền', cell: (t) => vnd(t.amount) },
        { header: 'Phương thức', cell: (t) => methodLabels[t.method] },
        { header: 'Trạng thái', cell: (t) => <StatusBadge status={t.status} /> },
        { header: '', className: 'text-right', cell: (t) => t.status === 'SUCCESS' && t.amount > 0 && <button className={btnSmDanger} onClick={() => refund(t)}>Hoàn tiền</button> },
      ]} />
      {confirmUI}
    </>
  )
}
