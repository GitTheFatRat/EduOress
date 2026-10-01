import { Link } from 'react-router-dom'
import { Receipt, Users, Wallet } from 'lucide-react'
import StatCard from '../../../components/ui/StatCard.jsx'
import BarChart from '../../../components/ui/BarChart.jsx'
import DataTable from '../../../components/ui/DataTable.jsx'
import PageHeader from '../../../components/ui/PageHeader.jsx'
import { btnSm, card } from '../../../components/ui/styles.js'
import { useOwn } from '../../../hooks/useOwn.js'
import { useTransactions } from '../../../hooks/useData.js'
import { vnd } from '../../../lib/format.js'
import { monthlySeries, sum } from '../../../lib/stats.js'

export default function RevenueReport() {
  const { user, mine } = useOwn()
  const tx = useTransactions().items.filter((t) => t.ownerId === user.id)
  const ok = tx.filter((t) => t.status === 'SUCCESS')
  const rows = mine.map((c) => {
    const list = ok.filter((t) => t.courseId === c.id)
    return { id: c.id, title: c.title, orders: list.length, revenue: sum(list, (t) => t.providerRevenue) }
  })
  return (
    <>
      <PageHeader title="Báo cáo doanh thu" subtitle="Doanh thu thực nhận là số tiền sau khi trừ phí nền tảng 10%." />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Doanh thu thực nhận" value={vnd(sum(ok, (t) => t.providerRevenue))} icon={Wallet} />
        <StatCard label="Đăng ký thành công" value={ok.length} icon={Receipt} />
        <StatCard label="Khách hàng khác nhau" value={new Set(ok.map((t) => t.userId)).size} icon={Users} />
      </div>
      <section className={`${card} mt-6 p-5`}>
        <h2 className="mb-4 font-display text-base font-bold">Theo tháng</h2>
        <BarChart data={monthlySeries(tx, 'providerRevenue')} label="Doanh thu theo tháng" />
      </section>
      <h2 className="mb-3 mt-8 font-display text-base font-bold">Theo khóa học</h2>
      <DataTable rows={rows} empty="Chưa có khóa học." columns={[
        { header: 'Khóa học', key: 'title' },
        { header: 'Lượt đăng ký', key: 'orders' },
        { header: 'Thực nhận', cell: (r) => vnd(r.revenue) },
        { header: '', className: 'text-right', cell: (r) => <Link to={`/provider/revenue/${r.id}`} className={btnSm}>Chi tiết</Link> },
      ]} />
    </>
  )
}
