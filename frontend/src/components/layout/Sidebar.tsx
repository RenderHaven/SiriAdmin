import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderTree,
  Image as ImageIcon,
  Camera,
  CalendarDays,
  CameraIcon,
  Share
} from 'lucide-react'

interface SidebarProps {
  onCloseMobile?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Categories', path: '/admin/categories', icon: <FolderTree className="w-5 h-5" /> },
    { name: 'Portfolio', path: '/admin/portfolio', icon: <ImageIcon className="w-5 h-5" /> },
    { name: 'Services', path: '/admin/services', icon: <Camera className="w-5 h-5" /> },
    { name: 'Bookings', path: '/admin/bookings', icon: <CalendarDays className="w-5 h-5" /> },
  ]

  return (
    <aside className="w-64 border-r border-zinc-200 bg-white h-screen flex flex-col fixed inset-y-0 left-0 z-40">
      {/* Brand header */}
      <div className="h-16 flex items-center gap-2.5 px-6 border-b border-zinc-100 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-zinc-900 flex items-center justify-center text-white shadow-md">
          <CameraIcon className="w-5 h-5" />
        </div>
        <div>
          <span className="font-bold text-zinc-900 tracking-tight text-base">Siri Admin</span>
          <p className="text-[10px] text-zinc-400 font-medium tracking-wider uppercase -mt-0.5">Photography CMS</p>
        </div>
      </div>

      {/* Nav list */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1.5">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
        <NavLink
            to="/"
            className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
          >
            <Share className="w-5 h-5" />
            <span>View Site</span>
          </NavLink>
      </nav>

      {/* Footer / Copyright */}
      <div className="p-6 border-t border-zinc-100 text-[11px] text-zinc-400 font-medium">
        © 2026 Siri Photography
      </div>
    </aside>
  )
}
