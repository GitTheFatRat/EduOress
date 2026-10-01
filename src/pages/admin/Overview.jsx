import { Link } from 'react-router-dom'
import { BookOpen, Store, Users, Wallet } from 'lucide-react'
import StatCard from '../../components/ui/StatCard.jsx'
import BarChart from '../../components/ui/BarChart.jsx'
import DataTable from '../../components/ui/DataTable.jsx'
import PageHeader from '../../components/ui/PageHeader.jsx'
import { StatusBadge } from '../../components/ui/Badge.jsx'
import { card } from '../../components/ui/styles.js'
import { useAuth } from '../../hooks/useAuth.js'
import { useCourses, useProviders, useTransactions } from '../../hooks/useData.js'
import { dateVN, vnd } from '../../lib/format.js'
import { monthlySeries, sum } from '../../lib/stats.js'

export default function Overview() {
  const { users } = useAuth()
  const { courses } = useCourses()
  const providers = useProviders().items
  const tx = useTransactions().items
  const ok = tx.filter((t) => t.status === 'SUCCESS')
  const pendingP = providers.filter((p) => p.status === 'PENDING').length
  const pendingC = courses.filter((c) => c.status === 'PENDING_REVIEW').length
  return (
    <>
      <PageHeader title="Tổng quan hệ thống" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Người dùng" value={users.filter((u) => u.role !== 'ADMIN').length} icon={Users} />
        <StatCard label="Nhà cung cấp" value={providers.filter((p) => p.status === 'APPROVED').length} icon={Store} />
        <StatCard label="Khóa học đang bán" value={courses.filter((c) => c.status === 'PUBLISHED').length} icon={BookOpen} />
        <StatCard label="Tổng giao dịch" value={vnd(sum(ok, (t) => t.amount))} hint={`Phí nền tảng: ${vnd(sum(ok, (t) => t.platformFee))}`} icon={Wallet} />
      </div>
      {(pendingP > 0 || pendingC > 0) && (
        <div className="mt-6 flex flex-wrap gap-3 text-[13px]">
          {pendingP > 0 && <Link to="/admin/providers/pending" className="rounded-full bg-amber-50 px-4 py-2 font-medium text-amber-700">{pendingP} nhà cung cấp chờ duyệt</Link>}
          {pendingC > 0 && <Link to="/admin/courses/pending" className="rounded-full bg-amber-50 px-4 py-2 font-medium text-amber-700">{pendingC} khóa học chờ duyệt</Link>}
        </div>
      )}
      <section className={`${card} mt-6 p-5`}>
        <h2 className="mb-4 font-display text-base font-bold">Giá trị giao dịch 6 tháng gần nhất</h2>
        <BarChart data={monthlySeries(tx, 'amount')} label="Giao dịch theo tháng" />
      </section>
      <h2 className="mb-3 mt-8 font-display text-base font-bold">Giao dịch gần đây</h2>
      <DataTable rows={tx.slice(0, 6)} columns={[
        { header: 'Ngày', cell: (t) => dateVN(t.createdAt) },
        { header: 'Khách hàng', key: 'userName' },
        { header: 'Khóa học', key: 'courseTitle' },
        { header: 'Số tiền', cell: (t) => vnd(t.amount) },
        { header: 'Trạng thái', cell: (t) => <StatusBadge status={t.status} /> },
      ]} />
    </>
  )
}
