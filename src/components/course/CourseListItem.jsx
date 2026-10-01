import { Link } from 'react-router-dom'
import { BookOpen, Clock, Signal, Users } from 'lucide-react'
import { formatPrice } from '../../data/mock.js'
import { levelLabels } from '../../data/courses.js'
import Rating from '../ui/Rating.jsx'

export default function CourseListItem({ course }) {
  const { icon: Icon } = course
  const free = course.price === 0
  const to = `/khoa-hoc/${course.slug}`
  return (
    <article className="group flex flex-col overflow-hidden rounded-card border border-line bg-white transition duration-200 hover:shadow-lift sm:flex-row">
      <Link to={to} aria-label={course.title} className="relative block shrink-0 sm:w-64">
        <div className={`grid aspect-[16/10] h-full w-full place-items-center bg-gradient-to-br sm:aspect-auto ${course.tone}`}>
          <Icon className="h-12 w-12 text-ink/70" strokeWidth={1.25} aria-hidden />
        </div>
        <span className="absolute left-3 top-3 rounded bg-ink px-2 py-1 text-[11px] font-medium text-white">{course.category}</span>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs text-muted">bởi <span className="font-medium text-ink">{course.provider}</span></p>
        <h3 className="mt-1 text-base font-semibold leading-snug group-hover:text-brand">
          <Link to={to}>{course.title}</Link>
        </h3>
        <div className="mt-1.5 flex items-center gap-2 text-xs text-muted">
          <Rating value={course.rating} size="h-3.5 w-3.5" />
          <span>{course.rating.toFixed(1)} ({course.ratingCount})</span>
        </div>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted">
          <li className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-brand" aria-hidden />{course.weeks} tuần</li>
          <li className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-brand" aria-hidden />{course.students} học viên</li>
          <li className="flex items-center gap-1.5"><Signal className="h-3.5 w-3.5 text-brand" aria-hidden />{levelLabels[course.level]}</li>
          <li className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5 text-brand" aria-hidden />{course.lessonCount} bài học</li>
        </ul>
        <div className="mt-4 flex items-center justify-between pt-1 sm:mt-auto">
          <p className="flex items-baseline gap-2 text-sm">
            {course.oldPrice > course.price && <span className="text-xs text-muted line-through">{new Intl.NumberFormat('vi-VN').format(course.oldPrice)} ₫</span>}
            <span className={`font-bold ${free ? 'text-free' : 'text-sale'}`}>{formatPrice(course.price)}</span>
          </p>
          <Link to={to} className="text-xs font-medium hover:text-brand">Xem chi tiết</Link>
        </div>
      </div>
    </article>
  )
}
