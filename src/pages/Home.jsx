import { Link } from 'react-router-dom'
import { Calendar, Check, GraduationCap, PlayCircle, Quote } from 'lucide-react'
import { useCourses } from '../hooks/useData.js'
import SectionHeading from '../components/SectionHeading.jsx'
import CourseCard from '../components/CourseCard.jsx'
import { categories, stats, benefits, testimonials, articles } from '../data/mock.js'

const container = 'mx-auto max-w-[1140px] px-4'
const btnPrimary = 'inline-flex items-center rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-white transition hover:bg-brand-dark'
const btnOutline = 'inline-flex items-center rounded-full border border-brand px-6 py-2.5 text-sm font-medium text-brand transition hover:bg-brand hover:text-white'

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#fdf3b0] via-[#e6f6d2] to-[#bdf1e3]">
      <span
        aria-hidden
        className="pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2 select-none font-display text-[7rem] font-extrabold leading-[0.85] text-white/60 md:text-[11rem]"
      >
        HỌC<br />ONLINE
      </span>
      <div className={`${container} relative grid items-center gap-10 py-16 md:grid-cols-2 md:py-24`}>
        <div>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Học kỹ năng mới<br />cùng khóa học trực tuyến
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-7 text-ink/70">
            Hàng trăm khóa học từ các nhà cung cấp đã được duyệt. Có khóa miễn phí, khóa trả phí và ưu đãi theo từng đợt.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/khoa-hoc" className={btnPrimary}>Xem khóa học</Link>
            <Link to="/dang-ky" className="inline-flex items-center rounded-full bg-white/70 px-6 py-2.5 text-sm font-medium transition hover:bg-white">Trở thành nhà cung cấp</Link>
          </div>
        </div>

        {}
        <div className="relative mx-auto hidden aspect-square w-full max-w-sm md:block" aria-hidden>
          <div className="absolute inset-4 rounded-[42%_58%_55%_45%/50%_45%_55%_50%] bg-white/50" />
          <div className="absolute inset-0 grid place-items-center">
            <div className="grid h-40 w-40 place-items-center rounded-full bg-brand text-white shadow-lift">
              <GraduationCap className="h-20 w-20" strokeWidth={1.5} />
            </div>
          </div>
          <div className="absolute bottom-6 left-0 flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-lift">
            <PlayCircle className="h-8 w-8 text-brand" />
            <div>
              <p className="text-sm font-semibold">Bài 4: Auto layout</p>
              <p className="text-xs text-muted">Đã học 65%</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Categories() {
  return (
    <section className={`${container} pt-16`}>
      <SectionHeading title="Danh mục nổi bật" sub="Khám phá các lĩnh vực được học nhiều" to="/khoa-hoc" action="Tất cả danh mục" />
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map(({ name, icon: Icon, count }) => (
          <li key={name}>
            <Link to="/khoa-hoc" className="flex h-full flex-col items-center gap-2 rounded-card border border-line px-3 py-6 text-center transition hover:border-transparent hover:shadow-lift">
              <Icon className="h-6 w-6 text-brand" aria-hidden />
              <span className="text-sm font-medium">{name}</span>
              <span className="text-xs text-muted">{count} khóa học</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Featured() {
  const { published } = useCourses()
  return (
    <section className={`${container} pt-20`}>
      <SectionHeading title="Khóa học nổi bật" sub="Được nhiều học viên đăng ký gần đây" to="/khoa-hoc" action="Tất cả khóa học" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {published.slice(0, 6).map((c) => <CourseCard key={c.id} course={c} />)}
      </div>
    </section>
  )
}

function PromoBanner() {
  return (
    <section className={`${container} pt-16`}>
      <div className="flex flex-col items-start justify-between gap-6 rounded-card bg-gradient-to-r from-[#b8f3dd] to-[#fbc9c9] p-8 md:flex-row md:items-center md:p-10">
        <div>
          <p className="text-[13px] font-medium">Ưu đãi đang diễn ra</p>
          <h2 className="mt-1 text-2xl font-bold">Giảm đến 40% cho khóa học đăng ký trong tuần này</h2>
          <p className="mt-2 max-w-lg text-[13px] leading-6 text-ink/70">
            Nhà cung cấp có thể tạo mã giảm giá và ưu đãi theo thời gian hoặc số lượt đăng ký. Nhập mã khi thanh toán để nhận giảm giá.
          </p>
        </div>
        <Link to="/khoa-hoc" className={btnPrimary}>Xem khóa học đang giảm</Link>
      </div>
    </section>
  )
}

function Stats() {
  return (
    <section className={`${container} pt-12`}>
      <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-card bg-surface px-4 py-6 text-center">
            <dt className="order-2 mt-1 text-xs text-muted">{s.label}</dt>
            <dd className="font-display text-2xl font-bold text-brand">{s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function Benefits() {
  return (
    <section className={`${container} grid items-center gap-10 pt-20 md:grid-cols-2`}>
      {}
      <div className="grid aspect-[4/3] place-items-center rounded-card bg-brand-soft" aria-hidden>
        <PlayCircle className="h-24 w-24 text-brand" strokeWidth={1} />
      </div>
      <div>
        <h2 className="text-2xl font-bold leading-snug">Nâng cao kỹ năng<br />ngay trên EduPress</h2>
        <p className="mt-3 max-w-md text-[13px] leading-6 text-muted">
          Mọi khóa học đều được quản trị viên duyệt trước khi đăng, nên bạn yên tâm về chất lượng nội dung.
        </p>
        <ul className="mt-5 space-y-2.5">
          {benefits.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-free" aria-hidden />{b}
            </li>
          ))}
        </ul>
        <Link to="/khoa-hoc" className={`${btnPrimary} mt-7`}>Khám phá khóa học</Link>
      </div>
    </section>
  )
}

function Testimonials() {
  return (
    <section className={`${container} pt-20`}>
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold">Học viên nói gì</h2>
        <p className="mt-1 text-[13px] text-muted">Phản hồi từ những người đã học trên EduPress</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {testimonials.map((t) => (
          <figure key={t.name} className="flex flex-col rounded-card border border-line p-5">
            <Quote className="h-5 w-5 text-muted/50" aria-hidden />
            <blockquote className="mt-3 flex-1 text-[13px] leading-6 text-ink/80">{t.text}</blockquote>
            <figcaption className="mt-4">
              <p className="text-sm font-semibold">{t.name}</p>
              <p className="text-xs text-muted">{t.role}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

function StartBanner() {
  return (
    <section className={`${container} pt-20`}>
      <div className="flex flex-col items-start justify-between gap-5 rounded-card bg-gradient-to-r from-[#bfe6fb] to-[#e4d3ff] p-6 md:flex-row md:items-center md:px-10">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-white"><GraduationCap className="h-7 w-7" aria-hidden /></span>
          <p className="text-[15px] font-medium">Bắt đầu cùng EduPress</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/dang-ky" className={`${btnOutline} bg-white/60`}>Tôi là học viên</Link>
          <Link to="/dang-ky" className={btnPrimary}>Trở thành nhà cung cấp</Link>
        </div>
      </div>
    </section>
  )
}

function Articles() {
  return (
    <section className={`${container} pt-20`}>
      <SectionHeading title="Bài viết mới" sub="Chia sẻ về học tập và kỹ năng" to="/blog" action="Tất cả bài viết" />
      <div className="grid gap-6 md:grid-cols-3">
        {articles.map((a) => (
          <article key={a.id} className="group overflow-hidden rounded-card border border-line transition hover:shadow-lift">
            <div className={`aspect-[16/9] bg-gradient-to-br ${a.tone}`} aria-hidden />
            <div className="p-4">
              <h3 className="text-[15px] font-semibold leading-snug group-hover:text-brand">
                <Link to="/blog">{a.title}</Link>
              </h3>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-muted"><Calendar className="h-3.5 w-3.5 text-brand" aria-hidden />{a.date}</p>
              <p className="mt-2 text-[13px] leading-6 text-muted">{a.excerpt}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <Featured />
      <PromoBanner />
      <Stats />
      <Benefits />
      <Testimonials />
      <StartBanner />
      <Articles />
    </>
  )
}
