import ManagePage from '../../../components/crud/ManagePage.jsx'
import Badge from '../../../components/ui/Badge.jsx'
import { useOwn } from '../../../hooks/useOwn.js'
import { useDiscounts } from '../../../hooks/useData.js'
import { dateVN, vnd } from '../../../lib/format.js'

export default function DiscountManagement() {
  const { user, mine } = useOwn()
  const discounts = useDiscounts()
  const rows = discounts.items.filter((d) => d.ownerId === user.id)
  return (
    <ManagePage
      title="Mã giảm giá"
      subtitle="Học viên nhập mã ở bước thanh toán để được giảm giá."
      newTo="/provider/discounts/new"
      newLabel="Tạo mã"
      rows={rows}
      empty="Bạn chưa tạo mã giảm giá nào."
      columns={[
        { header: 'Mã', cell: (d) => <span className="font-mono font-semibold">{d.code}</span> },
        { header: 'Áp dụng', cell: (d) => mine.find((c) => String(c.id) === String(d.courseId))?.title ?? 'Tất cả khóa của tôi' },
        { header: 'Giá trị', cell: (d) => (d.type === 'PERCENT' ? `${d.value}%` : vnd(d.value)) },
        { header: 'Đã dùng', cell: (d) => `${d.usedCount || 0}/${d.maxUses || '∞'}` },
        { header: 'Hết hạn', cell: (d) => (d.expiresAt ? dateVN(d.expiresAt) : 'Không giới hạn') },
        { header: 'Trạng thái', cell: (d) => <Badge tone={d.active ? 'green' : 'gray'}>{d.active ? 'Đang bật' : 'Đã tắt'}</Badge> },
      ]}
      editTo={(d) => `/provider/discounts/${d.id}/edit`}
      onDelete={(d) => discounts.remove(d.id)}
      deleteMessage={(d) => `Xóa mã ${d.code}?`}
    />
  )
}
