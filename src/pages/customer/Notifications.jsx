import { Link } from 'react-router-dom'
import { Bell } from 'lucide-react'
import EmptyState from '../../components/ui/EmptyState.jsx'
import { btnOutline, container } from '../../components/ui/styles.js'
import { useAuth } from '../../hooks/useAuth.js'
import { useNotificationsFor } from '../../hooks/useData.js'
import { dateTimeVN } from '../../lib/format.js'

export default function Notifications() {
  const { user } = useAuth()
  const { mine, isRead, markRead, markAll, unread } = useNotificationsFor(user)
  return (
    <div className={`${container} max-w-3xl py-10`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Thông báo {unread > 0 && <span className="ml-1 rounded-full bg-brand px-2 py-0.5 align-middle text-xs text-white">{unread} mới</span>}</h1>
        {unread > 0 && <button className={btnOutline} onClick={markAll}>Đánh dấu đã đọc tất cả</button>}
      </div>
      <div className="mt-6">
        {mine.length === 0 ? (
          <EmptyState icon={Bell} title="Chưa có thông báo nào" />
        ) : (
          <ul className="space-y-3">
            {mine.map((n) => {
              const read = isRead(n.id)
              return (
                <li key={n.id}>
                  <button onClick={() => markRead(n.id)} className={`w-full rounded-card border p-4 text-left transition hover:border-brand ${read ? 'border-line bg-white' : 'border-brand/40 bg-brand-soft'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <p className={`text-sm ${read ? 'font-medium' : 'font-bold'}`}>{n.title}</p>
                      <time className="shrink-0 text-xs text-muted">{dateTimeVN(n.createdAt)}</time>
                    </div>
                    <p className="mt-1.5 text-[13px] leading-6 text-ink/75">{n.body}</p>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
      {user.role === 'CUSTOMER' && <p className="mt-8 text-center text-xs text-muted">Xem lại <Link to="/hoc-tap" className="text-brand hover:underline">khóa học của tôi</Link></p>}
    </div>
  )
}
