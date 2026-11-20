import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import ScrollToTop from '@/components/ScrollToTop'
import PageLoader from '@/components/ui/PageLoader'

// Layouts stay eager — they wrap every route.
import LandingLayout from '@/layouts/LandingLayout'
import AuthLayout from '@/layouts/AuthLayout'
import EmployeeLayout from '@/layouts/EmployeeLayout'
import ManagerLayout from '@/layouts/ManagerLayout'
import AdminLayout from '@/layouts/AdminLayout'

// Website (Landing)
const HomePage = lazy(() => import('@/pages/website/HomePage'))
const FeaturesPage = lazy(() => import('@/pages/website/FeaturesPage'))
const PricingPage = lazy(() => import('@/pages/website/PricingPage'))
const AboutPage = lazy(() => import('@/pages/website/AboutPage'))
const ContactPage = lazy(() => import('@/pages/website/ContactPage'))

// Auth
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))

// Shared
const RequestDetails = lazy(() => import('@/pages/shared/RequestDetails'))
const NotFound = lazy(() => import('@/pages/NotFound'))

// Employee Pages
const EmployeeDashboard = lazy(() => import('@/pages/employee/Dashboard'))
const MyRequests = lazy(() => import('@/pages/employee/MyRequests'))
const NewRequest = lazy(() => import('@/pages/employee/NewRequest'))
const Dependents = lazy(() => import('@/pages/employee/Dependents'))

// Manager Pages
const ManagerDashboard = lazy(() => import('@/pages/manager/Dashboard'))
const PendingApprovals = lazy(() => import('@/pages/manager/PendingApprovals'))
const TeamRequests = lazy(() => import('@/pages/manager/TeamRequests'))

// Admin Pages
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'))
const AdminRequests = lazy(() => import('@/pages/admin/Requests'))
const RequestTypes = lazy(() => import('@/pages/admin/RequestTypes'))
const Employees = lazy(() => import('@/pages/admin/Employees'))
const Reports = lazy(() => import('@/pages/admin/Reports'))
const Settings = lazy(() => import('@/pages/admin/Settings'))

function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: string }) {
  const { user } = useAuthStore()
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  const { user } = useAuthStore()

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ═══ PUBLIC WEBSITE ═══ */}
          <Route element={<LandingLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* ═══ AUTH ═══ */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          {/* ═══ APP REDIRECT ═══ */}
          <Route
            path="/app"
            element={
              !user ? <Navigate to="/login" replace /> :
              user.role === 'admin'    ? <Navigate to="/app/admin"    replace /> :
              user.role === 'manager'  ? <Navigate to="/app/manager"  replace /> :
              <Navigate to="/app/employee" replace />
            }
          />

          {/* ═══ EMPLOYEE ═══ */}
          <Route element={<ProtectedRoute role="employee"><EmployeeLayout /></ProtectedRoute>}>
            <Route path="/app/employee"              element={<EmployeeDashboard />} />
            <Route path="/app/employee/requests"     element={<MyRequests />} />
            <Route path="/app/employee/requests/new" element={<NewRequest />} />
            <Route path="/app/employee/requests/new/:type" element={<NewRequest />} />
            <Route path="/app/employee/requests/:id" element={<RequestDetails />} />
            <Route path="/app/employee/dependents"   element={<Dependents />} />
          </Route>

          {/* ═══ MANAGER ═══ */}
          <Route element={<ProtectedRoute role="manager"><ManagerLayout /></ProtectedRoute>}>
            <Route path="/app/manager"               element={<ManagerDashboard />} />
            <Route path="/app/manager/approvals"     element={<PendingApprovals />} />
            <Route path="/app/manager/team"          element={<TeamRequests />} />
            <Route path="/app/manager/requests/new"  element={<NewRequest />} />
            <Route path="/app/manager/requests/new/:type" element={<NewRequest />} />
            <Route path="/app/manager/requests/:id" element={<RequestDetails />} />
          </Route>

          {/* ═══ ADMIN ═══ */}
          <Route element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
            <Route path="/app/admin"                 element={<AdminDashboard />} />
            <Route path="/app/admin/requests"        element={<AdminRequests />} />
            <Route path="/app/admin/requests/:id"    element={<RequestDetails />} />
            <Route path="/app/admin/request-types"   element={<RequestTypes />} />
            <Route path="/app/admin/employees"       element={<Employees />} />
            <Route path="/app/admin/reports"         element={<Reports />} />
            <Route path="/app/admin/settings"        element={<Settings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  )
}
