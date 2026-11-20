import { useState } from 'react'
import { FloppyDisk, CheckCircle } from '@phosphor-icons/react'

export default function Settings() {
  const [company, setCompany] = useState({
    name: 'مجموعة النخبة', email: 'hr@company.com',
    phone: '0112345678', website: 'www.company.com',
  })
  const [saved, setSaved] = useState(false)
  const [toggles, setToggles] = useState([true, true, false])

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const notifSettings = [
    { label: 'إشعار عند تقديم طلب جديد',   desc: 'يرسل إشعاراً للمدير عند كل طلب' },
    { label: 'إشعار عند الموافقة أو الرفض', desc: 'يرسل إشعاراً للموظف عند قرار الطلب' },
    { label: 'تقرير أسبوعي تلقائي',          desc: 'يرسل ملخصاً أسبوعياً للمسؤول' },
  ]

  return (
    <div className="max-w-2xl space-y-5 animate-fade-up">

      {/* Company Info */}
      <div className="glass border-gradient overflow-hidden rounded-2xl">
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <h3 className="font-black text-white">بيانات الشركة</h3>
        </div>
        <div className="p-6 space-y-4">
          {[
            { label: 'اسم الشركة',           key: 'name',    type: 'text'  },
            { label: 'البريد الإلكتروني',     key: 'email',   type: 'email' },
            { label: 'رقم الهاتف',            key: 'phone',   type: 'tel'   },
            { label: 'الموقع الإلكتروني',     key: 'website', type: 'text'  },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-xs font-black text-white/40 uppercase tracking-wider mb-2">
                {field.label}
              </label>
              <input
                type={field.type}
                value={(company as any)[field.key]}
                onChange={e => setCompany(c => ({ ...c, [field.key]: e.target.value }))}
                className="input"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="glass border-gradient overflow-hidden rounded-2xl">
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <h3 className="font-black text-white">إعدادات الإشعارات</h3>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {notifSettings.map((s, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-bold text-white/70">{s.label}</p>
                <p className="text-xs text-white/30 mt-0.5">{s.desc}</p>
              </div>
              <button
                onClick={() => setToggles(t => t.map((v, j) => j === i ? !v : v))}
                className={`relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${
                  toggles[i] ? 'bg-violet-600' : 'bg-white/[0.1]'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-300 ${
                  toggles[i] ? 'left-1' : 'right-1'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        className={`flex items-center gap-2 font-black px-7 py-3 rounded-2xl shadow-lg transition-all duration-300 ${
          saved
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-emerald-900/20'
            : 'btn-primary shadow-violet-900/40'
        }`}
      >
        {saved
          ? <><CheckCircle size={18} weight="fill" /> تم الحفظ!</>
          : <><FloppyDisk  size={18} weight="duotone" /> حفظ الإعدادات</>
        }
      </button>
    </div>
  )
}
