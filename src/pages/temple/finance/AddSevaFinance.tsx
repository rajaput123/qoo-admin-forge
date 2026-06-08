import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Save } from "lucide-react";
import { toast } from "sonner";

const AddSevaFinance = () => {
  const [devoteeName, setDevoteeName] = useState("");
  const [sevaType, setSevaType] = useState("");
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("");
  const [bankRef, setBankRef] = useState("");
  const [date, setDate] = useState("");
  const [remarks, setRemarks] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Seva booking recorded successfully");
    setDevoteeName(""); setSevaType(""); setAmount(""); setMode(""); setBankRef(""); setDate(""); setRemarks("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" /> Add Seva
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">Book a new seva entry</p>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Seva Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label>Devotee Name</Label><Input value={devoteeName} onChange={e => setDevoteeName(e.target.value)} placeholder="Enter devotee name" className="mt-1" required /></div>
            <div>
              <Label>Seva Type</Label>
              <Select value={sevaType} onValueChange={setSevaType}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select seva" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="archana">Archana</SelectItem>
                  <SelectItem value="abhishekam">Abhishekam</SelectItem>
                  <SelectItem value="homam">Homam</SelectItem>
                  <SelectItem value="sahasranamam">Sahasranamam</SelectItem>
                  <SelectItem value="kalyanam">Kalyanam</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Amount (₹)</Label><Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount" className="mt-1" required /></div>
            <div>
              <Label>Payment Mode</Label>
              <Select value={mode} onValueChange={v => { setMode(v); setBankRef(""); }}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select mode" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {mode && (
              <div>
                <Label>
                  {mode === "cash" ? "Bank Reference / UTR No" :
                    mode === "bank" ? "Bank Reference / UTR No" :
                    mode === "upi" ? "UPI Reference / Txn ID" :
                    "Payment Reference"}
                </Label>
                <Input
                  value={bankRef}
                  onChange={e => setBankRef(e.target.value)}
                  placeholder={
                    mode === "cash" ? "e.g. UTR for cash deposit (optional)" :
                    mode === "bank" ? "e.g. NEFT/RTGS UTR number" :
                    mode === "upi" ? "e.g. UPI transaction reference" :
                    "e.g. gateway transaction ID"
                  }
                  className="mt-1"
                />
              </div>
            )}
            <div><Label>Seva Date</Label><Input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1" required /></div>
            <div className="md:col-span-2">
              <Label>Remarks</Label>
              <Textarea value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Additional notes..." className="mt-1" rows={3} />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" className="gap-2"><Save className="h-4 w-4" /> Save Seva</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddSevaFinance;
