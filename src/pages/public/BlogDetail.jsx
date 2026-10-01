import { Link, useParams } from 'react-router-dom'
import { Calendar, ChevronLeft, ChevronRight, User } from 'lucide-react'
import Breadcrumb from '../../components/ui/Breadcrumb.jsx'
import { btnPrimary, container } from '../../components/ui/styles.js'
import { usePosts } from '../../hooks/useData.js'
import { dateVN } from '../../lib/format.js'

export default function BlogDetail() {
  const { slug } = useParams()
  const all = usePosts().items.filter((p) => !p.hidden).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const i = all.findIndex((p) => p.slug === slug)
  const post = all[i]

  if (!post)
    return (
      <div className={`${container} py-24 text-center`}>
        <h1 className="text-2xl font-bold">Không tìm thấy bài viết</h1>
        <Link to="/blog" className={`${btnPrimary} mt-6`}>Xem tất cả bài viết</Link>
      </div>
    )

  const prev = all[i + 1]
  const next = all[i - 1]
  return (
    <>
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Bài viết', to: '/blog' }, { label: post.title }]} />
      <article className={`${container} max-w-3xl py-10`}>
        <h1 className="text-3xl font-bold leading-tight">{post.title}</h1>
        <p className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-brand" aria-hidden />{post.author}</span>
          <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-brand" aria-hidden />{dateVN(post.createdAt)}</span>
        </p>
        <div aria-hidden className={`mt-6 aspect-[16/8] rounded-card bg-gradient-to-br ${post.tone}`} />
        <div className="mt-8 space-y-4 text-[15px] leading-7 text-ink/85">
          {post.content.split(/\n{2,}/).map((para, k) => <p key={k}>{para}</p>)}
        </div>
        {post.tags?.length > 0 && (
          <p className="mt-8 flex flex-wrap items-center gap-2 text-xs text-muted">Thẻ:
            {post.tags.map((t) => <Link key={t} to={`/blog?the=${encodeURIComponent(t)}`} className="rounded border border-line px-2.5 py-1 hover:border-brand hover:text-brand">{t}</Link>)}
          </p>
        )}
        <nav aria-label="Bài viết khác" className="mt-10 grid gap-4 border-t border-line pt-6 sm:grid-cols-2">
          {prev ? <Link to={`/blog/${prev.slug}`} className="flex items-center gap-2 rounded-card border border-line p-4 text-[13px] hover:border-brand"><ChevronLeft className="h-4 w-4 shrink-0" aria-hidden /><span><span className="block text-xs text-muted">Bài trước</span>{prev.title}</span></Link> : <span />}
          {next && <Link to={`/blog/${next.slug}`} className="flex items-center justify-between gap-2 rounded-card border border-line p-4 text-right text-[13px] hover:border-brand"><span><span className="block text-xs text-muted">Bài sau</span>{next.title}</span><ChevronRight className="h-4 w-4 shrink-0" aria-hidden /></Link>}
        </nav>
      </article>
    </>
  )
}
