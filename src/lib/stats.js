export function monthlySeries(transactions, field = 'amount', months = 6) {
  const now = new Date()
  const buckets = []
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    buckets.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: `T${d.getMonth() + 1}`, value: 0 })
  }
  transactions.filter((t) => t.status === 'SUCCESS').forEach((t) => {
    const d = new Date(t.createdAt)
    const b = buckets.find((x) => x.key === `${d.getFullYear()}-${d.getMonth()}`)
    if (b) b.value += t[field] || 0
  })
  return buckets
}
export const sum = (list, f) => list.reduce((n, x) => n + (f(x) || 0), 0)
