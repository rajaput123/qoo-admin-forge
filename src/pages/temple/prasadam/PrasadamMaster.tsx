import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Search, Plus, Package } from "lucide-react";
import { toast } from "sonner";

interface PrasadamType {
  id: string;
  name: string;
  category: string;
  unit: string;
  weight: string;
  shelfLife: string;
  location: string;
  structure: string;
  status: "Active" | "Inactive";
  showOnline: boolean;
}

const initialPrasadamData: PrasadamType[] = [
  { id: "PRS-001", name: "Laddu Prasadam", category: "Daily", unit: "Piece", weight: "100g", shelfLife: "12 Hours", location: "Main Kitchen", structure: "Main Temple", status: "Active", showOnline: true },
  { id: "PRS-002", name: "Pulihora", category: "Daily", unit: "Packet", weight: "250g", shelfLife: "8 Hours", location: "Main Kitchen", structure: "Main Temple", status: "Active", showOnline: false },
  { id: "PRS-003", name: "Sweet Pongal", category: "Daily", unit: "Packet", weight: "200g", shelfLife: "6 Hours", location: "Main Kitchen", structure: "Main Temple", status: "Active", showOnline: true },
  { id: "PRS-004", name: "Vada", category: "Daily", unit: "Piece", weight: "50g", shelfLife: "8 Hours", location: "Main Kitchen", structure: "Main Temple", status: "Active", showOnline: false },
  { id: "PRS-005", name: "Curd Rice", category: "Daily", unit: "Packet", weight: "300g", shelfLife: "6 Hours", location: "Main Kitchen", structure: "Main Temple", status: "Active", showOnline: true },
  { id: "PRS-006", name: "Panchamritam", category: "Special", unit: "Cup", weight: "50ml", shelfLife: "4 Hours", location: "Sanctum Kitchen", structure: "Shrine - Ganesh", status: "Active", showOnline: false },
  { id: "PRS-007", name: "Festival Laddu (Large)", category: "Festival", unit: "Piece", weight: "500g", shelfLife: "24 Hours", location: "Main Kitchen", structure: "Main Temple", status: "Active", showOnline: true },
  { id: "PRS-008", name: "Dosa Prasadam", category: "Counter Sale", unit: "Piece", weight: "150g", shelfLife: "4 Hours", location: "Counter Kitchen", structure: "Main Temple", status: "Inactive", showOnline: false },
];

const emptyForm = {
  name: "",
  category: "",
  unit: "",
  weight: "",
  shelfLife: "",
  location: "",
  structure: "",
  showOnline: true,
};

