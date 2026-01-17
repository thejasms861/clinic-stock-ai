import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import InventoryTable, { InventoryItem } from '@/components/dashboard/InventoryTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Upload, Download, Package } from 'lucide-react';
import { mockInventory } from '@/lib/mockData';
import { toast } from 'sonner';

const Inventory = () => {
  const navigate = useNavigate();
  const { user, loading, isAdmin, isPharmacyManager } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>(mockInventory);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'Tablets',
    batchNumber: '',
    quantity: '',
    reorderLevel: '',
    expiryDate: '',
    supplier: '',
  });

  if (!loading && !user) {
    navigate('/auth');
    return null;
  }

  const canEdit = isAdmin || isPharmacyManager;

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Tablets',
      batchNumber: '',
      quantity: '',
      reorderLevel: '',
      expiryDate: '',
      supplier: '',
    });
  };

  const handleAddItem = () => {
    const newItem: InventoryItem = {
      id: Date.now().toString(),
      name: formData.name,
      category: formData.category,
      batchNumber: formData.batchNumber,
      quantity: parseInt(formData.quantity),
      reorderLevel: parseInt(formData.reorderLevel),
      expiryDate: formData.expiryDate,
      supplier: formData.supplier,
      status: parseInt(formData.quantity) > parseInt(formData.reorderLevel) ? 'healthy' : 'low',
    };
    setItems([newItem, ...items]);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success('Medicine added successfully');
  };

  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      batchNumber: item.batchNumber,
      quantity: item.quantity.toString(),
      reorderLevel: item.reorderLevel.toString(),
      expiryDate: item.expiryDate,
      supplier: item.supplier,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateItem = () => {
    if (!selectedItem) return;
    
    const updatedItems = items.map(item => {
      if (item.id === selectedItem.id) {
        return {
          ...item,
          name: formData.name,
          category: formData.category,
          batchNumber: formData.batchNumber,
          quantity: parseInt(formData.quantity),
          reorderLevel: parseInt(formData.reorderLevel),
          expiryDate: formData.expiryDate,
          supplier: formData.supplier,
          status: parseInt(formData.quantity) > parseInt(formData.reorderLevel) ? 'healthy' as const : 'low' as const,
        };
      }
      return item;
    });
    
    setItems(updatedItems);
    setIsEditDialogOpen(false);
    setSelectedItem(null);
    resetForm();
    toast.success('Medicine updated successfully');
  };

  const handleDeleteItem = (item: InventoryItem) => {
    setItems(items.filter(i => i.id !== item.id));
    toast.success('Medicine deleted successfully');
  };

  const handleExport = () => {
    // Mock export functionality
    toast.success('Inventory exported to CSV');
  };

  const handleImport = () => {
    // Mock import functionality
    toast.info('Import feature coming soon');
  };

  const categories = ['Tablets', 'Capsules', 'Injections', 'Syrups', 'Ointments', 'Drops', 'Surgical', 'Equipment', 'Other'];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Inventory Management</h1>
            <p className="text-muted-foreground">
              Manage your medicine stock, batches, and expiry dates
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleImport} className="gap-2">
              <Upload className="w-4 h-4" />
              Import
            </Button>
            <Button variant="outline" onClick={handleExport} className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            {canEdit && (
              <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Medicine
              </Button>
            )}
          </div>
        </div>

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Stock Ledger
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InventoryTable 
              items={items} 
              onEdit={canEdit ? handleEditItem : undefined}
              onDelete={canEdit ? handleDeleteItem : undefined}
            />
          </CardContent>
        </Card>

        {/* Add Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Medicine</DialogTitle>
              <DialogDescription>
                Enter the details of the new medicine to add to inventory.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Medicine Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Paracetamol 500mg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="batch">Batch Number</Label>
                  <Input
                    id="batch"
                    value={formData.batchNumber}
                    onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                    placeholder="e.g., PCM-2024-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input
                    id="supplier"
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    placeholder="e.g., Cipla Ltd"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reorder">Reorder Level</Label>
                  <Input
                    id="reorder"
                    type="number"
                    value={formData.reorderLevel}
                    onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddItem}>Add Medicine</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Medicine</DialogTitle>
              <DialogDescription>
                Update the medicine details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Medicine Name</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-batch">Batch Number</Label>
                  <Input
                    id="edit-batch"
                    value={formData.batchNumber}
                    onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-supplier">Supplier</Label>
                  <Input
                    id="edit-supplier"
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-quantity">Quantity</Label>
                  <Input
                    id="edit-quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-reorder">Reorder Level</Label>
                  <Input
                    id="edit-reorder"
                    type="number"
                    value={formData.reorderLevel}
                    onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-expiry">Expiry Date</Label>
                  <Input
                    id="edit-expiry"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateItem}>Update Medicine</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Inventory;
