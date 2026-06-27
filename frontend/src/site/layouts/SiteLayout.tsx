import { Outlet } from 'react-router-dom'
import { SiteHeader, SiteFooter } from '@/components/site/SiteHeader'
import { Toaster } from 'sonner'

export function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      <Toaster position="top-center" theme="dark" richColors />
    </div>
  )
}
