export const statusMeta = {
  DRAFT: { label: 'Bản nháp', tone: 'gray' },
  PENDING_REVIEW: { label: 'Chờ duyệt', tone: 'amber' },
  PUBLISHED: { label: 'Đang bán', tone: 'green' },
  REJECTED: { label: 'Bị từ chối', tone: 'red' },
  DISABLED: { label: 'Đã vô hiệu', tone: 'gray' },
  PENDING: { label: 'Chờ duyệt', tone: 'amber' },
  APPROVED: { label: 'Đã duyệt', tone: 'green' },
  SUSPENDED: { label: 'Bị đình chỉ', tone: 'red' },
  ACTIVE: { label: 'Hoạt động', tone: 'green' },
  SUCCESS: { label: 'Thành công', tone: 'green' },
  FAILED: { label: 'Thất bại', tone: 'red' },
  REFUNDED: { label: 'Đã hoàn tiền', tone: 'gray' },
  FLAGGED: { label: 'Vi phạm', tone: 'red' },
  OPEN: { label: 'Mới', tone: 'amber' },
  IN_PROGRESS: { label: 'Đang xử lý', tone: 'blue' },
  RESOLVED: { label: 'Đã xử lý', tone: 'green' },
  CLOSED: { label: 'Đã đóng', tone: 'gray' },
  DONE: { label: 'Đã xử lý', tone: 'green' },
}
export const roleLabels = { ADMIN: 'Quản trị viên', PROVIDER: 'Nhà cung cấp', CUSTOMER: 'Khách hàng', STAFF: 'Nhân viên hệ thống' }
export const methodLabels = { FREE: 'Miễn phí', MOMO: 'MoMo', VNPAY: 'VNPay', BANK_TRANSFER: 'Chuyển khoản', CARD: 'Thẻ' }
