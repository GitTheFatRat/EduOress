import { Link, Navigate, useParams } from 'react-router-dom'
import StatCard from '../../../components/ui/StatCard.jsx'
import BarChart from '../../../components/ui/BarChart.jsx'
import DataTable from '../../../components/ui/DataTable.jsx'
import PageHeader from '../../../components/ui/PageHeader.jsx'
import { StatusBadge } from '../../../components/ui/Badge.jsx'
import { btnOutline, card } from '../../../components/ui/styles.js'
import { useOwn } from '../../../hooks/useOwn.js'
import { useTransactions } from '../../../hooks/useData.js'
import { dateVN, vnd } from '../../../lib/format.js'
import { monthlySeries, sum } from '../../../lib/stats.js'
import { methodLabels } from '../../../lib/status.js'

export default function RevenueDetail() {
  const { courseId } = useParams()
  const { mine } = useOwn()
  const txAll = useTransactions().items
  const course = mine.find((c) => String(c.id) === courseId)
  if (!course) return <Navigate to="/provider/revenue" replace />
  const tx = txAll.filter((t) => t.courseId === course.id)
  const ok = tx.filter((t) => t.status === 'SUCCESS')
  return (
    <>
      <PageHeader title={course.title} subtitle="Chi tiết doanh thu từng giao dịch" actions={<Link to="/provider/revenue" className={btnOutline}>Quay lại</Link>} />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Tổng thu từ học viên" value={vnd(sum(ok, (t) => t.amount))} />
        <StatCard label="Phí nền tảng" value={vnd(sum(ok, (t) => t.platformFee))} />
        <StatCard label="Thực nhận" value={vnd(sum(ok, (t) => t.providerRevenue))} />
      </div>
      <section className={`${card} mt-6 p-5`}><BarChart data={monthlySeries(tx, 'providerRevenue')} label="Doanh thu theo tháng" /></section>
      <div className="mt-6">
        <DataTable rows={tx} empty="Khóa học chưa có giao dịch." columns={[
          { header: 'Ngày', cell: (t) => dateVN(t.createdAt) },
          { header: 'Học viên', key: 'userName' },
          { header: 'Thanh toán', cell: (t) => methodLabels[t.method] },
          { header: 'Học viên trả', cell: (t) => vnd(t.amount) },
          { header: 'Thực nhận', cell: (t) => vnd(t.providerRevenue) },
          { header: 'Trạng thái', cell: (t) => <StatusBadge status={t.status} /> },
        ]} />
      </div>
    </>
  )
}
