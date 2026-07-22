import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'
import { BugBanner } from '@/components/BugBanner'
import { useBugMode } from '@/hooks/useBugMode'

export function Layout() {
  const { isBugMode } = useBugMode()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      {isBugMode && <BugBanner />}
      <Header onMenuToggle={() => setSidebarOpen(v => !v)} />
      <div className="flex flex-1 w-full overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 pt-5 pb-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}
