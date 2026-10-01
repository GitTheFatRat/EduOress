import ManagePage from '../../../components/crud/ManagePage.jsx'
import { useOwn } from '../../../hooks/useOwn.js'
import { useGifts } from '../../../hooks/useData.js'

export default function GiftManagement() {
  const { user, mine } = useOwn()
  const gifts = useGifts()
  return (
    <ManagePage
      title="Quà tặng kèm"
      subtitle="Học viên nhận quà khi đăng ký khóa học."
      newTo="/provider/gifts/new"
      newLabel="Thêm quà tặng"
      rows={gifts.items.filter((g) => g.ownerId === user.id)}
      empty="Bạn chưa có quà tặng nào."
      columns={[
        { header: 'Quà tặng', cell: (g) => <div><p className="font-medium">{g.name}</p><p className="text-xs text-muted">{g.description}</p></div> },
        { header: 'Khóa học', cell: (g) => mine.find((c) => c.id === Number(g.courseId))?.title ?? '—' },
      ]}
      editTo={(g) => `/provider/gifts/${g.id}/edit`}
      onDelete={(g) => gifts.remove(g.id)}
      deleteMessage={(g) => `Xóa quà tặng "${g.name}"?`}
    />
  )
}
