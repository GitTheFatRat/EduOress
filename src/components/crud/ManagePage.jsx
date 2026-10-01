import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import DataTable from '../ui/DataTable.jsx'
import PageHeader from '../ui/PageHeader.jsx'
import { useConfirm } from '../ui/Modal.jsx'
import { btnPrimary, btnSm, btnSmDanger } from '../ui/styles.js'

export default function ManagePage({ title, subtitle, newTo, newLabel = 'Tạo mới', columns, rows, editTo, onDelete, deleteMessage, extraActions, empty }) {
  const [confirmUI, ask] = useConfirm()
  const cols = [...columns, {
    header: 'Thao tác', className: 'text-right',
    cell: (r) => (
      <div className="flex flex-wrap justify-end gap-1.5">
        {extraActions?.(r)}
        {editTo && <Link to={editTo(r)} className={btnSm}>Sửa</Link>}
        {onDelete && <button className={btnSmDanger} onClick={() => ask(deleteMessage?.(r) ?? 'Bạn chắc chắn muốn xóa mục này?', () => onDelete(r), { danger: true, okLabel: 'Xóa' })}>Xóa</button>}
      </div>
    ),
  }]
  return (
    <>
      <PageHeader title={title} subtitle={subtitle} actions={newTo && <Link to={newTo} className={btnPrimary}><Plus className="h-4 w-4" aria-hidden />{newLabel}</Link>} />
      <DataTable columns={cols} rows={rows} empty={empty} />
      {confirmUI}
    </>
  )
}
