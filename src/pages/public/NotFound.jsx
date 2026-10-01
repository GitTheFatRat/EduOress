import { Link } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import { btnOutline, btnPrimary, container } from '../../components/ui/styles.js'

export default function NotFound() {
  return (
    <div className={`${container} py-24 text-center`}>
      <div className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-brand-soft"><SearchX className="h-12 w-12 text-brand" strokeWidth={1.25} aria-hidden /></div>
      <p className="mt-6 font-display text-5xl font-extrabold text-brand">404</p>
      <h1 className="mt-2 text-2xl font-bold">Không tìm thấy trang</h1>
      <p className="mx-auto mt-2 max-w-sm text-[13px] text-muted">Đường dẫn có thể đã thay đổi hoặc không còn tồn tại.</p>
      <div className="mt-6 flex justify-center gap-3"><Link to="/" className={btnPrimary}>Về trang chủ</Link><Link to="/khoa-hoc" className={btnOutline}>Xem khóa học</Link></div>
    </div>
  )
}
