import React from 'react'
import { Menu, LogOut, User } from 'lucide-react'
import { useAuth } from '@/features/auth/AuthContext'
import { useLocation } from 'react-router-dom'

interface NavbarProps {
  onOpenMobileSidebar: () => void
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileSidebar }) => {
  const { logout } = useAuth()
  const location = useLocation()

  // Derive breadcrumbs/page title from path
  const getPageTitle = () => {
    const path = location.pathname.substring(1)
    if (!path) return 'Dashboard'
    return path.charAt(0).toUpperCase() + path.slice(1)
  }

  return (
    <header className="h-16 border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Current title / Breadcrumb */}
        <div className="flex items-center gap-2">
          <span className="text-zinc-400 text-sm font-medium">SiriAdmin</span>
          <span className="text-zinc-300 text-sm">/</span>
          <span className="text-zinc-900 text-sm font-semibold">{getPageTitle()}</span>
        </div>
      </div>

      {/* Admin action menu */}
      <div className="flex items-center gap-4">
        {/* Admin profile indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-100 bg-zinc-50">
          <div className="w-6 h-6 rounded-full bg-zinc-900 flex items-center justify-center text-[10px] font-bold text-white uppercase">
            A
          </div>
          <span className="text-xs font-semibold text-zinc-700">Administrator</span>
        </div>

        {/* Logout button */}
        <button
          onClick={logout}
          title="Sign Out"
          className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
