'use client';

import { useApp } from '@/context/AppContext';
import { usePathname } from 'next/navigation';

const pageTitles = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Overview of your team\'s activity' },
  '/projects': { title: 'Projects', subtitle: 'Manage and track all projects' },
  '/tasks': { title: 'Tasks', subtitle: 'View and manage team tasks' },
};

export default function Navbar() {
  const { user, setSidebarOpen } = useApp();
  const pathname = usePathname();
  const page = pageTitles[pathname] || { title: 'TaskFlow', subtitle: '' };

  return (
    <header className="sticky top-0 z-20 h-16 flex items-center px-4 lg:px-6 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen((prev) => !prev)}
        className="lg:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 mr-3 transition-all"
        aria-label="Toggle sidebar"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h2 className="text-base font-bold text-white truncate">{page.title}</h2>
        <p className="text-xs text-slate-500 hidden sm:block truncate">{page.subtitle}</p>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 ml-4">
        {/* Notification bell */}
        <button className="relative p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border border-slate-950" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-800 mx-1 hidden sm:block" />

        {/* User avatar */}
        <div className="flex items-center gap-2.5 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-slate-800 group-hover:ring-indigo-500/40 transition-all">
            {user?.avatar || user?.name?.slice(0, 2).toUpperCase() || 'U'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-200 leading-none">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-500 capitalize mt-0.5">{user?.role || 'member'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
