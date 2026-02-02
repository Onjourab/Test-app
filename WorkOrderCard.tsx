import { useNavigate } from 'react-router-dom';
import type { WorkOrder } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  User, 
  MapPin, 
  Calendar, 
  Clock, 
  Car,
  Banknote,
  MoreVertical,
  Play,
  Pause,
  CheckCircle,
  FileText,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/data/mockData';
import { useApp } from '@/contexts/AppContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface WorkOrderCardProps {
  workOrder: WorkOrder;
  compact?: boolean;
}

export function WorkOrderCard({ workOrder, compact = false }: WorkOrderCardProps) {
  const navigate = useNavigate();
  const { currentUser, assignWorkOrder, updateWorkOrderStatus } = useApp();

  const handleTakeOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentUser) {
      assignWorkOrder(workOrder.id, currentUser.id);
    }
  };

  const handleStartWork = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateWorkOrderStatus(workOrder.id, 'started');
  };

  const handlePauseWork = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateWorkOrderStatus(workOrder.id, 'paused');
  };

  const handleCompleteWork = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateWorkOrderStatus(workOrder.id, 'completed');
  };

  const handleCreateInvoice = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateWorkOrderStatus(workOrder.id, 'invoiced');
  };

  if (compact) {
    return (
      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => navigate(`/workorders/${workOrder.id}`)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-mono text-slate-500">{workOrder.orderNumber}</span>
                <StatusBadge status={workOrder.status} size="sm" />
              </div>
              <h3 className="font-semibold text-slate-900">{workOrder.title}</h3>
              <p className="text-sm text-slate-500 mt-1">{workOrder.customer.name}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-slate-900">{formatCurrency(workOrder.totalAmount)}</p>
              <p className="text-xs text-slate-500">{formatDate(workOrder.scheduledDate)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
      onClick={() => navigate(`/workorders/${workOrder.id}`)}
    >
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-mono text-slate-500">{workOrder.orderNumber}</span>
              <StatusBadge status={workOrder.status} size="sm" />
            </div>
            <h3 className="font-semibold text-lg text-slate-900">{workOrder.title}</h3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/workorders/${workOrder.id}/edit`); }}>
                Redigera
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/workorders/${workOrder.id}`); }}>
                Visa detaljer
              </DropdownMenuItem>
              {workOrder.quoteId && (
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/quotes/${workOrder.quoteId}`); }}>
                  <FileText className="w-4 h-4 mr-2" />
                  Visa offert
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Customer Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span>{workOrder.customer.name}</span>
          </div>
          {workOrder.contact && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <User className="w-4 h-4 text-slate-400" />
              <span>{workOrder.contact.fullName}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span>{workOrder.customer.address.city}</span>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 mb-4 py-3 border-y border-slate-100">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600">{formatDate(workOrder.scheduledDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600">{workOrder.actualHours}h / {workOrder.estimatedHours}h</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Car className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600">{workOrder.travels.reduce((sum, t) => sum + t.distanceKm, 0)} km</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Banknote className="w-4 h-4 text-slate-400" />
            <span className="font-medium text-slate-900">{formatCurrency(workOrder.totalAmount)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {workOrder.assignedUser ? (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700">
                  {workOrder.assignedUser.firstName[0]}{workOrder.assignedUser.lastName[0]}
                </div>
                <span className="text-sm text-slate-600">{workOrder.assignedUser.firstName}</span>
              </div>
            ) : (
              <span className="text-sm text-slate-400">Ej tilldelad</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {workOrder.status === 'available' && (
              <Button 
                size="sm" 
                onClick={handleTakeOrder}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Ta arbetsorder
              </Button>
            )}
            {workOrder.status === 'taken' && (
              <Button 
                size="sm" 
                onClick={handleStartWork}
                className="bg-green-600 hover:bg-green-700"
              >
                <Play className="w-4 h-4 mr-1" />
                Starta
              </Button>
            )}
            {workOrder.status === 'started' && (
              <>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handlePauseWork}
                >
                  <Pause className="w-4 h-4 mr-1" />
                  Pausa
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleCompleteWork}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Avsluta
                </Button>
              </>
            )}
            {workOrder.status === 'paused' && (
              <Button 
                size="sm" 
                onClick={handleStartWork}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Play className="w-4 h-4 mr-1" />
                Fortsätt
              </Button>
            )}
            {workOrder.status === 'completed' && !workOrder.isInvoiced && (
              <Button 
                size="sm" 
                onClick={handleCreateInvoice}
                className="bg-violet-600 hover:bg-violet-700"
              >
                <FileText className="w-4 h-4 mr-1" />
                Fakturera
              </Button>
            )}
            {workOrder.isInvoiced && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-violet-700 bg-violet-100 border border-violet-200">
                Fakturerad
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
