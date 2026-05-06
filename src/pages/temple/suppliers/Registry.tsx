import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Download, Star, Phone, Mail, MapPin, Building, IndianRupee, FileText, Truck, Clock, Package, Link2, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { inventoryItems, supplierRefs, kitchenBatches, eventMaterialAllocations, eventRefs } from "@/data/templeData";

const suppliers = [
  { id: "SUP-001", name: "Sri Lakshmi Flowers", category: "Flowers", contactPerson: "Rajesh Kumar", phone: "+91 98765 43210", email: "rajesh@srilakshmi.com", city: "Tirupati", status: "Active", rating: 4.8, gst: "37AABCU9603R1ZM", pan: "AABCU9603R", businessType: "Proprietorship", yearsInBusiness: 12, totalOrders: 24, totalSpend: 185000, lastOrder: "2026-02-06", address: "12, Flower Market, Tirupati", state: "Andhra Pradesh", bankName: "SBI", accountNumber: "****6789", ifsc: "SBIN0001234" },
  { id: "SUP-002", name: "Annapurna Grocery", category: "Grocery", contactPerson: "Lakshmi Devi", phone: "+91 87654 32109", email: "lakshmi@annapurna.com", city: "Tirumala", status: "Active", rating: 4.5, gst: "37BBCD1234R5ZN", pan: "BBCD1234R5", businessType: "Company", yearsInBusiness: 8, totalOrders: 18, totalSpend: 142000, lastOrder: "2026-02-04", address: "45, Main Road, Tirumala", state: "Andhra Pradesh", bankName: "HDFC", accountNumber: "****1234", ifsc: "HDFC0005678" },
  { id: "SUP-003", name: "Shiva Pooja Stores", category: "Pooja Materials", contactPerson: "Venkat Rao", phone: "+91 76543 21098", email: "venkat@shivapooja.com", city: "Tirupati", status: "Active", rating: 4.7, gst: "37CCDE2345R6ZO", pan: "CCDE2345R6", businessType: "Proprietorship", yearsInBusiness: 15, totalOrders: 15, totalSpend: 98000, lastOrder: "2026-02-07", address: "78, Bazaar St, Tirupati", state: "Andhra Pradesh", bankName: "ICICI", accountNumber: "****5678", ifsc: "ICIC0009012" },
  { id: "SUP-004", name: "Nandi Oil & Ghee", category: "Oil & Ghee", contactPerson: "Suresh Reddy", phone: "+91 65432 10987", email: "suresh@nandioil.com", city: "Chittoor", status: "Active", rating: 4.3, gst: "37DDEF3456R7ZP", pan: "DDEF3456R7", businessType: "Company", yearsInBusiness: 20, totalOrders: 12, totalSpend: 76000, lastOrder: "2026-01-28", address: "22, Industrial Area, Chittoor", state: "Andhra Pradesh", bankName: "Canara", accountNumber: "****9012", ifsc: "CNRB0003456" },
  { id: "SUP-005", name: "Devi Decorations", category: "Decoration", contactPerson: "Priya Sharma", phone: "+91 54321 09876", email: "priya@devideco.com", city: "Tirupati", status: "Active", rating: 4.6, gst: "37EEFG4567R8ZQ", pan: "EEFG4567R8", businessType: "Proprietorship", yearsInBusiness: 6, totalOrders: 8, totalSpend: 64000, lastOrder: "2026-02-01", address: "56, MG Road, Tirupati", state: "Andhra Pradesh", bankName: "Axis", accountNumber: "****3456", ifsc: "UTIB0007890" },
  { id: "SUP-006", name: "Ravi Electricals", category: "Electrical", contactPerson: "Ravi Shankar", phone: "+91 43210 98765", email: "ravi@ravielectricals.com", city: "Tirupati", status: "Inactive", rating: 3.8, gst: "37FFGH5678R9ZR", pan: "FFGH5678R9", businessType: "Individual", yearsInBusiness: 4, totalOrders: 5, totalSpend: 32000, lastOrder: "2025-11-15", address: "89, Tech Lane, Tirupati", state: "Andhra Pradesh", bankName: "PNB", accountNumber: "****7890", ifsc: "PUNB0001234" },
  { id: "SUP-007", name: "Surya Milk Dairy", category: "Milk & Dairy", contactPerson: "Ganesh Pillai", phone: "+91 32109 87654", email: "ganesh@suryadairy.com", city: "Chandragiri", status: "Active", rating: 4.4, gst: "37GGHI6789R0ZS", pan: "GGHI6789R0", businessType: "Company", yearsInBusiness: 10, totalOrders: 30, totalSpend: 55000, lastOrder: "2026-02-09", address: "10, Dairy Rd, Chandragiri", state: "Andhra Pradesh", bankName: "Indian Bank", accountNumber: "****2345", ifsc: "IDIB0005678" },
  { id: "SUP-008", name: "Balaji Print Works", category: "Printing", contactPerson: "Karthik S", phone: "+91 21098 76543", email: "karthik@balajiprint.com", city: "Tirupati", status: "Blacklisted", rating: 2.1, gst: "37HHIJ7890R1ZT", pan: "HHIJ7890R1", businessType: "Proprietorship", yearsInBusiness: 3, totalOrders: 4, totalSpend: 18000, lastOrder: "2025-08-20", address: "33, Print Lane, Tirupati", state: "Andhra Pradesh", bankName: "BOB", accountNumber: "****6789", ifsc: "BARB0009012" },
];

