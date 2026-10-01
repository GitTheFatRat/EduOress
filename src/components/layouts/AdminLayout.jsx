import { BadgeCheck, BarChart3, Bell, BookOpen, CreditCard, FileText, Headset, LayoutDashboard, Lock, Store, Users, Wallet } from 'lucide-react'
import DashboardLayout from './DashboardLayout.jsx'
import { useCourses, useProviders } from '../../hooks/useData.js'

export default function AdminLayout() {
  const { raw } = useCourses()
  const providers = useProviders().items
  const pendingProviders = providers.filter((p) => p.status === 'PENDING').length
  const pendingCourses = raw.filter((c) => c.status === 'PENDING_REVIEW').length
  const nav = [
    { to: '/admin', label: 'Tổng quan', icon: LayoutDashboard, end: true },
    { section: 'Nhà cung cấp' },
    { to: '/admin/providers/pending', label: 'Duyệt nhà cung cấp', icon: BadgeCheck, badge: pendingProviders },
    { to: '/admin/providers', label: 'Quản lý nhà cung cấp', icon: Store, end: true },
    { to: '/admin/providers/reviews', label: 'Đánh giá nhà cung cấp', icon: BarChart3 },
    { section: 'Khóa học' },
    { to: '/admin/courses/pending', label: 'Duyệt khóa học', icon: BadgeCheck, badge: pendingCourses },
    { to: '/admin/courses', label: 'Quản lý khóa học', icon: BookOpen, end: true },
    { section: 'Khách hàng' },
    { to: '/admin/customers', label: 'Người dùng', icon: Users },
    { to: '/admin/payments', label: 'Thanh toán', icon: CreditCard },
    { section: 'Hệ thống' },
    { to: '/admin/notifications', label: 'Thông báo', icon: Bell },
    { to: '/admin/finance', label: 'Tài chính', icon: Wallet },
    { to: '/admin/support', label: 'Hỗ trợ kỹ thuật', icon: Headset },
    { to: '/admin/content', label: 'Nội dung hệ thống', icon: FileText },
    { to: '/admin/access', label: 'Phân quyền', icon: Lock },
  ]
  return <DashboardLayout title="Quản trị" nav={nav} />
}
