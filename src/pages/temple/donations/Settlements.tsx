import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Banknote, CheckCircle2, IndianRupee } from "lucide-react";
import { useDonations, useSettlements } from "@/modules/donations/hooks";
import { recordSettlement } from "@/modules/donations/donationsStore";
import { useToast } from "@/hooks/use-toast";

const fmt = (v: number) => `₹${v.toLocaleString("en-IN")}`;
const fmtDate = (d: string) => {
  try { return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return d; }
};

const BANK_ACCOUNTS = ["SBI Main Account", "HDFC Project Account", "UPI Wallet", "Cash on Hand"];

const SettlementsPage = () => {
  const { toast } = useToast();
  const donations = useDonations();
  const settlements = useSettlements();

  const [tab, setTab] = useState<"create" | "history">("create");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bankAccount, setBankAccount] = useState("");
  const [bankRef, setBankRef] = useState("");
  const [settleDate, setSettleDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [natureFilter, setNatureFilter] = useState<"All" | "Cash" | "Non-Cash">("Cash");

  // Unsettled donations only
  const unsettled = useMemo(() =>
    donations.filter(d => !d.settlementId && (natureFilter === "All" || d.nature === natureFilter))
      .sort((a, b) => b.date.localeCompare(a.date)),
    [donations, natureFilter]
  );

  const selectedTotal = useMemo(() =>
    donations.filter(d => selected.has(d.donationId)).reduce((s, d) => s + d.amount, 0),
    [donations, selected]
  );

  const toggleAll = () => {
    if (selected.size === unsettled.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(unsettled.map(d => d.donationId)));
    }
  };

  const handleCreate = () => {
    if (selected.size === 0) return toast({ title: "No donations selected", variant: "destructive" });
    if (!bankAccount) return toast({ title: "Select bank account", variant: "destructive" });
    if (!bankRef.trim()) return toast({ title: "Enter bank reference / UTR", variant: "destructive" });

    const settlement = recordSettlement({
      date: settleDate,
      bankReference: bankRef.trim(),
      bankAccountName: bankAccount,
      donationIds: Array.from(selected),
      notes: notes.trim() || undefined,
      createdBy: "Admin",
    });

    toast({ title: "Settlement created", description: `${settlement.settlementId} — ${fmt(settlement.totalAmount)}` });
    setSelected(new Set());
    setBankRef("");
    setNotes("");
    setTab("history");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Settlements</h1>
          <p className="text-sm text-muted-foreground mt-1">Group donations into bank settlements for reconciliation</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Unsettled donations</p>
            <p className="text-lg font-bold">{donations.filter(d => !d.settlementId).length}</p>
          </div>
        </div>
      </div>

      <Tabs value={tab} onValueChange={v => setTab(v as "create" | "history")}>
        <TabsList>
          <TabsTrigger value="create"><PlusCircle className="h-4 w-4 mr-2" />Create Settlement</TabsTrigger>
          <TabsTrigger value="history"><CheckCircle2 className="h-4 w-4 mr-2" />Settlement History</TabsTrigger>
        </TabsList>

        {/* ── Create Settlement ── */}
        <TabsContent value="create" className="space-y-4 mt-4">
          {/* Config row */}
          <Card>
            <CardContent className="pt-5">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Settlement Date *</Label>
                  <Input type="date" value={settleDate} onChange={e => setSettleDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Bank Account *</Label>
                  <Select value={bankAccount} onValueChange={setBankAccount}>
                    <SelectTrigger><SelectValue placeholder="Select account" /></SelectTrigger>
                    <SelectContent>
                      {BANK_ACCOUNTS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Bank Reference / UTR *</Label>
                  <Input placeholder="e.g. UTR123456789" value={bankRef} onChange={e => setBankRef(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Filter Donations</Label>
                  <Select value={natureFilter} onValueChange={v => { setNatureFilter(v as any); setSelected(new Set()); }}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="Cash">Cash Only</SelectItem>
                      <SelectItem value="Non-Cash">Non-Cash Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-4">
                  <Label>Notes</Label>
                  <Textarea placeholder="Optional notes about this settlement" value={notes} onChange={e => setNotes(e.target.value)} rows={2} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary bar */}
          {selected.size > 0 && (
            <div className="flex items-center justify-between p-4 rounded-xl bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-3">
                <IndianRupee className="h-5 w-5 text-primary" />
                <span className="font-semibold">{selected.size} donation{selected.size > 1 ? "s" : ""} selected — Total: {fmt(selectedTotal)}</span>
              </div>
              <Button onClick={handleCreate}>
                <Banknote className="h-4 w-4 mr-2" />Settle to Bank
              </Button>
            </div>
          )}

          {/* Donation table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={unsettled.length > 0 && selected.size === unsettled.length}
                        onCheckedChange={toggleAll}
                      />
                    </TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Donation ID</TableHead>
                    <TableHead>Donor</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>80G</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unsettled.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                        No unsettled donations found
                      </TableCell>
                    </TableRow>
                  ) : (
                    unsettled.map(d => (
                      <TableRow key={d.donationId} className="cursor-pointer" onClick={() => {
                        const next = new Set(selected);
                        next.has(d.donationId) ? next.delete(d.donationId) : next.add(d.donationId);
                        setSelected(next);
                      }}>
                        <TableCell onClick={e => e.stopPropagation()}>
                          <Checkbox
                            checked={selected.has(d.donationId)}
                            onCheckedChange={() => {
                              const next = new Set(selected);
                              next.has(d.donationId) ? next.delete(d.donationId) : next.add(d.donationId);
                              setSelected(next);
                            }}
                          />
                        </TableCell>
                        <TableCell className="text-sm">{fmtDate(d.date)}</TableCell>
                        <TableCell className="font-mono text-xs">{d.donationId}</TableCell>
                        <TableCell className="font-medium">{d.donorName}</TableCell>
                        <TableCell className="text-sm">{d.purpose}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">{d.mode}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold">{fmt(d.amount)}</TableCell>
                        <TableCell>
                          {d.is80G && <Badge className="bg-green-100 text-green-700 text-xs">80G</Badge>}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Settlement History ── */}
        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Settlement History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Settlement ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Bank Account</TableHead>
                    <TableHead>Bank Reference</TableHead>
                    <TableHead className="text-center">Donations</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {settlements.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                        No settlements yet. Create one from the tab above.
                      </TableCell>
                    </TableRow>
                  ) : (
                    settlements.map(s => (
                      <TableRow key={s.settlementId}>
                        <TableCell className="font-mono text-xs">{s.settlementId}</TableCell>
                        <TableCell className="text-sm">{fmtDate(s.date)}</TableCell>
                        <TableCell>{s.bankAccountName}</TableCell>
                        <TableCell className="font-mono text-xs">{s.bankReference}</TableCell>
                        <TableCell className="text-center">{s.donationIds.length}</TableCell>
                        <TableCell className="text-right font-semibold">{fmt(s.totalAmount)}</TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-100 text-emerald-700 text-xs">{s.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettlementsPage;
