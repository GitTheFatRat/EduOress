export default function DataTable({ columns, rows, rowKey = 'id', empty = 'Chưa có dữ liệu.' }) {
  return (
    <div className="overflow-x-auto rounded-card border border-line bg-white">
      <table className="w-full min-w-[640px] text-left text-[13px]">
        <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
          <tr>{columns.map((c) => <th key={c.header} scope="col" className={`px-4 py-3 font-semibold ${c.className ?? ''}`}>{c.header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={columns.length} className="px-4 py-12 text-center text-muted">{empty}</td></tr>
          ) : rows.map((r) => (
            <tr key={r[rowKey]} className="border-t border-line align-middle">
              {columns.map((c) => <td key={c.header} className={`px-4 py-3 ${c.className ?? ''}`}>{c.cell ? c.cell(r) : r[c.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
