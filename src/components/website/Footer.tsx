import { Link } from 'react-router-dom'
import { Buildings, TwitterLogo, LinkedinLogo, InstagramLogo, EnvelopeSimple, Phone, Heart } from '@phosphor-icons/react'

const links = {
  المنتج:   [{ l:'المميزات', p:'/features' }, { l:'الأسعار', p:'/pricing' }, { l:'التحديثات', p:'/' }],
  الشركة:   [{ l:'من نحن', p:'/about' }, { l:'تواصل معنا', p:'/contact' }, { l:'الوظائف', p:'/' }],
  الدعم:    [{ l:'مركز المساعدة', p:'/' }, { l:'توثيق API', p:'/' }, { l:'حالة الخدمة', p:'/' }],
  القانوني: [{ l:'سياسة الخصوصية', p:'/' }, { l:'شروط الاستخدام', p:'/' }, { l:'سياسة الكوكيز', p:'/' }],
}

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.06] mt-32" style={{ background: 'var(--bg-deep)' }}>
      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-14">

          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-5 group w-fit">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-900/50">
                <Buildings size={20} weight="duotone" color="white" />
              </div>
              <span className="font-black text-xl text-white">HR <span className="text-gradient">Portal</span></span>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed mb-6 max-w-xs">
              منصة إدارة الموارد البشرية الأكثر مرونةً في المنطقة العربية. نظام واحد يناسب كل شركة.
            </p>
            <div className="flex items-center gap-3">
              {[TwitterLogo, LinkedinLogo, InstagramLogo].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-violet-400 hover:border-violet-500/30 hover:bg-violet-500/10 transition-all">
                  <Icon size={16} weight="fill" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <p className="text-xs font-black text-white/70 uppercase tracking-widest mb-4">{title}</p>
              <ul className="space-y-2.5">
                {items.map(item => (
                  <li key={item.l}>
                    <Link to={item.p} className="text-sm text-white/35 hover:text-white/70 transition-colors">
                      {item.l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Bar */}
        <div className="flex flex-wrap gap-4 mb-10 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <a href="mailto:hello@hrportal.sa" className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors">
            <EnvelopeSimple size={15} weight="duotone" className="text-violet-400" />
            hello@hrportal.sa
          </a>
          <span className="text-white/10">|</span>
          <a href="tel:+966500000000" className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors">
            <Phone size={15} weight="duotone" className="text-violet-400" />
            +966 50 000 0000
          </a>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-white/[0.06]">
          <p className="text-xs text-white/25">© {new Date().getFullYear()} HR Portal. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-white/25">مصنوع بـ</span>
            <Heart size={13} weight="fill" className="text-red-400" />
            <span className="text-xs text-white/25">في المملكة العربية السعودية</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
