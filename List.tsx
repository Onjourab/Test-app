import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Plus,
  Filter,
  Building2,
  User,
  MapPin,
  Phone,
  Mail,
  MoreHorizontal,
  ClipboardList,
  FileText,
} from 'lucide-react';
import { formatCurrency } from '@/data/mockData';
import type { CustomerType } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export function CustomerList() {
  const navigate = useNavigate();
  const { customers, workOrders, quotes } = useApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<CustomerType | 'all'>('all');

  // Filter customers
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          customer.name.toLowerCase().includes(query) ||
          customer.email.toLowerCase().includes(query) ||
          customer.phone.includes(query) ||
          customer.address.city.toLowerCase().includes(query) ||
          (customer.orgNumber && customer.orgNumber.includes(query));
        if (!matchesSearch) return false;
      }

      // Type filter
      if (typeFilter !== 'all' && customer.type !== typeFilter) return false;

      return true;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [customers, searchQuery, typeFilter]);

  // Get customer stats
  const getCustomerStats = (customerId: string) => {
    const customerWorkOrders = workOrders.filter(wo => wo.customerId === customerId);
    const customerQuotes = quotes.filter(q => q.customerId === customerId);
    const totalRevenue = customerWorkOrders
      .filter(wo => wo.isInvoiced)
      .reduce((sum, wo) => sum + wo.totalAmount, 0);
    
    return {
      workOrders: customerWorkOrders.length,
      quotes: customerQuotes.length,
      totalRevenue,
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Företag & Kontakter</h1>
          <p className="text-slate-500">Hantera kunder och kontaktpersoner</p>
        </div>
        <Button 
          onClick={() => navigate('/customers/new')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ny kund
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Sök kunder..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as CustomerType | 'all')}>
              <SelectTrigger className="w-full lg:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Typ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alla typer</SelectItem>
                <SelectItem value="company">Företag</SelectItem>
                <SelectItem value="private">Privatperson</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Visar {filteredCustomers.length} av {customers.length} kunder
        </p>
      </div>

      {/* Content */}
      {filteredCustomers.length === 0 ? (
        <Card className="bg-slate-50 border-dashed">
          <CardContent className="p-12 text-center">
            <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">Inga kunder hittades</h3>
            <p className="text-slate-500 mb-4">Prova att ändra dina filter eller skapa en ny kund.</p>
            <Button 
              onClick={() => navigate('/customers/new')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ny kund
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredCustomers.map(customer => {
            const stats = getCustomerStats(customer.id);
            return (
              <Card 
                key={customer.id}
                className="cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                onClick={() => navigate(`/customers/${customer.id}`)}
              >
                <CardContent className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center',
                        customer.type === 'company' ? 'bg-blue-100' : 'bg-green-100'
                      )}>
                        {customer.type === 'company' ? (
                          <Building2 className="w-5 h-5 text-blue-600" />
                        ) : (
                          <User className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{customer.name}</h3>
                        <p className="text-sm text-slate-500">
                          {customer.type === 'company' ? 'Företag' : 'Privatperson'}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/customers/${customer.id}`); }}>
                          Visa detaljer
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/customers/${customer.id}/edit`); }}>
                          Redigera
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/workorders/new?customer=${customer.id}`); }}>
                          <ClipboardList className="w-4 h-4 mr-2" />
                          Ny arbetsorder
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/quotes/new?customer=${customer.id}`); }}>
                          <FileText className="w-4 h-4 mr-2" />
                          Ny offert
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Info */}
                  <div className="space-y-2 mb-4">
                    {customer.orgNumber && (
                      <p className="text-sm text-slate-600">Org.nr: {customer.orgNumber}</p>
                    )}
                    {customer.personNumber && (
                      <p className="text-sm text-slate-600">Personnr: {customer.personNumber}</p>
                    )}
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>{customer.address.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span>{customer.phone}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {stats.workOrders} AO
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {stats.quotes} offert{stats.quotes !== 1 ? 'er' : ''}
                      </Badge>
                    </div>
                    {stats.totalRevenue > 0 && (
                      <div className="ml-auto">
                        <span className="text-sm font-medium text-slate-900">
                          {formatCurrency(stats.totalRevenue)}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Helper function

