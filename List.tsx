import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { WorkOrderCard } from '@/components/cards/WorkOrderCard';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Search,
  Plus,
  Filter,
  Grid3X3,
  List,
  MoreHorizontal,
  User,
  Building2,
  ClipboardList,
} from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { formatCurrency, formatDate } from '@/data/mockData';
import type { WorkOrderStatus } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function WorkOrderList() {
  const navigate = useNavigate();
  const { workOrders, customers, users } = useApp();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<WorkOrderStatus | 'all'>('all');
  const [customerFilter, setCustomerFilter] = useState<string>('all');
  const [assignedFilter, setAssignedFilter] = useState<string>('all');

  // Filter work orders
  const filteredWorkOrders = useMemo(() => {
    return workOrders.filter(wo => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          wo.orderNumber.toLowerCase().includes(query) ||
          wo.title.toLowerCase().includes(query) ||
          wo.customer.name.toLowerCase().includes(query) ||
          wo.description.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (statusFilter !== 'all' && wo.status !== statusFilter) return false;

      // Customer filter
      if (customerFilter !== 'all' && wo.customerId !== customerFilter) return false;

      // Assigned filter
      if (assignedFilter !== 'all') {
        if (assignedFilter === 'unassigned' && wo.assignedTo) return false;
        if (assignedFilter !== 'unassigned' && wo.assignedTo !== assignedFilter) return false;
      }

      return true;
    }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [workOrders, searchQuery, statusFilter, customerFilter, assignedFilter]);

  // Status counts
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: workOrders.length,
      available: 0,
      taken: 0,
      started: 0,
      paused: 0,
      completed: 0,
      invoiced: 0,
    };
    workOrders.forEach(wo => {
      counts[wo.status] = (counts[wo.status] || 0) + 1;
    });
    return counts;
  }, [workOrders]);

  const statusOptions: { value: WorkOrderStatus | 'all'; label: string; count: number }[] = [
    { value: 'all', label: 'Alla', count: statusCounts.all },
    { value: 'available', label: 'Lediga', count: statusCounts.available },
    { value: 'taken', label: 'Tagna', count: statusCounts.taken },
    { value: 'started', label: 'Påbörjade', count: statusCounts.started },
    { value: 'paused', label: 'Pausade', count: statusCounts.paused },
    { value: 'completed', label: 'Avslutade', count: statusCounts.completed },
    { value: 'invoiced', label: 'Fakturerade', count: statusCounts.invoiced },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Arbetsordrar</h1>
          <p className="text-slate-500">Hantera och följ upp arbetsordrar</p>
        </div>
        <Button 
          onClick={() => navigate('/workorders/new')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ny arbetsorder
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
                placeholder="Sök arbetsordrar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as WorkOrderStatus | 'all')}>
              <SelectTrigger className="w-full lg:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center justify-between w-full">
                      <span>{option.label}</span>
                      <Badge variant="secondary" className="ml-2">{option.count}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Customer Filter */}
            <Select value={customerFilter} onValueChange={setCustomerFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <Building2 className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Kund" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alla kunder</SelectItem>
                {customers.map(customer => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Assigned Filter */}
            <Select value={assignedFilter} onValueChange={setAssignedFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <User className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Tilldelad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alla</SelectItem>
                <SelectItem value="unassigned">Ej tilldelad</SelectItem>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="flex items-center gap-1 border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Visar {filteredWorkOrders.length} av {workOrders.length} arbetsordrar
        </p>
      </div>

      {/* Content */}
      {filteredWorkOrders.length === 0 ? (
        <Card className="bg-slate-50 border-dashed">
          <CardContent className="p-12 text-center">
            <ClipboardList className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">Inga arbetsordrar hittades</h3>
            <p className="text-slate-500 mb-4">Prova att ändra dina filter eller skapa en ny arbetsorder.</p>
            <Button 
              onClick={() => navigate('/workorders/new')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ny arbetsorder
            </Button>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredWorkOrders.map(workOrder => (
            <WorkOrderCard key={workOrder.id} workOrder={workOrder} />
          ))}
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nr</TableHead>
                <TableHead>Titel</TableHead>
                <TableHead>Kund</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Datum</TableHead>
                <TableHead>Tilldelad</TableHead>
                <TableHead className="text-right">Belopp</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkOrders.map(workOrder => (
                <TableRow 
                  key={workOrder.id}
                  className="cursor-pointer hover:bg-slate-50"
                  onClick={() => navigate(`/workorders/${workOrder.id}`)}
                >
                  <TableCell className="font-mono text-sm">{workOrder.orderNumber}</TableCell>
                  <TableCell className="font-medium">{workOrder.title}</TableCell>
                  <TableCell>{workOrder.customer.name}</TableCell>
                  <TableCell>
                    <StatusBadge status={workOrder.status} size="sm" />
                  </TableCell>
                  <TableCell>{formatDate(workOrder.scheduledDate)}</TableCell>
                  <TableCell>
                    {workOrder.assignedUser ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700">
                          {workOrder.assignedUser.firstName[0]}{workOrder.assignedUser.lastName[0]}
                        </div>
                        <span className="text-sm">{workOrder.assignedUser.firstName}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400">Ej tilldelad</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(workOrder.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/workorders/${workOrder.id}`); }}>
                          Visa detaljer
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/workorders/${workOrder.id}/edit`); }}>
                          Redigera
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
