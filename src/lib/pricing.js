const endOfDay = (s) => new Date(`${s}T23:59:59`)

export function activePromotion(course, promotions, now = Date.now()) {
  return promotions
    .filter((p) =>
      p.active && p.courseIds?.includes(course.id) &&
      (!p.startsAt || new Date(p.startsAt) <= now) &&
      (!p.endsAt || endOfDay(p.endsAt) >= now) &&
      (!p.maxEnrollments || (p.enrolledCount || 0) < p.maxEnrollments))
    .sort((a, b) => b.discountPercent - a.discountPercent)[0]
}

export function validateCode(code, course, discounts, now = Date.now()) {
  const d = discounts.find((x) => x.code.toUpperCase() === code.trim().toUpperCase())
  if (!d || !d.active) return { error: 'Mã giảm giá không tồn tại hoặc đã tắt.' }
  if (d.ownerId !== course.ownerId || (d.courseId && Number(d.courseId) !== course.id)) return { error: 'Mã này không áp dụng cho khóa học này.' }
  if (d.startsAt && new Date(d.startsAt) > now) return { error: 'Mã chưa có hiệu lực.' }
  if (d.expiresAt && endOfDay(d.expiresAt) < now) return { error: 'Mã đã hết hạn.' }
  if (d.maxUses && (d.usedCount || 0) >= d.maxUses) return { error: 'Mã đã hết lượt sử dụng.' }
  return { discount: d }
}

export function computePrice(course, promotion, discount) {
  const list = course.price
  const promoAmt = promotion ? Math.round((list * promotion.discountPercent) / 100) : 0
  const afterPromo = list - promoAmt
  const codeAmt = discount
    ? Math.min(afterPromo, discount.type === 'PERCENT' ? Math.round((afterPromo * discount.value) / 100) : Number(discount.value))
    : 0
  return { list, promoAmt, codeAmt, total: Math.max(afterPromo - codeAmt, 0) }
}

export const PLATFORM_FEE_RATE = 0.1
