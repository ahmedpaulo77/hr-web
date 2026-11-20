import { Link } from 'react-router-dom'
import { Buildings, ArrowLeft, Heart } from '@phosphor-icons/react'

const links = {
  المنتج: [{ l: 'المميزات', p: '/features' }, { l: 'الأسعار', p: '/pricing' }],
  الشركة: [{ l: 'من نحن', p: '/about' }, { l: 'تواصل معنا', p: '/contact' }],
  ابدأ: [{ l: 'تسجيل الدخول', p: '/login' }, { l: 'جرّب المنصة', p: '/contact' }],
}

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.06] mt-32" style={{ background: 'var(--bg-deep)', direction: 'rtl' }}>
      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-10 mb-14">

          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-5 group w-fit">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-900/50">
                <Buildings size={20} weight="duotone" color="white" />
              </div>
              <span className="font-black text-xl text-white">HR <span className="text-gradient">Portal</span></span>
            </Link>
            <p className="text-[15px] text-white/60 leading-8 mb-6 max-w-sm">
              منصة تساعدك على تنظيم طلبات الموظفين، وتسريع الموافقات، ومتابعة أعمال الموارد البشرية من مكان واحد.
            </p>
            <Link to="/contact" className="inline-flex items-center gap-2 text-sm font-bold text-violet-300 hover:text-white transition-colors">
              تواصل مع فريقنا <ArrowLeft size={15} weight="bold" />
            </Link>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <p className="text-sm font-black text-white/80 mb-5">{title}</p>
              <ul className="space-y-3">
                {items.map(item => (
                  <li key={item.l}>
                    <Link to={item.p} className="text-[15px] text-white/55 hover:text-white/90 transition-colors">
                      {item.l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-white/[0.06]">
          <p className="text-sm text-white/50">© {new Date().getFullYear()} HR Portal. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-white/50">صُنع بكل عناية</span>
            <Heart size={13} weight="fill" className="text-red-400" />
            <span className="text-sm text-white/50">لخدمة فرق الموارد البشرية</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
