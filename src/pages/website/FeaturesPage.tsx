import { Link } from 'react-router-dom'
import {
  FileText, CheckCircle, Gear, ChartLine, ShieldCheck,
  Bell, Users, ArrowLeft, Sparkle, DeviceMobile,
  Clock, Lock, ArrowsClockwise, Database
} from '@phosphor-icons/react'

const allFeatures = [
  { icon: FileText,       color: 'violet', title: 'إدارة الطلبات',          desc: '14+ نوع طلب جاهز قابل للتخصيص. الموظف يقدم، المدير يوافق، أنت تتابع.' },
  { icon: CheckCircle,    color: 'emerald', title: 'سير عمل الموافقات',       desc: 'حدد مراحل الموافقة وأصحاب الصلاحية لكل نوع طلب بشكل مرن.' },
  { icon: Gear,           color: 'amber',   title: 'Form Builder مرئي',       desc: 'أضف أو عدّل أو احذف حقول أي طلب بالسحب والإفلات من الداشبورد.' },
  { icon: ChartLine,      color: 'cyan',    title: 'تقارير وتحليلات',         desc: 'تقارير احترافية بالرسوم البيانية مع إمكانية التصدير.' },
  { icon: Bell,           color: 'violet',  title: 'إشعارات لحظية',           desc: 'إشعارات فورية بالبريد والجوال عند كل حدث مهم.' },
  { icon: DeviceMobile,   color: 'emerald', title: 'تطبيق جوال',              desc: 'واجهة متجاوبة تعمل على كل الأجهزة بكفاءة عالية.' },
  { icon: ShieldCheck,    color: 'amber',   title: 'أمان متقدم',              desc: 'تشفير SSL، صلاحيات دقيقة، وسجل كامل لكل الإجراءات.' },
  { icon: Users,          color: 'cyan',    title: 'إدارة الموظفين',           desc: 'ملفات موظفين شاملة مع الهيكل التنظيمي والأدوار.' },
  { icon: ArrowsClockwise,color: 'violet',  title: 'تكاملات خارجية',          desc: 'تكامل مع أنظمة الرواتب والحضور والبصمة وأكثر.' },
  { icon: Clock,          color: 'emerald', title: 'تتبع الحضور',              desc: 'ربط مباشر مع أجهزة البصمة ونظام الدوام.' },
  { icon: Lock,           color: 'amber',   title: 'تعدد الشركات',            desc: 'خدمة كل شركة ببياناتها المعزولة وإعداداتها المستقلة.' },
  { icon: Database,       color: 'cyan',    title: 'نسخ احتياطي تلقائي',      desc: 'نسخ احتياطي يومي تلقائي مع استعادة فورية للبيانات.' },
]

const colorMap: Record<string, { bg: string; border: string; icon: string }> = {
  violet:  { bg: 'bg-violet-500/10',  border: 'border-violet-500/20',  icon: 'text-violet-400'  },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: 'text-emerald-400' },
  amber:   { bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   icon: 'text-amber-400'   },
  cyan:    { bg: 'bg-cyan-500/10',    border: 'border-cyan-500/20',    icon: 'text-cyan-400'    },
}

export default function FeaturesPage() {
  return (
    <div className="pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-xs font-black text-violet-400 uppercase tracking-widest">المميزات الكاملة</span>
          <h1 className="text-5xl md:text-6xl font-black text-white mt-3 mb-5">
            كل ما تحتاجه<br /><span className="text-gradient">وأكثر</span>
          </h1>
          <p className="text-white/45 text-xl max-w-2xl mx-auto leading-relaxed">
            HR Portal ليس مجرد نظام طلبات — إنه منصة HR متكاملة تنمو مع شركتك.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
          {allFeatures.map(f => {
            const c = colorMap[f.color]
            return (
              <div key={f.title} className={`glass border-gradient p-6 hover:-translate-y-1 transition-all duration-300 animate-fade-up group`}>
                <div className={`w-12 h-12 rounded-2xl ${c.bg} border ${c.border} flex items-center justify-center mb-4`}>
                  <f.icon size={22} weight="duotone" className={c.icon} />
                </div>
                <h3 className="font-black text-white mb-2">{f.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link to="/login" className="btn-primary text-base px-8 py-4 shadow-2xl shadow-violet-900/50">
            جرّب كل المميزات مجاناً
            <ArrowLeft size={18} weight="bold" />
          </Link>
        </div>
      </div>
    </div>
  )
}
