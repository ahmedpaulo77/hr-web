import { Outlet, Navigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Buildings, CheckCircle, Star } from '@phosphor-icons/react'
import ThemeToggle from '@/components/ui/ThemeToggle'

export default function AuthLayout() {
  const { user } = useAuthStore()
  if (user) return <Navigate to="/app" replace />

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--bg-base)',
      position: 'relative',
    }}>
      <div className="mesh-bg" />

      {/* Theme toggle */}
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 20 }}>
        <ThemeToggle />
      </div>

      {/* ── RIGHT PANEL: Branding ── */}
      <div style={{
        display: 'none',
        width: '50%',
        flexShrink: 0,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 32,
        padding: '48px 32px',
        position: 'relative',
        overflow: 'hidden',
      }} className="auth-left">

        {/* dot grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(var(--ov-rgb),0.04) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        {/* blob */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: 400, height: 400, borderRadius: '50%', filter: 'blur(80px)',
          background: 'radial-gradient(circle, rgba(109,40,217,0.22), transparent)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: 300, height: 300, borderRadius: '50%', filter: 'blur(60px)',
          background: 'radial-gradient(circle, rgba(245,158,11,0.1), transparent)',
          pointerEvents: 'none',
        }} />

        {/* Logo */}
        <Link to="/" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          textDecoration: 'none', position: 'relative', zIndex: 1,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 14,
            background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(109,40,217,0.5)',
          }}>
            <Buildings size={20} weight="duotone" color="white" />
          </div>
          <span style={{ fontWeight: 900, fontSize: 20, color: 'var(--ink)' }}>
            HR <span className="text-gradient">Portal</span>
          </span>
        </Link>

        {/* Main content — RTL text */}
        <div
          className="auth-brand-content"
          style={{
            position: 'relative', zIndex: 1, direction: 'rtl', textAlign: 'center',
            width: '100%', maxWidth: 480, flex: '0 1 auto', padding: 0,
          }}
        >
          <div style={{
            width: 'fit-content',
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 14px', borderRadius: 99,
            border: '1px solid rgba(139,92,246,0.3)',
            background: 'rgba(139,92,246,0.1)',
            alignSelf: 'center',
            marginBottom: 16,
          }} className="auth-brand-badge">
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: '#34d399', display: 'inline-block',
            }} />
            <span className="auth-brand-badge-text" style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-2)', fontFamily: 'Cairo, sans-serif' }}>
              +500 شركة تثق بنا الآن
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem,3.5vw,3.2rem)',
            fontWeight: 900, color: 'var(--ink)',
            lineHeight: 1.2, marginBottom: 16,
            fontFamily: 'Cairo, sans-serif',
          }}>
            نظام HR<br />
            <span className="text-gradient">يناسبك تماماً</span>
          </h1>

          <p className="auth-brand-description" style={{
            color: 'rgba(var(--fg-rgb),0.45)', fontSize: 16,
            lineHeight: 1.8, maxWidth: 420, margin: '0 auto 24px',
            fontFamily: 'Cairo, sans-serif',
          }}>
            خصّص كل شيء من الداشبورد — الحقول، المسميات،
            أنواع الطلبات — بدون كود.
          </p>

          <div className="auth-brand-features" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            {[
              '14+ نوع طلب جاهز للاستخدام',
              'Form Builder بالسحب والإفلات',
              'موافقات متعددة المراحل',
              'تقارير وتحليلات متقدمة',
            ].map(f => (
              <div key={f} className="auth-brand-feature" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                fontSize: 14, color: 'rgba(var(--fg-rgb),0.5)',
                fontWeight: 600, lineHeight: 1.7, fontFamily: 'Cairo, sans-serif',
              }}>
                <CheckCircle size={16} weight="fill" color="var(--accent-2)" style={{ flexShrink: 0 }} />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stats */}
        <div className="auth-brand-stats" style={{
          display: 'flex', justifyContent: 'center', gap: 28,
          position: 'relative', zIndex: 1,
          direction: 'rtl',
        }}>
          {[
            { n: '4.9', l: 'تقييم العملاء', star: true },
            { n: '99.9%', l: 'وقت التشغيل', star: false },
            { n: '24/7', l: 'دعم فني', star: false },
          ].map(s => (
            <div key={s.l}>
              <p style={{ fontSize: 20, fontWeight: 900, color: 'var(--ink)', fontFamily: 'Cairo, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                {s.n}
                {s.star && <Star size={15} weight="fill" color="#f59e0b" />}
              </p>
              <p className="auth-brand-stat-label" style={{ fontSize: 11, color: 'rgba(var(--fg-rgb),0.35)', fontFamily: 'Cairo, sans-serif', textAlign: 'center' }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── LEFT PANEL: Form ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        zIndex: 10,
      }}>
        <div style={{ width: '100%', maxWidth: 420, direction: 'rtl' }}>
          <Outlet />
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (min-width: 1024px) {
          .auth-left { display: flex !important; }
        }
      `}</style>
    </div>
  )
}
