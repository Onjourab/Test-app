import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Bell,
  Plus,
  User,
  Settings,
  LogOut,
  ClipboardList,
  FileText,
  Building2,
  Package,
  ChevronDown,
  Menu,
} from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
  sidebarCollapsed?: boolean;
}

export function Header({ onMenuClick, sidebarCollapsed = false }: HeaderProps) {
  const { currentUser, workOrders, quotes } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Get page title from path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/workorders')) return 'Arbetsordrar';
    if (path.startsWith('/quotes')) return 'Offerter';
    if (path.startsWith('/customers')) return 'Företag';
    if (path.startsWith('/contacts')) return 'Kontakter';
    if (path.startsWith('/materials')) return 'Material';
    if (path.startsWith('/timetravel')) return 'Tid & Resor';
    if (path.startsWith('/reports')) return 'Rapporter';
    if (path.startsWith('/settings')) return 'Inställningar';
    return 'WorkFlow Pro';
  };

  // Get notification count
  const notificationCount = workOrders.filter(wo => wo.status === 'available').length + 
    quotes.filter(q => q.status === 'sent').length;

  const quickActions = [
    { label: 'Ny arbetsorder', icon: ClipboardList, path: '/workorders/new', color: 'text-blue-600' },
    { label: 'Ny offert', icon: FileText, path: '/quotes/new', color: 'text-green-600' },
    { label: 'Nytt företag', icon: Building2, path: '/customers/new', color: 'text-purple-600' },
    { label: 'Nytt material', icon: Package, path: '/materials/new', color: 'text-orange-600' },
  ];

  return (
    <header 
      className={cn(
        'fixed top-0 right-0 h-16 bg-white border-b border-slate-200 z-40 transition-all duration-300',
        sidebarCollapsed ? 'left-16' : 'left-60'
      )}
    >
      <div className="h-full flex items-center justify-between px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-slate-900">{getPageTitle()}</h1>
        </div>

        {/* Center - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Sök arbetsordrar, offerter, företag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 h-10 bg-slate-50 border-slate-200 focus:bg-white"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Quick Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="default" 
                size="sm" 
                className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>Ny</span>
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Snabbåtgärder</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <DropdownMenuItem 
                    key={action.path}
                    onClick={() => navigate(action.path)}
                    className="cursor-pointer"
                  >
                    <Icon className={cn('w-4 h-4 mr-2', action.color)} />
                    {action.label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5 text-slate-600" />
                {notificationCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {notificationCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifikationer</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-64 overflow-y-auto">
                {workOrders.filter(wo => wo.status === 'available').length > 0 && (
                  <DropdownMenuItem className="cursor-pointer flex flex-col items-start py-3">
                    <span className="font-medium text-sm">
                      {workOrders.filter(wo => wo.status === 'available').length} lediga arbetsordrar
                    </span>
                    <span className="text-xs text-slate-500">Väntar på tilldelning</span>
                  </DropdownMenuItem>
                )}
                {quotes.filter(q => q.status === 'sent').length > 0 && (
                  <DropdownMenuItem className="cursor-pointer flex flex-col items-start py-3">
                    <span className="font-medium text-sm">
                      {quotes.filter(q => q.status === 'sent').length} skickade offerter
                    </span>
                    <span className="text-xs text-slate-500">Väntar på svar från kund</span>
                  </DropdownMenuItem>
                )}
                {notificationCount === 0 && (
                  <div className="py-4 text-center text-slate-500 text-sm">
                    Inga nya notifikationer
                  </div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                  {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
                </div>
                <span className="hidden sm:inline text-sm font-medium">
                  {currentUser?.firstName}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mitt konto</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/settings/profile')}>
                <User className="w-4 h-4 mr-2" />
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="w-4 h-4 mr-2" />
                Inställningar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                Logga ut
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
