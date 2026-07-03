import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Search, Filter, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SelectWithAddNew from "@/components/SelectWithAddNew";
import CustomFieldsSection, { CustomField } from "@/components/CustomFieldsSection";
import { stockItems, StockItem, itemCategories, itemUnits, storageLocations, templeStructures } from "@/data/inventoryData";
import { supplierRefs } from "@/data/templeData";

const statusColor: Record<string, string> = {
  "In Stock": "bg-green-50 text-green-700 border-green-200",
  "Low Stock": "bg-amber-50 text-amber-700 border-amber-200",
  "Out of Stock": "bg-red-50 text-red-700 border-red-200",
};

const typeColor: Record<string, string> = {
  "Consumable": "bg-blue-50 text-blue-700 border-blue-200",
  "Perishable": "bg-orange-50 text-orange-700 border-orange-200",
  "Asset": "bg-purple-50 text-purple-700 border-purple-200",
  "Donation Item": "bg-pink-50 text-pink-700 border-pink-200",
};

const Items = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [categories, setCategories] = useState(itemCategories);
  const [units, setUnits] = useState(itemUnits);
  const [locations, setLocations] = useState(storageLocations);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  // Form state
  const [form, setForm] = useState({
    name: "", code: "", itemType: "Consumable" as StockItem["itemType"],
    category: "", unit: "", defaultStructure: "", reorderLevel: "",
    minimumLevel: "", storageLocation: "", ritualUse: false, expiryApplicable: false,
    batchNumber: "", expiryDate: "", serialNumber: "", condition: "Good",
    assignedLocation: "", pricePerUnit: "", supplier: "",
  });

  const filtered = stockItems.filter(i => {
    const matchSearch = !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.code.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || i.itemType === typeFilter;
    const matchCat = categoryFilter === "all" || i.category === categoryFilter;
    return matchSearch && matchType && matchCat;
  });

  const uniqueCategories = [...new Set(stockItems.map(i => i.category))];

  const openAdd = () => {
    setForm({ name: "", code: "", itemType: "Consumable", category: "", unit: "", defaultStructure: "", reorderLevel: "", minimumLevel: "", storageLocation: "", ritualUse: false, expiryApplicable: false, batchNumber: "", expiryDate: "", serialNumber: "", condition: "Good", assignedLocation: "", pricePerUnit: "", supplier: "" });
    setCustomFields([]);
    setShowModal(true);
  };
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Item detail view handled by dedicated route `/temple/inventory/items/:id`

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Items</h1>
          <p className="text-muted-foreground text-sm">Master data for all physical materials & assets</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Upload className="h-4 w-4 mr-1.5" />Import</Button>
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1.5" />Export</Button>
          <Button size="sm" onClick={openAdd}><Plus className="h-4 w-4 mr-1.5" />Add Item</Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search items..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40 h-9 bg-background"><SelectValue placeholder="Item Type" /></SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Consumable">Consumable</SelectItem>
            <SelectItem value="Perishable">Perishable</SelectItem>
            <SelectItem value="Asset">Asset</SelectItem>
            <SelectItem value="Donation Item">Donation Item</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-44 h-9 bg-background"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">All Categories</SelectItem>
            {uniqueCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Structure</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-right">Reorder</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(item => (
              <TableRow key={item.id} className="cursor-pointer" onClick={() => navigate(`/temple/inventory/items/${item.id}`)}>
                <TableCell>
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.code}</p>
                </TableCell>
                <TableCell><Badge variant="outline" className={`text-xs ${typeColor[item.itemType]}`}>{item.itemType}</Badge></TableCell>
                <TableCell className="text-sm">{item.category}</TableCell>
                <TableCell className="text-sm">{item.defaultStructure}</TableCell>
                <TableCell className="text-right font-medium text-sm">{item.currentStock} {item.unit}</TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">{item.reorderLevel} {item.unit}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{item.storageLocation}</TableCell>
                <TableCell><Badge variant="outline" className={`text-xs ${statusColor[item.status]}`}>{item.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground">Showing {filtered.length} of {stockItems.length} items</p>

      {/* Add Item Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Add New Item</DialogTitle></DialogHeader>
          <Tabs defaultValue="basic">
            <TabsList className="mb-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="stock">Stock Settings</TabsTrigger>
              <TabsTrigger value="type">Type-Specific</TabsTrigger>
              <TabsTrigger value="custom">Custom Fields</TabsTrigger>
            </TabsList>
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Item Name</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g., Rose Petals" /></div>
                <div><Label>Item Code</Label><Input value={form.code} onChange={e => setForm({...form, code: e.target.value})} placeholder="e.g., FLW-001" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Item Type</Label>
                  <Select value={form.itemType} onValueChange={v => setForm({...form, itemType: v as StockItem["itemType"]})}>
                    <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="Consumable">Consumable</SelectItem>
                      <SelectItem value="Perishable">Perishable</SelectItem>
                      <SelectItem value="Asset">Asset</SelectItem>
                      <SelectItem value="Donation Item">Donation Item</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Category</Label>
                  <SelectWithAddNew value={form.category} onValueChange={v => setForm({...form, category: v})} options={categories} onAddNew={v => setCategories([...categories, v])} placeholder="Select category" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Unit</Label>
                  <SelectWithAddNew value={form.unit} onValueChange={v => setForm({...form, unit: v})} options={units} onAddNew={v => setUnits([...units, v])} placeholder="Select unit" />
                </div>
                <div>
                  <Label>Default Structure</Label>
                  <Select value={form.defaultStructure} onValueChange={v => setForm({...form, defaultStructure: v})}>
                    <SelectTrigger className="bg-background"><SelectValue placeholder="Select structure" /></SelectTrigger>
                    <SelectContent className="bg-popover">
                      {templeStructures.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Price Per Unit (₹)</Label><Input type="number" value={form.pricePerUnit} onChange={e => setForm({...form, pricePerUnit: e.target.value})} /></div>
                <div>
                  <Label>Supplier</Label>
                  <SelectWithAddNew
                    value={form.supplier}
                    onValueChange={(v) => {
                      setForm({...form, supplier: v});
                    }}
                    placeholder="Select supplier"
                    options={supplierRefs.map(s => s.name)}
                    onAddNew={(v) => {
                      // allow adding a new supplier name (does not create full supplier object here)
                      setForm({...form, supplier: v});
                    }}
                    className="bg-background"
                  />
                </div>
              </div>

              {/* Supplier quick view (tabs) */}
              {form.supplier && (
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground mb-2">Supplier preview</p>
                  <Tabs defaultValue="overview">
                    <div className="border-b border-border">
                      <TabsList className="w-full justify-start border-b-0 rounded-none h-auto p-0 bg-transparent gap-0">
                        <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 px-3 py-2 text-sm text-muted-foreground">Overview</TabsTrigger>
                        <TabsTrigger value="contact" className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 px-3 py-2 text-sm text-muted-foreground">Address & Contact</TabsTrigger>
                        <TabsTrigger value="inventory" className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 px-3 py-2 text-sm text-muted-foreground">Inventory Link</TabsTrigger>
                        <TabsTrigger value="financial" className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 px-3 py-2 text-sm text-muted-foreground">Financial</TabsTrigger>
                      </TabsList>
                    </div>
                    <TabsContent value="overview" className="mt-3">
                      <div className="p-3 bg-muted/50 rounded-lg text-sm">
                        <p className="font-medium">{form.supplier}</p>
                        <p className="text-xs text-muted-foreground">Quick supplier summary</p>
                      </div>
                    </TabsContent>
                    <TabsContent value="contact" className="mt-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div><Label className="text-xs">Phone</Label><p className="text-sm mt-1 text-muted-foreground">{(supplierRefs.find(s=>s.name===form.supplier)?.contact) || "—"}</p></div>
                        <div><Label className="text-xs">Email</Label><p className="text-sm mt-1 text-muted-foreground">{"—"}</p></div>
                        <div className="col-span-2"><Label className="text-xs">Address</Label><p className="text-sm mt-1 text-muted-foreground">{"—"}</p></div>
                      </div>
                    </TabsContent>
                    <TabsContent value="inventory" className="mt-3">
                      <p className="text-xs text-muted-foreground">Items supplied by this supplier are visible in Supplier Registry.</p>
                    </TabsContent>
                    <TabsContent value="financial" className="mt-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div><Label className="text-xs">Bank</Label><p className="text-sm mt-1 text-muted-foreground">{"—"}</p></div>
                        <div><Label className="text-xs">Last Order</Label><p className="text-sm mt-1 text-muted-foreground">{"—"}</p></div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </TabsContent>
            <TabsContent value="stock" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Reorder Level</Label><Input type="number" value={form.reorderLevel} onChange={e => setForm({...form, reorderLevel: e.target.value})} /></div>
                <div><Label>Minimum Level</Label><Input type="number" value={form.minimumLevel} onChange={e => setForm({...form, minimumLevel: e.target.value})} /></div>
              </div>
              <div>
                <Label>Storage Location</Label>
                <SelectWithAddNew value={form.storageLocation} onValueChange={v => setForm({...form, storageLocation: v})} options={locations} onAddNew={v => setLocations([...locations, v])} placeholder="Select location" />
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch checked={form.ritualUse} onCheckedChange={v => setForm({...form, ritualUse: v})} />
                  <Label>Ritual Use</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={form.expiryApplicable} onCheckedChange={v => setForm({...form, expiryApplicable: v})} />
                  <Label>Expiry Applicable</Label>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="type" className="space-y-4">
              {(form.itemType === "Perishable" || form.expiryApplicable) && (
                <div className="space-y-4 p-4 border rounded-lg bg-orange-50/30">
                  <p className="text-sm font-medium text-orange-700">Perishable Details</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Batch Number</Label><Input value={form.batchNumber} onChange={e => setForm({...form, batchNumber: e.target.value})} /></div>
                    <div><Label>Expiry Date</Label><Input type="date" value={form.expiryDate} onChange={e => setForm({...form, expiryDate: e.target.value})} /></div>
                  </div>
                </div>
              )}
              {form.itemType === "Asset" && (
                <div className="space-y-4 p-4 border rounded-lg bg-purple-50/30">
                  <p className="text-sm font-medium text-purple-700">Asset Details</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Serial Number</Label><Input value={form.serialNumber} onChange={e => setForm({...form, serialNumber: e.target.value})} /></div>
                    <div>
                      <Label>Condition</Label>
                      <Select value={form.condition} onValueChange={v => setForm({...form, condition: v})}>
                        <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-popover">
                          {["New", "Good", "Fair", "Poor", "Damaged"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div><Label>Assigned Location</Label><Input value={form.assignedLocation} onChange={e => setForm({...form, assignedLocation: e.target.value})} /></div>
                </div>
              )}
              {form.itemType !== "Asset" && form.itemType !== "Perishable" && !form.expiryApplicable && (
                <p className="text-sm text-muted-foreground py-8 text-center">No type-specific fields for {form.itemType}</p>
              )}
            </TabsContent>
            <TabsContent value="custom">
              <CustomFieldsSection fields={customFields} onFieldsChange={setCustomFields} />
            </TabsContent>
          </Tabs>
            <DialogFooter>
            <Button variant="outline" onClick={() => { setShowModal(false); setEditingItemId(null); }}>Cancel</Button>
            <Button onClick={() => {
              // save item via stockService
              import("@/services/stockService").then(svc => {
                const created = svc.createOrUpdateItem({
                  id: editingItemId || undefined,
                  name: form.name,
                  code: form.code,
                  itemType: form.itemType,
                  category: form.category,
                  unit: form.unit,
                  defaultStructure: form.defaultStructure,
                  reorderLevel: Number(form.reorderLevel) || 0,
                  minimumLevel: Number(form.minimumLevel) || 0,
                  storageLocation: form.storageLocation,
                  ritualUse: form.ritualUse,
                  expiryApplicable: form.expiryApplicable,
                  batchNumber: form.batchNumber,
                  expiryDate: form.expiryDate,
                  serialNumber: form.serialNumber,
                  condition: form.condition,
                  assignedLocation: form.assignedLocation,
                  pricePerUnit: Number(form.pricePerUnit) || 0,
                  supplier: form.supplier,
                } as any);
                if (created) {
                  setShowModal(false);
                  setEditingItemId(null);
                }
              });
            }}>Save Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Item detail is shown via dedicated route `/temple/inventory/items/:id` */}
    </motion.div>
  );
};

export default Items;
