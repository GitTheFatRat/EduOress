import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { Gift } from 'lucide-react'
import Breadcrumb from '../../components/ui/Breadcrumb.jsx'
import { btnOutline, btnPrimary, card, container } from '../../components/ui/styles.js'
import { useAuth } from '../../hooks/useAuth.js'
import { useCourses, useDiscounts, useEnrollments, useGifts, useNotifications, usePromotions, useTransactions } from '../../hooks/useData.js'
import { PLATFORM_FEE_RATE, activePromotion, computePrice, validateCode } from '../../lib/pricing.js'
import { vnd } from '../../lib/format.js'
import { methodLabels } from '../../lib/status.js'

const METHODS = ['MOMO', 'VNPAY', 'BANK_TRANSFER', 'CARD']

export default function Checkout() {
  const { slug } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { published, update: updateCourse } = useCourses()
  const enrollments = useEnrollments()
  const transactions = useTransactions()
  const discounts = useDiscounts()
  const promotions = usePromotions()
  const gifts = useGifts()
  const { notify } = useNotifications()
  const [code, setCode] = useState('')
  const [applied, setApplied] = useState(null)
  const [codeError, setCodeError] = useState('')
  const [method, setMethod] = useState('MOMO')

  const course = published.find((c) => c.slug === slug)
  if (!course) return <Navigate to="/khoa-hoc" replace />
  if (enrollments.items.some((e) => e.userId === user.id && e.courseId === course.id)) return <Navigate to={`/hoc/${slug}`} replace />

  const promotion = activePromotion(course, promotions.items)
  const price = computePrice(course, promotion, applied)
  const courseGifts = gifts.items.filter((g) => g.courseId === course.id)
  const { icon: Icon } = course

  const applyCode = (e) => {
    e.preventDefault()
    const res = validateCode(code, course, discounts.items)
    setCodeError(res.error ?? '')
    setApplied(res.discount ?? null)
  }

  const confirm = () => {
    const fee = Math.round(price.total * PLATFORM_FEE_RATE)
    const tx = transactions.add({
      userId: user.id, userName: user.fullName, courseId: course.id, courseTitle: course.title, ownerId: course.ownerId,
      listPrice: price.list, discountAmount: price.promoAmt + price.codeAmt, amount: price.total, platformFee: fee,
      providerRevenue: price.total - fee, method: price.total ? method : 'FREE', status: 'SUCCESS',
      discountCode: applied?.code ?? '', promotionId: promotion?.id ?? '',
    })
    enrollments.add({ userId: user.id, courseId: course.id, transactionId: tx.id, enrolledAt: new Date().toISOString() })
    if (applied) discounts.update(applied.id, (d) => ({ usedCount: (d.usedCount || 0) + 1 }))
    if (promotion) promotions.update(promotion.id, (p) => ({ enrolledCount: (p.enrolledCount || 0) + 1 }))
    updateCourse(course.id, (c) => ({ students: (c.students || 0) + 1 }))
    notify(user.id, 'Đăng ký khóa học thành công', `Bạn đã đăng ký "${course.title}". Bắt đầu học ngay trong mục Khóa học của tôi.`, 'COURSE')
    navigate('/hoc-tap', { state: { justEnrolled: course.title } })
  }

  return (
    <>
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Khóa học', to: '/khoa-hoc' }, { label: course.title, to: `/khoa-hoc/${slug}` }, { label: 'Đăng ký' }]} />
      <div className={`${container} grid gap-8 py-10 lg:grid-cols-[1fr_360px]`}>
        <section className="space-y-6">
          <h1 className="text-2xl font-bold">Đăng ký khóa học</h1>

          <div className={`${card} flex gap-4 p-4`}>
            <div className={`grid h-20 w-28 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${course.tone}`}><Icon className="h-8 w-8 text-ink/70" aria-hidden /></div>
            <div>
              <p className="text-xs text-muted">bởi {course.provider}</p>
              <h2 className="font-display font-semibold">{course.title}</h2>
              <p className="mt-1 text-xs text-muted">{course.weeks} tuần · {course.lessonCount} bài học</p>
            </div>
          </div>

          {course.price > 0 && (
            <form onSubmit={applyCode} className={`${card} p-5`}>
              <label htmlFor="code" className="text-[13px] font-medium">Mã giảm giá</label>
              <div className="mt-2 flex gap-2">
                <input id="code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Ví dụ: LUMEN20" className="h-10 flex-1 rounded-lg border border-line px-3 text-sm uppercase outline-none focus:border-brand" />
                <button className={btnOutline}>Áp dụng</button>
              </div>
              {codeError && <p role="alert" className="mt-2 text-xs text-sale">{codeError}</p>}
              {applied && <p className="mt-2 text-xs text-free">Đã áp dụng mã {applied.code}.</p>}
            </form>
          )}

          {price.total > 0 && (
            <fieldset className={`${card} p-5`}>
              <legend className="sr-only">Phương thức thanh toán</legend>
              <p className="mb-3 text-[13px] font-medium">Phương thức thanh toán</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {METHODS.map((m) => (
                  <label key={m} className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3.5 py-3 text-[13px] ${method === m ? 'border-brand bg-brand-soft' : 'border-line'}`}>
                    <input type="radio" name="method" checked={method === m} onChange={() => setMethod(m)} className="accent-brand" />
                    {methodLabels[m]}
                  </label>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted">Thanh toán giả lập, không trừ tiền thật.</p>
            </fieldset>
          )}

          {courseGifts.length > 0 && (
            <div className={`${card} p-5`}>
              <p className="flex items-center gap-2 text-[13px] font-medium"><Gift className="h-4 w-4 text-brand" aria-hidden />Quà tặng kèm</p>
              <ul className="mt-3 space-y-2 text-[13px]">
                {courseGifts.map((g) => <li key={g.id}><span className="font-medium">{g.name}</span>{g.description && <span className="text-muted"> · {g.description}</span>}</li>)}
              </ul>
            </div>
          )}
        </section>

        <aside className={`${card} h-fit space-y-3 p-5 text-[13px]`}>
          <h2 className="font-display text-base font-bold">Tóm tắt đơn hàng</h2>
          <dl className="space-y-2">
            <div className="flex justify-between"><dt className="text-muted">Giá khóa học</dt><dd>{vnd(price.list)}</dd></div>
            {promotion && <div className="flex justify-between"><dt className="text-muted">Ưu đãi {promotion.discountPercent}% ({promotion.name})</dt><dd className="text-free">−{vnd(price.promoAmt)}</dd></div>}
            {applied && <div className="flex justify-between"><dt className="text-muted">Mã {applied.code}</dt><dd className="text-free">−{vnd(price.codeAmt)}</dd></div>}
          </dl>
          <div className="flex items-baseline justify-between border-t border-line pt-3">
            <span className="font-semibold">Tổng cộng</span>
            <span className={`font-display text-xl font-bold ${price.total ? 'text-sale' : 'text-free'}`}>{price.total ? vnd(price.total) : 'Miễn phí'}</span>
          </div>
          <button onClick={confirm} className={`${btnPrimary} w-full py-3`}>{price.total ? 'Xác nhận thanh toán' : 'Đăng ký miễn phí'}</button>
          <Link to={`/khoa-hoc/${slug}`} className="block text-center text-xs text-muted hover:text-brand">Quay lại khóa học</Link>
        </aside>
      </div>
    </>
  )
}
