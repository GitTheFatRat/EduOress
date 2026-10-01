import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'
import { Logo } from './Header.jsx'
import { footerLinks } from '../data/mock.js'

const socials = [
  { icon: Facebook, label: 'Facebook' },
  { icon: Instagram, label: 'Instagram' },
  { icon: Twitter, label: 'X' },
  { icon: Youtube, label: 'YouTube' },
]

export default function Footer() {
  return (
    <footer className="mt-24 bg-surface">
      <div className="mx-auto grid max-w-[1140px] gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.4fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-[13px] leading-6 text-muted">
            Nền tảng học trực tuyến kết nối nhà cung cấp khóa học và học viên, với khóa miễn phí, khóa trả phí và ưu đãi theo từng đợt.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold">Hỗ trợ</h3>
          <ul className="mt-4 space-y-2.5 text-[13px] text-muted">
            {footerLinks.help.map((l) => (
              <li key={l.to}><Link to={l.to} className="hover:text-brand">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold">Chương trình</h3>
          <ul className="mt-4 space-y-2.5 text-[13px] text-muted">
            {footerLinks.programs.map((p) => (
              <li key={p}><Link to="/khoa-hoc" className="hover:text-brand">{p}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold">Liên hệ</h3>
          <address className="mt-4 space-y-2 text-[13px] not-italic leading-6 text-muted">
            <p>Địa chỉ: 123 Đường Mẫu, Quận 1, TP. Hồ Chí Minh</p>
            <p>Điện thoại: (028) 1234 5678</p>
            <p>Email: hotro@edupress.vn</p>
          </address>
          <div className="mt-4 flex gap-3">
            {socials.map(({ icon: Icon, label }) => (
              <a key={label} href="#" aria-label={label} className="text-brand transition hover:text-brand-dark">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-muted">
        © 2026 EduPress. Bảo lưu mọi quyền.
      </div>
    </footer>
  )
}
