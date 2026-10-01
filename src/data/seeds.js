import { seedCourses } from './courses.js'
import { getSections } from './lessons.js'
import { articles } from './mock.js'

export const SAMPLE_VIDEO = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
const daysAgo = (n) => new Date(Date.now() - n * 864e5).toISOString()
const dateAhead = (n) => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10)

export function seedLessons() {
  const out = []
  seedCourses().forEach((c) => {
    if (c.id === 15) return
    getSections(c.id).forEach((s) =>
      s.lessons.forEach((l) =>
        out.push({
          id: l.id, courseId: c.id, section: s.title, title: l.title, durationSec: l.durationSec,
          preview: l.preview, videoUrl: SAMPLE_VIDEO, resource: '',
          moderation: c.id === 13 || c.id === 14 ? 'PENDING' : 'APPROVED',
        })))
  })
  const flagged = out.find((l) => l.id === '2-2-2')
  if (flagged) flagged.moderation = 'FLAGGED'
  return out
}

export const seedEnrollments = () => [
  { id: 'e1', userId: 'u-customer', courseId: 2, transactionId: 'seed', enrolledAt: daysAgo(20) },
  { id: 'e2', userId: 'u-customer', courseId: 1, transactionId: 'seed', enrolledAt: daysAgo(9) },
  { id: 'e3', userId: 'u-customer', courseId: 6, transactionId: 'seed', enrolledAt: daysAgo(3) },
]

export const seedProgress = () => [
  { id: 'u-customer:2-1-1', userId: 'u-customer', courseId: 2, lessonId: '2-1-1' },
  { id: 'u-customer:2-1-2', userId: 'u-customer', courseId: 2, lessonId: '2-1-2' },
  { id: 'u-customer:1-1-1', userId: 'u-customer', courseId: 1, lessonId: '1-1-1' },
]