const statusColor = (status: string) => {
  if (status === "Active") return "text-green-700 border-green-300 bg-green-50";
  if (status === "Inactive") return "text-amber-700 border-amber-300 bg-amber-50";
  if (status === "Blacklisted") return "text-red-700 border-red-300 bg-red-50";
  return "text-muted-foreground border-border bg-muted";
};

const Registry = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<typeof suppliers[0] | null>(null);

  const filtered = suppliers.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase()) || s.contactPerson.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Get linked inventory items for selected supplier
  const getLinkedInventory = (supplierName: string) => {
    return inventoryItems.filter(inv => inv.supplier === supplierName);
  };

  // Get linked event allocations for selected supplier
  const getLinkedEvents = (supplierName: string) => {
    const invIds = getLinkedInventory(supplierName).map(inv => inv.id);
    return eventMaterialAllocations.filter(m => invIds.includes(m.inventoryId));
  };

  // Get linked kitchen batches for selected supplier
  const getLinkedBatches = (supplierName: string) => {
    const invIds = getLinkedInventory(supplierName).map(inv => inv.id);
    return kitchenBatches.filter(b => b.inventoryDeductions.some(d => invIds.includes(d.inventoryId)));
  };

  // Inline supplier detail view
  if (selected) {
    return (
      <div className="p-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setSelected(null)}><ArrowLeft className="h-4 w-4" /></Button>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">{selected.name}</h1>
                <p className="text-muted-foreground text-sm">{selected.category} • {selected.city}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`text-xs ${statusColor(selected.status)}`}>{selected.status}</Badge>
              <Button size="sm" onClick={() => setSelected(null)}>Back</Button>
            </div>
          </div>

          <Tabs defaultValue="overview">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="inventory">Inventory Link</TabsTrigger>
              <TabsTrigger value="kitchen">Kitchen Link</TabsTrigger>
              <TabsTrigger value="events">Event Link</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm"><Building className="h-4 w-4 text-muted-foreground" /><span>{selected.businessType}</span></div>
                <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-muted-foreground" /><span>{selected.phone}</span></div>
                <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-muted-foreground" /><span>{selected.email}</span></div>
                <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-muted-foreground" /><span>{selected.city}, {selected.state}</span></div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg text-sm"><strong>Address:</strong> {selected.address}</div>
            </TabsContent>
            <TabsContent value="inventory" className="space-y-4 mt-4">
              <p className="text-xs text-muted-foreground">Inventory items supplied by {selected.name}</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Current Stock</TableHead>
                    <TableHead className="text-right">Min Stock</TableHead>
                    <TableHead>Structure</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getLinkedInventory(selected.name).map(inv => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-medium">{inv.name}</TableCell>
                      <TableCell className="text-sm">{inv.category}</TableCell>
                      <TableCell className="text-right font-mono">{inv.currentStock} {inv.unit}</TableCell>
                      <TableCell className="text-right font-mono text-muted-foreground">{inv.minStock} {inv.unit}</TableCell>
                      <TableCell className="text-sm">{inv.structureLinked}</TableCell>
                      <TableCell>
                        <Badge variant={inv.status === "In Stock" ? "default" : "secondary"} className="text-xs">{inv.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {getLinkedInventory(selected.name).length === 0 && (
                    <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-4">No inventory items linked</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="kitchen" className="space-y-4 mt-4">
              <p className="text-xs text-muted-foreground">Kitchen batches that consumed materials from {selected.name}</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Prasadam</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Materials Used</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getLinkedBatches(selected.name).map(b => (
                    <TableRow key={b.id}>
                      <TableCell className="font-medium">{b.prasadam}</TableCell>
                      <TableCell className="text-sm">{b.date}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {b.inventoryDeductions.filter(d => getLinkedInventory(selected.name).some(inv => inv.id === d.inventoryId)).map((d, i) => (
                            <Badge key={i} variant="outline" className="text-[10px]">{d.inventoryName}: {d.qty}{d.unit}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell><Badge variant={b.status === "Active" ? "default" : "secondary"} className="text-xs">{b.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="events" className="space-y-4 mt-4">
              <p className="text-xs text-muted-foreground">Event allocations that used items from {selected.name}</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Inventory Item</TableHead>
                    <TableHead>Qty</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getLinkedEvents(selected.name).map((m, i) => (
                    <TableRow key={i}>
                      <TableCell>{eventRefs.find(e => e.id === m.eventId)?.name || m.eventId}</TableCell>
                      <TableCell>{m.inventoryName}</TableCell>
                      <TableCell className="text-sm">{m.requiredQty}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="financial" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Total Orders</p><p className="font-medium text-sm">{selected.totalOrders}</p></div>
                <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Total Spend</p><p className="font-medium text-sm">₹{selected.totalSpend.toLocaleString()}</p></div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Supplier Registry</h1>
            <p className="text-muted-foreground">Linked to Inventory, Kitchen, and Events</p>
          </div>
          <Button size="sm"><Download className="h-4 w-4 mr-2" />Export</Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search suppliers..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px] bg-background"><Filter className="h-4 w-4 mr-2" /><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Blacklisted">Blacklisted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Inventory Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Rating</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(s => {
                  const linkedInv = getLinkedInventory(s.name);
                  return (
                    <TableRow key={s.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelected(s)}>
                      <TableCell className="font-medium text-sm">{s.name}</TableCell>
                      <TableCell className="text-sm">{s.category}</TableCell>
                      <TableCell>
                        <p className="text-sm">{s.contactPerson}</p>
                        <p className="text-xs text-muted-foreground">{s.phone}</p>
                      </TableCell>
                      <TableCell className="text-sm">{s.city}</TableCell>
                      <TableCell>
                        {linkedInv.length > 0 ? (
                          <Badge variant="outline" className="text-xs">
                            <Package className="h-3 w-3 mr-1" />{linkedInv.length} items
                          </Badge>
                        ) : <span className="text-xs text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell><Badge variant="outline" className={`text-[10px] ${statusColor(s.status)}`}>{s.status}</Badge></TableCell>
                      <TableCell className="text-center"><Badge variant="outline" className="text-xs">⭐ {s.rating}</Badge></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-background">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  {selected.name}
                  <Badge variant="outline" className={`text-xs ${statusColor(selected.status)}`}>{selected.status}</Badge>
                </DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="overview">
                <TabsList className="grid grid-cols-5 w-full">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="inventory">Inventory Link</TabsTrigger>
                  <TabsTrigger value="kitchen">Kitchen Link</TabsTrigger>
                  <TabsTrigger value="events">Event Link</TabsTrigger>
                  <TabsTrigger value="financial">Financial</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm"><Building className="h-4 w-4 text-muted-foreground" /><span>{selected.businessType}</span></div>
                    <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-muted-foreground" /><span>{selected.phone}</span></div>
                    <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-muted-foreground" /><span>{selected.email}</span></div>
                    <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-muted-foreground" /><span>{selected.city}, {selected.state}</span></div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg text-sm"><strong>Address:</strong> {selected.address}</div>
                </TabsContent>
                <TabsContent value="inventory" className="space-y-4 mt-4">
                  <p className="text-xs text-muted-foreground">Inventory items supplied by {selected.name}</p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Current Stock</TableHead>
                        <TableHead className="text-right">Min Stock</TableHead>
                        <TableHead>Structure</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getLinkedInventory(selected.name).map(inv => (
                        <TableRow key={inv.id}>
                          <TableCell className="font-medium">{inv.name}</TableCell>
                          <TableCell className="text-sm">{inv.category}</TableCell>
                          <TableCell className="text-right font-mono">{inv.currentStock} {inv.unit}</TableCell>
                          <TableCell className="text-right font-mono text-muted-foreground">{inv.minStock} {inv.unit}</TableCell>
                          <TableCell className="text-sm">{inv.structureLinked}</TableCell>
                          <TableCell>
                            <Badge variant={inv.status === "In Stock" ? "default" : "secondary"} className="text-xs">{inv.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      {getLinkedInventory(selected.name).length === 0 && (
                        <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-4">No inventory items linked</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TabsContent>
                <TabsContent value="kitchen" className="space-y-4 mt-4">
                  <p className="text-xs text-muted-foreground">Kitchen batches that consumed materials from {selected.name}</p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Prasadam</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Materials Used</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getLinkedBatches(selected.name).map(b => (
                        <TableRow key={b.id}>
                          <TableCell className="font-medium">{b.prasadam}</TableCell>
                          <TableCell className="text-sm">{b.date}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {b.inventoryDeductions.filter(d => getLinkedInventory(selected.name).some(inv => inv.id === d.inventoryId)).map((d, i) => (
                                <Badge key={i} variant="outline" className="text-[10px]">{d.inventoryName}: {d.qty}{d.unit}</Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell><Badge variant={b.status === "Active" ? "default" : "secondary"} className="text-xs">{b.status}</Badge></TableCell>
                        </TableRow>
                      ))}
                      {getLinkedBatches(selected.name).length === 0 && (
                        <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-4">No kitchen batches linked</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TabsContent>
                <TabsContent value="events" className="space-y-4 mt-4">
                  <p className="text-xs text-muted-foreground">Event material allocations sourced from {selected.name}'s inventory</p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event</TableHead>
                        <TableHead>Material</TableHead>
                        <TableHead className="text-right">Required</TableHead>
                        <TableHead className="text-right">Allocated</TableHead>
                        <TableHead>Source</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getLinkedEvents(selected.name).map((m, i) => {
                        const evt = eventRefs.find(e => e.id === m.eventId);
                        return (
                          <TableRow key={i}>
                            <TableCell className="text-sm"><span className="font-mono text-primary text-xs">{m.eventId}</span> {evt?.name}</TableCell>
                            <TableCell className="font-medium">{m.inventoryName}</TableCell>
                            <TableCell className="text-right font-mono">{m.requiredQty} {m.unit}</TableCell>
                            <TableCell className="text-right font-mono">{m.allocatedQty} {m.unit}</TableCell>
                            <TableCell><Badge variant={m.source === "Stock" ? "default" : "secondary"} className="text-xs">{m.source}</Badge></TableCell>
                          </TableRow>
                        );
                      })}
                      {getLinkedEvents(selected.name).length === 0 && (
                        <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-4">No event allocations linked</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TabsContent>
                <TabsContent value="financial" className="space-y-4 mt-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg text-center"><p className="text-xs text-muted-foreground">Total Orders</p><p className="text-xl font-bold">{selected.totalOrders}</p></div>
                    <div className="p-3 bg-muted/50 rounded-lg text-center"><p className="text-xs text-muted-foreground">Total Spend</p><p className="text-xl font-bold">₹{selected.totalSpend.toLocaleString()}</p></div>
                    <div className="p-3 bg-muted/50 rounded-lg text-center"><p className="text-xs text-muted-foreground">Last Order</p><p className="text-xl font-bold">{selected.lastOrder}</p></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Bank</p><p className="font-medium text-sm">{selected.bankName}</p></div>
                    <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Account</p><p className="font-medium text-sm font-mono">{selected.accountNumber}</p></div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Registry;
