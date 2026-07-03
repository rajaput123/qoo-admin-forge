import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { financeSelectors, financeActions } from "@/modules/finance/financeStore";
import { FinanceTableRadioGroup, FinanceTableRadioHead, FinanceTableRadioCell } from "@/components/finance/FinanceTableRadio";

const FinanceCategories = () => {
  const [, setTick] = useState(0);
  const refresh = () => setTick(t => t + 1);

  const categories = financeSelectors.getCategories();
  const funds = financeSelectors.getFunds();
  const transactions = financeSelectors.getTransactions();

  const incomeCategories = categories.filter(c => c.type === "Income");
  const expenseCategories = categories.filter(c => c.type === "Expense");

  const getCategoryTxnCount = (catName: string) =>
    transactions.filter(t => t.category === catName).length;

  // Add dialog
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<"Income" | "Expense">("Income");
  const [newFund, setNewFund] = useState("");
  const [selectedIncomeId, setSelectedIncomeId] = useState("");
  const [selectedExpenseId, setSelectedExpenseId] = useState("");

  const handleAdd = () => {
    if (!newName.trim()) { toast.error("Category name is required"); return; }
    const result = financeActions.addCategory({
      name: newName.trim(),
      type: newType,
      suggestedFund: newFund || undefined,
    });
    if (result) {
      toast.success(`Category "${result.name}" created`);
      setShowAdd(false);
      setNewName("");
      setNewFund("");
      refresh();
    } else {
      toast.error("Category with this name already exists");
    }
  };

  const CategoryTable = ({ cats, selectedId, onSelectedIdChange }: { cats: typeof categories; selectedId: string; onSelectedIdChange: (v: string) => void }) => (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <FinanceTableRadioGroup value={selectedId} onValueChange={onSelectedIdChange}>
          <Table>
            <TableHeader>
              <TableRow>
                <FinanceTableRadioHead />
                <TableHead className="text-xs">Category</TableHead>
                <TableHead className="text-xs">ID</TableHead>
                <TableHead className="text-xs">Suggested Fund</TableHead>
                <TableHead className="text-xs text-center">Transactions</TableHead>
                <TableHead className="text-xs text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cats.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No categories</TableCell></TableRow>
              ) : cats.map(c => {
                const count = getCategoryTxnCount(c.name);
                const fundName = funds.find(f => f.id === c.suggestedFund)?.name || "—";
                return (
                  <TableRow key={c.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => onSelectedIdChange(c.id)}>
                    <FinanceTableRadioCell value={c.id} />
                    <TableCell className="text-sm font-medium">{c.name}</TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">{c.id}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{fundName}</TableCell>
                    <TableCell className="text-xs text-center">{count}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">Active</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          </FinanceTableRadioGroup>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">Manage income & expense categories</p>
        <Button className="gap-2" onClick={() => setShowAdd(true)}>
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      <Tabs defaultValue="income">
        <TabsList>
          <TabsTrigger value="income">Income ({incomeCategories.length})</TabsTrigger>
          <TabsTrigger value="expense">Expense ({expenseCategories.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="income" className="mt-4">
          <CategoryTable cats={incomeCategories} selectedId={selectedIncomeId} onSelectedIdChange={setSelectedIncomeId} />
        </TabsContent>
        <TabsContent value="expense" className="mt-4">
          <CategoryTable cats={expenseCategories} selectedId={selectedExpenseId} onSelectedIdChange={setSelectedExpenseId} />
        </TabsContent>
      </Tabs>

      {/* Add Category Dialog */}
      <Dialog open={showAdd} onOpenChange={v => { if (!v) { setNewName(""); setNewFund(""); } setShowAdd(v); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Add Category</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name *</Label>
              <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Temple Repairs" />
            </div>
            <div>
              <Label>Type *</Label>
              <Select value={newType} onValueChange={v => setNewType(v as "Income" | "Expense")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Income">Income</SelectItem>
                  <SelectItem value="Expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Suggested Fund</Label>
              <Select value={newFund} onValueChange={setNewFund}>
                <SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger>
                <SelectContent>
                  {funds.map(f => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinanceCategories;
