import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LayoutGrid, List, Search, SlidersHorizontal } from 'lucide-react'
import Breadcrumb from '../../components/ui/Breadcrumb.jsx'
import Pagination from '../../components/ui/Pagination.jsx'
import CourseCard from '../../components/CourseCard.jsx'
import CourseListItem from '../../components/course/CourseListItem.jsx'
import CourseFilters, { emptyFilters } from '../../components/course/CourseFilters.jsx'
import { useCourses } from '../../hooks/useData.js'

const PER_PAGE = 6
const fold = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd')

const sorters = {
  popular: (a, b) => b.students - a.students,
  rating: (a, b) => b.rating - a.rating,
  priceAsc: (a, b) => a.price - b.price,
  priceDesc: (a, b) => b.price - a.price,
}

export default function CourseListing() {
  const { published: courses } = useCourses()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const page = Number(params.get('page') ?? 1)
  const [view, setView] = useState('list')
  const [sort, setSort] = useState('popular')
  const [filters, setFilters] = useState(emptyFilters)
  const [showFilters, setShowFilters] = useState(false)

  const setParam = (patch) => {
    const next = new URLSearchParams(params)
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)))
    setParams(next, { replace: true })
  }
  const updateFilters = (patch) => {
    setFilters((f) => ({ ...f, ...patch }))
    setParam({ page: '' })
  }

  const results = useMemo(() => {
    const term = fold(q.trim())
    return courses
      .filter((c) => !term || fold(c.title).includes(term) || fold(c.provider).includes(term))
      .filter((c) => !filters.categories.length || filters.categories.includes(c.category))
      .filter((c) => !filters.providers.length || filters.providers.includes(c.provider))
      .filter((c) => !filters.levels.length || filters.levels.includes(c.level))
      .filter((c) => filters.price === 'all' || (filters.price === 'free' ? c.price === 0 : c.price > 0))
      .filter((c) => c.rating >= filters.minRating)
      .sort(sorters[sort])
  }, [courses, q, filters, sort])

  const pages = Math.max(1, Math.ceil(results.length / PER_PAGE))
  const current = Math.min(Math.max(page, 1), pages)
  const shown = results.slice((current - 1) * PER_PAGE, current * PER_PAGE)

  return (
    <>
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Khóa học' }]} />
      <div className="mx-auto max-w-[1140px] px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Tất cả khóa học</h1>
          <div className="flex flex-wrap items-center gap-3">
            <div role="search" className="flex items-center gap-2 border-b border-line focus-within:border-brand">
              <input
                type="search"
                value={q}
                onChange={(e) => setParam({ q: e.target.value, page: '' })}
                placeholder="Tìm khóa học..."
                aria-label="Tìm khóa học"
                className="w-40 bg-transparent py-1.5 text-sm outline-none"
              />
              <Search className="h-4 w-4 text-muted" aria-hidden />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sắp xếp"
              className="rounded-full border border-line bg-white px-3 py-1.5 text-[13px]"
            >
              <option value="popular">Phổ biến nhất</option>
              <option value="rating">Đánh giá cao</option>
              <option value="priceAsc">Giá thấp đến cao</option>
              <option value="priceDesc">Giá cao đến thấp</option>
            </select>
            <div className="flex gap-1" role="group" aria-label="Kiểu hiển thị">
              {[['grid', LayoutGrid, 'Dạng lưới'], ['list', List, 'Dạng danh sách']].map(([v, Icon, label]) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  aria-label={label}
                  aria-pressed={view === v}
                  className={`grid h-8 w-8 place-items-center rounded ${view === v ? 'text-brand' : 'text-muted hover:text-ink'}`}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
              className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[13px] lg:hidden"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden /> Bộ lọc
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_240px]">
          <section aria-live="polite">
            <p className="mb-4 text-[13px] text-muted">{results.length} khóa học</p>
            {shown.length === 0 ? (
              <div className="rounded-card border border-dashed border-line px-6 py-16 text-center">
                <p className="font-semibold">Không có khóa học phù hợp</p>
                <p className="mt-1 text-[13px] text-muted">Thử bỏ bớt bộ lọc hoặc tìm bằng từ khóa khác.</p>
                <button onClick={() => { setFilters(emptyFilters); setParam({ q: '', page: '' }) }} className="mt-4 rounded-full border border-brand px-5 py-2 text-[13px] font-medium text-brand hover:bg-brand hover:text-white">
                  Xóa bộ lọc
                </button>
              </div>
            ) : view === 'list' ? (
              <div className="space-y-4">{shown.map((c) => <CourseListItem key={c.id} course={c} />)}</div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">{shown.map((c) => <CourseCard key={c.id} course={c} />)}</div>
            )}
            <Pagination page={current} pages={pages} onChange={(n) => { setParam({ page: n > 1 ? String(n) : '' }); window.scrollTo({ top: 0 }) }} />
          </section>

          <aside aria-label="Bộ lọc khóa học" className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
            <CourseFilters courses={courses} filters={filters} onChange={updateFilters} />
          </aside>
        </div>
      </div>
    </>
  )
}