const PrasadamMaster = () => {
  const [prasadamList, setPrasadamList] = useState<PrasadamType[]>(initialPrasadamData);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showDetail, setShowDetail] = useState<PrasadamType | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const filtered = prasadamList.filter(p =>
    (categoryFilter === "all" || p.category === categoryFilter) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSave = () => {
    const newItem: PrasadamType = {
      id: `PRS-${String(prasadamList.length + 1).padStart(3, "0")}`,
      name: form.name,
      category: form.category,
      unit: form.unit,
      weight: form.weight,
      shelfLife: form.shelfLife,
      location: form.location,
      structure: form.structure,
      status: "Active",
      showOnline: form.showOnline,
    };
    setPrasadamList(prev => [...prev, newItem]);
    setForm(emptyForm);
    setShowAdd(false);
    toast.success("Prasadam type added");
  };

  const toggleShowOnline = (id: string, showOnline: boolean) => {
    setPrasadamList(prev => prev.map(p => p.id === id ? { ...p, showOnline } : p));
    if (showDetail?.id === id) setShowDetail(prev => prev ? { ...prev, showOnline } : null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Prasadam Master</h2>
          <p className="text-sm text-muted-foreground mt-1">Define and manage all prasadam types</p>
        </div>
        <Button size="sm" onClick={() => setShowAdd(true)}>
          <Plus className="h-4 w-4 mr-1" /> Add Prasadam
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search prasadam..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Daily">Daily</SelectItem>
                <SelectItem value="Festival">Festival</SelectItem>
                <SelectItem value="Special">Special</SelectItem>
                <SelectItem value="Counter Sale">Counter Sale</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Prasadam Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Shelf Life</TableHead>
                <TableHead>Structure</TableHead>
                <TableHead>Online</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(p => (
                <TableRow key={p.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setShowDetail(p)}>
                  <TableCell className="font-mono text-xs">{p.id}</TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{p.category}</Badge></TableCell>
                  <TableCell>{p.unit}</TableCell>
                  <TableCell>{p.weight}</TableCell>
                  <TableCell>{p.shelfLife}</TableCell>
                  <TableCell className="text-xs">{p.structure}</TableCell>
                  <TableCell onClick={e => e.stopPropagation()}>
                    <Switch checked={p.showOnline} onCheckedChange={v => toggleShowOnline(p.id, v)} />
                  </TableCell>
                  <TableCell>
                    <Badge variant={p.status === "Active" ? "default" : "secondary"} className="text-xs">{p.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!showDetail} onOpenChange={() => setShowDetail(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              {showDetail?.name}
            </DialogTitle>
          </DialogHeader>
          {showDetail && (
            <Tabs defaultValue="overview">
              <TabsList className="w-full">
                <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                <TabsTrigger value="recipe" className="flex-1">Recipe</TabsTrigger>
                <TabsTrigger value="history" className="flex-1">History</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-3 mt-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">ID:</span> <span className="font-mono">{showDetail.id}</span></div>
                  <div><span className="text-muted-foreground">Category:</span> {showDetail.category}</div>
                  <div><span className="text-muted-foreground">Unit:</span> {showDetail.unit}</div>
                  <div><span className="text-muted-foreground">Weight:</span> {showDetail.weight}</div>
                  <div><span className="text-muted-foreground">Shelf Life:</span> {showDetail.shelfLife}</div>
                  <div><span className="text-muted-foreground">Location:</span> {showDetail.location}</div>
                  <div className="col-span-2"><span className="text-muted-foreground">Structure:</span> {showDetail.structure}</div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Show in Online Booking</p>
                    <p className="text-xs text-muted-foreground">When enabled, devotees can see and select this prasadam online</p>
                  </div>
                  <Switch checked={showDetail.showOnline} onCheckedChange={v => toggleShowOnline(showDetail.id, v)} />
                </div>
              </TabsContent>
              <TabsContent value="recipe" className="mt-3">
                <p className="text-sm text-muted-foreground">Recipe ingredients linked to this prasadam will appear here.</p>
              </TabsContent>
              <TabsContent value="history" className="mt-3">
                <p className="text-sm text-muted-foreground">Production history and batch records will appear here.</p>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Add Prasadam Type</DialogTitle></DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Prasadam Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Laddu Prasadam" /></div>
              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Festival">Festival</SelectItem>
                    <SelectItem value="Special">Special</SelectItem>
                    <SelectItem value="Counter Sale">Counter Sale</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label>Unit Type</Label><Input value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} placeholder="Piece / Kg" /></div>
              <div><Label>Weight per Unit</Label><Input value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} placeholder="100g" /></div>
              <div><Label>Shelf Life</Label><Input value={form.shelfLife} onChange={e => setForm({ ...form, shelfLife: e.target.value })} placeholder="12 Hours" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Preparation Location</Label><Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Main Kitchen" /></div>
              <div><Label>Linked Structure</Label><Input value={form.structure} onChange={e => setForm({ ...form, structure: e.target.value })} placeholder="Main Temple" /></div>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <Switch checked={form.showOnline} onCheckedChange={v => setForm({ ...form, showOnline: v })} />
              <Label>Show in Online Booking</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.name || !form.category}>Save Prasadam</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PrasadamMaster;
