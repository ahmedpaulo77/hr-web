import { useState } from 'react'
import { EnvelopeSimple, Phone, MapPin, PaperPlaneTilt, CheckCircle } from '@phosphor-icons/react'

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-black text-violet-400 uppercase tracking-widest">تواصل معنا</span>
          <h1 className="text-5xl font-black text-white mt-3 mb-4">
            نحن هنا <span className="text-gradient">لمساعدتك</span>
          </h1>
          <p className="text-white/45 text-lg max-w-xl mx-auto">
            سواء كان لديك سؤال أو تريد عرض توضيحي — فريقنا جاهز دائماً.
          </p>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] items-stretch gap-6 lg:gap-8">

          {/* Info */}
          <div className="flex h-full flex-col gap-5">
            {[
              { icon: EnvelopeSimple, label: 'البريد الإلكتروني', value: 'hello@hrportal.sa', color: 'violet' },
              { icon: Phone,         label: 'الهاتف',              value: '+966 50 000 0000',  color: 'emerald' },
              { icon: MapPin,        label: 'الموقع',              value: 'الرياض، المملكة العربية السعودية', color: 'amber' },
            ].map(item => (
              <div key={item.label} className="glass border-gradient flex flex-1 items-center gap-4 p-5">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0
                  ${item.color === 'violet'  ? 'bg-violet-500/15 border border-violet-500/20'  : ''}
                  ${item.color === 'emerald' ? 'bg-emerald-500/15 border border-emerald-500/20' : ''}
                  ${item.color === 'amber'   ? 'bg-amber-500/15 border border-amber-500/20'    : ''}
                `}>
                  <item.icon size={20} weight="duotone" className={`
                    ${item.color === 'violet'  ? 'text-violet-400'  : ''}
                    ${item.color === 'emerald' ? 'text-emerald-400' : ''}
                    ${item.color === 'amber'   ? 'text-amber-400'   : ''}
                  `} />
                </div>
                <div>
                  <p className="text-xs text-white/35 font-semibold mb-0.5">{item.label}</p>
                  <p className="text-sm font-bold text-white/80">{item.value}</p>
                </div>
              </div>
            ))}

            {/* Working hours */}
            <div className="glass border-gradient flex flex-1 flex-col justify-center p-5">
              <p className="text-xs text-white/35 font-black uppercase tracking-widest mb-4">ساعات العمل</p>
              {[
                { day: 'الأحد — الخميس', time: '9:00ص — 6:00م' },
                { day: 'الجمعة — السبت', time: 'مغلق' },
              ].map(h => (
                <div key={h.day} className="flex justify-between items-center py-2 border-b border-white/[0.05] last:border-0">
                  <span className="text-sm text-white/50">{h.day}</span>
                  <span className={`text-sm font-bold ${h.time === 'مغلق' ? 'text-red-400' : 'text-emerald-400'}`}>{h.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div>
            {sent ? (
              <div className="glass border-gradient p-12 text-center rounded-3xl h-full flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle size={40} weight="duotone" className="text-emerald-400" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">تم الإرسال!</h3>
                <p className="text-white/45 text-sm max-w-sm">
                  شكراً لتواصلك معنا. سيرد عليك فريقنا خلال ساعات عمل.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass border-gradient p-7 rounded-3xl space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-black text-white/50 uppercase tracking-wider mb-2">الاسم الكامل *</label>
                    <input
                      required
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="محمد أحمد"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-white/50 uppercase tracking-wider mb-2">البريد الإلكتروني *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="name@company.com"
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-white/50 uppercase tracking-wider mb-2">اسم الشركة</label>
                  <input
                    value={form.company}
                    onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                    placeholder="شركة النخبة"
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-white/50 uppercase tracking-wider mb-2">رسالتك *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="أخبرنا عن احتياجاتك..."
                    className="input resize-none"
                  />
                </div>

                <button type="submit" className="btn-primary w-full justify-center py-3.5 text-base shadow-2xl shadow-violet-900/40">
                  <PaperPlaneTilt size={18} weight="fill" />
                  إرسال الرسالة
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
