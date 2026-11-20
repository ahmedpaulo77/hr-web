import { Link } from 'react-router-dom'
import {
  ArrowLeft, Play, CheckCircle, ArrowRight,
  FileText, Users, ChartLine, Gear, ShieldCheck,
  Sparkle, Buildings, Star, Quotes
} from '@phosphor-icons/react'

/* ─── Hero ─── */
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6"
      style={{ paddingTop: '120px', paddingBottom: '100px' }}>

      {/* blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full blur-3xl"
          style={{ width:'560px', height:'560px', top:'-120px', right:'-80px',
            background:'radial-gradient(circle, rgba(109,40,217,0.22) 0%, transparent 68%)' }} />
        <div className="absolute rounded-full blur-3xl"
          style={{ width:'420px', height:'420px', bottom:'60px', left:'-60px',
            background:'radial-gradient(circle, rgba(245,158,11,0.10) 0%, transparent 68%)' }} />
        {/* subtle dot-grid */}
        <div className="absolute inset-0"
          style={{
            backgroundImage:'radial-gradient(rgba(var(--ov-rgb),0.045) 1px, transparent 1px)',
            backgroundSize:'32px 32px',
          }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-10 animate-fade-up"
          style={{ border:'1px solid rgba(139,92,246,0.3)', background:'rgba(139,92,246,0.1)' }}>
          <Sparkle size={13} weight="fill" className="text-amber-400" />
          <span style={{ fontSize:'12px', fontWeight:700, color:'var(--accent-2)' }}>
            النظام الأكثر مرونةً في الشرق الأوسط
          </span>
          <span className="text-xs font-bold" style={{ color:'var(--accent-2)' }}>جديد</span>
        </div>

        {/* Headline */}
        <h1 className="font-black text-white animate-fade-up"
          style={{ fontSize:'clamp(2.6rem,6vw,4.5rem)', lineHeight:1.15, marginBottom:'24px', animationDelay:'0.1s' }}>
          إدارة الموارد البشرية<br />
          <span className="text-gradient">بذكاء وسرعة</span>
        </h1>

        {/* Sub */}
        <p className="animate-fade-up"
          style={{ fontSize:'clamp(1rem,2vw,1.2rem)', color:'rgba(var(--fg-rgb),0.55)',
            maxWidth:'580px', margin:'0 auto 40px', lineHeight:1.8, animationDelay:'0.18s' }}>
          منصة HR متكاملة تمكّن موظفيك من تقديم الطلبات، ومديريك من الموافقة عليها،
          وشركتك من تخصيص كل شيء — بدون كود.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-up"
          style={{ animationDelay:'0.26s' }}>
          <Link to="/login" className="btn-primary"
            style={{ fontSize:'15px', padding:'13px 28px', boxShadow:'0 6px 28px rgba(109,40,217,0.5)' }}>
            جرّب مجاناً الآن
            <ArrowLeft size={17} weight="bold" />
          </Link>
          <Link to="/features" className="btn-outline"
            style={{ fontSize:'15px', padding:'12px 28px' }}>
            <Play size={15} weight="fill" style={{ color:'var(--accent-2)' }} />
            شاهد كيف يعمل
          </Link>
        </div>

        {/* Social proof row */}
        <div className="animate-fade-up" style={{ animationDelay:'0.34s', marginTop:'56px' }}>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {[
              { n:'+500',  l:'شركة تثق بنا',  star:false },
              { n:'+50K',  l:'موظف نشط',      star:false },
              { n:'99.9%', l:'وقت تشغيل',     star:false },
              { n:'4.9',   l:'تقييم العملاء', star:true  },
            ].map(s => (
              <div key={s.l} className="text-center">
                <p style={{ fontSize:'1.6rem', fontWeight:900, color:'var(--ink)', lineHeight:1, display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}>
                  {s.n}
                  {s.star && <Star size={17} weight="fill" color="#f59e0b" />}
                </p>
                <p style={{ fontSize:'11px', color:'rgba(var(--fg-rgb),0.68)', marginTop:'4px', fontWeight:600 }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Features ─── */
const features = [
  {
    icon: FileText, color: 'violet',
    title: 'طلبات ذكية',
    desc: '14+ نوع طلب جاهز (سلفة، إجازة، شهادة خبرة...) مع تتبع كامل لحالة كل طلب لحظةً بلحظة.',
    items: ['تثبيت راتب', 'تعريف الراتب', 'إنهاء الخدمة', 'العلاقات الحكومية'],
  },
  {
    icon: CheckCircle, color: 'emerald',
    title: 'موافقات متعددة المراحل',
    desc: 'حدد مسار الموافقة لكل طلب. المدير يوافق بنقرة واحدة من أي جهاز.',
    items: ['موافقة فورية', 'إشعارات لحظية', 'سجل كامل', 'تفويض الصلاحيات'],
  },
  {
    icon: Gear, color: 'amber',
    title: 'تخصيص بلا حدود',
    desc: 'عدّل المسميات والحقول وأنواع الطلبات من الداشبورد مباشرةً — بدون مبرمج.',
    items: ['Form Builder مرئي', 'حقول مخصصة', 'مسميات وظيفية', 'صلاحيات متقدمة'],
  },
  {
    icon: ChartLine, color: 'cyan',
    title: 'تقارير وتحليلات',
    desc: 'تقارير احترافية تعطيك رؤية كاملة عن أداء فريقك وحركة الطلبات.',
    items: ['تقارير تلقائية', 'مخططات بيانية', 'تصدير Excel/PDF', 'KPIs مخصصة'],
  },
]

const colorMap: Record<string, { border: string; iconBg: string; iconClr: string; tagBg: string; tagClr: string }> = {
  violet:  { border:'rgba(139,92,246,0.2)',  iconBg:'rgba(139,92,246,0.12)', iconClr:'var(--txt-violet)',  tagBg:'rgba(139,92,246,0.12)', tagClr:'var(--tag-violet)'  },
  emerald: { border:'rgba(16,185,129,0.2)',  iconBg:'rgba(16,185,129,0.12)', iconClr:'var(--txt-emerald)', tagBg:'rgba(16,185,129,0.12)', tagClr:'var(--tag-emerald)' },
  amber:   { border:'rgba(245,158,11,0.2)',  iconBg:'rgba(245,158,11,0.12)', iconClr:'var(--txt-amber)',   tagBg:'rgba(245,158,11,0.12)', tagClr:'var(--tag-amber)'   },
  cyan:    { border:'rgba(6,182,212,0.2)',   iconBg:'rgba(6,182,212,0.12)',  iconClr:'var(--txt-cyan)',    tagBg:'rgba(6,182,212,0.12)',  tagClr:'var(--tag-cyan)'    },
}

function Features() {
  return (
    <section style={{ padding:'96px 24px' }}>
      <div style={{ maxWidth:'1200px', margin:'0 auto' }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:'60px' }}>
          <span style={{ fontSize:'11px', fontWeight:800, color:'var(--accent-2)', textTransform:'uppercase', letterSpacing:'3px' }}>
            المميزات
          </span>
          <h2 className="font-black text-white" style={{ fontSize:'clamp(2rem,4vw,3rem)', marginTop:'12px', marginBottom:'16px', lineHeight:1.2 }}>
            كل ما تحتاجه في{' '}
            <span className="text-gradient">مكان واحد</span>
          </h2>
          <p style={{ color:'rgba(var(--fg-rgb),0.72)', fontSize:'17px', maxWidth:'500px', margin:'0 auto', lineHeight:1.7 }}>
            من تقديم الطلبات إلى التقارير التفصيلية — منصة مصممة للشركات العربية.
          </p>
        </div>

        <div className="stagger" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'20px' }}>
          {features.map(f => {
            const c = colorMap[f.color]
            return (
              <div key={f.title} className="glass-card animate-fade-up"
                style={{ padding:'28px', border:`1px solid ${c.border}`,
                  transition:'transform 0.25s, box-shadow 0.25s', cursor:'default' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform='translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow=`0 16px 48px ${c.border}` }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform=''; (e.currentTarget as HTMLDivElement).style.boxShadow='' }}
              >
                <div style={{ width:48, height:48, borderRadius:14, background:c.iconBg, border:`1px solid ${c.border}`,
                  display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20 }}>
                  <f.icon size={22} weight="duotone" color={c.iconClr} />
                </div>
                <h3 className="font-black text-white" style={{ fontSize:'18px', marginBottom:8 }}>{f.title}</h3>
                <p style={{ color:'rgba(var(--fg-rgb),0.72)', fontSize:'14px', lineHeight:1.7, marginBottom:18 }}>{f.desc}</p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                  {f.items.map(item => (
                    <span key={item} style={{ fontSize:'12px', fontWeight:700, padding:'4px 12px', borderRadius:10,
                      background:c.tagBg, color:c.tagClr }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ textAlign:'center', marginTop:'40px' }}>
          <Link to="/features" className="btn-outline">
            عرض جميع المميزات <ArrowLeft size={14} weight="bold" />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ─── How It Works ─── */
function HowItWorks() {
  const steps = [
    { n:'01', title:'سجّل شركتك',   desc:'أنشئ حساباً وأضف موظفيك في دقائق معدودة.' },
    { n:'02', title:'خصّص النظام',  desc:'عدّل الطلبات والحقول والمسميات حسب طبيعة شركتك.' },
    { n:'03', title:'قدّم الطلبات', desc:'الموظفون يقدمون طلباتهم من أي جهاز بسهولة.' },
    { n:'04', title:'وافق وتابع',   desc:'المديرون يوافقون وأنت تراقب كل شيء من التقارير.' },
  ]
  return (
    <section style={{ padding:'96px 24px', background:'rgba(139,92,246,0.03)' }}>
      <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'60px' }}>
          <span style={{ fontSize:'11px', fontWeight:800, color:'var(--txt-amber)', textTransform:'uppercase', letterSpacing:'3px' }}>
            كيف يعمل
          </span>
          <h2 className="font-black text-white" style={{ fontSize:'clamp(2rem,4vw,3rem)', marginTop:'12px', lineHeight:1.2 }}>
            ابدأ في <span className="text-gradient">4 خطوات</span>
          </h2>
        </div>
        <div className="stagger" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'24px' }}>
          {steps.map((s, i) => (
            <div key={s.n} className="animate-fade-up" style={{ textAlign:'center', padding:'32px 20px',
              background:'var(--step-bg)', borderRadius:20, border:'1px solid rgba(139,92,246,0.14)' }}>
              <div style={{ width:60, height:60, borderRadius:16, margin:'0 auto 20px',
                background:'linear-gradient(135deg,rgba(139,92,246,0.25),rgba(109,40,217,0.15))',
                border:'1px solid rgba(139,92,246,0.25)',
                display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span className="text-gradient font-black" style={{ fontSize:'20px' }}>{s.n}</span>
              </div>
              <h3 className="font-black text-white" style={{ fontSize:'17px', marginBottom:8 }}>{s.title}</h3>
              <p style={{ color:'rgba(var(--fg-rgb),0.72)', fontSize:'13px', lineHeight:1.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Testimonials ─── */
const testimonials = [
  {
    name:'أحمد الشمري',  role:'مدير الموارد البشرية', company:'شركة التقنية الرائدة',
    avatar:'أ', color:'from-violet-500 to-purple-700',
    text:'وفّر علينا HR Portal أكثر من 80% من الوقت الذي كنا نقضيه في معالجة طلبات الموظفين يدوياً.',
    stars:5,
  },
  {
    name:'سارة القحطاني', role:'CEO', company:'مجموعة النخبة التجارية',
    avatar:'س', color:'from-emerald-500 to-teal-600',
    text:'أخيراً نظام عربي يفهم احتياجاتنا! ميزة تخصيص الحقول والمسميات من الداشبورد غيّرت طريقة عملنا.',
    stars:5,
  },
  {
    name:'محمد الغامدي',  role:'مدير تقنية المعلومات', company:'شركة البناء المتقدم',
    avatar:'م', color:'from-amber-500 to-orange-600',
    text:'التكامل كان سلساً جداً والدعم الفني ممتاز. فريقنا يقدم ويتابع الطلبات من الجوال.',
    stars:5,
  },
]

function Testimonials() {
  return (
    <section style={{ padding:'96px 24px' }}>
      <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'60px' }}>
          <span style={{ fontSize:'11px', fontWeight:800, color:'var(--accent-2)', textTransform:'uppercase', letterSpacing:'3px' }}>
            آراء العملاء
          </span>
          <h2 className="font-black text-white" style={{ fontSize:'clamp(2rem,4vw,3rem)', marginTop:'12px', lineHeight:1.2 }}>
            ماذا يقول <span className="text-gradient">عملاؤنا</span>
          </h2>
        </div>

        <div className="stagger" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'20px' }}>
          {testimonials.map(t => (
            <div key={t.name} className="glass-card animate-fade-up"
              style={{ padding:'28px', border:'1px solid rgba(139,92,246,0.14)',
                transition:'transform 0.25s', cursor:'default' }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform='translateY(-4px)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform=''}>
              <Quotes size={28} weight="fill" style={{ color:'rgba(139,92,246,0.35)', marginBottom:16 }} />
              <p style={{ color:'rgba(var(--fg-rgb),0.58)', fontSize:'14px', lineHeight:1.8, marginBottom:20 }}>
                "{t.text}"
              </p>
              <div style={{ display:'flex', gap:3, marginBottom:20 }}>
                {[...Array(t.stars)].map((_,i) => <Star key={i} size={14} weight="fill" color="#f59e0b" />)}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:12, paddingTop:16, borderTop:'1px solid rgba(var(--ov-rgb),0.06)' }}>
                <div className={`bg-gradient-to-br ${t.color}`}
                  style={{ width:40, height:40, borderRadius:12, display:'flex', alignItems:'center',
                    justifyContent:'center', fontWeight:900, color:'white', fontSize:'16px' }}>
                  {t.avatar}
                </div>
                <div>
                  <p style={{ fontWeight:800, fontSize:'14px', color:'rgba(var(--fg-rgb),0.9)' }}>{t.name}</p>
                  <p style={{ fontSize:'11px', color:'rgba(var(--fg-rgb),0.62)' }}>{t.role} · {t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── CTA Banner ─── */
function CTABanner() {
  return (
    <section style={{ padding:'32px 24px 80px' }}>
      <div style={{ maxWidth:'900px', margin:'0 auto' }}>
        <div className="glass-card" style={{
          padding:'72px 48px', textAlign:'center',
          border:'1px solid rgba(139,92,246,0.25)',
          background:'var(--cta-bg)',
          position:'relative', overflow:'hidden',
        }}>
          {/* glow */}
          <div style={{ position:'absolute', top:'-60px', left:'50%', transform:'translateX(-50%)',
            width:300, height:300, borderRadius:'50%', filter:'blur(80px)',
            background:'radial-gradient(circle,rgba(109,40,217,0.35),transparent)', pointerEvents:'none' }} />

          <div style={{ position:'relative', zIndex:1 }}>
            <span style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'8px 18px',
              borderRadius:99, border:'1px solid rgba(245,158,11,0.3)', background:'rgba(245,158,11,0.1)',
              fontSize:'12px', fontWeight:700, color:'#fcd34d', marginBottom:24 }}>
              <Sparkle size={13} weight="fill" color="#f59e0b" />
              ابدأ مجاناً — لا حاجة لبطاقة ائتمان
            </span>

            <h2 className="font-black text-white" style={{ fontSize:'clamp(2rem,4vw,3rem)', lineHeight:1.2, marginBottom:16 }}>
              جاهز لتحويل<br /><span className="text-gradient">إدارة HR؟</span>
            </h2>
            <p style={{ color:'rgba(var(--fg-rgb),0.72)', fontSize:'17px', marginBottom:36, maxWidth:460, margin:'0 auto 36px' }}>
              انضم لأكثر من 500 شركة تستخدم HR Portal وجرّب الفرق بنفسك.
            </p>

            <div style={{ display:'flex', flexWrap:'wrap', gap:12, justifyContent:'center' }}>
              <Link to="/login" className="btn-primary"
                style={{ fontSize:'15px', padding:'13px 28px', boxShadow:'0 6px 28px rgba(109,40,217,0.5)' }}>
                ابدأ تجربتك المجانية
                <ArrowLeft size={17} weight="bold" />
              </Link>
              <Link to="/contact" className="btn-outline"
                style={{ fontSize:'15px', padding:'12px 28px' }}>
                تحدث مع فريق المبيعات
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Page ─── */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTABanner />
    </>
  )
}
