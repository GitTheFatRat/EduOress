import PageHeader from '../../components/ui/PageHeader.jsx'
import { usePermissions } from '../../hooks/useData.js'
import { permissionList, roleList, seedPermissions } from '../../data/seeds.js'
import { btnOutline } from '../../components/ui/styles.js'

export default function AccessManagement() {
  const [perms, setPerms] = usePermissions()
  const toggle = (role, key) => setPerms((p) => ({ ...p, [role]: { ...p[role], [key]: !p[role]?.[key] } }))
  return (
    <>
      <PageHeader title="Phân quyền truy cập" subtitle="Ma trận quyền theo vai trò. Quản trị viên luôn có đầy đủ quyền."
        actions={<button className={btnOutline} onClick={() => setPerms(seedPermissions())}>Khôi phục mặc định</button>} />
      <div className="overflow-x-auto rounded-card border border-line bg-white">
        <table className="w-full min-w-[640px] text-left text-[13px]">
          <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
            <tr><th scope="col" className="px-4 py-3 font-semibold">Quyền</th>{roleList.map(([k, label]) => <th key={k} scope="col" className="px-4 py-3 text-center font-semibold">{label}</th>)}</tr>
          </thead>
          <tbody>
            {permissionList.map(([key, label]) => (
              <tr key={key} className="border-t border-line">
                <th scope="row" className="px-4 py-3 font-medium">{label}</th>
                {roleList.map(([role, roleLabel]) => (
                  <td key={role} className="px-4 py-3 text-center">
                    <input type="checkbox" className="h-4 w-4 accent-brand" aria-label={`${roleLabel}: ${label}`}
                      checked={Boolean(perms[role]?.[key])} disabled={role === 'ADMIN'} onChange={() => toggle(role, key)} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-muted">Bản demo: cấu hình được lưu lại nhưng chưa dùng để chặn truy cập. Hiện việc chặn dựa trên vai trò (Admin, Nhà cung cấp, Khách hàng).</p>
    </>
  )
}
