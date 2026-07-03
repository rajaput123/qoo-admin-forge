import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Printer, Save, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { FinanceTableRadioGroup, FinanceTableRadioHead, FinanceTableRadioCell } from "@/components/finance/FinanceTableRadio";

interface LineItem {
  desc: string;
  unit: string;
  qty: string;
  price: string;
  gst: number;
}

const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN")}`;

const CreatePurchaseOrderPage = () => {
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { desc: "Pooja Samagri Kit", unit: "Set", qty: "10", price: "850", gst: 18 },
  ]);
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split("T")[0]);
  const [deliveryBy, setDeliveryBy] = useState("");
  const [vendor, setVendor] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("Net 30");
  const [approvedBy, setApprovedBy] = useState("");
  const [selectedLineId, setSelectedLineId] = useState("");

  const updateLine = (idx: number, field: keyof LineItem, value: string | number) => {
    setLineItems((prev) => prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item)));
  };

  const totals = lineItems.reduce(
    (acc, item) => {
      const base = (parseFloat(item.qty) || 0) * (parseFloat(item.price) || 0);
      const gstAmt = Math.round(base * item.gst / 100);
      return { subTotal: acc.subTotal + base, totalGST: acc.totalGST + gstAmt, grandTotal: acc.grandTotal + base + gstAmt };
    },
    { subTotal: 0, totalGST: 0, grandTotal: 0 }
  );

  const handleSave = () => {
    if (!vendor || !deliveryBy || !approvedBy) {
      toast.error("Please fill all required fields");
      return;
    }
    toast.success("Purchase order saved (mock)");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">Add line items and supplier details</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.success("PO exported (mock PDF)")}>
            <Download className="h-4 w-4 mr-1.5" /> Export PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-1.5" /> Print
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-1.5" /> Save Order
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label>PO Number</Label>
              <Input readOnly value="PO-2026-AUTO" className="bg-muted font-mono" />
            </div>
            <div className="space-y-1.5">
              <Label>Order Date *</Label>
              <Input type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Temple *</Label>
              <Input readOnly value="Sri Ganesha Temple" className="bg-muted" />
            </div>
            <div className="space-y-1.5">
              <Label>Delivery By *</Label>
              <Input type="date" value={deliveryBy} onChange={(e) => setDeliveryBy(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Vendor / Supplier *</Label>
              <Select value={vendor} onValueChange={setVendor}>
                <SelectTrigger className="bg-background"><SelectValue placeholder="Select vendor" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="v1">Ramesh — Sri Pooja Stores</SelectItem>
                  <SelectItem value="v2">Lakshmi — Temple Catering Co.</SelectItem>
                  <SelectItem value="v3">Venkat — Flower Vendor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Payment Terms</Label>
              <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Net 30", "Net 45", "Net 60", "Advance Payment", "On Delivery"].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Approved By *</Label>
              <Select value={approvedBy} onValueChange={setApprovedBy}>
                <SelectTrigger className="bg-background"><SelectValue placeholder="Select authority" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="shashank">Shashank (SuperAdmin)</SelectItem>
                  <SelectItem value="priya">Priya Sharma (Accounts)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg">Particulars</CardTitle>
          <Button size="sm" onClick={() => setLineItems([...lineItems, { desc: "", unit: "Nos", qty: "", price: "", gst: 18 }])}>
            <Plus className="h-4 w-4 mr-1.5" /> Add Item
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <FinanceTableRadioGroup value={selectedLineId} onValueChange={setSelectedLineId}>
          <Table>
            <TableHeader>
              <TableRow>
                <FinanceTableRadioHead />
                <TableHead className="w-10">#</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="text-center">Qty</TableHead>
                <TableHead className="text-right">Rate (₹)</TableHead>
                <TableHead className="text-center">GST</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {lineItems.map((item, idx) => {
                const base = (parseFloat(item.qty) || 0) * (parseFloat(item.price) || 0);
                const amt = base + Math.round(base * item.gst / 100);
                return (
                  <TableRow key={idx} className="hover:bg-muted/50 cursor-pointer" onClick={() => setSelectedLineId(String(idx))}>
                    <FinanceTableRadioCell value={String(idx)} />
                    <TableCell className="text-muted-foreground text-sm">{idx + 1}</TableCell>
                    <TableCell>
                      <Input value={item.desc} onChange={(e) => updateLine(idx, "desc", e.target.value)} placeholder="Item description" />
                    </TableCell>
                    <TableCell>
                      <Select value={item.unit} onValueChange={(v) => updateLine(idx, "unit", v)}>
                        <SelectTrigger className="w-[90px] bg-background"><SelectValue /></SelectTrigger>
                        <SelectContent>{["Nos", "Set", "Kg", "Litre", "Box"].map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input value={item.qty} onChange={(e) => updateLine(idx, "qty", e.target.value)} className="text-center w-20 mx-auto" type="number" />
                    </TableCell>
                    <TableCell>
                      <Input value={item.price} onChange={(e) => updateLine(idx, "price", e.target.value)} className="text-right w-28 ml-auto" type="number" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Select value={String(item.gst)} onValueChange={(v) => updateLine(idx, "gst", Number(v))}>
                        <SelectTrigger className="w-[80px] mx-auto bg-background"><SelectValue /></SelectTrigger>
                        <SelectContent>{[0, 5, 12, 18, 28].map((g) => <SelectItem key={g} value={String(g)}>{g}%</SelectItem>)}</SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="font-medium text-right text-sm">{formatCurrency(amt)}</TableCell>
                    <TableCell>
                      {lineItems.length > 1 && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setLineItems(lineItems.filter((_, i) => i !== idx))}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          </FinanceTableRadioGroup>
          <div className="px-6 py-4 border-t flex justify-end gap-8 text-sm">
            <div><span className="text-muted-foreground">Subtotal:</span> <strong>{formatCurrency(totals.subTotal)}</strong></div>
            <div><span className="text-muted-foreground">GST:</span> <strong>{formatCurrency(totals.totalGST)}</strong></div>
            <div><span className="text-muted-foreground">Grand Total:</span> <strong className="text-primary">{formatCurrency(totals.grandTotal)}</strong></div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CreatePurchaseOrderPage;
