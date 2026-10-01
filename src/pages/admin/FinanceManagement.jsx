import { useState } from 'react'
import { Coins, Receipt, TrendingUp, Undo2 } from 'lucide-react'
import StatCard from '../../components/ui/StatCard.jsx'
import BarChart from '../../components/ui/BarChart.jsx'
import DataTable from '../../components/ui/DataTable.jsx'
import PageHeader from '../../components/ui/PageHeader.jsx'
import FormField from '../../components/ui/FormField.jsx'
import { btnOutline, btnPrimary, btnSmDanger, card } from '../../components/ui/styles.js'
import { useCosts, useCourses, useTransactions } from '../../hooks/useData.js'
import { dateVN, vnd } from '../../lib/format.js'
import { monthlySeries, sum } from '../../lib/stats.js'

export default function FinanceManagement() {
  const tx = useTransactions().items
  const costs = useCosts()
  const { courses } = useCourses()
  const [form, setForm] = useState({ label: '', amount: '', date: new Date().toISOString().slice(0, 10) })
  const [err, setErr] = useState({})
  const ok = tx.filter((t) => t.status === 'SUCCESS')
  const fee = sum(ok, (t) => t.platformFee)
  const totalCost = sum(costs.items, (c) => c.amount)

  const providerOf = new Map(courses.map((c) => [c.id, c.provider]))
  const byProvider = [...ok.reduce((m, t) => {
    const name = providerOf.get(t.courseId) ?? '—'
    const r = m.get(name) ?? { id: name, name, orders: 0, gross: 0, fee: 0, payout: 0 }
    r.orders += 1; r.gross += t.amount; r.fee += t.platformFee; r.payout += t.providerRevenue
    return m.set(name, r)
  }, new Map()).values()].sort((a, b) => b.gross - a.gross)

  const addCost = (e) => {
    e.preventDefault()
    const next = {}
    if (form.label.trim().length < 3) next.label = 'Nhập nội dung chi phí.'
    if (!(Number(form.amount) > 0)) next.amount = 'Nhập số tiền lớn hơn 0.'
    setErr(next)
    if (Object.keys(next).length) return
    costs.add({ label: form.label.trim(), amount: Number(form.amount), date: form.date })
    setForm({ ...form, label: '', amount: '' })
  }

  return (
    <>
      <PageHeader title="Quản lý tài chính" subtitle="Doanh thu của nền tảng là phí 10% trên mỗi giao dịch thành công." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Tổng giao dịch" value={vnd(sum(ok, (t) => t.amount))} icon={Receipt} />
        <StatCard label="Doanh thu nền tảng (phí)" value={vnd(fee)} icon={Coins} />
        <StatCard label="Lợi nhuận" value={vnd(fee - totalCost)} hint={`Sau chi phí ${vnd(totalCost)}`} icon={TrendingUp} />
        <StatCard label="Đã hoàn tiền" value={vnd(sum(tx.filter((t) => t.status === 'REFUNDED'), (t) => t.amount))} icon={Undo2} />
      </div>

      <section className={`${card} mt-6 p-5`}>
        <h2 className="mb-4 font-display text-base font-bold">Doanh thu nền tảng theo tháng</h2>
        <BarChart data={monthlySeries(tx, 'platformFee')} label="Phí nền tảng theo tháng" />
      </section>

      <h2 className="mb-3 mt-8 font-display text-base font-bold">Chi trả cho nhà cung cấp</h2>
      <DataTable rows={byProvider} empty="Chưa có giao dịch." columns={[
        { header: 'Nhà cung cấp', key: 'name' }, { header: 'Lượt đăng ký', key: 'orders' },
        { header: 'Tổng thu', cell: (r) => vnd(r.gross) }, { header: 'Phí nền tảng', cell: (r) => vnd(r.fee) }, { header: 'Chi trả', cell: (r) => vnd(r.payout) },
      ]} />

      <h2 className="mb-3 mt-8 font-display text-base font-bold">Chi phí vận hành</h2>
      <form onSubmit={addCost} noValidate className={`${card} mb-4 grid gap-4 p-5 md:grid-cols-[1fr_180px_160px_auto] md:items-start`}>
        <FormField label="Nội dung" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} error={err.label} />
        <FormField label="Số tiền (₫)" type="number" min={0} step={1000} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} error={err.amount} />
        <FormField label="Ngày" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        <button className={`${btnPrimary} md:mt-7`}>Thêm</button>
      </form>
      <DataTable rows={[...costs.items].sort((a, b) => b.date.localeCompare(a.date))} empty="Chưa có chi phí." columns={[
        { header: 'Ngày', cell: (c) => dateVN(c.date) }, { header: 'Nội dung', key: 'label' }, { header: 'Số tiền', cell: (c) => vnd(c.amount) },
        { header: '', className: 'text-right', cell: (c) => <button className={btnSmDanger} onClick={() => costs.remove(c.id)}>Xóa</button> },
      ]} />
    </>
  )
}
