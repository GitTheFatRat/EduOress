import {
  Figma, Globe, Aperture, Megaphone, Wallet, BarChart3, Video, PenLine,
  MessagesSquare, Network, Palette, FlaskConical, BookOpen,
} from 'lucide-react'
import { courses as base } from './mock.js'
import { getReviews, summarize } from './reviews.js'

export const levelLabels = { all: 'Mọi cấp độ', beginner: 'Người mới', intermediate: 'Trung cấp', expert: 'Nâng cao' }

export const iconMap = { BookOpen, Figma, Globe, Aperture, Megaphone, Wallet, BarChart3, Video, PenLine, MessagesSquare, Network, Palette, FlaskConical }
export const iconLabels = {
  BookOpen: 'Sách', Figma: 'Thiết kế', Globe: 'Web', Aperture: 'Nhiếp ảnh', Megaphone: 'Marketing', Wallet: 'Tài chính',
  BarChart3: 'Dữ liệu', Video: 'Video', PenLine: 'Viết lách', MessagesSquare: 'Giao tiếp', Network: 'Mạng', Palette: 'Nghệ thuật', FlaskConical: 'Khoa học',
}
export const categoryOptions = ['Thiết kế', 'Lập trình', 'Nhiếp ảnh', 'Marketing', 'Tài chính', 'Dựng phim', 'Viết nội dung', 'Giao tiếp', 'Mạng máy tính', 'Khoa học']
export const defaultTone = 'from-[#e6e9ff] to-[#c9d2ff]'

const nameOf = (Icon) => Object.keys(iconMap).find((k) => iconMap[k] === Icon) ?? 'BookOpen'
const levelById = { 1: 'beginner', 2: 'intermediate', 3: 'beginner', 4: 'all', 5: 'all', 6: 'intermediate' }
const owner = { 1: 'u-provider', 7: 'u-provider', 11: 'u-provider' }
const levelText = { all: 'học viên ở mọi trình độ', beginner: 'người mới bắt đầu', intermediate: 'người đã có kiến thức nền', expert: 'người muốn học ở mức nâng cao' }

const extra = [
  { id: 7, slug: 'dung-video-ngan-capcut', title: 'Dựng video ngắn bằng CapCut', category: 'Dựng phim', provider: 'Lumen Studio', weeks: 4, students: 143, price: 250000, oldPrice: 400000, icon: Video, tone: 'from-[#ffd6e0] to-[#ffb3c6]', level: 'beginner' },
  { id: 8, slug: 'viet-noi-dung-chuan-seo', title: 'Viết nội dung chuẩn SEO', category: 'Viết nội dung', provider: 'Growth Lab', weeks: 5, students: 76, price: 0, oldPrice: 300000, icon: PenLine, tone: 'from-[#fff0c2] to-[#ffe08a]', level: 'beginner' },
  { id: 9, slug: 'giao-tiep-tu-tin-cong-so', title: 'Giao tiếp tự tin nơi công sở', category: 'Giao tiếp', provider: 'Minh Anh Academy', weeks: 3, students: 210, price: 180000, oldPrice: 300000, icon: MessagesSquare, tone: 'from-[#d7f0f5] to-[#a6dce6]', level: 'all' },
  { id: 10, slug: 'mang-may-tinh-can-ban', title: 'Mạng máy tính căn bản', category: 'Mạng máy tính', provider: 'CodeXanh', weeks: 6, students: 64, price: 420000, oldPrice: 600000, icon: Network, tone: 'from-[#e6e9ff] to-[#c9d2ff]', level: 'intermediate' },
  { id: 11, slug: 'thiet-ke-poster-illustrator', title: 'Thiết kế poster với Illustrator', category: 'Thiết kế', provider: 'Lumen Studio', weeks: 5, students: 118, price: 380000, oldPrice: 520000, icon: Palette, tone: 'from-[#ffe1d1] to-[#ffb98f]', level: 'intermediate' },
  { id: 12, slug: 'khoa-hoc-du-lieu-nang-cao', title: 'Khoa học dữ liệu nâng cao', category: 'Khoa học', provider: 'CodeXanh', weeks: 10, students: 59, price: 950000, oldPrice: 1290000, icon: FlaskConical, tone: 'from-[#efdcff] to-[#d5b3f5]', level: 'expert' },
]

