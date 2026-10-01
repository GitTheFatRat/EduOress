import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BookOpen, Check, Clock, Signal, Users } from 'lucide-react'
import Breadcrumb from '../../components/ui/Breadcrumb.jsx'
import Tabs from '../../components/ui/Tabs.jsx'
import Accordion from '../../components/ui/Accordion.jsx'
import Rating from '../../components/ui/Rating.jsx'
import CurriculumList from '../../components/course/CurriculumList.jsx'
import ReviewList from '../../components/course/ReviewList.jsx'
import ReviewForm from '../../components/course/ReviewForm.jsx'
import { levelLabels } from '../../data/courses.js'
import { groupSections } from '../../data/lessons.js'
import { useCourses, useLessons, useCourseReviews, useReviewsStore, useIsEnrolled } from '../../hooks/useData.js'
import { formatPrice } from '../../data/mock.js'
import { useAuth } from '../../hooks/useAuth.js'

const tabs = [
  { id: 'overview', label: 'Tổng quan' },
  { id: 'curriculum', label: 'Nội dung khóa học' },
  { id: 'instructor', label: 'Nhà cung cấp' },
  { id: 'faqs', label: 'Hỏi đáp' },
  { id: 'reviews', label: 'Đánh giá' },
]

const faqs = [
  ['Khóa học này dành cho ai?', 'Xem mục cấp độ ở đầu trang. Bạn có thể xem thử các bài có nhãn "Xem thử" trước khi đăng ký.'],
  ['Tôi có xem lại video được không?', 'Có. Sau khi đăng ký, bạn xem lại video bao nhiêu lần cũng được.'],
  ['Khóa học có tài liệu đi kèm không?', 'Mỗi bài giảng có thể kèm tài liệu để tải về, tùy nhà cung cấp.'],
  ['Tôi có dùng được mã giảm giá không?', 'Có. Nhập mã ở bước thanh toán, mã hợp lệ sẽ được trừ vào giá khóa học.'],
]

const formatOld = (n) => new Intl.NumberFormat('vi-VN').format(n) + ' ₫'

function ReviewsTab({ course, user, enrolled }) {
  const reviews = useCourseReviews(course)
  const store = useReviewsStore()
  const submit = ({ rating, text }) => {
    const mine = store.items.find((r) => r.courseId === course.id && r.userId === user.id)
    const data = { courseId: course.id, userId: user.id, name: user.fullName, date: new Date().toLocaleDateString('vi-VN'), rating, text }
    if (mine) store.update(mine.id, data)
    else store.add(data)
  }
  return (
    <>
      <ReviewList key={reviews.length} reviews={reviews} />
      <ReviewForm onSubmit={submit} canReview={enrolled} reason={user ? 'enroll' : 'login'} />
    </>
  )
}

