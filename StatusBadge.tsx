import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { WorkOrderStatus, QuoteStatus } from '@/types';
import { getStatusLabel } from '@/data/mockData';

interface StatusBadgeProps {
  status: WorkOrderStatus | QuoteStatus | string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
  className?: string;
}

export function StatusBadge({ 
  status, 
  size = 'md', 
  showDot = true,
  className 
}: StatusBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1',
  };

  const dotSizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  // Get color based on status
  const getStatusColorClass = (status: string): string => {
    const colorMap: Record<string, string> = {
      // Work order statuses
      available: 'bg-green-100 text-green-700 border-green-200',
      taken: 'bg-amber-100 text-amber-700 border-amber-200',
      started: 'bg-blue-100 text-blue-700 border-blue-200',
      paused: 'bg-orange-100 text-orange-700 border-orange-200',
      completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      invoiced: 'bg-violet-100 text-violet-700 border-violet-200',
      // Quote statuses
      draft: 'bg-slate-100 text-slate-700 border-slate-200',
      sent: 'bg-amber-100 text-amber-700 border-amber-200',
      accepted: 'bg-green-100 text-green-700 border-green-200',
      rejected: 'bg-red-100 text-red-700 border-red-200',
      revised: 'bg-orange-100 text-orange-700 border-orange-200',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getDotColorClass = (status: string): string => {
    const colorMap: Record<string, string> = {
      available: 'bg-green-500',
      taken: 'bg-amber-500',
      started: 'bg-blue-500',
      paused: 'bg-orange-500',
      completed: 'bg-emerald-500',
      invoiced: 'bg-violet-500',
      draft: 'bg-slate-400',
      sent: 'bg-amber-500',
      accepted: 'bg-green-500',
      rejected: 'bg-red-500',
      revised: 'bg-orange-500',
    };
    return colorMap[status] || 'bg-gray-400';
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        'font-medium border flex items-center gap-1.5',
        sizeClasses[size],
        getStatusColorClass(status),
        className
      )}
    >
      {showDot && (
        <span className={cn('rounded-full', dotSizeClasses[size], getDotColorClass(status))} />
      )}
      {getStatusLabel(status)}
    </Badge>
  );
}
