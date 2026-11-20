import { Link } from 'react-router-dom'
import { ArrowLeft, Users, Buildings, Globe, Heart } from '@phosphor-icons/react'

const team = [
  { name: 'عبدالله الحارثي', role: 'المؤسس والرئيس التنفيذي',  avatar: 'ع', color: 'from-violet-500 to-purple-700' },
  { name: 'سارة المطيري',    role: 'مدير المنتج',               avatar: 'س', color: 'from-emerald-500 to-teal-600' },
  { name: 'خالد البقمي',     role: 'المدير التقني',              avatar: 'خ', color: 'from-amber-500 to-orange-600' },
  { name: 'نورة العمري',     role: 'مدير تجربة المستخدم',       avatar: 'ن', color: 'from-cyan-500 to-blue-600' },
]

const values = [
  { icon: Users,     title: 'الناس أولاً',    desc: 'نصمم لأجل الموظف قبل أي شيء آخر.' },
  { icon: Globe,     title: 'عربي بالكامل',   desc: 'بنيت المنصة من الأساس لتخدم الشركات العربية.' },
  { icon: Heart,     title: 'بساطة حقيقية',   desc: 'نؤمن أن التقنية يجب أن تكون سهلة لا معقدة.' },
  { icon: Buildings, title: 'نمو مستدام',     desc: 'نظام يتكيف مع نمو شركتك بلا حدود.' },
]

export default function AboutPage() {
  return (
    <div className="pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto space-y-28">

        {/* Hero */}
        <div className="text-center">
          <span className="text-xs font-black text-violet-400 uppercase tracking-widest">من نحن</span>
          <h1 className="text-5xl md:text-6xl font-black text-white mt-3 mb-6">
            نبني مستقبل<br /><span className="text-gradient">إدارة HR</span>
          </h1>
          <p className="text-white/45 text-xl max-w-2xl mx-auto leading-relaxed">
            HR Portal وُلد من تجربة حقيقية مع تعقيدات إدارة الموارد البشرية في الشركات العربية. مهمتنا تبسيط العمل وتمكين الناس.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 stagger">
          {[
            { n: '2021', l: 'سنة التأسيس' },
            { n: '+500', l: 'شركة عميلة' },
            { n: '+50K', l: 'موظف نشط' },
            { n: '12',   l: 'دولة عربية' },
          ].map(s => (
            <div key={s.l} className="glass border-gradient p-6 text-center animate-fade-up">
              <p className="text-4xl font-black text-gradient mb-2">{s.n}</p>
              <p className="text-sm text-white/40 font-semibold">{s.l}</p>
            </div>
          ))}
        </div>

        {/* Values */}
        <div>
          <h2 className="text-3xl font-black text-white text-center mb-10">قيمنا</h2>
          <div className="grid md:grid-cols-4 gap-5 stagger">
            {values.map(v => (
              <div key={v.title} className="glass border-gradient p-6 text-center animate-fade-up hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
                  <v.icon size={22} weight="duotone" className="text-violet-400" />
                </div>
                <h3 className="font-black text-white mb-2">{v.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <h2 className="text-3xl font-black text-white text-center mb-10">الفريق</h2>
          <div className="grid md:grid-cols-4 gap-5 stagger">
            {team.map(m => (
              <div key={m.name} className="glass border-gradient p-6 text-center animate-fade-up hover:-translate-y-1 transition-all">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${m.color} flex items-center justify-center mx-auto mb-4 font-black text-white text-2xl shadow-lg`}>
                  {m.avatar}
                </div>
                <p className="font-black text-white mb-1">{m.name}</p>
                <p className="text-xs text-white/35">{m.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/contact" className="btn-primary text-base px-8 py-4 shadow-2xl shadow-violet-900/50">
            انضم لفريقنا
            <ArrowLeft size={18} weight="bold" />
          </Link>
        </div>
      </div>
    </div>
  )
}
