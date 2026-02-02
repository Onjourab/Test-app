import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Save,
  X,
  Trash2,
} from 'lucide-react';
import type { WorkOrder, WorkOrderMaterial } from '@/types';
import { formatCurrency } from '@/data/mockData';

export function WorkOrderForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { workOrders, customers, materials, addWorkOrder, updateWorkOrder, currentUser } = useApp();
  
  const isEditing = !!id;
  const existingWorkOrder = workOrders.find(wo => wo.id === id);

  const [formData, setFormData] = useState<Partial<WorkOrder>>({
    title: '',
    description: '',
    customerId: '',
    contactId: '',
    priority: 'medium',
    estimatedHours: 0,
    scheduledDate: undefined,
    notes: '',
    internalNotes: '',
    materials: [],
  });

  const [selectedMaterials, setSelectedMaterials] = useState<WorkOrderMaterial[]>([]);

  useEffect(() => {
    if (existingWorkOrder) {
      setFormData({
        title: existingWorkOrder.title,
        description: existingWorkOrder.description,
        customerId: existingWorkOrder.customerId,
        contactId: existingWorkOrder.contactId,
        priority: existingWorkOrder.priority,
        estimatedHours: existingWorkOrder.estimatedHours,
        scheduledDate: existingWorkOrder.scheduledDate,
        notes: existingWorkOrder.notes,
        internalNotes: existingWorkOrder.internalNotes,
      });
      setSelectedMaterials(existingWorkOrder.materials);
    }
  }, [existingWorkOrder]);

  const selectedCustomer = customers.find(c => c.id === formData.customerId);
  const customerContacts = selectedCustomer ? [
    { id: 'direct', fullName: `${selectedCustomer.name} (Direkt)` },
  ] : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.customerId) {
      return;
    }

    const customer = customers.find(c => c.id === formData.customerId);
    if (!customer) return;

    if (isEditing && existingWorkOrder) {
      updateWorkOrder(existingWorkOrder.id, {
        ...formData,
        materials: selectedMaterials,
      });
      navigate(`/workorders/${existingWorkOrder.id}`);
    } else {
      const newWorkOrder: WorkOrder = {
        id: `wo-${Date.now()}`,
        orderNumber: `WO-${new Date().getFullYear()}-${String(workOrders.length + 1).padStart(3, '0')}`,
        title: formData.title!,
        description: formData.description || '',
        status: 'available',
        priority: (formData.priority as WorkOrder['priority']) || 'medium',
        customerId: formData.customerId!,
        customer,
        contactId: formData.contactId,
        assignedTo: undefined,
        createdBy: currentUser?.id || '',
        createdByUser: currentUser!,
        createdAt: new Date(),
        updatedAt: new Date(),
        scheduledDate: formData.scheduledDate,
        estimatedHours: formData.estimatedHours || 0,
        actualHours: 0,
        materials: selectedMaterials,
        travels: [],
        timeEntries: [],
        images: [],
        documents: [],
        materialCost: selectedMaterials.reduce((sum, m) => sum + m.totalPrice, 0),
        laborCost: 0,
        travelCost: 0,
        totalAmount: selectedMaterials.reduce((sum, m) => sum + m.totalPrice, 0),
        isInvoiced: false,
        notes: formData.notes,
        internalNotes: formData.internalNotes,
      };
      addWorkOrder(newWorkOrder);
      navigate('/workorders');
    }
  };

  const addMaterial = (materialId: string) => {
    const material = materials.find(m => m.id === materialId);
    if (!material) return;

    const existingIndex = selectedMaterials.findIndex(m => m.materialId === materialId);
    if (existingIndex >= 0) {
      const updated = [...selectedMaterials];
      updated[existingIndex].quantity += 1;
      updated[existingIndex].totalPrice = updated[existingIndex].quantity * updated[existingIndex].unitPrice;
      setSelectedMaterials(updated);
    } else {
      setSelectedMaterials([...selectedMaterials, {
        id: `wom-${Date.now()}`,
        workOrderId: id || 'new',
        materialId: material.id,
        material,
        quantity: 1,
        unitPrice: material.price,
        totalPrice: material.price,
      }]);
    }
  };

  const updateMaterialQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeMaterial(index);
      return;
    }
    const updated = [...selectedMaterials];
    updated[index].quantity = quantity;
    updated[index].totalPrice = quantity * updated[index].unitPrice;
    setSelectedMaterials(updated);
  };

  const removeMaterial = (index: number) => {
    setSelectedMaterials(selectedMaterials.filter((_, i) => i !== index));
  };

  const totalMaterialCost = selectedMaterials.reduce((sum, m) => sum + m.totalPrice, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {isEditing ? 'Redigera arbetsorder' : 'Ny arbetsorder'}
            </h1>
            <p className="text-slate-500">
              {isEditing ? `Arbetsorder ${existingWorkOrder?.orderNumber}` : 'Skapa en ny arbetsorder'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <X className="w-4 h-4 mr-2" />
            Avbryt
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? 'Spara ändringar' : 'Skapa arbetsorder'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Grundinformation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Titel *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ange en beskrivande titel"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Beskrivning</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Beskriv vad som ska göras..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customer">Kund *</Label>
                    <Select 
                      value={formData.customerId} 
                      onValueChange={(value) => setFormData({ ...formData, customerId: value, contactId: '' })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Välj kund" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map(customer => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="contact">Kontaktperson</Label>
                    <Select 
                      value={formData.contactId} 
                      onValueChange={(value) => setFormData({ ...formData, contactId: value })}
                      disabled={!selectedCustomer}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Välj kontaktperson" />
                      </SelectTrigger>
                      <SelectContent>
                        {customerContacts.map(contact => (
                          <SelectItem key={contact.id} value={contact.id}>
                            {contact.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="priority">Prioritet</Label>
                    <Select 
                      value={formData.priority} 
                      onValueChange={(value) => setFormData({ ...formData, priority: value as WorkOrder['priority'] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Låg</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">Hög</SelectItem>
                        <SelectItem value="urgent">Akut</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="scheduledDate">Planerat datum</Label>
                    <Input
                      id="scheduledDate"
                      type="date"
                      value={formData.scheduledDate ? formData.scheduledDate.toISOString().split('T')[0] : ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        scheduledDate: e.target.value ? new Date(e.target.value) : undefined 
                      })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="estimatedHours">Beräknad tid (timmar)</Label>
                    <Input
                      id="estimatedHours"
                      type="number"
                      min="0"
                      step="0.5"
                      value={formData.estimatedHours}
                      onChange={(e) => setFormData({ ...formData, estimatedHours: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Materials */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Material</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Select onValueChange={addMaterial}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Lägg till material..." />
                    </SelectTrigger>
                    <SelectContent>
                      {materials.map(material => (
                        <SelectItem key={material.id} value={material.id}>
                          {material.articleNumber} - {material.name} ({formatCurrency(material.price)}/{material.unit})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedMaterials.length > 0 && (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-slate-700">Artikel</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-slate-700">Antal</th>
                          <th className="px-4 py-2 text-right text-sm font-medium text-slate-700">Pris</th>
                          <th className="px-4 py-2 text-right text-sm font-medium text-slate-700">Totalt</th>
                          <th className="px-4 py-2"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {selectedMaterials.map((item, index) => (
                          <tr key={item.id}>
                            <td className="px-4 py-2">
                              <div className="font-medium">{item.material.name}</div>
                              <div className="text-sm text-slate-500">{item.material.articleNumber}</div>
                            </td>
                            <td className="px-4 py-2">
                              <Input
                                type="number"
                                min="0"
                                step={item.material.unit === 'st' ? 1 : 0.1}
                                value={item.quantity}
                                onChange={(e) => updateMaterialQuantity(index, parseFloat(e.target.value) || 0)}
                                className="w-24"
                              />
                            </td>
                            <td className="px-4 py-2 text-right">{formatCurrency(item.unitPrice)}</td>
                            <td className="px-4 py-2 text-right font-medium">{formatCurrency(item.totalPrice)}</td>
                            <td className="px-4 py-2 text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeMaterial(index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-slate-50">
                        <tr>
                          <td colSpan={3} className="px-4 py-2 text-right font-medium">Totalt material:</td>
                          <td className="px-4 py-2 text-right font-bold">{formatCurrency(totalMaterialCost)}</td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Anteckningar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="notes">Anteckningar (synliga för kund)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Anteckningar som kan visas för kunden..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="internalNotes">Interna anteckningar</Label>
                  <Textarea
                    id="internalNotes"
                    value={formData.internalNotes || ''}
                    onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
                    placeholder="Interna anteckningar (syns inte för kund)..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sammanfattning</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Material</span>
                  <span className="font-medium">{formatCurrency(totalMaterialCost)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Beräknad arbetstid</span>
                  <span className="font-medium">{formData.estimatedHours}h</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Uppskattat totalt</span>
                    <span className="font-bold text-lg">{formatCurrency(totalMaterialCost + (formData.estimatedHours || 0) * 650)}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    * Arbete beräknas till 650 kr/tim
                  </p>
                </div>
              </CardContent>
            </Card>

            {selectedCustomer && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Kundinformation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="font-medium">{selectedCustomer.name}</p>
                  <p className="text-sm text-slate-600">{selectedCustomer.address.street}</p>
                  <p className="text-sm text-slate-600">
                    {selectedCustomer.address.postalCode} {selectedCustomer.address.city}
                  </p>
                  <p className="text-sm text-slate-600">{selectedCustomer.email}</p>
                  <p className="text-sm text-slate-600">{selectedCustomer.phone}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
