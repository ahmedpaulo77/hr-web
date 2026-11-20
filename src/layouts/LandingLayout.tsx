import { Outlet } from 'react-router-dom'
import Navbar from '@/components/website/Navbar'
import Footer from '@/components/website/Footer'

export default function LandingLayout() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-deep)' }}>
      <div className="mesh-bg" />
      <Navbar />
      <main className="relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
