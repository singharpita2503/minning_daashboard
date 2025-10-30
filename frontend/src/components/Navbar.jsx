import React from 'react'
import { Menu, Search, Bell, Sun, Moon, ChevronDown } from 'lucide-react'

export default function Navbar({ toggleSidebar, toggleCollapse, isCollapsed, darkMode, toggleDarkMode }) {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back, Admin</p>
          </div>
        </div>

        {/* Middle Section - Metrics */}
        <div className="hidden xl:flex items-center gap-6">
          <div className="text-sm">
            <span className="text-gray-600 dark:text-gray-400">Active Sites:</span>
            <span className="ml-2 font-semibold text-green-600 dark:text-green-500">12</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-600 dark:text-gray-400">Workers Online:</span>
            <span className="ml-2 font-semibold text-primary-600 dark:text-primary-400">84</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
            <Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm w-40 lg:w-60 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>

          {/* Notifications */}
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-3 border-l border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold text-sm">
                AD
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">Admin</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">System Admin</div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

