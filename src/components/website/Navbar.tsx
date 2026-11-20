import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { List, X, ArrowLeft, Buildings } from '@phosphor-icons/react'
import { useAuthStore } from '@/store/authStore'
import ThemeToggle from '@/components/ui/ThemeToggle'

const navLinks = [
  { label: 'المميزات',   path: '/features' },
  { label: 'الأسعار',    path: '/pricing'  },
  { label: 'من نحن',     path: '/about'    },
  { label: 'تواصل معنا', path: '/contact'  },
]

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user } = useAuthStore()
  const navigate  = useNavigate()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 50,
          padding: scrolled ? '10px 0' : '18px 0',
          transition: 'all 0.4s ease',
          ...(scrolled ? {
            background: 'var(--topbar)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            borderBottom: '1px solid rgba(139,92,246,0.15)',
          } : {}),
        }}
      >
        {/* RTL row: Logo RIGHT — Nav CENTER — Buttons LEFT */}
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          direction: 'rtl',
          gap: 8,
        }}>

          {/* Logo — right side */}
          <Link to="/" onClick={() => {
            setMobileOpen(false)
            window.scrollTo({ top: 0, behavior: 'instant' })
            document.querySelector('main')?.scrollTo({ top: 0, behavior: 'instant' })
          }} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            textDecoration: 'none', flexShrink: 0,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 12,
              background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(109,40,217,0.5)',
            }}>
              <Buildings size={18} weight="duotone" color="white" />
            </div>
            <span style={{ fontWeight: 900, fontSize: 19, color: 'var(--ink)', letterSpacing: '-0.3px' }}>
              HR <span className="text-gradient">Portal</span>
            </span>
          </Link>

          {/* Nav links — center */}
          <div style={{
            display: 'none',
            alignItems: 'center',
            gap: 4,
          }} className="desktop-nav">
            {navLinks.map(link => (
              <NavLink key={link.path} to={link.path}
                style={({ isActive }) => ({
                  padding: '8px 12px',
                  borderRadius: 12,
                  fontSize: 16,
                  fontWeight: 600,
                  fontFamily: 'Cairo, sans-serif',
                  textDecoration: 'none',
                  transition: 'all 0.18s',
                  color: isActive ? 'var(--ink)' : 'rgba(var(--fg-rgb),0.55)',
                  background: isActive ? 'rgba(var(--ov-rgb),0.1)' : 'transparent',
                  direction: 'rtl',
                })}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  if (!el.className.includes('active')) {
                    el.style.color = 'var(--ink)'
                    el.style.background = 'rgba(var(--ov-rgb),0.06)'
                  }
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  if (!el.className.includes('active')) {
                    el.style.color = 'rgba(var(--fg-rgb),0.55)'
                    el.style.background = 'transparent'
                  }
                }}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Left side: theme toggle + CTA + mobile menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ThemeToggle />

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}
              className="desktop-cta">
              {user ? (
                <button onClick={() => navigate('/app')} className="btn-primary"
                  style={{ fontSize: 13, padding: '9px 18px' }}>
                  لوحة التحكم
                  <ArrowLeft size={14} weight="bold" />
                </button>
              ) : (
                <>
                  <Link to="/login" className="btn-nav-light"
                    style={{ fontSize: 13, padding: '9px 18px' }}>
                    تسجيل الدخول
                  </Link>
                  <Link to="/contact" className="btn-primary"
                    style={{ fontSize: 13, padding: '9px 18px' }}>
                    ابدأ مجاناً
                    <ArrowLeft size={14} weight="bold" />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="mobile-menu-btn"
              style={{
                display: 'none',
                width: 38, height: 38,
                borderRadius: 10,
                background: 'rgba(var(--ov-rgb),0.08)',
                border: '1px solid rgba(var(--ov-rgb),0.15)',
                alignItems: 'center', justifyContent: 'center',
                color: 'rgba(var(--fg-rgb),0.85)',
                cursor: 'pointer',
              }}
            >
              {mobileOpen ? <X size={17} weight="bold" /> : <List size={17} weight="bold" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Responsive styles */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-nav { display: flex !important; }
          .desktop-cta { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 899px) {
          .desktop-nav { display: none !important; }
          .desktop-cta { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed', inset: 0, zIndex: 40,
            background: 'var(--sidebar)',
            backdropFilter: 'blur(28px)',
            display: 'flex', flexDirection: 'column',
            padding: '90px 24px 32px',
            direction: 'rtl',
          }}
        >
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {navLinks.map(link => (
              <NavLink key={link.path} to={link.path}
                onClick={() => setMobileOpen(false)}
                style={({ isActive }) => ({
                  display: 'block', padding: '14px 16px',
                  borderRadius: 14, fontSize: 15, fontWeight: 700,
                  fontFamily: 'Cairo, sans-serif', textDecoration: 'none',
                  transition: 'all 0.18s',
                  color: isActive ? 'var(--ink)' : 'rgba(var(--fg-rgb),0.55)',
                  background: isActive ? 'rgba(139,92,246,0.15)' : 'transparent',
                  border: isActive ? '1px solid rgba(139,92,246,0.25)' : '1px solid transparent',
                })}>
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link to="/login" onClick={() => setMobileOpen(false)}
              className="btn-nav-light"
              style={{ width: '100%', justifyContent: 'center', padding: '13px 20px' }}>
              تسجيل الدخول
            </Link>
            <Link to="/contact" onClick={() => setMobileOpen(false)}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '13px 20px' }}>
              ابدأ مجاناً <ArrowLeft size={15} weight="bold" />
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
