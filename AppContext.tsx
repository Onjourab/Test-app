import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User, WorkOrder, Quote, Customer, Material, DashboardStats, TimeEntry, Travel } from '@/types';
import { 
  mockUsers, 
  mockWorkOrders, 
  mockQuotes, 
  mockCustomers, 
  mockMaterials,
  mockDashboardStats 
} from '@/data/mockData';

interface AppContextType {
  // Current user
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  
  // Data
  users: User[];
  workOrders: WorkOrder[];
  quotes: Quote[];
  customers: Customer[];
  materials: Material[];
  dashboardStats: DashboardStats;
  timeEntries: TimeEntry[];
  travels: Travel[];
  
  // Actions
  addWorkOrder: (workOrder: WorkOrder) => void;
  updateWorkOrder: (id: string, updates: Partial<WorkOrder>) => void;
  deleteWorkOrder: (id: string) => void;
  assignWorkOrder: (id: string, userId: string | undefined) => void;
  updateWorkOrderStatus: (id: string, status: WorkOrder['status']) => void;
  
  addQuote: (quote: Quote) => void;
  updateQuote: (id: string, updates: Partial<Quote>) => void;
  deleteQuote: (id: string) => void;
  convertQuoteToWorkOrder: (quoteId: string) => WorkOrder | null;
  
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  
  addMaterial: (material: Material) => void;
  updateMaterial: (id: string, updates: Partial<Material>) => void;
  deleteMaterial: (id: string) => void;
  
  refreshDashboardStats: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(mockUsers[0]);
  const [users] = useState<User[]>(mockUsers);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(mockWorkOrders);
  const [quotes, setQuotes] = useState<Quote[]>(mockQuotes);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [materials, setMaterials] = useState<Material[]>(mockMaterials);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>(mockDashboardStats);
  const [timeEntries] = useState<TimeEntry[]>([]);
  const [travels] = useState<Travel[]>([]);

  // Work Order Actions
  const addWorkOrder = useCallback((workOrder: WorkOrder) => {
    setWorkOrders(prev => [workOrder, ...prev]);
    refreshDashboardStats();
  }, []);

  const updateWorkOrder = useCallback((id: string, updates: Partial<WorkOrder>) => {
    setWorkOrders(prev => prev.map(wo => 
      wo.id === id ? { ...wo, ...updates, updatedAt: new Date() } : wo
    ));
    refreshDashboardStats();
  }, []);

  const deleteWorkOrder = useCallback((id: string) => {
    setWorkOrders(prev => prev.filter(wo => wo.id !== id));
    refreshDashboardStats();
  }, []);

  const assignWorkOrder = useCallback((id: string, userId: string | undefined) => {
    setWorkOrders(prev => prev.map(wo => {
      if (wo.id === id) {
        const assignedUser = userId ? users.find(u => u.id === userId) : undefined;
        return { 
          ...wo, 
          assignedTo: userId,
          assignedUser,
          status: userId ? 'taken' : 'available',
          updatedAt: new Date()
        };
      }
      return wo;
    }));
    refreshDashboardStats();
  }, [users]);

  const updateWorkOrderStatus = useCallback((id: string, status: WorkOrder['status']) => {
    setWorkOrders(prev => prev.map(wo => {
      if (wo.id === id) {
        const updates: Partial<WorkOrder> = { status, updatedAt: new Date() };
        if (status === 'started' && !wo.startedAt) {
          updates.startedAt = new Date();
        }
        if (status === 'completed' && !wo.completedAt) {
          updates.completedAt = new Date();
        }
        return { ...wo, ...updates };
      }
      return wo;
    }));
    refreshDashboardStats();
  }, []);

  // Quote Actions
  const addQuote = useCallback((quote: Quote) => {
    setQuotes(prev => [quote, ...prev]);
    refreshDashboardStats();
  }, []);

  const updateQuote = useCallback((id: string, updates: Partial<Quote>) => {
    setQuotes(prev => prev.map(q => 
      q.id === id ? { ...q, ...updates, updatedAt: new Date() } : q
    ));
    refreshDashboardStats();
  }, []);

  const deleteQuote = useCallback((id: string) => {
    setQuotes(prev => prev.filter(q => q.id !== id));
    refreshDashboardStats();
  }, []);

