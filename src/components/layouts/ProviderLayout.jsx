import { BarChart3, BookOpen, Gift, LayoutDashboard, Percent, Ticket } from 'lucide-react'
import DashboardLayout from './DashboardLayout.jsx'

const nav = [
  { to: '/provider', label: 'Tổng quan', icon: LayoutDashboard, end: true },
  { to: '/provider/courses', label: 'Khóa học', icon: BookOpen },
  { section: 'Khuyến mãi' },
  { to: '/provider/discounts', label: 'Mã giảm giá', icon: Ticket },
  { to: '/provider/promotions', label: 'Chương trình ưu đãi', icon: Percent },
  { to: '/provider/gifts', label: 'Quà tặng', icon: Gift },
  { section: 'Báo cáo' },
  { to: '/provider/revenue', label: 'Doanh thu', icon: BarChart3 },
]

export default function ProviderLayout() {
  return <DashboardLayout title="Nhà cung cấp" nav={nav} />
}
