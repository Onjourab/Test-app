import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { StatsCard } from '@/components/cards/StatsCard';
import { WorkOrderCard } from '@/components/cards/WorkOrderCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ClipboardList, 
  FileText, 
  Building2, 
  Package,
  TrendingUp,
  Clock,
  AlertCircle,
  Plus,
  ArrowRight,
  Calendar,
  Banknote,
} from 'lucide-react';
import { formatCurrency } from '@/data/mockData';

export function Dashboard() {
  const navigate = useNavigate();
  const { dashboardStats, workOrders, quotes } = useApp();

  // Get upcoming work orders (next 7 days)
  const upcomingWorkOrders = workOrders
    .filter(wo => wo.scheduledDate && wo.scheduledDate >= new Date() && wo.status !== 'completed' && wo.status !== 'invoiced')
    .sort((a, b) => (a.scheduledDate?.getTime() || 0) - (b.scheduledDate?.getTime() || 0))
    .slice(0, 5);

  // Get work orders requiring attention
  const attentionWorkOrders = workOrders.filter(wo => 
    wo.status === 'available' || wo.status === 'paused'
  );

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Välkommen tillbaka!</h1>
          <p className="text-slate-500">Här är en översikt över din verksamhet idag.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate('/reports')}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Rapporter
          </Button>
          <Button 
            onClick={() => navigate('/workorders/new')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ny arbetsorder
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Lediga arbetsordrar"
          value={dashboardStats.workOrders.available}
          subtitle="Väntar på tilldelning"
          icon={ClipboardList}
          color="blue"
          onClick={() => navigate('/workorders?status=available')}
        />
        <StatsCard
          title="Pågående arbete"
          value={dashboardStats.workOrders.started + dashboardStats.workOrders.taken}
          subtitle="Aktiva jobb just nu"
          icon={Clock}
          color="amber"
          onClick={() => navigate('/workorders?status=started,taken')}
        />
        <StatsCard
          title="Skickade offerter"
          value={dashboardStats.quotes.sent}
          subtitle="Väntar på svar"
          icon={FileText}
          color="purple"
          onClick={() => navigate('/quotes?status=sent')}
        />
        <StatsCard
          title="Intäkt denna månad"
          value={formatCurrency(dashboardStats.revenue.thisMonth)}
          subtitle={`${formatCurrency(dashboardStats.revenue.pending)} väntar på fakturering`}
          icon={Banknote}
          color="green"
          onClick={() => navigate('/reports')}
        />
      </div>

      {/* Status Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Statusöversikt</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{dashboardStats.workOrders.available}</div>
              <div className="text-sm text-green-700">Lediga</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">{dashboardStats.workOrders.taken}</div>
              <div className="text-sm text-amber-700">Tagna</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{dashboardStats.workOrders.started}</div>
              <div className="text-sm text-blue-700">Påbörjade</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{dashboardStats.workOrders.paused}</div>
              <div className="text-sm text-orange-700">Pausade</div>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600">{dashboardStats.workOrders.completed}</div>
              <div className="text-sm text-emerald-700">Avslutade</div>
            </div>
            <div className="text-center p-4 bg-violet-50 rounded-lg">
              <div className="text-2xl font-bold text-violet-600">{dashboardStats.workOrders.invoiced}</div>
              <div className="text-sm text-violet-700">Fakturerade</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Work Orders */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Kommande arbetsordrar</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/workorders')}>
              Visa alla
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          {upcomingWorkOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingWorkOrders.map(workOrder => (
                <WorkOrderCard key={workOrder.id} workOrder={workOrder} compact />
              ))}
            </div>
          ) : (
            <Card className="bg-slate-50 border-dashed">
              <CardContent className="p-8 text-center">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">Inga kommande arbetsordrar</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => navigate('/workorders/new')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Skapa ny
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Attention Required */}
          {attentionWorkOrders.length > 0 && (
            <Card className="border-amber-200 bg-amber-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  Kräver åtgärd
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {attentionWorkOrders.slice(0, 3).map(workOrder => (
                  <div 
                    key={workOrder.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg cursor-pointer hover:shadow-sm transition-shadow"
                    onClick={() => navigate(`/workorders/${workOrder.id}`)}
                  >
                    <div>
                      <p className="font-medium text-sm">{workOrder.title}</p>
                      <p className="text-xs text-slate-500">{workOrder.customer.name}</p>
                    </div>
                    <Badge variant={workOrder.status === 'available' ? 'default' : 'secondary'}>
                      {workOrder.status === 'available' ? 'Ledig' : 'Pausad'}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Recent Quotes */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Senaste offerter</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate('/quotes')}>
                  Visa alla
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {quotes.slice(0, 3).map(quote => (
                <div 
                  key={quote.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => navigate(`/quotes/${quote.id}`)}
                >
                  <div>
                    <p className="font-medium text-sm">{quote.title}</p>
                    <p className="text-xs text-slate-500">{quote.customer.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{formatCurrency(quote.totalAmount)}</p>
                    <p className="text-xs text-slate-400">{quote.status}</p>
                  </div>
                </div>
              ))}
              {quotes.length === 0 && (
                <p className="text-center text-slate-500 py-4">Inga offerter ännu</p>
              )}
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">Snabblänkar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => navigate('/workorders/new')}
              >
                <ClipboardList className="w-4 h-4 mr-2 text-blue-600" />
                Ny arbetsorder
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => navigate('/quotes/new')}
              >
                <FileText className="w-4 h-4 mr-2 text-green-600" />
                Ny offert
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => navigate('/customers/new')}
              >
                <Building2 className="w-4 h-4 mr-2 text-purple-600" />
                Nytt företag
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => navigate('/materials/new')}
              >
                <Package className="w-4 h-4 mr-2 text-orange-600" />
                Nytt material
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
