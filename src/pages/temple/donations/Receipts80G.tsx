import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Receipt, FileDown, FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useCertificates80G, useDonations } from "@/modules/donations/hooks";
import { generate80GCertificate } from "@/modules/donations/donationsStore";

const formatCurrency = (val: number) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
  return `₹${val.toLocaleString()}`;
};

const Receipts80G = () => {
  const donations = useDonations();
  const certificates80G = useCertificates80G();
  const [search, setSearch] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState<{
    id: string;
    donationId: string;
    donor: string;
    amount: number;
    date: string;
    mode: string;
    status: string;
  } | null>(null);

  const receipts = donations.map(d => ({
    id: d.receiptNo,
    donationId: d.donationId,
    donor: d.donorName,
    amount: d.amount,
    date: d.date,
    mode: d.channel,
    receiptType: "Standard",
    status: "Issued",
  }));

  const filteredReceipts = receipts.filter(r =>
    r.id.toLowerCase().includes(search.toLowerCase()) ||
    r.donationId.toLowerCase().includes(search.toLowerCase()) ||
    r.donor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Receipts & 80G Certificates</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage donation receipts and generate 80G tax exemption certificates</p>
        </div>
        <Button variant="outline" size="sm"><FileDown className="h-4 w-4 mr-1" /> Export All</Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><div className="p-2 rounded-lg bg-muted"><Receipt className="h-4 w-4 text-primary" /></div><div><p className="text-xl font-bold">3,412</p><p className="text-xs text-muted-foreground">Total Receipts</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><div className="p-2 rounded-lg bg-muted"><CheckCircle2 className="h-4 w-4 text-green-600" /></div><div><p className="text-xl font-bold">42</p><p className="text-xs text-muted-foreground">80G Certificates</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><div className="p-2 rounded-lg bg-muted"><Clock className="h-4 w-4 text-amber-600" /></div><div><p className="text-xl font-bold">5</p><p className="text-xs text-muted-foreground">Pending 80G</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><div className="p-2 rounded-lg bg-muted"><AlertCircle className="h-4 w-4 text-red-600" /></div><div><p className="text-xl font-bold">2</p><p className="text-xs text-muted-foreground">PAN Missing</p></div></CardContent></Card>
      </div>

      <Tabs defaultValue="receipts">
        <TabsList>
          <TabsTrigger value="receipts">Donation Receipts</TabsTrigger>
          <TabsTrigger value="80g">80G Certificates</TabsTrigger>
        </TabsList>

        <TabsContent value="receipts" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <div className="relative max-w-md mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search receipts..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Receipt No.</TableHead>
                    <TableHead>Donation ID</TableHead>
                    <TableHead>Donor</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReceipts.map(r => (
                    <TableRow key={r.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedReceipt(r)}>
                      <TableCell className="font-mono text-xs">{r.id}</TableCell>
                      <TableCell className="font-mono text-xs">{r.donationId}</TableCell>
                      <TableCell className="font-medium text-sm">{r.donor}</TableCell>
                      <TableCell className="text-right font-mono font-medium">{formatCurrency(r.amount)}</TableCell>
                      <TableCell className="text-xs">{r.mode}</TableCell>
                      <TableCell className="text-xs">{r.date}</TableCell>
                      <TableCell><Badge variant="default" className="text-[10px]">{r.status}</Badge></TableCell>
                      <TableCell><Button variant="ghost" size="sm" className="h-7 text-xs"><FileDown className="h-3 w-3 mr-1" />PDF</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="80g" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Certificate ID</TableHead>
                    <TableHead>Donor</TableHead>
                    <TableHead>PAN</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead>FY</TableHead>
                    <TableHead className="text-right">Receipts</TableHead>
                    <TableHead>Generated</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {certificates80G.map(c => (
                    <TableRow key={c.certificateId}>
                      <TableCell className="font-mono text-xs">{c.certificateId}</TableCell>
                      <TableCell className="font-medium text-sm">{c.donorName}</TableCell>
                      <TableCell className="font-mono text-xs">{c.pan}</TableCell>
                      <TableCell className="text-right font-mono font-medium">{formatCurrency(c.totalAmount)}</TableCell>
                      <TableCell className="text-xs">{c.fy}</TableCell>
                      <TableCell className="text-right">{c.receiptNos.length}</TableCell>
                      <TableCell className="text-xs">{c.generatedDate}</TableCell>
                      <TableCell><Badge variant={c.status === "Generated" ? "default" : "secondary"} className="text-[10px]">{c.status}</Badge></TableCell>
                      <TableCell>
                        {c.status === "Generated" ? (
                          <Button variant="ghost" size="sm" className="h-7 text-xs"><FileDown className="h-3 w-3 mr-1" />PDF</Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => {
                              generate80GCertificate({ donorId: c.donorId, fy: c.fy, createdBy: "System" });
                            }}
                          >
                            Generate
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Receipt Detail */}
      <Dialog open={!!selectedReceipt} onOpenChange={() => setSelectedReceipt(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Receipt Details</DialogTitle></DialogHeader>
          {selectedReceipt && (
            <div className="space-y-3">
              <div className="p-4 rounded-lg border bg-muted/30 text-center">
                <p className="font-mono text-lg font-bold">{selectedReceipt.id}</p>
                <p className="text-2xl font-bold mt-2">{formatCurrency(selectedReceipt.amount)}</p>
                <p className="text-sm text-muted-foreground">{selectedReceipt.donor}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Donation ID", selectedReceipt.donationId],
                  ["Payment Mode", selectedReceipt.mode],
                  ["Date", selectedReceipt.date],
                  ["Status", selectedReceipt.status],
                ].map(([l, v]) => (
                  <div key={l} className="p-2 rounded bg-muted/50">
                    <p className="text-[10px] text-muted-foreground">{l}</p>
                    <p className="font-medium">{v}</p>
                  </div>
                ))}
              </div>
              <Button className="w-full" variant="outline"><FileDown className="h-4 w-4 mr-2" /> Download Receipt PDF</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Receipts80G;
