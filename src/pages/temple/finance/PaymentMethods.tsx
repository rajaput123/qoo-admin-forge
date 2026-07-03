import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Wallet, Plus, Pencil, CreditCard, Banknote, Smartphone, Building2, FileText } from "lucide-react";
import { toast } from "sonner";
import { FinanceTableRadioGroup, FinanceTableRadioHead, FinanceTableRadioCell } from "@/components/finance/FinanceTableRadio";

const methods = [
  { id: 1, name: "Cash", icon: Banknote, transactions: 890, status: true, description: "Physical cash payments" },
  { id: 2, name: "UPI", icon: Smartphone, transactions: 1250, status: true, description: "Google Pay, PhonePe, Paytm, etc." },
  { id: 3, name: "Bank Transfer", icon: Building2, transactions: 320, status: true, description: "NEFT, RTGS, IMPS transfers" },
  { id: 4, name: "Cheque", icon: FileText, transactions: 85, status: true, description: "Cheque payments" },
  { id: 5, name: "Online Payment", icon: CreditCard, transactions: 450, status: true, description: "Website & payment gateway" },
  { id: 6, name: "In-Kind", icon: Wallet, transactions: 28, status: true, description: "Non-cash donations (goods, assets)" },
];

const PaymentMethods = () => {
  const [methodList, setMethodList] = useState(methods);
  const [selectedId, setSelectedId] = useState("");

  const toggleStatus = (id: number) => {
    setMethodList(prev => prev.map(m => m.id === id ? { ...m, status: !m.status } : m));
    toast.success("Payment method updated");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">Configure accepted payment modes</p>
        <Button className="gap-2" onClick={() => toast.info("Add payment method")}><Plus className="h-4 w-4" /> Add Method</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <FinanceTableRadioGroup value={selectedId} onValueChange={setSelectedId}>
            <Table>
              <TableHeader>
                <TableRow>
                  <FinanceTableRadioHead />
                  <TableHead className="text-xs">Method</TableHead>
                  <TableHead className="text-xs">Description</TableHead>
                  <TableHead className="text-xs text-center">Transactions</TableHead>
                  <TableHead className="text-xs text-center">Status</TableHead>
                  <TableHead className="text-xs text-center">Enabled</TableHead>
                  <TableHead className="text-xs text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {methodList.map(m => (
                  <TableRow key={m.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => setSelectedId(String(m.id))}>
                    <FinanceTableRadioCell value={String(m.id)} />
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <m.icon className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{m.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{m.description}</TableCell>
                    <TableCell className="text-xs text-center">{m.transactions}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={`text-[10px] ${m.status ? "bg-green-50 text-green-700 border-green-200" : "bg-muted text-muted-foreground"}`}>
                        {m.status ? "Active" : "Disabled"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch checked={m.status} onCheckedChange={() => toggleStatus(m.id)} />
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="h-3 w-3" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </FinanceTableRadioGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentMethods;
