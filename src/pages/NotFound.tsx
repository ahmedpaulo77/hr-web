import { Link } from 'react-router-dom'
import { House, ArrowLeft } from '@phosphor-icons/react'
import { useAuthStore } from '@/store/authStore'

export default function NotFound() {
  const user = useAuthStore(s => s.user)

  const homeHref =
    !user ? '/' :
    user.role === 'admin' ? '/app/admin' :
    user.role === 'manager' ? '/app/manager' :
    '/app/employee'

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--bg-deep)' }}>
      <div className="mesh-bg" />
      <div className="relative z-10 text-center max-w-md">
        <p className="text-7xl font-black text-violet-400/80 mb-3">404</p>
        <h1 className="text-2xl font-black text-white mb-2">الصفحة غير موجودة</h1>
        <p className="text-sm text-white/40 mb-7 leading-relaxed">
          الرابط الذي تحاول الوصول إليه غير صحيح أو تم نقله إلى مكان آخر.
        </p>
        <Link
          to={homeHref}
          className="btn-primary inline-flex items-center gap-2 px-6 py-3"
        >
          <House size={17} weight="duotone" />
          العودة إلى {user ? 'لوحة التحكم' : 'الرئيسية'}
          <ArrowLeft size={15} weight="bold" />
        </Link>
      </div>
    </div>
  )
}
