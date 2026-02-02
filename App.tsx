import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from '@/contexts/AppContext';
import { Layout } from '@/components/layout/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { WorkOrderList } from '@/pages/WorkOrders/List';
import { WorkOrderDetail } from '@/pages/WorkOrders/Detail';
import { WorkOrderForm } from '@/pages/WorkOrders/Form';
import { QuoteList } from '@/pages/Quotes/List';
import { QuoteDetail } from '@/pages/Quotes/Detail';
import { CustomerList } from '@/pages/Customers/List';
import { MaterialList } from '@/pages/Materials/List';
import { TimeTravel } from '@/pages/TimeTravel/TimeTravel';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* Dashboard */}
            <Route path="/" element={<Dashboard />} />
            
            {/* Work Orders */}
            <Route path="/workorders" element={<WorkOrderList />} />
            <Route path="/workorders/new" element={<WorkOrderForm />} />
            <Route path="/workorders/:id" element={<WorkOrderDetail />} />
            <Route path="/workorders/:id/edit" element={<WorkOrderForm />} />
            
            {/* Quotes */}
            <Route path="/quotes" element={<QuoteList />} />
            <Route path="/quotes/new" element={<div className="p-8 text-center">Ny offert - Kommer snart</div>} />
            <Route path="/quotes/:id" element={<QuoteDetail />} />
            <Route path="/quotes/:id/edit" element={<div className="p-8 text-center">Redigera offert - Kommer snart</div>} />
            
            {/* Customers */}
            <Route path="/customers" element={<CustomerList />} />
            <Route path="/customers/new" element={<div className="p-8 text-center">Ny kund - Kommer snart</div>} />
            <Route path="/customers/:id" element={<div className="p-8 text-center">Kunddetaljer - Kommer snart</div>} />
            <Route path="/customers/:id/edit" element={<div className="p-8 text-center">Redigera kund - Kommer snart</div>} />
            
            {/* Contacts */}
            <Route path="/contacts" element={<div className="p-8 text-center">Kontakter - Kommer snart</div>} />
            
            {/* Materials */}
            <Route path="/materials" element={<MaterialList />} />
            <Route path="/materials/new" element={<div className="p-8 text-center">Nytt material - Kommer snart</div>} />
            <Route path="/materials/:id" element={<div className="p-8 text-center">Materialdetaljer - Kommer snart</div>} />
            
            {/* Time & Travel */}
            <Route path="/timetravel" element={<TimeTravel />} />
            
            {/* Reports */}
            <Route path="/reports" element={<div className="p-8 text-center">Rapporter - Kommer snart</div>} />
            
            {/* Settings */}
            <Route path="/settings" element={<div className="p-8 text-center">Inställningar - Kommer snart</div>} />
            <Route path="/settings/profile" element={<div className="p-8 text-center">Profil - Kommer snart</div>} />
            
            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
        <Toaster />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
