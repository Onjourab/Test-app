import { useNavigate } from 'react-router-dom';
import type { Quote } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  User, 
  Calendar, 
  Banknote,
  MoreVertical,
  FileText,
  Send,
  CheckCircle,
  XCircle,
  RotateCcw,
  ClipboardList,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/data/mockData';
import { useApp } from '@/contexts/AppContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';

interface QuoteCardProps {
  quote: Quote;
  compact?: boolean;
}

export function QuoteCard({ quote, compact = false }: QuoteCardProps) {
  const navigate = useNavigate();
  const { updateQuote, convertQuoteToWorkOrder } = useApp();
  const [convertDialogOpen, setConvertDialogOpen] = useState(false);

  const handleSendQuote = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuote(quote.id, { status: 'sent', sentAt: new Date() });
  };

  const handleAcceptQuote = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuote(quote.id, { status: 'accepted', acceptedAt: new Date() });
  };

  const handleRejectQuote = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuote(quote.id, { status: 'rejected', rejectedAt: new Date() });
  };

  const handleConvertToWorkOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    const workOrder = convertQuoteToWorkOrder(quote.id);
    if (workOrder) {
      navigate(`/workorders/${workOrder.id}`);
    }
    setConvertDialogOpen(false);
  };

  if (compact) {
    return (
      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => navigate(`/quotes/${quote.id}`)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-mono text-slate-500">{quote.quoteNumber}</span>
                <StatusBadge status={quote.status} size="sm" />
              </div>
              <h3 className="font-semibold text-slate-900">{quote.title}</h3>
              <p className="text-sm text-slate-500 mt-1">{quote.customer.name}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-slate-900">{formatCurrency(quote.totalAmount)}</p>
              <p className="text-xs text-slate-500">Giltig till {formatDate(quote.validUntil)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
      onClick={() => navigate(`/quotes/${quote.id}`)}
    >
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-mono text-slate-500">{quote.quoteNumber}</span>
              <StatusBadge status={quote.status} size="sm" />
            </div>
            <h3 className="font-semibold text-lg text-slate-900">{quote.title}</h3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/quotes/${quote.id}/edit`); }}>
                Redigera
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/quotes/${quote.id}`); }}>
                Visa detaljer
              </DropdownMenuItem>
              {quote.workOrderId && (
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/workorders/${quote.workOrderId}`); }}>
                  <ClipboardList className="w-4 h-4 mr-2" />
                  Visa arbetsorder
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Customer Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span>{quote.customer.name}</span>
          </div>
          {quote.contact && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <User className="w-4 h-4 text-slate-400" />
              <span>{quote.contact.fullName}</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 mb-4 py-3 border-y border-slate-100">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600">Giltig till: {formatDate(quote.validUntil)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Banknote className="w-4 h-4 text-slate-400" />
            <span className="font-medium text-slate-900">{formatCurrency(quote.totalAmount)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FileText className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600">{quote.items.length} artiklar</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600">{formatDate(quote.createdAt)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2">
          {quote.status === 'draft' && (
            <>
              <Button 
                size="sm" 
                variant="outline"
                onClick={(e) => { e.stopPropagation(); navigate(`/quotes/${quote.id}/edit`); }}
              >
                Redigera
              </Button>
              <Button 
                size="sm" 
                onClick={handleSendQuote}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4 mr-1" />
                Skicka
              </Button>
            </>
          )}
          {quote.status === 'sent' && (
            <>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleRejectQuote}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <XCircle className="w-4 h-4 mr-1" />
                Avslå
              </Button>
              <Button 
                size="sm" 
                onClick={handleAcceptQuote}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Acceptera
              </Button>
            </>
          )}
          {quote.status === 'accepted' && !quote.workOrderId && (
            <Dialog open={convertDialogOpen} onOpenChange={setConvertDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="sm" 
                  onClick={(e) => e.stopPropagation()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <ClipboardList className="w-4 h-4 mr-1" />
                  Konvertera till AO
                </Button>
              </DialogTrigger>
              <DialogContent onClick={(e) => e.stopPropagation()}>
                <DialogHeader>
                  <DialogTitle>Konvertera till arbetsorder</DialogTitle>
                  <DialogDescription>
                    Vill du konvertera offerten "{quote.title}" till en arbetsorder?
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm text-slate-600">
                    Detta skapar en ny arbetsorder med information från offerten. 
                    Offerten markeras som accepterad.
                  </p>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setConvertDialogOpen(false)}>
                    Avbryt
                  </Button>
                  <Button onClick={handleConvertToWorkOrder} className="bg-blue-600 hover:bg-blue-700">
                    Konvertera
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          {quote.status === 'rejected' && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={(e) => { e.stopPropagation(); navigate(`/quotes/${quote.id}/edit`); }}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Gör om offert
            </Button>
          )}
          {quote.workOrderId && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={(e) => { e.stopPropagation(); navigate(`/workorders/${quote.workOrderId}`); }}
            >
              <ClipboardList className="w-4 h-4 mr-1" />
              Visa arbetsorder
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
