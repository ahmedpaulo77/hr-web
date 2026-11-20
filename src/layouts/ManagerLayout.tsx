import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '@/components/ui/Sidebar'
import TopBar from '@/components/ui/TopBar'
import { SquaresFour, CheckCircle, Users, PlusCircle, CalendarBlank } from '@phosphor-icons/react'

const navItems = [
  { label: 'الرئيسية',     path: '/app/manager',              icon: SquaresFour },
  { label: 'الموافقات',    path: '/app/manager/approvals',    icon: CheckCircle },
  { label: 'طلبات الفريق', path: '/app/manager/team',         icon: Users       },
  { label: 'فريقي',        path: '/app/manager/team-operations', icon: CalendarBlank },
  { label: 'طلب جديد',     path: '/app/manager/requests/new', icon: PlusCircle  },
]

const titles: Record<string, { title: string; subtitle: string }> = {
  '/app/manager':              { title: 'لوحة المدير',    subtitle: 'نظرة عامة على فريقك' },
  '/app/manager/approvals':    { title: 'الموافقات',      subtitle: 'الطلبات المعلقة' },
  '/app/manager/team':         { title: 'طلبات الفريق',   subtitle: 'جميع طلبات الفريق' },
  '/app/manager/team-operations': { title: 'فريقي', subtitle: 'حضور الفريق وجدوله وإجراءات المدير' },
  '/app/manager/requests/new': { title: 'طلب جديد',       subtitle: 'تقديم طلب' },
}

export default function ManagerLayout() {
  const location = useLocation()
  const page = location.pathname.startsWith('/app/manager/requests/') && !location.pathname.startsWith('/app/manager/requests/new')
    ? { title: 'تفاصيل الطلب', subtitle: 'بيانات الطلب وسجل المتابعة' }
    : titles[location.pathname] || { title: 'HR Portal', subtitle: '' }

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
