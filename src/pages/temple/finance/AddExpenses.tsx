import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Receipt, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const departmentExpenseTypes: Record<string, string[]> = {
  "Pooja & Rituals": ["Pooja Materials", "Flowers & Garlands", "Ghee & Oil", "Camphor & Incense", "Priest Honorarium", "Other"],
  "Kitchen & Prasadam": ["Raw Materials", "Cooking Supplies", "Utensils", "Labour", "Other"],
  "Maintenance": ["Civil Repairs", "Electrical", "Plumbing", "Painting", "Equipment Repair", "Other"],
  "Administration": ["Stationery", "Printing", "Travel", "Professional Fees", "Insurance", "Other"],
  "Security": ["Guard Salary", "Equipment", "CCTV Maintenance", "Other"],
  "Utilities": ["Electricity", "Water", "Gas", "Internet & Phone", "Other"],
  "Staff & HR": ["Salaries", "Allowances", "Uniforms", "Training", "Medical", "Other"],
  "Events": ["Decoration", "Sound & Lighting", "Catering", "Transport", "Publicity", "Other"],
  "Projects": ["Materials", "Labour", "Contractor Payments", "Permits & Approvals", "Other"],
};

const linkedEvents = [
  { value: "evt1", label: "Brahmotsavam 2025" },
  { value: "evt2", label: "Maha Shivaratri 2025" },
  { value: "evt3", label: "Navaratri 2025" },
];
const linkedProjects = [
  { value: "prj1", label: "Gopuram Renovation" },
  { value: "prj2", label: "Kitchen Upgrade" },
  { value: "prj3", label: "Parking Expansion" },
];
const linkedSevas = [
  { value: "sev1", label: "Abhishekam" },
  { value: "sev2", label: "Archana" },
  { value: "sev3", label: "Annadanam" },
];

interface Expense {
  id: string;
  description: string;
  amount: number;
  department: string;
  expenseType: string;
  mode: string;
  date: string;
  vendor: string;
  linkType: string;
  linkedModule: string;
  linkedLabel: string;
  remarks: string;
}

const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN")}`;

