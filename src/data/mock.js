import {
  Palette, Code2, MessagesSquare, Video, Camera,
  TrendingUp, PenLine, Landmark, FlaskConical, Network,
  Figma, Globe, Aperture, Megaphone, Wallet, BarChart3,
} from 'lucide-react'

export const categories = [
  { name: 'Nghệ thuật & Thiết kế', icon: Palette, count: 38 },
  { name: 'Lập trình', icon: Code2, count: 38 },
  { name: 'Giao tiếp', icon: MessagesSquare, count: 38 },
  { name: 'Dựng phim', icon: Video, count: 38 },
  { name: 'Nhiếp ảnh', icon: Camera, count: 38 },
  { name: 'Marketing', icon: TrendingUp, count: 38 },
  { name: 'Viết nội dung', icon: PenLine, count: 38 },
  { name: 'Tài chính', icon: Landmark, count: 38 },
  { name: 'Khoa học', icon: FlaskConical, count: 38 },
  { name: 'Mạng máy tính', icon: Network, count: 38 },
]

export const courses = [
  { id: 1, slug: 'thiet-ke-giao-dien-figma', title: 'Thiết kế giao diện với Figma từ cơ bản', category: 'Thiết kế', provider: 'Lumen Studio', weeks: 6, students: 156, price: 0, oldPrice: 590000, icon: Figma, tone: 'from-[#e6e9ff] to-[#c9d2ff]' },
  { id: 2, slug: 'react-website-ban-hang', title: 'Xây dựng website bán hàng với React', category: 'Lập trình', provider: 'CodeXanh', weeks: 8, students: 204, price: 490000, oldPrice: 790000, icon: Globe, tone: 'from-[#ffe1d1] to-[#ffb98f]' },
  { id: 3, slug: 'nhiep-anh-chan-dung', title: 'Nhiếp ảnh chân dung cho người mới', category: 'Nhiếp ảnh', provider: 'Góc Ảnh Hà Nội', weeks: 4, students: 98, price: 0, oldPrice: 390000, icon: Aperture, tone: 'from-[#d8f3dc] to-[#a9e4b6]' },
  { id: 4, slug: 'marketing-noi-dung-mang-xa-hoi', title: 'Marketing nội dung trên mạng xã hội', category: 'Marketing', provider: 'Growth Lab', weeks: 5, students: 132, price: 350000, oldPrice: 550000, icon: Megaphone, tone: 'from-[#fff0c2] to-[#ffdc7a]' },
  { id: 5, slug: 'tai-chinh-ca-nhan', title: 'Tài chính cá nhân căn bản', category: 'Tài chính', provider: 'Minh Anh Academy', weeks: 3, students: 87, price: 0, oldPrice: 290000, icon: Wallet, tone: 'from-[#d7f0f5] to-[#a6dce6]' },
  { id: 6, slug: 'python-phan-tich-du-lieu', title: 'Python cho phân tích dữ liệu', category: 'Lập trình', provider: 'CodeXanh', weeks: 7, students: 175, price: 620000, oldPrice: 890000, icon: BarChart3, tone: 'from-[#efdcff] to-[#d5b3f5]' },
]

export const stats = [
  { value: '25K+', label: 'Học viên đang học' },
  { value: '899', label: 'Khóa học' },
  { value: '158', label: 'Nhà cung cấp' },
  { value: '100%', label: 'Học viên hài lòng' },
]

export const benefits = [
  'Khóa học miễn phí và trả phí từ nhiều nhà cung cấp',
  'Mã giảm giá và ưu đãi theo thời gian hoặc số lượt đăng ký',
  'Học video mọi lúc, theo dõi tiến độ từng bài',
  'Quà tặng kèm khi đăng ký một số khóa học',
]

export const testimonials = [
  { name: 'Nguyễn Thu Hà', role: 'Nhà thiết kế', text: 'Mình học xong khóa Figma trong hai tuần. Bài giảng ngắn, có tài liệu đi kèm nên dễ làm theo.' },
  { name: 'Trần Quốc Bảo', role: 'Sinh viên CNTT', text: 'Có mã giảm giá nên mình đăng ký được khóa React. Xem lại video lúc nào cũng được.' },
  { name: 'Lê Phương Linh', role: 'Nhân viên marketing', text: 'Phần đánh giá của học viên trước giúp mình chọn đúng khóa, không mất thời gian thử.' },
  { name: 'Phạm Đức Minh', role: 'Freelancer', text: 'Mình đăng ký làm nhà cung cấp, khóa học được duyệt nhanh và xem được doanh thu từng khóa.' },
]

export const articles = [
  { id: 1, title: '5 cách chọn khóa học online phù hợp với mục tiêu', date: '24/01/2023', excerpt: 'Trước khi mua khóa học, hãy xem mục tiêu, đánh giá và bài học xem thử để tránh chọn nhầm.', tone: 'from-[#ffe1d1] to-[#ffc9a8]' },
  { id: 2, title: 'Lộ trình tự học lập trình web cho người mới bắt đầu', date: '24/01/2023', excerpt: 'Bắt đầu từ HTML, CSS rồi tới JavaScript và một framework. Mỗi bước nên có một dự án nhỏ.', tone: 'from-[#d8f3dc] to-[#b6e8c1]' },
  { id: 3, title: 'Làm sao để giữ nhịp học đều mỗi tuần', date: '24/01/2023', excerpt: 'Chia nhỏ bài học, đặt lịch cố định và theo dõi tiến độ giúp bạn học đến cuối khóa.', tone: 'from-[#e6e9ff] to-[#cfd6ff]' },
]

export const footerLinks = {
  help: [
    { label: 'Liên hệ', to: '/lien-he' },
    { label: 'Bài viết mới', to: '/blog' },
    { label: 'Câu hỏi thường gặp', to: '/faq' },
  ],
  programs: ['Nghệ thuật & Thiết kế', 'Kinh doanh', 'CNTT & Phần mềm', 'Ngoại ngữ', 'Lập trình'],
}

export const formatPrice = (n) =>
  n === 0 ? 'Miễn phí' : new Intl.NumberFormat('vi-VN').format(n) + ' ₫'