  const convertQuoteToWorkOrder = useCallback((quoteId: string): WorkOrder | null => {
    const quote = quotes.find(q => q.id === quoteId);
    if (!quote) return null;

    const newWorkOrder: WorkOrder = {
      id: `wo-${Date.now()}`,
      orderNumber: `WO-${new Date().getFullYear()}-${String(workOrders.length + 1).padStart(3, '0')}`,
      title: quote.title,
      description: quote.description,
      status: 'available',
      priority: 'medium',
      customerId: quote.customerId,
      customer: quote.customer,
      contactId: quote.contactId,
      contact: quote.contact,
      assignedTo: undefined,
      assignedUser: undefined,
      createdBy: currentUser?.id || '',
      createdByUser: currentUser!,
      createdAt: new Date(),
      updatedAt: new Date(),
      scheduledDate: undefined,
      startedAt: undefined,
      completedAt: undefined,
      estimatedHours: 0,
      actualHours: 0,
      materials: [],
      travels: [],
      timeEntries: [],
      images: [],
      documents: [],
      materialCost: 0,
      laborCost: 0,
      travelCost: 0,
      totalAmount: quote.totalAmount,
      quoteId: quote.id,
      fortnoxInvoiceId: undefined,
      isInvoiced: false,
      notes: '',
      internalNotes: '',
    };

    setWorkOrders(prev => [newWorkOrder, ...prev]);
    setQuotes(prev => prev.map(q => 
      q.id === quoteId ? { ...q, status: 'accepted' as const, workOrderId: newWorkOrder.id, workOrder: newWorkOrder } : q
    ));
    refreshDashboardStats();
    return newWorkOrder;
  }, [quotes, workOrders.length, currentUser]);

  // Customer Actions
  const addCustomer = useCallback((customer: Customer) => {
    setCustomers(prev => [customer, ...prev]);
  }, []);

  const updateCustomer = useCallback((id: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => 
      c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c
    ));
  }, []);

  const deleteCustomer = useCallback((id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  }, []);

  // Material Actions
  const addMaterial = useCallback((material: Material) => {
    setMaterials(prev => [material, ...prev]);
  }, []);

  const updateMaterial = useCallback((id: string, updates: Partial<Material>) => {
    setMaterials(prev => prev.map(m => 
      m.id === id ? { ...m, ...updates, updatedAt: new Date() } : m
    ));
  }, []);

  const deleteMaterial = useCallback((id: string) => {
    setMaterials(prev => prev.filter(m => m.id !== id));
  }, []);

  // Dashboard Stats
  const refreshDashboardStats = useCallback(() => {
    const stats: DashboardStats = {
      workOrders: {
        available: workOrders.filter(wo => wo.status === 'available').length,
        taken: workOrders.filter(wo => wo.status === 'taken').length,
        started: workOrders.filter(wo => wo.status === 'started').length,
        paused: workOrders.filter(wo => wo.status === 'paused').length,
        completed: workOrders.filter(wo => wo.status === 'completed').length,
        invoiced: workOrders.filter(wo => wo.status === 'invoiced').length,
        total: workOrders.length,
      },
      quotes: {
        draft: quotes.filter(q => q.status === 'draft').length,
        sent: quotes.filter(q => q.status === 'sent').length,
        accepted: quotes.filter(q => q.status === 'accepted').length,
        rejected: quotes.filter(q => q.status === 'rejected').length,
        total: quotes.length,
      },
      revenue: {
        thisMonth: workOrders
          .filter(wo => wo.isInvoiced && wo.invoiceDate && wo.invoiceDate.getMonth() === new Date().getMonth())
          .reduce((sum, wo) => sum + wo.totalAmount, 0),
        lastMonth: 0,
        thisYear: workOrders
          .filter(wo => wo.isInvoiced && wo.invoiceDate && wo.invoiceDate.getFullYear() === new Date().getFullYear())
          .reduce((sum, wo) => sum + wo.totalAmount, 0),
        pending: workOrders
          .filter(wo => wo.status === 'completed' && !wo.isInvoiced)
          .reduce((sum, wo) => sum + wo.totalAmount, 0),
      },
      recentWorkOrders: workOrders.slice(0, 5),
      recentQuotes: quotes.slice(0, 3),
      upcomingWorkOrders: workOrders.filter(wo => 
        wo.status === 'available' || wo.status === 'taken' || wo.status === 'started'
      ),
    };
    setDashboardStats(stats);
  }, [workOrders, quotes]);

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      users,
      workOrders,
      quotes,
      customers,
      materials,
      dashboardStats,
      timeEntries,
      travels,
      addWorkOrder,
      updateWorkOrder,
      deleteWorkOrder,
      assignWorkOrder,
      updateWorkOrderStatus,
      addQuote,
      updateQuote,
      deleteQuote,
      convertQuoteToWorkOrder,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addMaterial,
      updateMaterial,
      deleteMaterial,
      refreshDashboardStats,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
