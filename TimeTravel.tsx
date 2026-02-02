import { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  ChevronLeft,
  ChevronRight,
  Clock,
  Car,
  Plus,
  User,
  MapPin,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export function TimeTravel() {
  const { workOrders, users, timeEntries, travels } = useApp();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('week');
  const [timeDialogOpen, setTimeDialogOpen] = useState(false);

  // Get week dates
  const getWeekDates = (date: Date) => {
    const week = [];
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    
    for (let i = 0; i < 5; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      week.push(d);
    }
    return week;
  };

  const weekDates = getWeekDates(currentWeek);
  const weekNumber = Math.ceil((currentWeek.getTime() - new Date(currentWeek.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));

  // Navigate weeks
  const prevWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeek(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeek(newDate);
  };

  // Filter time entries
  const filteredTimeEntries = useMemo(() => {
    return timeEntries.filter(entry => {
      if (selectedUser !== 'all' && entry.userId !== selectedUser) return false;
      return true;
    });
  }, [timeEntries, selectedUser]);

  // Calculate totals
  const totalHours = filteredTimeEntries.reduce((sum: number, entry: { totalMinutes: number }) => sum + entry.totalMinutes / 60, 0);
  const totalTravelKm = travels.reduce((sum: number, t: { distanceKm: number }) => sum + t.distanceKm, 0);
  const totalTravelCost = travels.reduce((sum: number, t: { cost: number }) => sum + t.cost, 0);

  // Get work orders for a specific date
  const getWorkOrdersForDate = (date: Date) => {
    return workOrders.filter(wo => {
      if (!wo.scheduledDate) return false;
      return wo.scheduledDate.toDateString() === date.toDateString();
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tid & Resor</h1>
          <p className="text-slate-500">Registrera och följ upp arbetad tid och resor</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={timeDialogOpen} onOpenChange={setTimeDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Registrera tid
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrera tid</DialogTitle>
                <DialogDescription>
                  Registrera arbetad tid för en arbetsorder.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>Arbetsorder</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Välj arbetsorder" />
                    </SelectTrigger>
                    <SelectContent>
                      {workOrders.filter(wo => wo.status !== 'invoiced').map(wo => (
                        <SelectItem key={wo.id} value={wo.id}>
                          {wo.orderNumber} - {wo.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Datum</Label>
                  <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
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
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total arbetad tid</p>
                <p className="text-2xl font-bold">{Math.floor(totalHours)}h {Math.round((totalHours % 1) * 60)}m</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total körsträcka</p>
                <p className="text-2xl font-bold">{totalTravelKm} km</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Totala resekostnader</p>
                <p className="text-2xl font-bold">{formatCurrency(totalTravelCost)}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="week">Veckovy</TabsTrigger>
          <TabsTrigger value="entries">Tidregistreringar</TabsTrigger>
          <TabsTrigger value="travels">Resor</TabsTrigger>
        </TabsList>

        {/* Week View */}
        <TabsContent value="week" className="space-y-4">
          {/* Week Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={prevWeek}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div>
                <h2 className="text-lg font-semibold">Vecka {weekNumber}</h2>
                <p className="text-sm text-slate-500">
                  {formatDate(weekDates[0])} - {formatDate(weekDates[4])}
                </p>
              </div>
              <Button variant="outline" size="icon" onClick={nextWeek}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className="w-48">
                <User className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Välj användare" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alla användare</SelectItem>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id}>{user.fullName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Week Grid */}
          <div className="grid grid-cols-5 gap-4">
            {weekDates.map((date, index) => {
              const dayWorkOrders = getWorkOrdersForDate(date);
              const dayNames = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre'];
              const isToday = date.toDateString() === new Date().toDateString();
              
              return (
                <Card key={index} className={isToday ? 'border-blue-300 ring-1 ring-blue-300' : ''}>
                  <CardHeader className="pb-3">
                    <div className="text-center">
                      <p className="text-sm text-slate-500">{dayNames[index]}</p>
                      <p className={`text-lg font-semibold ${isToday ? 'text-blue-600' : ''}`}>
                        {date.getDate()}/{date.getMonth() + 1}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {dayWorkOrders.length > 0 ? (
                      dayWorkOrders.map(wo => (
                        <div 
                          key={wo.id}
                          className="p-2 bg-slate-50 rounded text-sm cursor-pointer hover:bg-slate-100"
                          onClick={() => {}}
                        >
                          <p className="font-medium truncate">{wo.title}</p>
                          <p className="text-xs text-slate-500">{wo.customer.name}</p>
                          <span 
                            className={
                              `inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                              wo.status === 'started' ? 'border-green-300 text-green-700' :
                              wo.status === 'completed' ? 'border-blue-300 text-blue-700' :
                              'border-slate-300 text-slate-600'
                              }`
                            }
                          >
                            {wo.status === 'started' ? 'Pågår' :
                             wo.status === 'completed' ? 'Klar' : wo.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-sm text-slate-400 py-4">Inga jobb</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Time Entries */}
        <TabsContent value="entries">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Datum</TableHead>
                  <TableHead>Användare</TableHead>
                  <TableHead>Arbetsorder</TableHead>
                  <TableHead>Tid</TableHead>
                  <TableHead>Anteckningar</TableHead>
                  <TableHead className="text-right">Kostnad</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTimeEntries.length > 0 ? (
                  filteredTimeEntries.map((entry: { id: string; date: Date; userId: string; user: { firstName: string; lastName: string; fullName: string }; workOrderId: string; totalMinutes: number; notes?: string; totalCost: number }) => (
                    <TableRow key={entry.id}>
                      <TableCell>{formatDate(entry.date)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700">
                            {entry.user.firstName[0]}{entry.user.lastName[0]}
                          </div>
                          {entry.user.fullName}
                        </div>
                      </TableCell>
                      <TableCell>
                        {workOrders.find(wo => wo.id === entry.workOrderId)?.title || '-'}
                      </TableCell>
                      <TableCell>
                        {Math.floor(entry.totalMinutes / 60)}h {entry.totalMinutes % 60}m
                      </TableCell>
                      <TableCell>{entry.notes || '-'}</TableCell>
                      <TableCell className="text-right">{formatCurrency(entry.totalCost)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                      Inga tidregistreringar hittades
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Travels */}
        <TabsContent value="travels">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Datum</TableHead>
                  <TableHead>Användare</TableHead>
                  <TableHead>Arbetsorder</TableHead>
                  <TableHead>Sträcka</TableHead>
                  <TableHead>Restid</TableHead>
                  <TableHead className="text-right">Kostnad</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {travels.length > 0 ? (
                  travels.map((travel: { id: string; date: Date; userId: string; user: { firstName: string; lastName: string; fullName: string }; workOrderId: string; distanceKm: number; travelTimeMinutes: number; cost: number }) => (
                    <TableRow key={travel.id}>
                      <TableCell>{formatDate(travel.date)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700">
                            {travel.user.firstName[0]}{travel.user.lastName[0]}
                          </div>
                          {travel.user.fullName}
                        </div>
                      </TableCell>
                      <TableCell>
                        {workOrders.find(wo => wo.id === travel.workOrderId)?.title || '-'}
                      </TableCell>
                      <TableCell>{travel.distanceKm} km</TableCell>
                      <TableCell>{travel.travelTimeMinutes} min</TableCell>
                      <TableCell className="text-right">{formatCurrency(travel.cost)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                      Inga resor registrerade
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
