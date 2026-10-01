import { Link } from 'react-router-dom'
import { Clock, Users } from 'lucide-react'
import { formatPrice } from '../data/mock.js'

export default function CourseCard({ course }) {
  const { icon: Icon } = course
  const free = course.price === 0
  return (
    <article className="group flex flex-col overflow-hidden rounded-card border border-line bg-white transition duration-200 hover:shadow-lift">
      <Link to={`/khoa-hoc/${course.slug}`} className="relative block" aria-label={course.title}>
        <div className={`grid aspect-[16/10] place-items-center bg-gradient-to-br ${course.tone}`}>
          <Icon className="h-14 w-14 text-ink/70" strokeWidth={1.25} aria-hidden />
        </div>
        <span className="absolute left-3 top-3 rounded bg-ink px-2 py-1 text-[11px] font-medium text-white">
          {course.category}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs text-muted">bởi <span className="font-medium text-ink">{course.provider}</span></p>
        <h3 className="mt-1.5 text-[15px] font-semibold leading-snug group-hover:text-brand">
          <Link to={`/khoa-hoc/${course.slug}`}>{course.title}</Link>
        </h3>
        <div className="mt-3 flex items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-brand" aria-hidden />{course.weeks} tuần</span>
          <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-brand" aria-hidden />{course.students} học viên</span>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
          <p className="flex items-baseline gap-2 text-sm">
            {course.oldPrice > course.price && <span className="text-xs text-muted line-through">{new Intl.NumberFormat('vi-VN').format(course.oldPrice)} ₫</span>}
            <span className={`font-bold ${free ? 'text-free' : 'text-sale'}`}>{formatPrice(course.price)}</span>
          </p>
          <Link to={`/khoa-hoc/${course.slug}`} className="text-xs font-medium hover:text-brand">Xem chi tiết</Link>
        </div>
      </div>
    </article>
  )
}
