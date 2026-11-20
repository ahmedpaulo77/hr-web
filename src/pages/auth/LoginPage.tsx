import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Eye, EyeSlash, ArrowLeft, SpinnerGap, User, Briefcase, GearSix, WarningCircle } from '@phosphor-icons/react'

const demoAccounts = [
  { email: 'employee@hr.com', password: '123456', role: 'employee' as const, name: 'أحمد محمد علي',   dept: 'تقنية المعلومات', pos: 'مطور برمجيات',   icon: User,       label: 'موظف' },
  { email: 'manager@hr.com',  password: '123456', role: 'manager'  as const, name: 'محمد عبدالله',    dept: 'تقنية المعلومات', pos: 'مدير القسم',      icon: Briefcase,  label: 'مدير' },
  { email: 'admin@hr.com',    password: '123456', role: 'admin'    as const, name: 'سارة أحمد',        dept: 'الموارد البشرية', pos: 'مسؤول النظام',   icon: GearSix,    label: 'مسؤول' },
]

export default function LoginPage() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const { login }  = useAuthStore()
  const navigate   = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    const acc = demoAccounts.find(a => a.email === email && a.password === password)
    if (!acc) { setError('البريد الإلكتروني أو كلمة المرور غير صحيحة'); setLoading(false); return }
    login({ id: acc.email, name: acc.name, email: acc.email, role: acc.role, department: acc.dept, position: acc.pos, companyName: 'مجموعة النخبة' }, 'demo-token')
    navigate('/app')
  }

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-white mb-2">مرحباً بعودتك</h2>
        <p className="text-white/40 text-sm">سجّل دخولك للوصول إلى نظام HR Portal</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block text-xs font-black text-white/50 uppercase tracking-wider mb-2">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="name@company.com"
            required
            className="input"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-black text-white/50 uppercase tracking-wider">
              كلمة المرور
            </label>
            <button type="button" className="text-xs text-violet-400 hover:text-violet-300 font-semibold">
              نسيت كلمة المرور؟
            </button>
          </div>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="input pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            >
              {showPass
                ? <EyeSlash size={18} weight="regular" />
                : <Eye      size={18} weight="regular" />
              }
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 font-medium">
            <WarningCircle size={17} weight="fill" className="flex-shrink-0" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center py-3.5 text-base shadow-2xl shadow-violet-900/50 disabled:opacity-50"
        >
          {loading ? (
            <><SpinnerGap size={18} weight="bold" className="animate-spin-slow" /> جاري تسجيل الدخول...</>
          ) : (
            <> تسجيل الدخول <ArrowLeft size={16} weight="bold" /></>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-white/[0.07]" />
        <span className="text-xs text-white/25 font-semibold">تجربة سريعة</span>
        <div className="flex-1 h-px bg-white/[0.07]" />
      </div>

      {/* Quick Login */}
      <div className="grid grid-cols-3 gap-2.5">
        {demoAccounts.map(acc => (
          <button
            key={acc.role}
            onClick={() => { setEmail(acc.email); setPassword(acc.password) }}
            className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border border-white/[0.07] bg-white/[0.03] hover:bg-violet-500/10 hover:border-violet-500/25 transition-all group"
          >
            <acc.icon size={20} weight="duotone" className="text-violet-300/70 group-hover:text-violet-300 transition-colors" />
            <span className="text-xs font-bold text-white/40 group-hover:text-violet-300 transition-colors">
              {acc.label}
            </span>
          </button>
        ))}
      </div>

      <p className="text-center text-xs text-white/20 mt-6">
        ليس لديك حساب؟{' '}
        <Link to="/contact" className="text-violet-400 hover:text-violet-300 font-semibold">
          تواصل معنا
        </Link>
      </p>
    </div>
  )
}