export function seedTransactions() {
  const names = ['Nguyễn Văn An', 'Trần Thị Bích', 'Lê Hoàng Long', 'Phạm Minh Châu', 'Võ Thanh Tùng', 'Đặng Ngọc Hà', 'Bùi Quốc Việt', 'Hoàng Thu Trang']
  const methods = ['MOMO', 'VNPAY', 'BANK_TRANSFER', 'CARD']
  const cs = seedCourses().filter((c) => c.seeded)
  const out = []
  for (let i = 0; i < 48; i++) {
    const c = cs[(i * 5 + 3) % cs.length]
    const monthsAgo = (i * 5 + Math.floor(i / 3)) % 6
    const created = new Date(Date.now() - monthsAgo * 30 * 864e5 - ((i * 7) % 20) * 864e5).toISOString()
    const disc = i % 4 === 0 ? Math.round(c.price * 0.2) : 0
    const amount = Math.max(c.price - disc, 0)
    const status = i % 11 === 5 ? 'FAILED' : i % 13 === 7 ? 'REFUNDED' : 'SUCCESS'
    const fee = Math.round(amount * 0.1)
    out.push({
      id: `t${i + 1}`, userId: i % 6 === 0 ? 'u-customer' : `u-demo-${i % 8}`, userName: names[i % 8],
      courseId: c.id, courseTitle: c.title, ownerId: c.ownerId, listPrice: c.price, discountAmount: disc,
      amount, platformFee: fee, providerRevenue: amount - fee, method: amount ? methods[i % 4] : 'FREE',
      status, createdAt: created,
    })
  }
  return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export const seedProviders = () => [
  { id: 'p-lumen', userId: 'u-provider', name: 'Lumen Studio', email: 'provider@edupress.vn', contact: '0901 234 567', bio: 'Studio thiết kế và dựng phim, chuyên đào tạo thực hành.', status: 'APPROVED', createdAt: daysAgo(120) },
  { id: 'p-codexanh', userId: null, name: 'CodeXanh', email: 'contact@codexanh.vn', contact: '0902 111 222', bio: 'Nhóm kỹ sư phần mềm chia sẻ kiến thức lập trình.', status: 'APPROVED', createdAt: daysAgo(110) },
  { id: 'p-growth', userId: null, name: 'Growth Lab', email: 'hello@growthlab.vn', contact: '0903 333 444', bio: 'Đội ngũ marketing và nội dung số.', status: 'APPROVED', createdAt: daysAgo(100) },
  { id: 'p-minhanh', userId: null, name: 'Minh Anh Academy', email: 'info@minhanh.vn', contact: '0904 555 666', bio: 'Trung tâm kỹ năng mềm và tài chính cá nhân.', status: 'APPROVED', createdAt: daysAgo(90) },
  { id: 'p-goc-anh', userId: null, name: 'Góc Ảnh Hà Nội', email: 'gocanh@hn.vn', contact: '0905 777 888', bio: 'Câu lạc bộ nhiếp ảnh.', status: 'APPROVED', createdAt: daysAgo(80) },
  { id: 'p-hocnhanh', userId: null, name: 'Học Nhanh Center', email: 'admin@hocnhanh.vn', contact: '0906 999 000', bio: 'Trung tâm luyện thi.', status: 'SUSPENDED', createdAt: daysAgo(70) },
  { id: 'p-hoasen', userId: 'u-hoasen', name: 'Studio Hoa Sen', email: 'hoasen@studio.vn', contact: '0907 123 123', bio: 'Muốn đăng khóa học vẽ minh họa kỹ thuật số cho người mới.', status: 'PENDING', createdAt: daysAgo(2) },
  { id: 'p-namtoan', userId: 'u-namtoan', name: 'Thầy Nam Toán', email: 'namtoan@gmail.com', contact: '0908 321 321', bio: 'Giáo viên toán cấp 3, muốn đăng khóa ôn thi.', status: 'PENDING', createdAt: daysAgo(1) },
]

export const seedDiscounts = () => [
  { id: 'd1', ownerId: 'u-provider', code: 'LUMEN20', courseId: '', type: 'PERCENT', value: 20, maxUses: 100, usedCount: 12, startsAt: '', expiresAt: dateAhead(60), active: true, createdAt: daysAgo(30) },
  { id: 'd2', ownerId: 'u-provider', code: 'POSTER50K', courseId: '11', type: 'FIXED', value: 50000, maxUses: 50, usedCount: 4, startsAt: '', expiresAt: dateAhead(30), active: true, createdAt: daysAgo(20) },
  { id: 'd3', ownerId: 'u-provider', code: 'HETHAN', courseId: '', type: 'PERCENT', value: 10, maxUses: 20, usedCount: 20, startsAt: '', expiresAt: dateAhead(-10), active: false, createdAt: daysAgo(90) },
]

export const seedPromotions = () => [
  { id: 'pr1', ownerId: 'u-provider', name: 'Khuyến mãi tháng mới', type: 'TIME_BASED', discountPercent: 15, startsAt: dateAhead(-3), endsAt: dateAhead(20), maxEnrollments: '', enrolledCount: 0, courseIds: [7, 11], active: true, createdAt: daysAgo(4) },
  { id: 'pr2', ownerId: 'u-provider', name: '50 học viên đầu tiên', type: 'QUOTA_BASED', discountPercent: 30, startsAt: '', endsAt: '', maxEnrollments: 50, enrolledCount: 21, courseIds: [7], active: true, createdAt: daysAgo(10) },
]

export const seedGifts = () => [
  { id: 'g1', ownerId: 'u-provider', courseId: 7, name: 'Bộ hiệu ứng chuyển cảnh', description: 'Gói 30 hiệu ứng dùng ngay trong CapCut.', fileUrl: 'https://example.com/hieu-ung.zip', createdAt: daysAgo(15) },
  { id: 'g2', ownerId: 'u-provider', courseId: 11, name: 'Template poster A3', description: 'Ba mẫu poster định dạng .ai.', fileUrl: 'https://example.com/poster.zip', createdAt: daysAgo(12) },
]

export const seedNotifications = () => [
  { id: 'n1', audience: 'ALL', type: 'SYSTEM', title: 'Chào mừng đến với EduPress', body: 'Khám phá hàng trăm khóa học miễn phí và trả phí từ các nhà cung cấp đã được duyệt.', createdAt: daysAgo(14) },
  { id: 'n2', audience: 'PROVIDER', type: 'SYSTEM', title: 'Quy định đăng khóa học mới', body: 'Khóa học cần có ít nhất một bài xem thử và mô tả rõ mục tiêu trước khi gửi duyệt.', createdAt: daysAgo(7) },
  { id: 'n3', audience: 'CUSTOMER', type: 'PROMOTION', title: 'Ưu đãi cuối tuần', body: 'Nhiều khóa học giảm giá đến 30%. Xem ngay tại trang Khóa học.', createdAt: daysAgo(2) },
]

export const seedTickets = () => [
  { id: 'tk1', userName: 'Trần Thị Bích', email: 'bich@mail.com', subject: 'Không xem được video bài 3', message: 'Video bị đứng ở giây thứ 10, mình đã thử tải lại trang.', status: 'OPEN', reply: '', createdAt: daysAgo(1) },
  { id: 'tk2', userName: 'Lê Hoàng Long', email: 'long@mail.com', subject: 'Hỏi về hoàn tiền', message: 'Mình đăng ký nhầm khóa, có được hoàn tiền không?', status: 'IN_PROGRESS', reply: 'Chúng tôi đang kiểm tra giao dịch của bạn.', createdAt: daysAgo(3) },
  { id: 'tk3', userName: 'Phạm Minh Châu', email: 'chau@mail.com', subject: 'Quên mật khẩu không nhận được email', message: 'Mình chưa nhận được email đặt lại mật khẩu.', status: 'RESOLVED', reply: 'Đã gửi lại, bạn kiểm tra cả thư mục spam nhé.', createdAt: daysAgo(6) },
]

export const seedCosts = () => [
  { id: 'c1', label: 'Máy chủ và tên miền', amount: 300000, date: daysAgo(30).slice(0, 10) },
  { id: 'c2', label: 'Dịch vụ lưu trữ video', amount: 400000, date: daysAgo(20).slice(0, 10) },
  { id: 'c3', label: 'Quảng cáo', amount: 250000, date: daysAgo(8).slice(0, 10) },
]

const postBody = (t) => `${t}\n\nMỗi khóa học nên được chọn dựa trên mục tiêu cụ thể của bạn: học để đổi việc, để nâng kỹ năng hiện tại hay để thử một lĩnh vực mới.\n\nHãy xem phần mục tiêu, bài học xem thử và đánh giá của học viên trước khi đăng ký. Với khóa trả phí, bạn có thể dùng mã giảm giá của nhà cung cấp ở bước thanh toán.\n\nCuối cùng, hãy đặt lịch học cố định mỗi tuần. Học đều với thời lượng ngắn hiệu quả hơn học dồn.`
export const seedPosts = () => [
  ...articles.map((a) => ({
    id: `post-${a.id}`, slug: `bai-viet-${a.id}`, title: a.title, excerpt: a.excerpt, content: postBody(a.excerpt),
    category: ['Học tập', 'Lập trình', 'Kỹ năng'][a.id - 1], tags: ['khóa học', 'tự học'], tone: a.tone, author: 'Ban biên tập', hidden: false, createdAt: daysAgo(30 - a.id * 3),
  })),
  { id: 'post-4', slug: 'cach-dung-ma-giam-gia', title: 'Cách dùng mã giảm giá khi đăng ký khóa học', excerpt: 'Nhập mã ở bước thanh toán để được trừ trực tiếp vào giá khóa học.', content: postBody('Nhập mã ở bước thanh toán để được trừ trực tiếp vào giá khóa học.'), category: 'Hướng dẫn', tags: ['giảm giá'], tone: 'from-[#fff0c2] to-[#ffdc7a]', author: 'Ban biên tập', hidden: false, createdAt: daysAgo(12) },
  { id: 'post-5', slug: 'tro-thanh-nha-cung-cap', title: 'Trở thành nhà cung cấp khóa học trên EduPress', excerpt: 'Đăng ký làm nhà cung cấp, chờ quản trị viên duyệt và bắt đầu đăng khóa học đầu tiên.', content: postBody('Đăng ký làm nhà cung cấp, chờ quản trị viên duyệt và bắt đầu đăng khóa học đầu tiên.'), category: 'Nhà cung cấp', tags: ['nhà cung cấp'], tone: 'from-[#d7f0f5] to-[#a6dce6]', author: 'Ban biên tập', hidden: false, createdAt: daysAgo(9) },
  { id: 'post-6', slug: 'hoc-online-hieu-qua', title: 'Học online hiệu quả: 6 thói quen nên có', excerpt: 'Chọn giờ học cố định, tắt thông báo và ghi chú sau mỗi bài giúp bạn nhớ lâu hơn.', content: postBody('Chọn giờ học cố định, tắt thông báo và ghi chú sau mỗi bài giúp bạn nhớ lâu hơn.'), category: 'Học tập', tags: ['thói quen'], tone: 'from-[#efdcff] to-[#d5b3f5]', author: 'Ban biên tập', hidden: false, createdAt: daysAgo(5) },
]

export const seedFaqs = () => [
  ['EduPress là gì?', 'EduPress là nền tảng học trực tuyến, nơi các nhà cung cấp đăng khóa học và học viên đăng ký học.'],
  ['Tôi có thể học miễn phí không?', 'Có. Nhiều khóa học do nhà cung cấp chia sẻ miễn phí, bạn chỉ cần tạo tài khoản.'],
  ['Làm sao để đăng ký một khóa học trả phí?', 'Vào trang chi tiết khóa học, chọn Đăng ký ngay, nhập mã giảm giá nếu có rồi chọn phương thức thanh toán.'],
  ['Tôi xem lại video được bao nhiêu lần?', 'Không giới hạn. Sau khi đăng ký bạn xem lại bài học bất cứ lúc nào.'],
  ['Làm thế nào để trở thành nhà cung cấp?', 'Trong menu tài khoản chọn Trở thành nhà cung cấp, điền thông tin và chờ quản trị viên duyệt.'],
  ['Khóa học của tôi cần được duyệt không?', 'Có. Quản trị viên duyệt mỗi khóa học mới trước khi khóa được hiển thị công khai.'],
  ['Tôi có thể đánh giá khóa học không?', 'Có, khi bạn đã đăng ký khóa học đó. Bạn chọn số sao và viết nhận xét.'],
  ['Tôi cần hỗ trợ kỹ thuật thì liên hệ đâu?', 'Bạn gửi tin nhắn ở trang Liên hệ, đội hỗ trợ sẽ phản hồi qua email.'],
].map(([question, answer], i) => ({ id: `f${i + 1}`, question, answer, hidden: false }))

export const permissionList = [
  ['course.create', 'Tạo và quản lý khóa học'], ['promo.manage', 'Quản lý ưu đãi, mã giảm giá'], ['revenue.view', 'Xem báo cáo doanh thu'],
  ['course.enroll', 'Đăng ký và học khóa học'], ['course.review', 'Đánh giá khóa học'],
  ['course.approve', 'Duyệt khóa học'], ['provider.approve', 'Duyệt nhà cung cấp'], ['user.manage', 'Quản lý người dùng'],
  ['payment.manage', 'Quản lý thanh toán'], ['notification.send', 'Gửi thông báo'], ['finance.view', 'Xem tài chính'],
  ['support.manage', 'Hỗ trợ kỹ thuật'], ['content.moderate', 'Kiểm duyệt nội dung'],
]
export const roleList = [['ADMIN', 'Quản trị viên'], ['STAFF', 'Nhân viên hệ thống'], ['PROVIDER', 'Nhà cung cấp'], ['CUSTOMER', 'Khách hàng']]
export const seedPermissions = () => {
  const all = Object.fromEntries(permissionList.map(([k]) => [k, true]))
  const pick = (keys) => Object.fromEntries(keys.map((k) => [k, true]))
  return {
    ADMIN: all,
    STAFF: pick(['course.approve', 'notification.send', 'support.manage', 'content.moderate']),
    PROVIDER: pick(['course.create', 'promo.manage', 'revenue.view', 'course.enroll', 'course.review']),
    CUSTOMER: pick(['course.enroll', 'course.review']),
  }
}
