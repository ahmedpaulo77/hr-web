import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useState } from 'react'
import {
  SquaresFour, FileText, PlusCircle, CheckCircle,
  Users, ChartBar, Gear, SignOut, List, X,
  CaretRight,
} from '@phosphor-icons/react'
import CompanyLogo from '@/components/ui/CompanyLogo'

interface NavItem {
  label: string
  path: string
  icon: React.ElementType
}
interface SidebarProps { navItems: NavItem[] }

const roleConfig: Record<string, { grad: string; label: string; badge: string }> = {
  employee: { grad: 'linear-gradient(135deg,#8b5cf6,#7c3aed)',  label: 'موظف',         badge: 'rgba(139,92,246,0.2)'  },
  manager:  { grad: 'linear-gradient(135deg,#f59e0b,#d97706)',  label: 'مدير',          badge: 'rgba(245,158,11,0.2)'  },
  admin:    { grad: 'linear-gradient(135deg,#10b981,#059669)',   label: 'مسؤول النظام', badge: 'rgba(16,185,129,0.2)'  },
}
const roleLabelColor: Record<string, string> = {
  employee: '#c4b5fd', manager: '#fcd34d', admin: '#6ee7b7',
}

export default function Sidebar({ navItems }: SidebarProps) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [collapsed,  setCollapsed]  = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const role = user?.role || 'employee'
  const rc   = roleConfig[role]

  const handleLogout = () => { logout(); navigate('/login') }

  const Content = () => (
    /* direction: rtl so Arabic text is right-aligned */
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', direction: 'rtl' }}>

      {/* Header */}
      <div style={{
        padding: '16px 14px',
        borderBottom: '1px solid rgba(var(--ov-rgb),0.06)',
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
      }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CompanyLogo size={34} />
            <div>
              <p style={{ fontWeight: 900, fontSize: 13, color: 'var(--ink)', lineHeight: 1 }}>HR Portal</p>
              <p style={{ fontSize: 10, color: 'rgba(var(--fg-rgb),0.35)', marginTop: 2 }}>
                {user?.companyName || 'الشركة'}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'rgba(var(--ov-rgb),0.05)',
            border: '1px solid rgba(var(--ov-rgb),0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(var(--fg-rgb),0.4)', cursor: 'pointer',
            transition: 'all 0.18s', flexShrink: 0,
          }}
        >
          <CaretRight size={13} weight="bold"
            style={{ transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
        </button>
      </div>

      {/* User card */}
      {!collapsed && (
        <div style={{
          margin: '12px 10px 6px',
          padding: '12px',
          borderRadius: 14,
          background: 'rgba(var(--ov-rgb),0.03)',
          border: '1px solid rgba(var(--ov-rgb),0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: rc.grad,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, color: '#fff', fontSize: 14,
              boxShadow: '0 3px 10px rgba(0,0,0,0.3)',
            }}>
              {user?.name?.charAt(0)}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{
                fontSize: 13, fontWeight: 800, color: 'var(--ink)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{user?.name}</p>
              <span style={{
                fontSize: 10, fontWeight: 700,
                color: roleLabelColor[role],
                background: rc.badge,
                padding: '2px 8px', borderRadius: 6,
                display: 'inline-block', marginTop: 3,
              }}>{rc.label}</span>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 8px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) => isActive ? 'nav-active' : ''}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: collapsed ? '10px' : '10px 12px',
              borderRadius: 12,
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 700,
              fontFamily: 'Cairo, sans-serif',
              transition: 'all 0.18s',
              justifyContent: collapsed ? 'center' : 'flex-start',
              color: isActive ? 'var(--brand-primary)' : 'rgba(var(--fg-rgb),0.5)',
              border: '1px solid transparent',
            })}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement
              if (!el.className.includes('nav-active')) {
                el.style.background = 'rgba(var(--ov-rgb),0.04)'
                el.style.color = 'rgba(var(--fg-rgb),0.85)'
              }
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement
              if (!el.className.includes('nav-active')) {
                el.style.background = 'transparent'
                el.style.color = 'rgba(var(--fg-rgb),0.5)'
              }
            }}
            title={collapsed ? item.label : undefined}
          >
            {({ isActive }: { isActive: boolean }) => (
              <>
                <item.icon
                  size={19}
                  weight={isActive ? 'duotone' : 'regular'}
                  color={isActive ? 'var(--brand-primary)' : 'rgba(var(--fg-rgb),0.4)'}
                  style={{ flexShrink: 0 }}
                />
                {!collapsed && <span>{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '8px', borderTop: '1px solid rgba(var(--ov-rgb),0.06)' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center',
            gap: 10, padding: collapsed ? '10px' : '10px 12px',
            borderRadius: 12, background: 'transparent', border: 'none',
            fontSize: 13, fontWeight: 700, fontFamily: 'Cairo, sans-serif',
            color: 'rgba(var(--fg-rgb),0.4)', cursor: 'pointer',
            transition: 'all 0.18s',
            justifyContent: collapsed ? 'center' : 'flex-start',
            direction: 'rtl',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.background = 'rgba(239,68,68,0.1)'
            el.style.color = '#f87171'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.background = 'transparent'
            el.style.color = 'rgba(var(--fg-rgb),0.4)'
          }}
        >
          <SignOut size={19} weight="regular" style={{ flexShrink: 0 }} />
          {!collapsed && <span>تسجيل الخروج</span>}
        </button>
      </div>
    </div>
  )

  const sidebarStyle: React.CSSProperties = {
    background: 'var(--sidebar)',
    backdropFilter: 'blur(20px)',
    borderLeft: '1px solid rgba(139,92,246,0.1)',
    height: '100vh',
    position: 'sticky',
    top: 0,
    flexShrink: 0,
    width: collapsed ? 64 : 230,
    transition: 'width 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
  }

  return (
    <>
      {/* Desktop */}
      <aside style={sidebarStyle} className="sidebar-desktop">
        <Content />
      </aside>

      {/* Mobile FAB */}
      <button
        onClick={() => setMobileOpen(true)}
        className="sidebar-fab"
        style={{
          display: 'none',
          position: 'fixed', bottom: 24, right: 24, zIndex: 40,
          width: 52, height: 52, borderRadius: 16,
          background: 'var(--brand-primary)',
          border: 'none', cursor: 'pointer',
          alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 6px 24px rgba(109,40,217,0.6)',
          color: '#fff',
        }}
      >
        <List size={22} weight="bold" />
      </button>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed', inset: 0, zIndex: 50,
            display: 'flex',
          }}
        >
          <div
            onClick={() => setMobileOpen(false)}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
          />
          <aside style={{
            position: 'relative', width: 260, height: '100%',
            background: 'var(--surface-2)', zIndex: 1,
            borderLeft: '1px solid rgba(139,92,246,0.15)',
            marginLeft: 'auto',
          }}>
            <button
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'absolute', top: 12, left: 12,
                width: 32, height: 32, borderRadius: 8,
                background: 'rgba(var(--ov-rgb),0.06)', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(var(--fg-rgb),0.5)', cursor: 'pointer',
              }}
            >
              <X size={15} weight="bold" />
            </button>
            <Content />
          </aside>
        </div>
      )}

      <style>{`
        @media (max-width: 1023px) {
          .sidebar-desktop { display: none !important; }
          .sidebar-fab { display: flex !important; }
        }
      `}</style>
    </>
  )
}
