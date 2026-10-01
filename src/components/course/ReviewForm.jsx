import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'

export default function ReviewForm({ onSubmit, canReview = true, reason = 'login' }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')

  if (!canReview) {
    return reason === 'enroll' ? (
      <p className="mt-8 text-[13px] text-muted">Chỉ học viên đã đăng ký khóa học này mới đánh giá được.</p>
    ) : (
      <p className="mt-8 text-[13px] text-muted">
        <Link to="/dang-nhap" className="font-medium text-brand hover:underline">Đăng nhập</Link> để viết đánh giá cho khóa học này.
      </p>
    )
  }

  const submit = (e) => {
    e.preventDefault()
    if (!rating) return setError('Vui lòng chọn số sao.')
    if (comment.trim().length < 10) return setError('Nhận xét cần ít nhất 10 ký tự.')
    onSubmit({ rating, text: comment.trim() })
    setRating(0)
    setComment('')
    setError('')
  }

  return (
    <form onSubmit={submit} className="mt-10" noValidate>
      <h3 className="text-sm font-bold">Viết đánh giá của bạn</h3>
      <div role="radiogroup" aria-label="Số sao" className="mt-3 flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={rating === n}
            aria-label={`${n} sao`}
            onClick={() => setRating(n)}
            className="rounded p-0.5"
          >
            <Star className={`h-6 w-6 ${n <= rating ? 'fill-amber-400 text-amber-400' : 'text-line'}`} />
          </button>
        ))}
      </div>
      <label className="mt-4 block text-[13px] font-medium" htmlFor="review-comment">Nhận xét</label>
      <textarea
        id="review-comment"
        rows={4}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Khóa học giúp bạn được gì? Điều gì cần cải thiện?"
        className="mt-1.5 w-full rounded-lg border border-line bg-white p-3 text-sm outline-none focus:border-brand"
      />
      {error && <p role="alert" className="mt-1.5 text-xs text-sale">{error}</p>}
      <button className="mt-4 rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-white transition hover:bg-brand-dark">
        Gửi đánh giá
      </button>
    </form>
  )
}
