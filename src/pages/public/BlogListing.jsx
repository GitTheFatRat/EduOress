import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Calendar, Search } from 'lucide-react'
import Breadcrumb from '../../components/ui/Breadcrumb.jsx'
import Pagination from '../../components/ui/Pagination.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import { container } from '../../components/ui/styles.js'
import { usePosts } from '../../hooks/useData.js'
import { dateVN } from '../../lib/format.js'

const PER_PAGE = 6
const fold = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd')

export default function BlogListing() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const cat = params.get('danh-muc') ?? ''
  const tag = params.get('the') ?? ''
  const page = Number(params.get('page') ?? 1)
  const all = usePosts().items.filter((p) => !p.hidden).sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const setParam = (patch) => {
    const next = new URLSearchParams(params)
    Object.entries({ page: '', ...patch }).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)))
    setParams(next, { replace: true })
  }

  const categories = useMemo(() => [...new Set(all.map((p) => p.category))].map((c) => [c, all.filter((p) => p.category === c).length]), [all])
  const tags = useMemo(() => [...new Set(all.flatMap((p) => p.tags ?? []))], [all])
  const list = all.filter((p) => (!cat || p.category === cat) && (!tag || p.tags?.includes(tag)) && (!q || fold(p.title).includes(fold(q.trim()))))
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE))
  const current = Math.min(Math.max(page, 1), pages)
  const shown = list.slice((current - 1) * PER_PAGE, current * PER_PAGE)
  const chip = (active) => `rounded border px-2.5 py-1 text-xs ${active ? 'border-brand bg-brand-soft text-brand' : 'border-line hover:border-brand hover:text-brand'}`

  return (
    <>
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Bài viết' }]} />
      <div className={`${container} py-10`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Tất cả bài viết</h1>
          <div role="search" className="flex items-center gap-2 border-b border-line focus-within:border-brand">
            <input type="search" aria-label="Tìm bài viết" placeholder="Tìm bài viết..." value={q} onChange={(e) => setParam({ q: e.target.value })} className="w-44 bg-transparent py-1.5 text-sm outline-none" />
            <Search className="h-4 w-4 text-muted" aria-hidden />
          </div>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_240px]">
          <section>
            {shown.length === 0 ? (
              <EmptyState title="Không có bài viết phù hợp" text="Thử bỏ bộ lọc hoặc tìm bằng từ khóa khác." />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {shown.map((p) => (
                  <article key={p.id} className="group overflow-hidden rounded-card border border-line bg-white transition hover:shadow-lift">
                    <Link to={`/blog/${p.slug}`} aria-hidden tabIndex={-1} className={`block aspect-[16/9] bg-gradient-to-br ${p.tone}`} />
                    <div className="p-4">
                      <h2 className="font-display text-[15px] font-semibold leading-snug group-hover:text-brand"><Link to={`/blog/${p.slug}`}>{p.title}</Link></h2>
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-muted"><Calendar className="h-3.5 w-3.5 text-brand" aria-hidden />{dateVN(p.createdAt)} · {p.category}</p>
                      <p className="mt-2 text-[13px] leading-6 text-muted">{p.excerpt}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
            <Pagination page={current} pages={pages} onChange={(n) => { setParam({ page: n > 1 ? String(n) : '' }); window.scrollTo({ top: 0 }) }} />
          </section>

          <aside className="space-y-8">
            <div>
              <h2 className="mb-3 font-display text-sm font-bold">Danh mục</h2>
              <ul className="space-y-2 text-[13px] text-muted">
                <li><button onClick={() => setParam({ 'danh-muc': '' })} className={!cat ? 'font-medium text-brand' : 'hover:text-ink'}>Tất cả</button></li>
                {categories.map(([c, n]) => (
                  <li key={c} className="flex justify-between"><button onClick={() => setParam({ 'danh-muc': c })} className={cat === c ? 'font-medium text-brand' : 'hover:text-ink'}>{c}</button><span>{n}</span></li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mb-3 font-display text-sm font-bold">Bài viết mới</h2>
              <ul className="space-y-3">
                {all.slice(0, 3).map((p) => (
                  <li key={p.id} className="flex gap-3">
                    <span aria-hidden className={`h-12 w-12 shrink-0 rounded bg-gradient-to-br ${p.tone}`} />
                    <Link to={`/blog/${p.slug}`} className="text-xs font-medium leading-snug hover:text-brand">{p.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mb-3 font-display text-sm font-bold">Thẻ</h2>
              <div className="flex flex-wrap gap-2">{tags.map((t) => <button key={t} onClick={() => setParam({ the: tag === t ? '' : t })} aria-pressed={tag === t} className={chip(tag === t)}>{t}</button>)}</div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
