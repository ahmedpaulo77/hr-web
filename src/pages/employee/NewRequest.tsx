import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { requestTypes, RequestType } from '@/data/requestTypes'
import { useAuthStore } from '@/store/authStore'
import { ArrowRight, PaperPlaneTilt, MagnifyingGlass, FileText, SpinnerGap, CheckCircle } from '@phosphor-icons/react'
import RequestCard from '@/components/ui/RequestCard'

function RequestForm({ type, onBack }: { type: RequestType; onBack: () => void }) {
  const [values,  setValues]  = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const basePath = user?.role === 'manager' ? '/app/manager' : '/app/employee'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setSuccess(true)
    setTimeout(() => navigate(basePath + '/requests'), 2000)
  }

  if (success) {
    return (
      <div className="glass border-gradient p-14 text-center max-w-md mx-auto rounded-3xl animate-fade-up">
        <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={40} weight="duotone" className="text-emerald-400" />
        </div>
        <h3 className="text-2xl font-black text-white mb-2">تم التقديم بنجاح!</h3>
        <p className="text-white/40 text-sm">سيتم مراجعة طلبك من قبل المدير المختص قريباً</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-up">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack}
          className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/[0.08] transition-all">
          <ArrowRight size={18} weight="bold" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center border"
            style={{ backgroundColor: type.color + '20', borderColor: type.color + '40' }}>
            <FileText size={22} weight="duotone" style={{ color: type.color }} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">{type.title}</h2>
            <p className="text-sm text-white/35">{type.description}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="glass border-gradient p-7 rounded-3xl space-y-5">
        {type.fields.map(field => (
          <div key={field.id}>
            <label className="block text-xs font-black text-white/50 uppercase tracking-wider mb-2">
              {field.label}
              {field.required && <span className="text-red-400 mr-1 normal-case">*</span>}
            </label>

            {field.type === 'select' ? (
              <select
                required={field.required}
                value={values[field.id] || ''}
                onChange={e => setValues(v => ({ ...v, [field.id]: e.target.value }))}
                className="input"
              >
                <option value="">اختر...</option>
                {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea
                rows={3}
                required={field.required}
                placeholder={field.placeholder}
                value={values[field.id] || ''}
                onChange={e => setValues(v => ({ ...v, [field.id]: e.target.value }))}
                className="input resize-none"
              />
            ) : (
              <input
                type={field.type}
                required={field.required}
                placeholder={field.placeholder}
                value={values[field.id] || ''}
                onChange={e => setValues(v => ({ ...v, [field.id]: e.target.value }))}
                className="input"
              />
            )}
          </div>
        ))}

        {/* Upload */}
        <div>
          <label className="block text-xs font-black text-white/50 uppercase tracking-wider mb-2">المرفقات (اختياري)</label>
          <div className="border-2 border-dashed border-white/[0.08] hover:border-violet-500/40 rounded-2xl p-6 text-center transition-all cursor-pointer group">
            <p className="text-sm text-white/30 group-hover:text-white/50">
              اسحب الملفات هنا أو{' '}
              <span className="text-violet-400 font-semibold">اختر ملفاً</span>
            </p>
            <p className="text-xs text-white/20 mt-1">PDF, JPG, PNG — حد أقصى 10MB</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center py-3.5 text-base shadow-2xl shadow-violet-900/50 disabled:opacity-50"
        >
          {loading
            ? <><SpinnerGap size={18} weight="bold" className="animate-spin-slow" /> جاري التقديم...</>
            : <><PaperPlaneTilt size={18} weight="fill" /> تقديم الطلب</>
          }
        </button>
      </form>
    </div>
  )
}

export default function NewRequest() {
  const { type: typeId } = useParams()
  const navigate = useNavigate()
  const [search,   setSearch]   = useState('')
  const [selected, setSelected] = useState<RequestType | null>(
    typeId ? requestTypes.find(r => r.id === typeId) || null : null
  )
  const { user } = useAuthStore()
  const basePath = user?.role === 'manager' ? '/app/manager' : '/app/employee'

  const categories = [
    { id: 'salary',    label: '💰 الراتب' },
    { id: 'leave',     label: '🌴 الإجازات' },
    { id: 'documents', label: '📄 الوثائق' },
    { id: 'hr',        label: '👥 الموارد البشرية' },
  ]

  const filtered = requestTypes.filter(r =>
    r.title.includes(search) || r.description.includes(search)
  )

  if (selected) {
    return <RequestForm type={selected} onBack={() => { setSelected(null); navigate(`${basePath}/requests/new`) }} />
  }

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Search */}
      <div className="flex items-center gap-3 glass border border-white/[0.08] rounded-2xl px-5 py-3.5">
        <MagnifyingGlass size={18} weight="regular" className="text-white/30 flex-shrink-0" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="ابحث عن نوع الطلب..."
          className="flex-1 bg-transparent text-sm text-white/70 placeholder-white/25 outline-none"
        />
      </div>

      {/* Categories */}
      {categories.map(cat => {
        const items = filtered.filter(r => r.category === cat.id)
        if (!items.length) return null
        return (
          <div key={cat.id}>
            <h3 className="text-xs font-black text-white/30 uppercase tracking-widest mb-3">{cat.label}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {items.map(rt => (
                <RequestCard
                  key={rt.id}
                  id={rt.id}
                  title={rt.title}
                  icon={FileText}
                  color={rt.color}
                  description={rt.description}
                  basePath={basePath}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
