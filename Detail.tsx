import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/common/StatusBadge';
import { formatCurrency, formatDate } from '@/data/mockData';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Send,
  CheckCircle,
  XCircle,
  RotateCcw,
  ClipboardList,
  Building2,
  User,
  Mail,
  Phone,
  Calendar,
  Download,
  Printer,
  MoreVertical,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';

export function QuoteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { quotes, updateQuote, convertQuoteToWorkOrder } = useApp();
  const [convertDialogOpen, setConvertDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const quote = quotes.find(q => q.id === id);

  if (!quote) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-slate-900">Offert hittades inte</h2>
        <p className="text-slate-500 mt-2">Offerten du letar efter finns inte.</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate('/quotes')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Tillbaka till lista
        </Button>
      </div>
    );
  }

  const handleSendQuote = () => {
    updateQuote(quote.id, { status: 'sent', sentAt: new Date() });
  };

  const handleAcceptQuote = () => {
    updateQuote(quote.id, { status: 'accepted', acceptedAt: new Date() });
  };

  const handleRejectQuote = () => {
    updateQuote(quote.id, { 
      status: 'rejected', 
      rejectedAt: new Date(),
      rejectionReason: rejectReason 
    });
    setRejectDialogOpen(false);
    setRejectReason('');
  };

  const handleConvertToWorkOrder = () => {
    const workOrder = convertQuoteToWorkOrder(quote.id);
    if (workOrder) {
      navigate(`/workorders/${workOrder.id}`);
    }
    setConvertDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/quotes')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-slate-500">{quote.quoteNumber}</span>
              <StatusBadge status={quote.status} size="sm" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">{quote.title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate(`/quotes/${quote.id}/edit`)}>
            <Edit className="w-4 h-4 mr-2" />
            Redigera
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                Ladda ner PDF
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Printer className="w-4 h-4 mr-2" />
                Skriv ut
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="w-4 h-4 mr-2" />
                Skicka e-post
              </DropdownMenuItem>
              {quote.workOrderId && (
                <DropdownMenuItem onClick={() => navigate(`/workorders/${quote.workOrderId}`)}>
                  <ClipboardList className="w-4 h-4 mr-2" />
                  Visa arbetsorder
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Ta bort
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        {quote.status === 'draft' && (
          <>
            <Button variant="outline" onClick={() => navigate(`/quotes/${quote.id}/edit`)}>
              <Edit className="w-4 h-4 mr-2" />
              Redigera
            </Button>
            <Button onClick={handleSendQuote} className="bg-blue-600 hover:bg-blue-700">
              <Send className="w-4 h-4 mr-2" />
              Skicka offert
            </Button>
          </>
        )}
        {quote.status === 'sent' && (
          <>
            <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                  <XCircle className="w-4 h-4 mr-2" />
                  Markera avslagen
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Markera offert som avslagen</DialogTitle>
                  <DialogDescription>
                    Ange varför offerten avslogs. Detta hjälper dig att förbättra framtida offerter.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Textarea
                    placeholder="Anledning till avslag..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                    Avbryt
                  </Button>
                  <Button onClick={handleRejectQuote} variant="destructive">
                    Markera avslagen
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button onClick={handleAcceptQuote} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              Markera accepterad
            </Button>
          </>
        )}
        {quote.status === 'accepted' && !quote.workOrderId && (
          <Dialog open={convertDialogOpen} onOpenChange={setConvertDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <ClipboardList className="w-4 h-4 mr-2" />
                Konvertera till arbetsorder
              </Button>
            </DialogTrigger>
            <DialogContent>
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
        {quote.workOrderId && (
          <Button variant="outline" onClick={() => navigate(`/workorders/${quote.workOrderId}`)}>
            <ClipboardList className="w-4 h-4 mr-2" />
            Visa arbetsorder
          </Button>
        )}
        {quote.status === 'rejected' && (
          <Button variant="outline" onClick={() => navigate(`/quotes/${quote.id}/edit`)}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Gör om offert
          </Button>
        )}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quote Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Offertposter</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Beskrivning</TableHead>
                    <TableHead className="text-right">Antal</TableHead>
                    <TableHead className="text-right">Á-pris</TableHead>
                    <TableHead className="text-right">Totalt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quote.items.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">{item.quantity} {item.unit}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(item.totalPrice)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Summary */}
              <div className="mt-6 border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Delsumma</span>
                    <span>{formatCurrency(quote.subtotal)}</span>
                  </div>
                  {quote.discountAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Rabatt ({quote.discountPercent}%)</span>
                      <span className="text-red-600">-{formatCurrency(quote.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Moms ({quote.vatPercent}%)</span>
                    <span>{formatCurrency(quote.vatAmount)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-semibold">Totalt att betala</span>
                    <span className="font-bold text-lg">{formatCurrency(quote.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Beskrivning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 whitespace-pre-wrap">{quote.description}</p>
            </CardContent>
          </Card>

          {/* Notes */}
          {quote.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Anteckningar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 whitespace-pre-wrap">{quote.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Rejection Reason */}
          {quote.rejectionReason && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-lg text-red-700">Anledning till avslag</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-700">{quote.rejectionReason}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quote Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Offertinformation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-slate-500 text-sm">Status</span>
                <div className="mt-1">
                  <StatusBadge status={quote.status} />
                </div>
              </div>
              <div>
                <span className="text-slate-500 text-sm">Skapad</span>
                <p className="text-sm">{formatDate(quote.createdAt)}</p>
              </div>
              <div>
                <span className="text-slate-500 text-sm">Skapad av</span>
                <p className="text-sm">{quote.createdByUser.fullName}</p>
              </div>
              <div>
                <span className="text-slate-500 text-sm">Giltig till</span>
                <p className="text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {formatDate(quote.validUntil)}
                </p>
              </div>
              {quote.sentAt && (
                <div>
                  <span className="text-slate-500 text-sm">Skickad</span>
                  <p className="text-sm">{formatDate(quote.sentAt)}</p>
                </div>
              )}
              {quote.acceptedAt && (
                <div>
                  <span className="text-slate-500 text-sm">Accepterad</span>
                  <p className="text-sm">{formatDate(quote.acceptedAt)}</p>
                </div>
              )}
              {quote.rejectedAt && (
                <div>
                  <span className="text-slate-500 text-sm">Avslagen</span>
                  <p className="text-sm">{formatDate(quote.rejectedAt)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Kund</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-slate-500 text-sm">Företag/Namn</span>
                <p className="text-sm font-medium flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  {quote.customer.name}
                </p>
              </div>
              {quote.contact && (
                <div>
                  <span className="text-slate-500 text-sm">Kontaktperson</span>
                  <p className="text-sm flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    {quote.contact.fullName}
                  </p>
                </div>
              )}
              <div>
                <span className="text-slate-500 text-sm">E-post</span>
                <p className="text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <a href={`mailto:${quote.customer.email}`} className="text-blue-600 hover:underline">
                    {quote.customer.email}
                  </a>
                </p>
              </div>
              <div>
                <span className="text-slate-500 text-sm">Telefon</span>
                <p className="text-sm flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <a href={`tel:${quote.customer.phone}`} className="text-blue-600 hover:underline">
                    {quote.customer.phone}
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Total */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-blue-600 mb-1">Totalt belopp</p>
                <p className="text-3xl font-bold text-blue-700">{formatCurrency(quote.totalAmount)}</p>
                <p className="text-xs text-blue-500 mt-1">Inkl. moms</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
