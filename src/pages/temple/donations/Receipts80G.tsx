import { useState } from "react";
import JSZip from "jszip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Receipt, FileDown, FileText, CheckCircle2, Clock, AlertCircle, Package } from "lucide-react";
import { useCertificates80G, useDonations } from "@/modules/donations/hooks";
import { useDonors } from "@/modules/donations/hooks";
import { generate80GCertificate } from "@/modules/donations/donationsStore";
import { downloadReceipt } from "@/lib/receiptGenerator";
import { useToast } from "@/hooks/use-toast";

const formatCurrency = (val: number) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
  return `₹${val.toLocaleString()}`;
};

const Receipts80G = () => {
  const donations = useDonations();
  const donors = useDonors();
  const certificates80G = useCertificates80G();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [bulkFy, setBulkFy] = useState<string>("2024-25");
  const [bulkLoading, setBulkLoading] = useState(false);
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

  // Available FYs from existing certificates
  const fyOptions = Array.from(new Set(certificates80G.map(c => c.fy))).filter(Boolean);
  if (fyOptions.length === 0) fyOptions.push("2024-25");

  const handleBulkDownload = async () => {
    const fyCerts = certificates80G.filter(c => c.fy === bulkFy && c.status === "Generated");
    if (fyCerts.length === 0) {
      toast({ title: "No certificates", description: `No generated 80G certificates for FY ${bulkFy}`, variant: "destructive" });
      return;
    }
    setBulkLoading(true);
    try {
      const zip = new JSZip();
      fyCerts.forEach(c => {
        // Each certificate as a Form 10BE text representation
        const content = `FORM 10BE — CERTIFICATE OF DONATION
(Under Section 80G(5)(ix) of the Income Tax Act, 1961)

Certificate ID : ${c.certificateId}
Financial Year : ${c.fy}
Generated On   : ${c.generatedDate}

------------------------------------------------------------
Donor Details
------------------------------------------------------------
Donor Name     : ${c.donorName}
Donor ID       : ${c.donorId}
PAN            : ${c.pan}

------------------------------------------------------------
Donation Summary
------------------------------------------------------------
Total Receipts : ${c.receiptNos.length}
Total Amount   : ₹${c.totalAmount.toLocaleString("en-IN")}

Receipt Numbers:
${c.receiptNos.map(r => `  • ${r}`).join("\n")}

------------------------------------------------------------
This certificate is issued under Section 80G of the Income Tax Act.
Donations are eligible for deduction as per the prescribed limits.

Authorised Signatory
Sri Venkateswara Temple
`;
        const safe = c.donorName.replace(/[^a-z0-9]/gi, "_");
        zip.file(`${c.certificateId}_${safe}.txt`, content);
      });
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Form10BE_Certificates_FY${bulkFy}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "ZIP downloaded", description: `${fyCerts.length} Form 10BE certificates exported` });
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to generate ZIP", variant: "destructive" });
    } finally {
      setBulkLoading(false);
    }
  };

  const handleReceiptPDF = (receiptId: string) => {
    const d = donations.find(x => x.receiptNo === receiptId);
    if (!d) {
      toast({ title: "Not found", description: "Donation not found", variant: "destructive" });
      return;
    }
    try {
      const donor = donors.find(x => x.donorId === d.donorId) || null;
      downloadReceipt(d, donor, d.is80G || false);
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to open PDF", variant: "destructive" });
    }
  };

  const handle80GPDF = (certificateId: string) => {
    const c = certificates80G.find(x => x.certificateId === certificateId);
    if (!c) return;
    const w = window.open('', '_blank');
    if (!w) {
      toast({ title: "Popup blocked", description: "Please allow popups to download the PDF", variant: "destructive" });
      return;
    }
    const html = `<!doctype html><html><head><meta charset="utf-8"/><title>${c.certificateId}</title>
<style>
  body{font-family:Georgia,serif;color:#1a1a1a;padding:48px;max-width:780px;margin:auto}
  .border{border:2px solid #c2410c;padding:32px;border-radius:8px}
  h1{text-align:center;color:#9a3412;margin:0 0 4px;font-size:22px;letter-spacing:1px}
  h2{text-align:center;font-size:13px;font-weight:normal;color:#57534e;margin:0 0 24px}
  .row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px dotted #d6d3d1}
  .label{color:#57534e;font-size:12px}.val{font-weight:600;font-size:13px}
  table{width:100%;margin-top:16px;border-collapse:collapse;font-size:12px}
  th,td{border:1px solid #d6d3d1;padding:6px 8px;text-align:left}
  th{background:#fed7aa}
  .sig{margin-top:48px;text-align:right;font-size:13px}
  .note{margin-top:24px;font-size:11px;color:#57534e;font-style:italic;text-align:center}
</style></head><body>
<div class="border">
  <h1>FORM 10BE — CERTIFICATE OF DONATION</h1>
  <h2>Under Section 80G(5)(ix) of the Income Tax Act, 1961</h2>
  <div class="row"><span class="label">Certificate ID</span><span class="val">${c.certificateId}</span></div>
  <div class="row"><span class="label">Financial Year</span><span class="val">${c.fy}</span></div>
  <div class="row"><span class="label">Generated On</span><span class="val">${c.generatedDate}</span></div>
  <div class="row"><span class="label">Donor Name</span><span class="val">${c.donorName}</span></div>
  <div class="row"><span class="label">Donor ID</span><span class="val">${c.donorId}</span></div>
  <div class="row"><span class="label">PAN</span><span class="val">${c.pan}</span></div>
  <div class="row"><span class="label">Total Receipts</span><span class="val">${c.receiptNos.length}</span></div>
  <div class="row"><span class="label">Total Amount</span><span class="val">₹${c.totalAmount.toLocaleString("en-IN")}</span></div>
  <table><thead><tr><th>#</th><th>Receipt No.</th></tr></thead><tbody>
    ${c.receiptNos.map((r,i)=>`<tr><td>${i+1}</td><td>${r}</td></tr>`).join("")}
  </tbody></table>
  <p class="note">This certificate is issued under Section 80G of the Income Tax Act, 1961. Donations are eligible for deduction as per the prescribed limits.</p>
  <div class="sig">_____________________<br/>Authorised Signatory<br/>Sri Venkateswara Temple</div>
</div>
<script>window.onload=()=>setTimeout(()=>{window.print();},250);</script>
</body></html>`;
    w.document.write(html);
    w.document.close();
  };

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
                      <TableCell><Button variant="ghost" size="sm" className="h-7 text-xs" onClick={(e) => { e.stopPropagation(); handleReceiptPDF(r.id); }}><FileDown className="h-3 w-3 mr-1" />PDF</Button></TableCell>
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
              {/* Bulk download bar */}
              <div className="flex flex-wrap items-end gap-3 mb-4 p-3 rounded-lg border bg-muted/30">
                <div className="flex-1 min-w-[200px]">
                  <p className="text-sm font-medium mb-1">Form 10BE — Bulk Download</p>
                  <p className="text-xs text-muted-foreground">Download all donor certificates for a financial year as a single ZIP file</p>
                </div>
                <Select value={bulkFy} onValueChange={setBulkFy}>
                  <SelectTrigger className="w-36"><SelectValue placeholder="FY" /></SelectTrigger>
                  <SelectContent>
                    {fyOptions.map(f => <SelectItem key={f} value={f}>FY {f}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button onClick={handleBulkDownload} disabled={bulkLoading}>
                  <Package className="h-4 w-4 mr-2" />
                  {bulkLoading ? "Preparing..." : "Download ZIP"}
                </Button>
              </div>
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
                          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => handle80GPDF(c.certificateId)}><FileDown className="h-3 w-3 mr-1" />PDF</Button>
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
              <Button className="w-full" variant="outline" onClick={() => handleReceiptPDF(selectedReceipt.id)}><FileDown className="h-4 w-4 mr-2" /> Download Receipt PDF</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Receipts80G;
