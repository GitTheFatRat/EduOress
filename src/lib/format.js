export const vnd = (n) => new Intl.NumberFormat('vi-VN').format(Math.round(n || 0)) + ' ₫'
export const vndShort = (n) => (n >= 1e6 ? `${(n / 1e6).toFixed(1).replace('.0', '')}tr` : n >= 1e3 ? `${Math.round(n / 1e3)}k` : String(n))
export const dateVN = (iso) => (iso ? new Date(iso).toLocaleDateString('vi-VN') : '—')
export const dateTimeVN = (iso) => (iso ? new Date(iso).toLocaleString('vi-VN') : '—')
export const slugify = (s) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
export const initial = (name = '?') => name.trim().split(/\s+/).slice(-1)[0][0]
