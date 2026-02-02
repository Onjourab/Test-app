import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/common/StatusBadge';
import { formatCurrency, formatDate, formatDateTime } from '@/data/mockData';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Play,
  Pause,
  CheckCircle,
  FileText,
  Building2,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Package,
  Image,
  MoreVertical,
  Timer,
  Flag,
  Plus,
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function WorkOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { workOrders, currentUser, assignWorkOrder, updateWorkOrderStatus } = useApp();
  const [activeTab, setActiveTab] = useState('info');
  const [timeDialogOpen, setTimeDialogOpen] = useState(false);
  const [materialDialogOpen, setMaterialDialogOpen] = useState(false);

  const workOrder = workOrders.find(wo => wo.id === id);

  if (!workOrder) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-slate-900">Arbetsorder hittades inte</h2>
        <p className="text-slate-500 mt-2">Arbetsordern du letar efter finns inte.</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate('/workorders')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Tillbaka till lista
        </Button>
      </div>
    );
  }

  const handleTakeOrder = () => {
    if (currentUser) {
      assignWorkOrder(workOrder.id, currentUser.id);
    }
  };

  const handleStartWork = () => {
    updateWorkOrderStatus(workOrder.id, 'started');
  };

  const handlePauseWork = () => {
    updateWorkOrderStatus(workOrder.id, 'paused');
  };

  const handleCompleteWork = () => {
    updateWorkOrderStatus(workOrder.id, 'completed');
  };

  const handleCreateInvoice = () => {
    updateWorkOrderStatus(workOrder.id, 'invoiced');
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-slate-100 text-slate-700',
      medium: 'bg-blue-100 text-blue-700',
      high: 'bg-orange-100 text-orange-700',
      urgent: 'bg-red-100 text-red-700',
    };
    return colors[priority] || colors.medium;
  };

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      low: 'Låg',
      medium: 'Medium',
      high: 'Hög',
      urgent: 'Akut',
    };
    return labels[priority] || priority;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/workorders')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-slate-500">{workOrder.orderNumber}</span>
              <StatusBadge status={workOrder.status} size="sm" />
              <Badge variant="outline" className={getPriorityColor(workOrder.priority)}>
                <Flag className="w-3 h-3 mr-1" />
                {getPriorityLabel(workOrder.priority)}
              </Badge>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">{workOrder.title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate(`/workorders/${workOrder.id}/edit`)}>
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
              <DropdownMenuItem onClick={() => navigate(`/workorders/${workOrder.id}/edit`)}>
                <Edit className="w-4 h-4 mr-2" />
                Redigera
              </DropdownMenuItem>
              {workOrder.quoteId && (
                <DropdownMenuItem onClick={() => navigate(`/quotes/${workOrder.quoteId}`)}>
                  <FileText className="w-4 h-4 mr-2" />
                  Visa offert
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
        {workOrder.status === 'available' && (
          <Button onClick={handleTakeOrder} className="bg-blue-600 hover:bg-blue-700">
            Ta arbetsorder
          </Button>
        )}
        {workOrder.status === 'taken' && (
          <Button onClick={handleStartWork} className="bg-green-600 hover:bg-green-700">
            <Play className="w-4 h-4 mr-2" />
            Starta arbete
          </Button>
        )}
        {workOrder.status === 'started' && (
          <>
            <Button variant="outline" onClick={handlePauseWork}>
              <Pause className="w-4 h-4 mr-2" />
              Pausa
            </Button>
            <Button onClick={handleCompleteWork} className="bg-emerald-600 hover:bg-emerald-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              Avsluta arbete
            </Button>
          </>
        )}
        {workOrder.status === 'paused' && (
          <Button onClick={handleStartWork} className="bg-blue-600 hover:bg-blue-700">
            <Play className="w-4 h-4 mr-2" />
            Fortsätt arbete
          </Button>
        )}
        {workOrder.status === 'completed' && !workOrder.isInvoiced && (
          <Button onClick={handleCreateInvoice} className="bg-violet-600 hover:bg-violet-700">
            <FileText className="w-4 h-4 mr-2" />
            Skapa faktura
          </Button>
        )}
        {workOrder.isInvoiced && (
          <Badge variant="outline" className="text-violet-600 border-violet-200 px-3 py-1">
            <FileText className="w-4 h-4 mr-2" />
            Fakturerad
          </Badge>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="info">Information</TabsTrigger>
          <TabsTrigger value="materials">Material</TabsTrigger>
          <TabsTrigger value="time">Tid & Resor</TabsTrigger>
          <TabsTrigger value="images">Bilder</TabsTrigger>
          <TabsTrigger value="notes">Anteckningar</TabsTrigger>
        </TabsList>

        {/* Info Tab */}
        <TabsContent value="info" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Work Order Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Arbetsorder-info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-500">Status</Label>
                    <div className="mt-1">
                      <StatusBadge status={workOrder.status} />
                    </div>
                  </div>
                  <div>
                    <Label className="text-slate-500">Prioritet</Label>
                    <div className="mt-1">
                      <Badge variant="outline" className={getPriorityColor(workOrder.priority)}>
                        {getPriorityLabel(workOrder.priority)}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-slate-500">Skapad</Label>
                  <p className="text-sm">{formatDateTime(workOrder.createdAt)}</p>
                </div>
                <div>
                  <Label className="text-slate-500">Skapad av</Label>
                  <p className="text-sm">{workOrder.createdByUser.fullName}</p>
                </div>
                {workOrder.scheduledDate && (
                  <div>
                    <Label className="text-slate-500">Planerat datum</Label>
                    <p className="text-sm flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {formatDate(workOrder.scheduledDate)}
                    </p>
                  </div>
                )}
                {workOrder.startedAt && (
                  <div>
                    <Label className="text-slate-500">Startad</Label>
                    <p className="text-sm">{formatDateTime(workOrder.startedAt)}</p>
                  </div>
                )}
                {workOrder.completedAt && (
                  <div>
                    <Label className="text-slate-500">Avslutad</Label>
                    <p className="text-sm">{formatDateTime(workOrder.completedAt)}</p>
                  </div>
                )}
                <div>
                  <Label className="text-slate-500">Tilldelad</Label>
                  <p className="text-sm">
                    {workOrder.assignedUser ? workOrder.assignedUser.fullName : 'Ej tilldelad'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Kund</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-slate-500">Företag/Namn</Label>
                  <p className="text-sm font-medium flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    {workOrder.customer.name}
                  </p>
                </div>
                {workOrder.contact && (
                  <div>
                    <Label className="text-slate-500">Kontaktperson</Label>
                    <p className="text-sm flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      {workOrder.contact.fullName}
                    </p>
                  </div>
                )}
                <div>
                  <Label className="text-slate-500">Adress</Label>
                  <p className="text-sm flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                    <span>
                      {workOrder.customer.address.street}<br />
                      {workOrder.customer.address.postalCode} {workOrder.customer.address.city}
                    </span>
                  </p>
                </div>
                <div>
                  <Label className="text-slate-500">E-post</Label>
                  <p className="text-sm flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <a href={`mailto:${workOrder.customer.email}`} className="text-blue-600 hover:underline">
                      {workOrder.customer.email}
                    </a>
                  </p>
                </div>
                <div>
                  <Label className="text-slate-500">Telefon</Label>
                  <p className="text-sm flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <a href={`tel:${workOrder.customer.phone}`} className="text-blue-600 hover:underline">
                      {workOrder.customer.phone}
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Cost Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Kostnadssammanställning</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Material</span>
                  <span className="font-medium">{formatCurrency(workOrder.materialCost)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Arbete</span>
                  <span className="font-medium">{formatCurrency(workOrder.laborCost)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Resor</span>
                  <span className="font-medium">{formatCurrency(workOrder.travelCost)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Totalt</span>
                    <span className="font-bold text-lg">{formatCurrency(workOrder.totalAmount)}</span>
                  </div>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Beräknad tid</span>
                    <span>{workOrder.estimatedHours}h</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Faktisk tid</span>
                    <span>{workOrder.actualHours}h</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Beskrivning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 whitespace-pre-wrap">{workOrder.description}</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Materials Tab */}
        <TabsContent value="materials" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Material</h2>
            <Dialog open={materialDialogOpen} onOpenChange={setMaterialDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Lägg till material
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Lägg till material</DialogTitle>
                  <DialogDescription>
                    Välj material att lägga till i arbetsordern.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label>Sök material</Label>
                    <Input placeholder="Sök artikelnummer eller namn..." />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setMaterialDialogOpen(false)}>
                    Avbryt
                  </Button>
                  <Button>Lägg till</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {workOrder.materials.length > 0 ? (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Artikel</TableHead>
                    <TableHead>Namn</TableHead>
                    <TableHead>Antal</TableHead>
                    <TableHead>Pris/st</TableHead>
                    <TableHead className="text-right">Totalt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workOrder.materials.map(material => (
                    <TableRow key={material.id}>
                      <TableCell className="font-mono text-sm">{material.material.articleNumber}</TableCell>
                      <TableCell>{material.material.name}</TableCell>
                      <TableCell>{material.quantity} {material.material.unit}</TableCell>
                      <TableCell>{formatCurrency(material.unitPrice)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(material.totalPrice)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          ) : (
            <Card className="bg-slate-50 border-dashed">
              <CardContent className="p-8 text-center">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">Inget material tillagt ännu</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setMaterialDialogOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Lägg till material
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Time Tab */}
        <TabsContent value="time" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Tid & Resor</h2>
            <Dialog open={timeDialogOpen} onOpenChange={setTimeDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Timer className="w-4 h-4 mr-2" />
                  Registrera tid
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Registrera tid</DialogTitle>
                  <DialogDescription>
                    Registrera arbetad tid för denna arbetsorder.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label>Datum</Label>
                    <Input type="date" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Starttid</Label>
                      <Input type="time" />
                    </div>
                    <div>
                      <Label>Sluttid</Label>
                      <Input type="time" />
                    </div>
                  </div>
                  <div>
                    <Label>Rast (minuter)</Label>
                    <Input type="number" placeholder="60" />
                  </div>
                  <div>
                    <Label>Anteckningar</Label>
                    <Textarea placeholder="Beskriv vad som gjordes..." />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setTimeDialogOpen(false)}>
                    Avbryt
                  </Button>
                  <Button>Spara</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Time Entries */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tidregistreringar</CardTitle>
            </CardHeader>
            <CardContent>
              {workOrder.timeEntries.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Datum</TableHead>
                      <TableHead>Användare</TableHead>
                      <TableHead>Tid</TableHead>
                      <TableHead>Anteckningar</TableHead>
                      <TableHead className="text-right">Kostnad</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workOrder.timeEntries.map(entry => (
                      <TableRow key={entry.id}>
                        <TableCell>{formatDate(entry.date)}</TableCell>
                        <TableCell>{entry.user.fullName}</TableCell>
                        <TableCell>{Math.floor(entry.totalMinutes / 60)}h {entry.totalMinutes % 60}m</TableCell>
                        <TableCell>{entry.notes || '-'}</TableCell>
                        <TableCell className="text-right">{formatCurrency(entry.totalCost)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-slate-500 py-4">Inga tidregistreringar ännu</p>
              )}
            </CardContent>
          </Card>

          {/* Travels */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resor</CardTitle>
            </CardHeader>
            <CardContent>
              {workOrder.travels.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Datum</TableHead>
                      <TableHead>Användare</TableHead>
                      <TableHead>Sträcka</TableHead>
                      <TableHead>Tid</TableHead>
                      <TableHead className="text-right">Kostnad</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workOrder.travels.map(travel => (
                      <TableRow key={travel.id}>
                        <TableCell>{formatDate(travel.date)}</TableCell>
                        <TableCell>{travel.user.fullName}</TableCell>
                        <TableCell>{travel.distanceKm} km</TableCell>
                        <TableCell>{travel.travelTimeMinutes} min</TableCell>
                        <TableCell className="text-right">{formatCurrency(travel.cost)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-slate-500 py-4">Inga resor registrerade ännu</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Images Tab */}
        <TabsContent value="images" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Bilder</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Ladda upp bild
            </Button>
          </div>

          {workOrder.images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {workOrder.images.map(image => (
                <Card key={image.id} className="overflow-hidden">
                  <img 
                    src={image.url} 
                    alt={image.caption || 'Arbetsorder bild'} 
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-3">
                    <p className="text-sm font-medium truncate">{image.caption || 'Bild'}</p>
                    <p className="text-xs text-slate-500">{formatDate(image.uploadedAt)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-slate-50 border-dashed">
              <CardContent className="p-8 text-center">
                <Image className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">Inga bilder uppladdade ännu</p>
                <Button variant="outline" className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Ladda upp bild
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Anteckningar</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Lägg till anteckningar om arbetsordern..."
                className="min-h-[200px]"
                defaultValue={workOrder.notes || ''}
              />
              <div className="mt-4 flex justify-end">
                <Button>Spara anteckningar</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Interna anteckningar</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Interna anteckningar (syns inte för kund)..."
                className="min-h-[150px]"
                defaultValue={workOrder.internalNotes || ''}
              />
              <div className="mt-4 flex justify-end">
                <Button>Spara interna anteckningar</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
