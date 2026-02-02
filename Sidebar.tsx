import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  Building2,
  Users,
  Package,
  Clock,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Briefcase,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Arbetsordrar', path: '/workorders', icon: ClipboardList },
  { label: 'Offerter', path: '/quotes', icon: FileText },
  { label: 'Företag', path: '/customers', icon: Building2 },
  { label: 'Kontakter', path: '/contacts', icon: Users },
  { label: 'Material', path: '/materials', icon: Package },
  { label: 'Tid & Resor', path: '/timetravel', icon: Clock },
  { label: 'Rapporter', path: '/reports', icon: BarChart3 },
  { label: 'Inställningar', path: '/settings', icon: Settings },
];

export function Sidebar() {
  const { currentUser } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-slate-900 text-white transition-all duration-300 z-50 flex flex-col',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">WorkFlow</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
        )}
        {!collapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
            onClick={() => setCollapsed(true)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        )}
        {collapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800 absolute -right-4 top-5 bg-slate-900 border border-slate-800 rounded-full"
            onClick={() => setCollapsed(false)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
            (item.path !== '/' && location.pathname.startsWith(item.path));
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              )}
            >
              <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-white')} />
              {!collapsed && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
              {collapsed && (
                <span className="absolute left-14 bg-slate-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </span>
              )}
              {isActive && !collapsed && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-3 border-t border-slate-800">
        <div
          className={cn(
            'flex items-center gap-3 p-2 rounded-lg bg-slate-800/50',
            collapsed && 'justify-center'
          )}
        >
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={currentUser?.avatar} />
            <AvatarFallback className="bg-blue-600 text-white text-xs">
              {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {currentUser?.fullName}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {currentUser?.email}
              </p>
            </div>
          )}
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}
