import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '@/components/ui/Sidebar'
import TopBar from '@/components/ui/TopBar'
import { SquaresFour, FileText, Users, ChartBar, Gear } from '@phosphor-icons/react'

const navItems = [
  { label: 'الرئيسية',       path: '/app/admin',                icon: SquaresFour },
  { label: 'أنواع الطلبات',  path: '/app/admin/request-types',  icon: FileText    },
  { label: 'الموظفون',       path: '/app/admin/employees',       icon: Users       },
  { label: 'التقارير',       path: '/app/admin/reports',         icon: ChartBar    },
  { label: 'الإعدادات',      path: '/app/admin/settings',        icon: Gear        },
]

const titles: Record<string, { title: string; subtitle: string }> = {
  '/app/admin':               { title: 'لوحة الإدارة',    subtitle: 'إدارة شاملة للنظام' },
  '/app/admin/request-types': { title: 'أنواع الطلبات',   subtitle: 'تخصيص وإدارة الطلبات' },
  '/app/admin/employees':     { title: 'الموظفون',         subtitle: 'إدارة بيانات الموظفين' },
  '/app/admin/reports':       { title: 'التقارير',         subtitle: 'تقارير وإحصائيات' },
  '/app/admin/settings':      { title: 'الإعدادات',        subtitle: 'ضبط إعدادات الشركة' },
}

export default function AdminLayout() {
  const location = useLocation()
  const page = titles[location.pathname] || { title: 'HR Portal', subtitle: '' }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      <div className="mesh-bg" />
      <Sidebar navItems={navItems} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative', zIndex: 10 }}>
        <TopBar title={page.title} subtitle={page.subtitle} />
        <main style={{ flex: 1, padding: '24px', overflowY: 'auto', direction: 'rtl' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
