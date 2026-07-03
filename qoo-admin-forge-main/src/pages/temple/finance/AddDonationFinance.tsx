import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Save } from "lucide-react";
import { toast } from "sonner";

const AddDonationFinance = () => {
  const [donorName, setDonorName] = useState("");
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("");
  const [purpose, setPurpose] = useState("");
  const [remarks, setRemarks] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Donation recorded successfully");
    setDonorName(""); setAmount(""); setMode(""); setPurpose(""); setRemarks("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary" /> Add Donation
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">Record a new donation entry</p>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Donation Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label>Donor Name</Label><Input value={donorName} onChange={e => setDonorName(e.target.value)} placeholder="Enter donor name" className="mt-1" required /></div>
            <div><Label>Amount (₹)</Label><Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount" className="mt-1" required /></div>
            <div>
              <Label>Payment Mode</Label>
              <Select value={mode} onValueChange={setMode}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select mode" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Purpose / Fund</Label>
              <Select value={purpose} onValueChange={setPurpose}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select purpose" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Fund</SelectItem>
                  <SelectItem value="annadanam">Annadanam</SelectItem>
                  <SelectItem value="renovation">Temple Renovation</SelectItem>
                  <SelectItem value="festival">Festival Fund</SelectItem>
                  <SelectItem value="education">Education Fund</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Remarks</Label>
              <Textarea value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Additional notes..." className="mt-1" rows={3} />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" className="gap-2"><Save className="h-4 w-4" /> Save Donation</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddDonationFinance;