export default function CourseDetail() {
  const { user } = useAuth()
  const { slug } = useParams()
  const { published } = useCourses()
  const course = published.find((c) => c.slug === slug)
  const lessonsAll = useLessons().items
  const enrolled = useIsEnrolled(user, course)
  const [tab, setTab] = useState('overview')
  const sections = useMemo(
    () => (course ? groupSections(lessonsAll.filter((l) => l.courseId === course.id && l.moderation === 'APPROVED')) : []),
    [course, lessonsAll],
  )

  if (!course) {
    return (
      <div className="mx-auto max-w-[1140px] px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Không tìm thấy khóa học</h1>
        <p className="mt-2 text-muted">Khóa học có thể đã bị gỡ hoặc đường dẫn chưa đúng.</p>
        <Link to="/khoa-hoc" className="mt-6 inline-flex rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-dark">
          Xem tất cả khóa học
        </Link>
      </div>
    )
  }

  const { icon: Icon } = course
  const free = course.price === 0
  const providerCourses = published.filter((c) => c.provider === course.provider)
  const stats = { courses: providerCourses.length, students: providerCourses.reduce((n, c) => n + c.students, 0) }

  return (
    <>
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Khóa học', to: '/khoa-hoc' }, { label: course.title }]} />

      <div className="bg-ink text-white">
        <div className="relative mx-auto max-w-[1140px] px-4 py-10">
          <div className="lg:pr-[380px]">
            <p className="flex items-center gap-2 text-[13px]">
              <span className="rounded bg-white/15 px-2 py-1 text-[11px] font-medium">{course.category}</span>
              <span className="text-white/70">bởi <span className="font-medium text-white">{course.provider}</span></span>
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">{course.title}</h1>
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-white/75">
              <li className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-brand" aria-hidden />{course.weeks} tuần</li>
              <li className="flex items-center gap-1.5"><Users className="h-4 w-4 text-brand" aria-hidden />{course.students} học viên</li>
              <li className="flex items-center gap-1.5"><Signal className="h-4 w-4 text-brand" aria-hidden />{levelLabels[course.level]}</li>
              <li className="flex items-center gap-1.5"><BookOpen className="h-4 w-4 text-brand" aria-hidden />{course.lessonCount} bài học</li>
              <li className="flex items-center gap-1.5"><Rating value={course.rating} size="h-3.5 w-3.5" />{course.rating.toFixed(1)}</li>
            </ul>
          </div>

          <aside className="mt-8 rounded-card border border-line bg-white p-3 text-ink shadow-lift lg:absolute lg:right-4 lg:top-10 lg:z-10 lg:mt-0 lg:w-[340px]">
            <div className={`grid aspect-[16/10] place-items-center rounded-lg bg-gradient-to-br ${course.tone}`}>
              <Icon className="h-14 w-14 text-ink/70" strokeWidth={1.25} aria-hidden />
            </div>
            <div className="flex items-center justify-between px-1 pb-1 pt-4">
              <p className="flex items-baseline gap-2">
                {course.oldPrice > course.price && <span className="text-xs text-muted line-through">{formatOld(course.oldPrice)}</span>}
                <span className={`font-display text-xl font-bold ${free ? 'text-free' : 'text-sale'}`}>{formatPrice(course.price)}</span>
              </p>
              <Link to={enrolled ? `/hoc/${course.slug}` : `/thanh-toan/${course.slug}`} className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white transition hover:bg-brand-dark">
                {enrolled ? 'Vào học ngay' : free ? 'Học miễn phí' : 'Đăng ký ngay'}
              </Link>
            </div>
          </aside>
        </div>
      </div>

      <div className="mx-auto max-w-[1140px] px-4 py-10 lg:min-h-[420px] lg:pr-[380px]">
        <Tabs tabs={tabs} value={tab} onChange={setTab} label="Thông tin khóa học" />
        <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="rounded-b-card border border-line bg-surface p-6">
          {tab === 'overview' && (
            <div className="space-y-4 text-[13px] leading-7 text-ink/80">
              {course.description.map((p, i) => <p key={i}>{p}</p>)}
              <h2 className="pt-2 font-display text-sm font-bold text-ink">Bạn sẽ học được</h2>
              <ul className="space-y-2">
                {course.objectives.map((o) => (
                  <li key={o} className="flex items-start gap-2.5"><Check className="mt-1 h-4 w-4 shrink-0 text-free" aria-hidden />{o}</li>
                ))}
              </ul>
            </div>
          )}

          {tab === 'curriculum' && <CurriculumList sections={sections} slug={course.slug} />}

          {tab === 'instructor' && (
            <div className="flex flex-col gap-5 sm:flex-row">
              <span className="grid h-28 w-28 shrink-0 place-items-center rounded-lg bg-brand font-display text-5xl font-bold text-white" aria-hidden>
                {course.provider[0]}
              </span>
              <div>
                <h2 className="font-display text-base font-bold">{course.provider}</h2>
                <p className="mt-1 flex gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-brand" aria-hidden />{stats.students} học viên</span>
                  <span className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5 text-brand" aria-hidden />{stats.courses} khóa học</span>
                </p>
                <p className="mt-3 text-[13px] leading-7 text-ink/80">
                  {course.provider} là nhà cung cấp đã được EduPress duyệt. Các khóa học của đơn vị tập trung vào thực hành và có tài liệu đi kèm.
                </p>
              </div>
            </div>
          )}

          {tab === 'faqs' && (
            <div className="space-y-2.5">
              {faqs.map(([q, a], i) => (
                <Accordion key={q} title={q} defaultOpen={i === 0}>
                  <p className="px-4 py-3 text-[13px] leading-6 text-ink/75">{a}</p>
                </Accordion>
              ))}
            </div>
          )}

          {tab === 'reviews' && <ReviewsTab key={course.id} course={course} user={user} enrolled={enrolled} />}
        </div>
      </div>
    </>
  )
}
