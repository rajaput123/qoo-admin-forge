import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, FolderTree, FileText, Search } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  description: string;
  documentCount: number;
  subcategories: string[];
  color: string;
}

const KnowledgeCategories = () => {
  const [categories, setCategories] = useState<Category[]>([
    { id: "CAT-001", name: "Daily Operations", description: "SOPs and procedures for daily temple activities", documentCount: 45, subcategories: ["Opening/Closing", "Cleaning", "Security"], color: "bg-primary/10 text-primary" },
    { id: "CAT-002", name: "Finance & Accounts", description: "Financial guidelines, tax rules, audit procedures", documentCount: 38, subcategories: ["Donations", "Expenses", "Audit", "Tax"], color: "bg-amber-100 text-amber-700" },
    { id: "CAT-003", name: "Events & Festivals", description: "Event planning guides and festival checklists", documentCount: 32, subcategories: ["Annual Festivals", "Special Events", "Planning"], color: "bg-emerald-100 text-emerald-700" },
    { id: "CAT-004", name: "HR & People", description: "Employee policies, training materials, guidelines", documentCount: 28, subcategories: ["Policies", "Training", "Onboarding"], color: "bg-blue-100 text-blue-700" },
    { id: "CAT-005", name: "Safety & Compliance", description: "Safety protocols and regulatory compliance", documentCount: 22, subcategories: ["Fire Safety", "Emergency", "Legal"], color: "bg-red-100 text-red-700" },
    { id: "CAT-006", name: "Rituals & Traditions", description: "Religious procedures, mantras, and traditions", documentCount: 56, subcategories: ["Daily Pujas", "Special Rituals", "Mantras"], color: "bg-purple-100 text-purple-700" },
  ]);

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({ name: "", description: "" });

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    if (!form.name || !form.description) { toast.error("Please fill all fields"); return; }
    const newCat: Category = {
      id: `CAT-${String(categories.length + 1).padStart(3, "0")}`,
      name: form.name,
      description: form.description,
      documentCount: 0,
      subcategories: [],
      color: "bg-muted text-muted-foreground",
    };
    setCategories([...categories, newCat]);
    setForm({ name: "", description: "" });
    setShowAddCategory(false);
    toast.success("Category created successfully");
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this category?")) {
      setCategories(categories.filter(c => c.id !== id));
      toast.success("Category deleted");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Category Management</h1>
        <p className="text-sm text-muted-foreground mt-1">Organize and manage knowledge categories</p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search categories..." className="pl-9" />
        </div>
        <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-2" /> Add Category</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Category</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div><Label>Category Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., Maintenance" /></div>
              <div><Label>Description *</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description" /></div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowAddCategory(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleAdd}>Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((cat) => (
          <Card key={cat.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${cat.color}`}>
                    <FolderTree className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-sm">{cat.name}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Edit className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleDelete(cat.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">{cat.description}</p>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <FileText className="h-3 w-3" /> {cat.documentCount} documents
                </div>
              </div>
              {cat.subcategories.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {cat.subcategories.map((sub) => (
                    <Badge key={sub} variant="secondary" className="text-[10px]">{sub}</Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default KnowledgeCategories;
