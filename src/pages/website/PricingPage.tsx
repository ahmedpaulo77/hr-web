import { Link } from 'react-router-dom'
import { CheckCircle, ArrowLeft, Sparkle, Question } from '@phosphor-icons/react'
import { useState } from 'react'

const plans = [
  {
    name: 'Starter',       nameAr: 'المبتدئ',
    price: { monthly: 299,  yearly: 249 },
    desc: 'مثالي للشركات الصغيرة',
    color: 'emerald',
    features: ['حتى 25 موظف', '5 أنواع طلبات', 'تقارير أساسية', 'دعم بالبريد الإلكتروني', 'تطبيق جوال'],
    popular: false,
  },
  {
    name: 'Professional',  nameAr: 'الاحترافي',
    price: { monthly: 699,  yearly: 579 },
    desc: 'الأكثر شيوعاً للشركات المتوسطة',
    color: 'violet',
    features: ['حتى 100 موظف', 'طلبات غير محدودة', 'Form Builder كامل', 'تقارير متقدمة', 'دعم أولوية 24/7', 'تكاملات خارجية', 'تعدد الأدوار والصلاحيات'],
    popular: true,
  },
  {
    name: 'Enterprise',    nameAr: 'المؤسسي',
    price: { monthly: 0,    yearly: 0 },
    desc: 'للمؤسسات الكبيرة',
    color: 'amber',
    features: ['موظفون غير محدودون', 'جميع المميزات', 'نطاق خاص', 'SLA مضمون 99.9%', 'مدير حساب مخصص', 'تدريب فريق', 'API كامل'],
    popular: false,
  },
]

const colorMap: Record<string, { border: string; badge: string; btn: string; check: string }> = {
  emerald: { border: 'border-emerald-500/20', badge: 'bg-emerald-500/10 text-emerald-300', btn: 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30', check: 'text-emerald-400' },
  violet:  { border: 'border-violet-500/40',  badge: 'bg-violet-500/10 text-violet-300',   btn: 'btn-primary',  check: 'text-violet-400' },
  amber:   { border: 'border-amber-500/20',   badge: 'bg-amber-500/10 text-amber-300',     btn: 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30',   check: 'text-amber-400' },
}

const faqs = [
  { q: 'هل هناك تجربة مجانية؟',               a: 'نعم! تجربة مجانية لمدة 14 يوماً كاملة بدون بطاقة ائتمان.' },
  { q: 'هل يمكنني تغيير الخطة لاحقاً؟',       a: 'بالطبع، يمكنك الترقية أو التخفيض في أي وقت.' },
  { q: 'ما طرق الدفع المتاحة؟',                a: 'نقبل البطاقات الائتمانية، التحويل البنكي، ومدى.' },
  { q: 'هل يدعم النظام أكثر من شركة؟',         a: 'نعم، في خطة Enterprise يمكنك إدارة عدة شركات.' },
]

export default function PricingPage() {
  const [yearly, setYearly] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-xs font-black text-violet-400 uppercase tracking-widest">الأسعار</span>
          <h1 className="text-5xl font-black text-white mt-3 mb-4">
            سعر شفاف <span className="text-gradient">بلا مفاجآت</span>
          </h1>
          <p className="text-white/45 text-lg mb-8">ابدأ مجاناً، ادفع عند النمو</p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 p-1.5 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
            <button onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${!yearly ? 'bg-violet-600 text-white shadow-lg' : 'text-white/40 hover:text-white/70'}`}>
              شهري
            </button>
            <button onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${yearly ? 'bg-violet-600 text-white shadow-lg' : 'text-white/40 hover:text-white/70'}`}>
              سنوي
              <span className="text-xs bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-lg">وفّر 17%</span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 mb-20 stagger">
          {plans.map(plan => {
            const c = colorMap[plan.color]
            return (
              <div key={plan.name}
                className={`glass p-7 rounded-3xl border ${c.border} animate-fade-up relative ${plan.popular ? 'scale-105 shadow-2xl shadow-violet-900/40' : ''} hover:-translate-y-1 transition-all duration-300`}>
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-600 to-purple-700 text-white text-xs font-black shadow-lg">
                      <Sparkle size={12} weight="fill" /> الأكثر شيوعاً
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <span className={`text-xs font-black px-3 py-1 rounded-xl ${c.badge}`}>{plan.nameAr}</span>
                  <div className="mt-4">
                    {plan.price.monthly === 0 ? (
                      <p className="text-4xl font-black text-white">تواصل معنا</p>
                    ) : (
                      <div className="flex items-end gap-2">
                        <span className="text-5xl font-black text-white">
                          {yearly ? plan.price.yearly : plan.price.monthly}
                        </span>
                        <div className="pb-1.5">
                          <p className="text-white/40 text-sm font-semibold">ريال</p>
                          <p className="text-white/30 text-xs">/شهر</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-white/35 text-sm mt-2">{plan.desc}</p>
                </div>

                <ul className="space-y-3 mb-7">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-white/60">
                      <CheckCircle size={16} weight="fill" className={c.check} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  to={plan.price.monthly === 0 ? '/contact' : '/login'}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${c.btn}`}
                >
                  {plan.price.monthly === 0 ? 'تواصل معنا' : 'ابدأ مجاناً'}
                  <ArrowLeft size={15} weight="bold" />
                </Link>
              </div>
            )
          })}
        </div>

        {/* FAQs */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-10">الأسئلة الشائعة</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="glass rounded-2xl overflow-hidden border border-white/[0.06]">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-right"
                >
                  <span className="font-bold text-white/80 text-sm">{faq.q}</span>
                  <span className={`text-violet-400 transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>
                    <Question size={18} weight="bold" />
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-white/45 leading-relaxed border-t border-white/[0.05] pt-4 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
