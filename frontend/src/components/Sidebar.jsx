import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X
} from 'lucide-react'

const menuItems = [
  { icon: LayoutDashboard, label: 'Analytics', path: '/' },
  { icon: Users, label: 'Workers', path: '/workers' },
]

const bottomMenuItems = [
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: HelpCircle, label: 'Help', path: '/help' },
  { icon: LogOut, label: 'Logout', path: '/logout' },
]

export default function Sidebar({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden z-20"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          ${isCollapsed ? 'w-20' : 'w-64'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          flex flex-col py-6
          transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="mb-2 flex items-center justify-center">
          <img 
            src="/logo.png" 
            alt="Mine Gaurd Logo" 
            className={`object-contain transition-all ${isCollapsed ? 'w-16 h-16' : 'w-36 h-36'}`}
          />
        </div>

        {/* Toggle Button */}
        <div className="mb-4 px-3">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <Menu className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium text-sm">Collapse Menu</span>}
          </button>
        </div>

        {/* Main Menu */}
        <nav className="flex-1 flex flex-col gap-2 px-3">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-xl transition-all group relative ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300'
                } ${isCollapsed ? 'justify-center' : ''}`
              }
            >
              <item.icon className="w-6 h-6 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Menu */}
        <div className="flex flex-col gap-2 px-3 mt-auto">
          {bottomMenuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 transition-all group relative ${
                isCollapsed ? 'justify-center' : ''
              }`}
            >
              <item.icon className="w-6 h-6 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </div>
      </aside>
    </>
  )
}

