export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <section className="bg-gradient-to-r from-[#fdf3b0]/50 via-[#e6f6d2]/50 to-[#bdf1e3]/50 px-4 py-14 md:py-20">
      <div className="mx-auto w-full max-w-md rounded-card border border-line bg-white p-7 shadow-lift md:p-9">
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="mt-1.5 text-[13px] leading-6 text-muted">{subtitle}</p>}
        <div className="mt-6">{children}</div>
        {footer && <div className="mt-6 border-t border-line pt-5 text-center text-[13px] text-muted">{footer}</div>}
      </div>
    </section>
  )
}
