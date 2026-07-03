import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Tags, Package } from "lucide-react";

const categories = [
  { id: 1, name: "Flowers", materialCount: 8, suppliers: 3, status: "Active", color: "bg-pink-500" },
  { id: 2, name: "Grocery", materialCount: 15, suppliers: 2, status: "Active", color: "bg-green-500" },
  { id: 3, name: "Pooja Materials", materialCount: 12, suppliers: 4, status: "Active", color: "bg-orange-500" },
  { id: 4, name: "Oil & Ghee", materialCount: 6, suppliers: 2, status: "Active", color: "bg-amber-500" },
  { id: 5, name: "Decoration", materialCount: 10, suppliers: 1, status: "Active", color: "bg-purple-500" },
  { id: 6, name: "Electrical", materialCount: 5, suppliers: 1, status: "Inactive", color: "bg-blue-500" },
  { id: 7, name: "Milk & Dairy", materialCount: 4, suppliers: 1, status: "Active", color: "bg-cyan-500" },
  { id: 8, name: "Printing & Media", materialCount: 3, suppliers: 1, status: "Active", color: "bg-slate-500" },
];

const materials = [
  { id: 1, name: "Rose Petals", category: "Flowers", unit: "kg", standardRate: 500, status: "Active" },
  { id: 2, name: "Jasmine Garlands", category: "Flowers", unit: "pcs", standardRate: 80, status: "Active" },
  { id: 3, name: "Marigold Garlands", category: "Flowers", unit: "pcs", standardRate: 50, status: "Active" },
  { id: 4, name: "Rice (Sona Masuri)", category: "Grocery", unit: "kg", standardRate: 55, status: "Active" },
  { id: 5, name: "Toor Dal", category: "Grocery", unit: "kg", standardRate: 120, status: "Active" },
  { id: 6, name: "Ghee (Cow)", category: "Oil & Ghee", unit: "ltr", standardRate: 600, status: "Active" },
  { id: 7, name: "Sesame Oil", category: "Oil & Ghee", unit: "ltr", standardRate: 350, status: "Active" },
  { id: 8, name: "Camphor", category: "Pooja Materials", unit: "kg", standardRate: 800, status: "Active" },
  { id: 9, name: "Kumkum", category: "Pooja Materials", unit: "kg", standardRate: 400, status: "Active" },
  { id: 10, name: "Incense Sticks", category: "Pooja Materials", unit: "pkt", standardRate: 30, status: "Active" },
  { id: 11, name: "Turmeric Powder", category: "Pooja Materials", unit: "kg", standardRate: 200, status: "Active" },
  { id: 12, name: "Milk (Full Cream)", category: "Milk & Dairy", unit: "ltr", standardRate: 60, status: "Active" },
];

const Categories = () => {
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredMaterials = materials.filter(m => categoryFilter === "all" || m.category === categoryFilter);

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Categories & Materials</h1>
          <p className="text-muted-foreground">Manage supplier categories and material master list</p>
        </div>

        {/* Categories Grid */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium flex items-center gap-2"><Tags className="h-5 w-5" />Supplier Categories</h2>
          <Button size="sm" onClick={() => setShowAddCategory(true)}><Plus className="h-4 w-4 mr-2" />Add Category</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {categories.map(c => (
            <Card key={c.id} className="group hover:shadow-md transition-all cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-3 h-3 rounded-full ${c.color}`} />
                  <Badge variant="outline" className={`text-[10px] ${c.status === "Active" ? "text-green-700 border-green-300 bg-green-50" : "text-amber-700 border-amber-300 bg-amber-50"}`}>{c.status}</Badge>
                </div>
                <p className="font-medium text-sm">{c.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{c.materialCount} materials · {c.suppliers} suppliers</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Materials Table */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium flex items-center gap-2"><Package className="h-5 w-5" />Material List</h2>
          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Categories" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button size="sm" onClick={() => setShowAddMaterial(true)}><Plus className="h-4 w-4 mr-2" />Add Material</Button>
          </div>
        </div>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead className="text-right">Standard Rate (₹)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMaterials.map(m => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium text-sm">{m.name}</TableCell>
                    <TableCell><Badge variant="secondary" className="text-xs">{m.category}</Badge></TableCell>
                    <TableCell className="text-sm">{m.unit}</TableCell>
                    <TableCell className="text-right font-medium text-sm">₹{m.standardRate}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px] text-green-700 border-green-300 bg-green-50">{m.status}</Badge></TableCell>
                    <TableCell><Button variant="ghost" size="sm"><Pencil className="h-3.5 w-3.5" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Add Category Dialog */}
      <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add Supplier Category</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-xs">Category Name</Label><Input placeholder="e.g. Flowers, Grocery" /></div>
            <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setShowAddCategory(false)}>Cancel</Button><Button onClick={() => setShowAddCategory(false)}>Add Category</Button></div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Material Dialog */}
      <Dialog open={showAddMaterial} onOpenChange={setShowAddMaterial}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add Material</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-xs">Material Name</Label><Input placeholder="Material name" /></div>
            <div><Label className="text-xs">Category</Label><Select><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger><SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent></Select></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Unit of Measurement</Label><Select><SelectTrigger><SelectValue placeholder="Unit" /></SelectTrigger><SelectContent><SelectItem value="kg">kg</SelectItem><SelectItem value="ltr">ltr</SelectItem><SelectItem value="pcs">pcs</SelectItem><SelectItem value="pkt">pkt</SelectItem><SelectItem value="box">box</SelectItem></SelectContent></Select></div>
              <div><Label className="text-xs">Standard Rate (₹)</Label><Input type="number" placeholder="0" /></div>
            </div>
            <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setShowAddMaterial(false)}>Cancel</Button><Button onClick={() => setShowAddMaterial(false)}>Add Material</Button></div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;
