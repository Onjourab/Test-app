// ============================================
// WorkFlow Pro - Type Definitions
// ============================================

// ============================================
// Enums & Constants
// ============================================

export type WorkOrderStatus = 
  | 'available' 
  | 'taken' 
  | 'started' 
  | 'paused' 
  | 'completed' 
  | 'invoiced';

export type QuoteStatus = 
  | 'draft' 
  | 'sent' 
  | 'accepted' 
  | 'rejected' 
  | 'revised';

export type CustomerType = 'company' | 'private';

export type SupplierType = 'ahlsell' | 'copiax' | 'custom';

export type UserRole = 'admin' | 'manager' | 'technician';

// ============================================
// Address
// ============================================

export interface Address {
  street: string;
  postalCode: string;
  city: string;
  country: string;
}

// ============================================
// User
// ============================================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

// ============================================
// Customer
// ============================================

export interface Customer {
  id: string;
  type: CustomerType;
  name: string;
  orgNumber?: string;
  personNumber?: string;
  address: Address;
  email: string;
  phone: string;
  website?: string;
  paymentTerms?: number;
  notes?: string;
  fortnoxCustomerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Contact
// ============================================

export interface Contact {
  id: string;
  customerId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  mobile?: string;
  title?: string;
  department?: string;
  isPrimary: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Material
// ============================================

export interface Material {
  id: string;
  articleNumber: string;
  name: string;
  description?: string;
  unit: string;
  price: number;
  purchasePrice?: number;
  supplier: SupplierType;
  supplierArticleNumber?: string;
  category: string;
  subcategory?: string;
  stockQuantity?: number;
  minStockLevel?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Work Order Material
// ============================================

export interface WorkOrderMaterial {
  id: string;
  workOrderId: string;
  materialId: string;
  material: Material;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

// ============================================
// Travel
// ============================================

export interface Travel {
  id: string;
  workOrderId: string;
  userId: string;
  user: User;
  date: Date;
  startTime?: Date;
  endTime?: Date;
  distanceKm: number;
  travelTimeMinutes: number;
  cost: number;
  notes?: string;
  createdAt: Date;
}

// ============================================
// Time Entry
// ============================================

export interface TimeEntry {
  id: string;
  workOrderId: string;
  userId: string;
  user: User;
  date: Date;
  startTime: Date;
  endTime?: Date;
  breakMinutes: number;
  totalMinutes: number;
  notes?: string;
  isBillable: boolean;
  hourlyRate: number;
  totalCost: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Work Order
// ============================================

export interface WorkOrder {
  id: string;
  orderNumber: string;
  title: string;
  description: string;
  status: WorkOrderStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  customerId: string;
  customer: Customer;
  contactId?: string;
  contact?: Contact;
  assignedTo?: string;
  assignedUser?: User;
  createdBy: string;
  createdByUser: User;
  createdAt: Date;
  updatedAt: Date;
  scheduledDate?: Date;
  startedAt?: Date;
  completedAt?: Date;
  estimatedHours: number;
  actualHours: number;
  materials: WorkOrderMaterial[];
  travels: Travel[];
  timeEntries: TimeEntry[];
  images: WorkOrderImage[];
  documents: WorkOrderDocument[];
  materialCost: number;
  laborCost: number;
  travelCost: number;
  totalAmount: number;
  quoteId?: string;
  fortnoxInvoiceId?: string;
  isInvoiced: boolean;
  invoiceDate?: Date;
  notes?: string;
  internalNotes?: string;
}

// ============================================
// Work Order Image
// ============================================

export interface WorkOrderImage {
  id: string;
  workOrderId: string;
  url: string;
  thumbnailUrl: string;
  caption?: string;
  uploadedBy: string;
  uploadedAt: Date;
  fileSize: number;
  mimeType: string;
}

// ============================================
// Work Order Document
// ============================================

export interface WorkOrderDocument {
  id: string;
  workOrderId: string;
  name: string;
  url: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: Date;
}

// ============================================
// Quote Item
// ============================================

export interface QuoteItem {
  id: string;
  quoteId: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discountPercent: number;
  totalPrice: number;
  materialId?: string;
  material?: Material;
}

// ============================================
// Quote
// ============================================

export interface Quote {
  id: string;
  quoteNumber: string;
  title: string;
  description: string;
  status: QuoteStatus;
  customerId: string;
  customer: Customer;
  contactId?: string;
  contact?: Contact;
  createdBy: string;
  createdByUser: User;
  createdAt: Date;
  updatedAt: Date;
  validUntil: Date;
  sentAt?: Date;
  acceptedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  items: QuoteItem[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  vatPercent: number;
  vatAmount: number;
  totalAmount: number;
  workOrderId?: string;
  workOrder?: WorkOrder;
  notes?: string;
  internalNotes?: string;
  pdfUrl?: string;
}

// ============================================
// Supplier Integration
// ============================================

export interface SupplierProduct {
  articleNumber: string;
  name: string;
  description: string;
  unit: string;
  price: number;
  supplier: SupplierType;
  category: string;
  stockQuantity?: number;
  manufacturer?: string;
  ean?: string;
}

// ============================================
// Fortnox Integration
// ============================================

export interface FortnoxConnection {
  id: string;
  isConnected: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  companyName?: string;
  orgNumber?: string;
  lastSyncAt?: Date;
}

// ============================================
// Dashboard Stats
// ============================================

export interface DashboardStats {
  workOrders: {
    available: number;
    taken: number;
    started: number;
    paused: number;
    completed: number;
    invoiced: number;
    total: number;
  };
  quotes: {
    draft: number;
    sent: number;
    accepted: number;
    rejected: number;
    total: number;
  };
  revenue: {
    thisMonth: number;
    lastMonth: number;
    thisYear: number;
    pending: number;
  };
  recentWorkOrders: WorkOrder[];
  recentQuotes: Quote[];
  upcomingWorkOrders: WorkOrder[];
}

// ============================================
// Filter Types
// ============================================

export interface WorkOrderFilter {
  search?: string;
  status?: WorkOrderStatus[];
  customerId?: string;
  assignedTo?: string;
  dateFrom?: Date;
  dateTo?: Date;
  priority?: string[];
}

export interface QuoteFilter {
  search?: string;
  status?: QuoteStatus[];
  customerId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface CustomerFilter {
  search?: string;
  type?: CustomerType;
  city?: string;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
