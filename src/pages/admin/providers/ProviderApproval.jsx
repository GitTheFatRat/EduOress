import { useState } from 'react'
import { BadgeCheck } from 'lucide-react'
import PageHeader from '../../../components/ui/PageHeader.jsx'
import EmptyState from '../../../components/ui/EmptyState.jsx'
import ReasonModal from '../../../components/ui/ReasonModal.jsx'
import { btnOutline, btnPrimary, card } from '../../../components/ui/styles.js'
import { useAuth } from '../../../hooks/useAuth.js'
import { useNotifications, useProviders } from '../../../hooks/useData.js'
import { dateVN } from '../../../lib/format.js'

export default function ProviderApproval() {
  const { updateUser } = useAuth()
  const providers = useProviders()
  const { notify } = useNotifications()
  const [rejecting, setRejecting] = useState(null)
  const pending = providers.items.filter((p) => p.status === 'PENDING')

  const approve = (p) => {
    providers.update(p.id, { status: 'APPROVED', reviewedAt: new Date().toISOString() })
    if (p.userId) {
      updateUser(p.userId, { role: 'PROVIDER' })
      notify(p.userId, 'Đăng ký nhà cung cấp đã được duyệt', 'Bạn có thể vào Bảng điều khiển nhà cung cấp để tạo khóa học đầu tiên.', 'SYSTEM')
    }
  }
  const reject = (reason) => {
    providers.update(rejecting.id, { status: 'REJECTED', rejectReason: reason })
    if (rejecting.userId) notify(rejecting.userId, 'Đăng ký nhà cung cấp chưa được duyệt', `Lý do: ${reason}`, 'SYSTEM')
  }

  return (
    <>
      <PageHeader title="Duyệt nhà cung cấp" subtitle="Khách hàng đã gửi yêu cầu trở thành nhà cung cấp khóa học." />
      {pending.length === 0 ? (
        <EmptyState icon={BadgeCheck} title="Không có yêu cầu nào đang chờ" text="Yêu cầu mới sẽ hiện ở đây." />
      ) : (
        <div className="space-y-4">
          {pending.map((p) => (
            <article key={p.id} className={`${card} flex flex-wrap items-start justify-between gap-4 p-5`}>
              <div className="min-w-0 flex-1">
                <h2 className="font-display font-semibold">{p.name}</h2>
                <p className="mt-1 text-xs text-muted">{p.email} · {p.contact} · gửi ngày {dateVN(p.createdAt)}</p>
                <p className="mt-3 text-[13px] leading-6 text-ink/80">{p.bio}</p>
              </div>
              <div className="flex gap-2">
                <button className={btnOutline} onClick={() => setRejecting(p)}>Từ chối</button>
                <button className={btnPrimary} onClick={() => approve(p)}>Duyệt</button>
              </div>
            </article>
          ))}
        </div>
      )}
      <ReasonModal open={Boolean(rejecting)} title={`Từ chối "${rejecting?.name}"`} onClose={() => setRejecting(null)} onSubmit={reject} />
    </>
  )
}
