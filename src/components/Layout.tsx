import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Shield, Calendar, ClipboardList, 
  FileText, DollarSign, Link2, CheckCircle, Settings, 
  Bell, Search, Plus, ChevronDown, Menu, X, LogOut
} from 'lucide-react';
import { organization, users } from '../data/mockData';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Patients', href: '/patients', icon: Users },
  { name: 'Authorizations', href: '/authorizations', icon: Shield },
  { name: 'Schedule', href: '/schedule', icon: Calendar },
  { name: 'Treatment Plans', href: '/treatment-plans', icon: ClipboardList },
  { name: 'Documentation', href: '/documentation', icon: FileText },
  { name: 'Claims', href: '/claims', icon: DollarSign },
  { name: 'Referrals', href: '/referrals', icon: Link2 },
  { name: 'Compliance', href: '/compliance', icon: CheckCircle },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const currentUser = users[0]; // Sarah Chen - Owner

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-900/50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-xl">
            <SidebarContent currentPath={location.pathname} onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 overflow-y-auto">
          <SidebarContent currentPath={location.pathname} />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
              >
                <Menu className="h-5 w-5" />
              </button>
              
              {/* Practice switcher */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-sm font-medium text-gray-700">{organization.name}</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200 w-64">
                <Search className="h-4 w-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search patients..." 
                  className="bg-transparent text-sm text-gray-700 outline-none w-full placeholder:text-gray-400"
                />
              </div>

              {/* Quick actions */}
              <div className="hidden sm:flex items-center gap-2">
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="h-4 w-4" />
                  <span>New</span>
                </button>
              </div>

              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>
                
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2 shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Authorization URGENT</p>
                            <p className="text-xs text-gray-500 mt-0.5">Maria Garcia - Expires in 5 days, 2 visits remaining</p>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Authorization EXHAUSTED</p>
                            <p className="text-xs text-gray-500 mt-0.5">James Thompson - All visits used, re-auth denied</p>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Claim Denied</p>
                            <p className="text-xs text-gray-500 mt-0.5">CLM-2024-003 - Authorization exhausted</p>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-3 hover:bg-gray-50">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Re-eval Overdue</p>
                            <p className="text-xs text-gray-500 mt-0.5">Patricia Lee - Re-evaluation past due</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User menu */}
              <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-700">{currentUser.firstName} {currentUser.lastName}</p>
                  <p className="text-xs text-gray-500">{currentUser.role.replace('_', ' ')}</p>
                </div>
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{currentUser.firstName[0]}{currentUser.lastName[0]}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ currentPath, onClose }: { currentPath: string; onClose?: () => void }) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">PT</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900">Practice OS</h1>
            <p className="text-xs text-gray-500">PT/OT Operations</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = currentPath === item.href || (item.href !== '/' && currentPath.startsWith(item.href));
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade banner */}
      <div className="px-3 pb-3">
        <Link to="/pricing" className="block p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:border-blue-300 transition-colors">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">Solo Plan</span>
            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded">ACTIVE</span>
          </div>
          <p className="text-xs text-blue-600/80 leading-snug">Unlock claims, referrals & compliance tools</p>
          <div className="flex items-center gap-1 mt-1.5 text-xs font-semibold text-blue-700">
            Upgrade plan <ChevronDown className="h-3 w-3 -rotate-90" />
          </div>
        </Link>
      </div>

      {/* Bottom section */}
      <div className="border-t border-gray-100 px-3 py-4 space-y-1">
        <Link to="/pricing" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
          <Settings className="h-5 w-5 text-gray-400" />
          Pricing & Plans
        </Link>
        <Link to="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
          <Settings className="h-5 w-5 text-gray-400" />
          Settings
        </Link>
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors w-full">
          <LogOut className="h-5 w-5 text-gray-400" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
