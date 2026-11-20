import { useState } from 'react'
import { FloppyDisk, CheckCircle } from '@phosphor-icons/react'
import { DEFAULT_BRANDING, useSettingsStore } from '@/store/settingsStore'
import type { BrandingSettings } from '@/store/settingsStore'
import { useTenantId } from '@/lib/tenant'

export default function Settings() {
  const { company: savedCompany, notifications: toggles, saveCompany, toggleNotification } = useSettingsStore()
  const companyId = useTenantId()
  const branding = useSettingsStore(state => state.brandingByCompany[companyId] ?? DEFAULT_BRANDING)
  const saveBranding = useSettingsStore(state => state.saveBranding)

  const [company, setCompany] = useState(savedCompany)
  const [brand, setBrand] = useState<BrandingSettings>(branding)
  const [saved, setSaved] = useState(false)
  const [logoError, setLogoError] = useState('')

  const handleSave = () => {
    saveCompany(company)
    saveBranding(companyId, brand)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleLogo = (file?: File) => {
    setLogoError('')
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setLogoError('اختر ملف صورة صالحاً.')
      return
    }
    if (file.size > 1_500_000) {
      setLogoError('حجم الشعار يجب ألا يتجاوز 1.5 ميجابايت.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => setBrand(current => ({ ...current, logoDataUrl: String(reader.result ?? '') }))
    reader.onerror = () => setLogoError('تعذر قراءة الصورة، حاول مرة أخرى.')
    reader.readAsDataURL(file)
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

      <div className="glass border-gradient overflow-hidden rounded-2xl">
        <div className="border-b border-white/[0.06] px-5 py-4">
          <h3 className="font-black text-white">هوية الشركة</h3>
          <p className="mt-1 text-xs text-white/35">تظهر الهوية لمستخدمي الشركة الحالية فقط.</p>
        </div>
        <div className="space-y-5 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
              {brand.logoDataUrl
                ? <img src={brand.logoDataUrl} alt="معاينة شعار الشركة" className="h-full w-full object-contain p-1" />
                : <span className="text-xs font-bold text-white/30">بدون شعار</span>}
            </div>
            <div className="flex-1">
              <label className="mb-2 block text-xs font-black uppercase tracking-wider text-white/40">رفع صورة اللوجو</label>
              <input
                type="file"
                accept="image/*"
                onChange={event => handleLogo(event.target.files?.[0])}
                className="block w-full text-xs text-white/50 file:ml-3 file:rounded-lg file:border-0 file:bg-white/[0.08] file:px-3 file:py-2 file:font-bold file:text-white/70"
              />
              {brand.logoDataUrl && (
                <button type="button" onClick={() => setBrand(current => ({ ...current, logoDataUrl: '' }))}
                  className="mt-2 text-xs font-bold text-red-400 hover:text-red-300">
                  إزالة الشعار
                </button>
              )}
              {logoError && <p className="mt-2 text-xs font-bold text-red-400">{logoError}</p>}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label htmlFor="brand-primary-color" className="text-xs font-black uppercase tracking-wider text-white/40">اللون الرئيسي</label>
            <input
              id="brand-primary-color"
              type="color"
              value={brand.primaryColor}
              onChange={event => setBrand(current => ({ ...current, primaryColor: event.target.value }))}
              className="h-10 w-14 cursor-pointer rounded-lg border border-white/10 bg-transparent p-1"
            />
            <span className="font-mono text-xs text-white/40">{brand.primaryColor}</span>
            <span className="rounded-xl px-4 py-2 text-xs font-black text-white" style={{ background: brand.primaryColor }}>
              معاينة الزر
            </span>
          </div>
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
                onClick={() => toggleNotification(i)}
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
