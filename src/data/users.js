export const seedUsers = [
  { id: 'u-admin', fullName: 'Quản trị viên', email: 'admin@edupress.vn', password: '123456', role: 'ADMIN', status: 'ACTIVE' },
  { id: 'u-provider', fullName: 'Lumen Studio', email: 'provider@edupress.vn', password: '123456', role: 'PROVIDER', status: 'ACTIVE' },
  { id: 'u-customer', fullName: 'Nguyễn Văn An', email: 'customer@edupress.vn', password: '123456', role: 'CUSTOMER', status: 'ACTIVE' },
  { id: 'u-locked', fullName: 'Tài khoản bị khóa', email: 'locked@edupress.vn', password: '123456', role: 'CUSTOMER', status: 'DISABLED' },
]

export const demoAccounts = [
  { label: 'Khách hàng', email: 'customer@edupress.vn', password: '123456' },
  { label: 'Nhà cung cấp', email: 'provider@edupress.vn', password: '123456' },
  { label: 'Quản trị viên', email: 'admin@edupress.vn', password: '123456' },
]
