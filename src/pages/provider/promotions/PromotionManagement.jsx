import ManagePage from '../../../components/crud/ManagePage.jsx'
import Badge from '../../../components/ui/Badge.jsx'
import { useOwn } from '../../../hooks/useOwn.js'
import { usePromotions } from '../../../hooks/useData.js'
import { dateVN } from '../../../lib/format.js'

export default function PromotionManagement() {
  const { user } = useOwn()
  const promos = usePromotions()
  const rows = promos.items.filter((p) => p.ownerId === user.id)
  return (
    <ManagePage
      title="Chương trình ưu đãi"
      subtitle="Giảm giá tự động theo thời gian hoặc theo số lượt đăng ký."
      newTo="/provider/promotions/new"
      newLabel="Tạo chương trình"
      rows={rows}
      empty="Bạn chưa có chương trình ưu đãi nào."
      columns={[
        { header: 'Tên', cell: (p) => <span className="font-medium">{p.name}</span> },
        { header: 'Loại', cell: (p) => (p.type === 'TIME_BASED' ? 'Theo thời gian' : 'Theo số lượt') },
        { header: 'Giảm', cell: (p) => `${p.discountPercent}%` },
        { header: 'Điều kiện', cell: (p) => (p.type === 'TIME_BASED' ? `${dateVN(p.startsAt)} - ${dateVN(p.endsAt)}` : `${p.enrolledCount || 0}/${p.maxEnrollments} lượt`) },
        { header: 'Khóa áp dụng', cell: (p) => `${p.courseIds?.length ?? 0} khóa` },
        { header: 'Trạng thái', cell: (p) => <Badge tone={p.active ? 'green' : 'gray'}>{p.active ? 'Đang bật' : 'Đã tắt'}</Badge> },
      ]}
      editTo={(p) => `/provider/promotions/${p.id}/edit`}
      onDelete={(p) => promos.remove(p.id)}
      deleteMessage={(p) => `Xóa chương trình "${p.name}"?`}
    />
  )
}