const objectives = [
  'Nắm vững các khái niệm cốt lõi của khóa học',
  'Làm theo các bài thực hành từng bước',
  'Hoàn thành một dự án nhỏ để đưa vào hồ sơ',
  'Biết cách tiếp tục học ở mức cao hơn',
]
const describe = (c) =>
  `${c.title} là khóa học lĩnh vực ${c.category} do ${c.provider} biên soạn, dành cho ${levelText[c.level]}.\n\nNội dung chia thành các phần ngắn, mỗi bài có video bài giảng và tài liệu đi kèm. Bạn học theo tiến độ của mình và làm bài thực hành sau từng phần.\n\nKhóa học kéo dài khoảng ${c.weeks} tuần. Hoàn thành khóa, bạn có một sản phẩm nhỏ để đưa vào hồ sơ.`

const pending = [
  { id: 13, slug: 'lap-trinh-game-2d-unity', title: 'Lập trình game 2D với Unity', category: 'Lập trình', provider: 'CodeXanh', ownerId: null, weeks: 8, students: 0, price: 690000, oldPrice: 890000, iconName: 'Globe', tone: 'from-[#ffe1d1] to-[#ffb98f]', level: 'intermediate', status: 'PENDING_REVIEW', seeded: false, createdAt: '2026-09-25T08:00:00.000Z' },
  { id: 14, slug: 'chup-anh-san-pham-bang-dien-thoai', title: 'Chụp ảnh sản phẩm bằng điện thoại', category: 'Nhiếp ảnh', provider: 'Lumen Studio', ownerId: 'u-provider', weeks: 3, students: 0, price: 290000, oldPrice: 390000, iconName: 'Aperture', tone: 'from-[#d8f3dc] to-[#a9e4b6]', level: 'beginner', status: 'PENDING_REVIEW', seeded: false, createdAt: '2026-09-27T08:00:00.000Z' },
  { id: 15, slug: 'ky-nang-thuyet-trinh', title: 'Kỹ năng thuyết trình', category: 'Giao tiếp', provider: 'Lumen Studio', ownerId: 'u-provider', weeks: 2, students: 0, price: 150000, oldPrice: 0, iconName: 'MessagesSquare', tone: 'from-[#d7f0f5] to-[#a6dce6]', level: 'all', status: 'DRAFT', seeded: false, createdAt: '2026-09-28T08:00:00.000Z' },
].map((c) => ({ ...c, description: describe(c), objectives }))

export const seedCourses = () => [
  ...[...base.map((c) => ({ ...c, level: levelById[c.id] })), ...extra].map((c) => ({
    id: c.id, slug: c.slug, title: c.title, category: c.category, provider: c.provider, ownerId: owner[c.id] ?? null,
    weeks: c.weeks, students: c.students, price: c.price, oldPrice: c.oldPrice, iconName: nameOf(c.icon), tone: c.tone,
    level: c.level, status: 'PUBLISHED', seeded: true, createdAt: '2026-06-01T08:00:00.000Z',
    description: describe(c), objectives,
  })),
  ...pending,
]

export function hydrateCourse(r, lessons, storedReviews) {
  const approved = lessons.filter((l) => l.courseId === r.id && l.moderation === 'APPROVED')
  const revs = [...(r.seeded ? getReviews(r.id) : []), ...storedReviews.filter((x) => x.courseId === r.id)]
  const { avg, total } = summarize(revs)
  return {
    ...r,
    icon: iconMap[r.iconName] ?? BookOpen,
    tone: r.tone || defaultTone,
    level: r.level || 'all',
    lessonCount: approved.length,
    rating: avg,
    ratingCount: total,
    descriptionText: r.description || '',
    description: (r.description || '').split(/\n{2,}/).filter(Boolean),
    objectives: r.objectives || [],
  }
}