const AddExpenses = () => {
  const [showForm, setShowForm] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "demo-1",
      description: "Monthly Electricity Bill",
      amount: 45000,
      department: "Utilities",
      expenseType: "Electricity",
      mode: "Bank Transfer",
      date: "2025-03-01",
      vendor: "APSPDCL",
      linkType: "",
      linkedModule: "",
      linkedLabel: "",
      remarks: "March 2025 bill",
    },
  ]);

  // Form state
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [department, setDepartment] = useState("");
  const [expenseNature, setExpenseNature] = useState("");
  const [mode, setMode] = useState("");
  const [date, setDate] = useState("");
  const [vendor, setVendor] = useState("");
  const [remarks, setRemarks] = useState("");
  const [linkType, setLinkType] = useState("");
  const [linkedModule, setLinkedModule] = useState("");

  const expenseNatures = department ? departmentExpenseTypes[department] || [] : [];
  const linkedOptions = linkType === "event" ? linkedEvents
    : linkType === "project" ? linkedProjects
    : linkType === "seva" ? linkedSevas : [];

  const resetForm = () => {
    setDescription(""); setAmount(""); setDepartment(""); setExpenseNature("");
    setMode(""); setDate(""); setVendor(""); setRemarks("");
    setLinkType(""); setLinkedModule("");
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !department || !expenseNature || !mode || !date) {
      toast.error("Please fill all required fields");
      return;
    }
    const linkedLabel = linkedModule
      ? linkedOptions.find(o => o.value === linkedModule)?.label || ""
      : "";

    const newExpense: Expense = {
      id: crypto.randomUUID(),
      description,
      amount: parseFloat(amount),
      department,
      expenseType: expenseNature,
      mode,
      date,
      vendor,
      linkType: linkType && linkType !== "none" ? linkType : "",
      linkedModule,
      linkedLabel,
      remarks,
    };
    setExpenses(prev => [newExpense, ...prev]);
    resetForm();
    setShowForm(false);
    toast.success("Expense added");
  };

  const handleDelete = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    toast.success("Expense removed");
  };

  const totalAmount = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Receipt className="h-6 w-6 text-primary" /> Record Expenses
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Record and manage temple expenses</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          {showForm ? <ChevronUp className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Close" : "Add Expense"}
        </Button>
      </div>

      {/* Inline Form */}
      {showForm && (
        <Card className="border-primary/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">New Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Description *</Label>
                  <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Expense description" className="mt-1" required />
                </div>
                <div>
                  <Label>Amount (₹) *</Label>
                  <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" className="mt-1" required />
                </div>
                <div>
                  <Label>Date *</Label>
                  <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Department *</Label>
                  <Select value={department} onValueChange={(v) => { setDepartment(v); setExpenseNature(""); setLinkedModule(""); if (v === "Events") { setLinkType("event"); } else if (v === "Projects") { setLinkType("project"); } else if (linkType === "event" || linkType === "project") { setLinkType(""); } }}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select department" /></SelectTrigger>
                    <SelectContent>
                      {Object.keys(departmentExpenseTypes).map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Expense Type *</Label>
                  <Select value={expenseNature} onValueChange={setExpenseNature} disabled={!department}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder={department ? "Select type" : "Pick department first"} /></SelectTrigger>
                    <SelectContent>
                      {expenseNatures.map(n => (
                        <SelectItem key={n} value={n}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Payment Mode *</Label>
                  <Select value={mode} onValueChange={setMode}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select mode" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="UPI">UPI</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="Cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Vendor / Payee</Label>
                  <Input value={vendor} onChange={e => setVendor(e.target.value)} placeholder="Vendor name" className="mt-1" />
                </div>
                <div>
                  <Label>Link To</Label>
                  <Select value={linkType} onValueChange={(v) => { setLinkType(v); setLinkedModule(""); }}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="None" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                      <SelectItem value="seva">Seva</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {linkType && linkType !== "none" && (
                  <div>
                    <Label>Select {linkType === "event" ? "Event" : linkType === "project" ? "Project" : "Seva"}</Label>
                    <Select value={linkedModule} onValueChange={setLinkedModule}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder={`Select ${linkType}`} /></SelectTrigger>
                      <SelectContent>
                        {linkedOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div>
                <Label>Remarks</Label>
                <Textarea value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Optional notes..." className="mt-1" rows={2} />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => { resetForm(); setShowForm(false); }}>Cancel</Button>
                <Button type="submit" className="gap-2"><Plus className="h-4 w-4" /> Add Expense</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Expenses Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Recorded Expenses</CardTitle>
            {expenses.length > 0 && (
              <div className="text-sm font-medium">
                Total: <span className="text-primary">{formatCurrency(totalAmount)}</span>
                <span className="text-muted-foreground ml-2">({expenses.length} entries)</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Receipt className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No expenses recorded yet</p>
              <p className="text-xs mt-1">Click "Add Expense" to get started</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b">
                      <th className="text-left p-3 font-medium">Date</th>
                      <th className="text-left p-3 font-medium">Description</th>
                      <th className="text-left p-3 font-medium">Department</th>
                      <th className="text-left p-3 font-medium">Type</th>
                      <th className="text-left p-3 font-medium">Mode</th>
                      <th className="text-left p-3 font-medium">Linked To</th>
                      <th className="text-right p-3 font-medium">Amount</th>
                      <th className="text-center p-3 font-medium w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((exp) => (
                      <tr key={exp.id} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                        <td className="p-3 text-muted-foreground whitespace-nowrap">{new Date(exp.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                        <td className="p-3">
                          <div>{exp.description}</div>
                          {exp.vendor && <div className="text-xs text-muted-foreground">{exp.vendor}</div>}
                        </td>
                        <td className="p-3"><Badge variant="outline" className="text-xs">{exp.department}</Badge></td>
                        <td className="p-3 text-muted-foreground">{exp.expenseType}</td>
                        <td className="p-3"><Badge variant="secondary" className="text-xs">{exp.mode}</Badge></td>
                        <td className="p-3">
                          {exp.linkType ? (
                            <div className="text-xs">
                              <span className="text-muted-foreground capitalize">{exp.linkType}: </span>
                              <span>{exp.linkedLabel}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="p-3 text-right font-medium whitespace-nowrap">{formatCurrency(exp.amount)}</td>
                        <td className="p-3 text-center">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDelete(exp.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-muted/30 font-medium">
                      <td colSpan={6} className="p-3 text-right">Total</td>
                      <td className="p-3 text-right">{formatCurrency(totalAmount)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AddExpenses;
