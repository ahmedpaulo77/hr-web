import { useState } from 'react'
import {
  Plus, Trash, IdentificationCard, Cake, UserCircle, X, CheckCircle,
} from '@phosphor-icons/react'
import { useAuthStore } from '@/store/authStore'
import { useDependentsStore } from '@/store/dependentsStore'
import { formatDate } from '@/lib/format'
import type { Dependent } from '@/types'

const relations: Dependent['relation'][] = ['زوجة', 'ابن', 'ابنة', 'والد', 'والدة']

const relationTone: Record<Dependent['relation'], string> = {
  زوجة: 'bg-pink-500/10 text-pink-300 border-pink-500/20',
  ابن: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
  ابنة: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
  والد: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  والدة: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
}

const emptyForm = {
  name: '',
  fatherName: '',
  grandfatherName: '',
  localName: '',
  relation: 'ابن' as Dependent['relation'],
  birthDate: '',
  gender: 'ذكر' as Dependent['gender'],
  idNumber: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  email: '',
  phone: '',
  address: '',
}

export default function Dependents() {
  const { user } = useAuthStore()
  const { list, add, remove } = useDependentsStore()
  const dependents = list(user?.id)

  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)

  const setField = (key: keyof typeof emptyForm, value: string) => {
    setForm(f => ({ ...f, [key]: value }))
    setErrors(e => {
      if (!e[key]) return e
      const next = { ...e }
      delete next[key]
      return next
    })
  }

  const handleSave = () => {
    const found: Record<string, string> = {}
    if (!form.name.trim()) found.name = 'اسم التابع مطلوب'
    if (!form.fatherName.trim()) found.fatherName = 'اسم الأب مطلوب'
    if (!form.grandfatherName.trim()) found.grandfatherName = 'اسم الجد مطلوب'
    if (!form.birthDate) found.birthDate = 'تاريخ الميلاد مطلوب'
    if (!/^\d{10}$/.test(form.idNumber)) found.idNumber = 'رقم الهوية يجب أن يكون 10 أرقام'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) found.email = 'صيغة البريد الإلكتروني غير صحيحة'
    if (form.phone && !/^[+()\d\s-]{7,20}$/.test(form.phone)) found.phone = 'راجع رقم الهاتف'
    if (form.emergencyContactPhone && !/^[+()\d\s-]{7,20}$/.test(form.emergencyContactPhone)) found.emergencyContactPhone = 'راجع رقم هاتف الطوارئ'
    if (Object.keys(found).length) {
      setErrors(found)
      return
    }

    add(user!.id, {
      name: form.name.trim(),
      fatherName: form.fatherName.trim(),
      grandfatherName: form.grandfatherName.trim(),
      localName: form.localName.trim(),
      relation: form.relation,
      birthDate: form.birthDate,
      gender: form.gender,
      idNumber: form.idNumber,
      emergencyContactName: form.emergencyContactName.trim(),
      emergencyContactPhone: form.emergencyContactPhone.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      address: form.address.trim(),
    })

    setForm(emptyForm)
    setErrors({})
    setOpen(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-5 animate-fade-up max-w-4xl">

      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-black text-white">التابعون المسجلون</h2>
          <p className="text-sm text-white/35">
            {dependents.length} تابع مسجل · تُستخدم في طلبات التأمين الطبي
          </p>
        </div>
        <button onClick={() => setOpen(true)} className="btn-primary text-sm">
          <Plus size={15} weight="bold" /> إضافة تابع
        </button>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.07] px-4 py-3">
          <CheckCircle size={16} weight="fill" className="text-emerald-400" />
          <p className="text-sm font-bold text-emerald-300">تم حفظ بيانات التابع بنجاح</p>
        </div>
      )}

      {/* Add form */}
      {open && (
        <div className="glass border-gradient p-6 rounded-3xl animate-fade-up">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-black text-white">بيانات التابع</h3>
            <button
              onClick={() => { setOpen(false); setForm(emptyForm); setErrors({}) }}
              className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center text-white/40 hover:text-white/80 transition-colors"
              aria-label="إغلاق"
            >
              <X size={14} weight="bold" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-5 gap-y-4">
            <div>
              <label className="block text-xs font-black text-white/50 uppercase tracking-wider mb-1.5">
                الاسم الكامل <span className="text-red-400">*</span>
              </label>
              <input value={form.name} onChange={e => setField('name', e.target.value)} className="input" placeholder="اسم التابع" />
              {errors.name && <p className="text-[11px] text-red-400 font-semibold mt-1.5">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-black text-white/50 uppercase tracking-wider mb-1.5">
                اسم الأب <span className="text-red-400">*</span>
              </label>
              <input value={form.fatherName} onChange={e => setField('fatherName', e.target.value)} className="input" />
              {errors.fatherName && <p className="text-[11px] text-red-400 font-semibold mt-1.5">{errors.fatherName}</p>}
            </div>

            <div>
              <label className="block text-xs font-black text-white/50 uppercase tracking-wider mb-1.5">
                اسم الجد <span className="text-red-400">*</span>
              </label>
              <input value={form.grandfatherName} onChange={e => setField('grandfatherName', e.target.value)} className="input" />
              {errors.grandfatherName && <p className="text-[11px] text-red-400 font-semibold mt-1.5">{errors.grandfatherName}</p>}
            </div>

            <div>
              <label className="block text-xs font-black text-white/50 uppercase tracking-wider mb-1.5">الاسم باللغة المحلية</label>
              <input value={form.localName} onChange={e => setField('localName', e.target.value)} className="input" dir="auto" />
            </div>

            <div>
              <label className="block text-xs font-black text-white/50 uppercase tracking-wider mb-1.5">صفة الشخص</label>
              <select value={form.relation} onChange={e => setField('relation', e.target.value)} className="input">
                {relations.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-white/50 uppercase tracking-wider mb-1.5">
                تاريخ الميلاد <span className="text-red-400">*</span>
              </label>
              <input type="date" value={form.birthDate} onChange={e => setField('birthDate', e.target.value)} className="input" />
              {errors.birthDate && <p className="text-[11px] text-red-400 font-semibold mt-1.5">{errors.birthDate}</p>}
            </div>

            <div>
              <label className="block text-xs font-black text-white/50 uppercase tracking-wider mb-1.5">الجنس</label>
              <select value={form.gender} onChange={e => setField('gender', e.target.value)} className="input">
                <option value="ذكر">ذكر</option>
                <option value="أنثى">أنثى</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-black text-white/50 uppercase tracking-wider mb-1.5">
                رقم الهوية <span className="text-red-400">*</span>
              </label>
              <input
                value={form.idNumber}
                onChange={e => setField('idNumber', e.target.value.replace(/\D/g, ''))}
                maxLength={10}
                inputMode="numeric"
                dir="ltr"
                placeholder="10 أرقام"
                className="input font-mono tracking-wide"
              />
              {errors.idNumber && <p className="text-[11px] text-red-400 font-semibold mt-1.5">{errors.idNumber}</p>}
            </div>

            <div>
              <label className="block text-xs font-black text-white/50 uppercase tracking-wider mb-1.5">جهة اتصال الطوارئ</label>
              <input value={form.emergencyContactName} onChange={e => setField('emergencyContactName', e.target.value)} className="input" />
            </div>

            <div>
              <label className="block text-xs font-black text-white/50 uppercase tracking-wider mb-1.5">هاتف الطوارئ</label>
              <input value={form.emergencyContactPhone} onChange={e => setField('emergencyContactPhone', e.target.value)} className="input" dir="ltr" inputMode="tel" />
              {errors.emergencyContactPhone && <p className="text-[11px] text-red-400 font-semibold mt-1.5">{errors.emergencyContactPhone}</p>}
            </div>

            <div>
              <label className="block text-xs font-black text-white/50 uppercase tracking-wider mb-1.5">البريد الإلكتروني</label>
              <input value={form.email} onChange={e => setField('email', e.target.value)} className="input" dir="ltr" type="email" />
              {errors.email && <p className="text-[11px] text-red-400 font-semibold mt-1.5">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-black text-white/50 uppercase tracking-wider mb-1.5">رقم الهاتف</label>
              <input value={form.phone} onChange={e => setField('phone', e.target.value)} className="input" dir="ltr" inputMode="tel" />
              {errors.phone && <p className="text-[11px] text-red-400 font-semibold mt-1.5">{errors.phone}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-black text-white/50 uppercase tracking-wider mb-1.5">العنوان</label>
              <textarea value={form.address} onChange={e => setField('address', e.target.value)} className="input resize-none" rows={2} />
            </div>
          </div>

          <div className="flex gap-2 mt-5">
            <button onClick={handleSave} className="btn-primary justify-center flex-1">
              <CheckCircle size={16} weight="bold" /> حفظ التابع
            </button>
            <button
              onClick={() => { setOpen(false); setForm(emptyForm); setErrors({}) }}
              className="btn-outline justify-center flex-1"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {dependents.length === 0 ? (
        <div className="glass border-gradient p-14 text-center rounded-3xl">
          <UserCircle size={40} weight="duotone" className="text-white/20 mx-auto mb-3" />
          <p className="font-black text-white/70">لا يوجد تابعون مسجلون</p>
          <p className="text-sm text-white/30 mt-1 mb-5">
            أضف التابعين أولاً حتى تستطيع طلب تأمين طبي لهم.
          </p>
          <button onClick={() => setOpen(true)} className="btn-primary mx-auto text-sm">
            <Plus size={15} weight="bold" /> إضافة أول تابع
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {dependents.map(dep => (
            <div key={dep.id} className="glass border-gradient p-5 rounded-2xl group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-700/20 border border-violet-500/20 flex items-center justify-center font-black text-violet-300 flex-shrink-0">
                    {dep.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-white/85 truncate">{dep.name}</p>
                    <span className={`inline-block mt-1 text-[10px] font-black px-2 py-0.5 rounded-lg border ${relationTone[dep.relation]}`}>
                      {dep.relation}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => remove(user!.id, dep.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0"
                  aria-label={`حذف ${dep.name}`}
                >
                  <Trash size={14} weight="bold" />
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-2 text-xs">
                <p className="flex items-center gap-2 text-white/35">
                  <Cake size={13} weight="duotone" className="text-violet-400/70" />
                  تاريخ الميلاد: <span className="text-white/60 font-bold">{formatDate(dep.birthDate)}</span>
                </p>
                <p className="flex items-center gap-2 text-white/35">
                  <IdentificationCard size={13} weight="duotone" className="text-violet-400/70" />
                  الهوية: <span className="text-white/60 font-bold font-mono" dir="ltr">{dep.idNumber}</span>
                </p>
                {(dep.fatherName || dep.grandfatherName || dep.localName) && (
                  <p className="text-white/35">
                    الأب والجد: <span className="text-white/60 font-bold">{[dep.fatherName, dep.grandfatherName].filter(Boolean).join(' · ') || '—'}</span>
                    {dep.localName && <> · الاسم المحلي: <span className="text-white/60 font-bold">{dep.localName}</span></>}
                  </p>
                )}
                {(dep.email || dep.phone || dep.emergencyContactName || dep.address) && (
                  <div className="space-y-1 border-t border-white/[0.05] pt-2">
                    {dep.email && <p className="text-white/45" dir="ltr">{dep.email}</p>}
                    {dep.phone && <p className="text-white/45" dir="ltr">{dep.phone}</p>}
                    {dep.emergencyContactName && <p className="text-white/45">طوارئ: {dep.emergencyContactName} {dep.emergencyContactPhone}</p>}
                    {dep.address && <p className="text-white/45">العنوان: {dep.address}</p>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
