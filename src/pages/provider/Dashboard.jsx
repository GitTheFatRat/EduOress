import { BookOpen, Clock, Users, Wallet } from 'lucide-react'
import StatCard from '../../components/ui/StatCard.jsx'
import BarChart from '../../components/ui/BarChart.jsx'
import DataTable from '../../components/ui/DataTable.jsx'
import PageHeader from '../../components/ui/PageHeader.jsx'
import { StatusBadge } from '../../components/ui/Badge.jsx'
import { card } from '../../components/ui/styles.js'
import { useOwn } from '../../hooks/useOwn.js'
import { useTransactions } from '../../hooks/useData.js'
import { dateVN, vnd } from '../../lib/format.js'
import { monthlySeries, sum } from '../../lib/stats.js'

export default function Dashboard() {
  const { user, mine } = useOwn()
  const tx = useTransactions().items.filter((t) => t.ownerId === user.id)
  const ok = tx.filter((t) => t.status === 'SUCCESS')
  return (
    <>
      <PageHeader title="Tổng quan" subtitle={`Xin chào ${user.fullName}, đây là tình hình khóa học của bạn.`} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Khóa học đang bán" value={mine.filter((c) => c.status === 'PUBLISHED').length} hint={`${mine.length} khóa tất cả`} icon={BookOpen} />
        <StatCard label="Tổng học viên" value={sum(mine, (c) => c.students)} icon={Users} />
        <StatCard label="Doanh thu thực nhận" value={vnd(sum(ok, (t) => t.providerRevenue))} hint="Sau phí nền tảng 10%" icon={Wallet} />
        <StatCard label="Chờ duyệt" value={mine.filter((c) => c.status === 'PENDING_REVIEW').length} icon={Clock} />
      </div>
      <section className={`${card} mt-6 p-5`}>
        <h2 className="mb-4 font-display text-base font-bold">Doanh thu 6 tháng gần nhất</h2>
        <BarChart data={monthlySeries(tx, 'providerRevenue')} label="Doanh thu theo tháng" />
      </section>
      <h2 className="mb-3 mt-8 font-display text-base font-bold">Đăng ký gần đây</h2>
      <DataTable
        rows={tx.slice(0, 6)}
        empty="Chưa có đăng ký nào."
        columns={[
          { header: 'Ngày', cell: (t) => dateVN(t.createdAt) },
          { header: 'Học viên', key: 'userName' },
          { header: 'Khóa học', key: 'courseTitle' },
          { header: 'Thực nhận', cell: (t) => vnd(t.providerRevenue) },
          { header: 'Trạng thái', cell: (t) => <StatusBadge status={t.status} /> },
        ]}
      />
    </>
  )
}
