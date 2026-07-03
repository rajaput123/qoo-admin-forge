import { useMemo, useState } from "react";
import JSZip from "jszip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Search,
  Calendar,
  FileCheck2,
  Award,
  Download,
  Receipt,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDonations, useDonors, useReceipts80G } from "@/modules/donations/hooks";
import { build80GReceiptPdfBlob, download80GReceiptPdf, download80GBlankTemplatePdf } from "@/lib/eightyGReceipt";
import { downloadReceiptPdf } from "@/lib/pdfDocs";
import { useToast } from "@/hooks/use-toast";

const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN")}`;

const generateFYOptions = () => {
  const curr = new Date();
  const year = curr.getMonth() >= 3 ? curr.getFullYear() : curr.getFullYear() - 1;
  return Array.from({ length: 5 }, (_, i) => {
    const y = year - i;
    return { value: `${y}-${String(y + 1).slice(2)}`, start: `${y}-04-01`, end: `${y + 1}-03-31` };
  });
};

const Section80G = () => {
  const donors = useDonors();
  const donations = useDonations();
  const receipts80G = useReceipts80G();
  const { toast } = useToast();

  const fyOptions = useMemo(() => generateFYOptions(), []);
  const [fy, setFy] = useState(fyOptions[0].value);
  const [search, setSearch] = useState("");
  const [bulkLoading, setBulkLoading] = useState(false);

  const generatedReceipts = useMemo(
    () => receipts80G.filter((r) => r.status === "Generated"),
    [receipts80G]
  );

  const fyReceipts = useMemo(
    () => generatedReceipts.filter((r) => r.fy === fy),
    [generatedReceipts, fy]
  );

  const panMissingCount = useMemo(
    () => receipts80G.filter((r) => r.fy === fy && r.status === "PAN Missing").length,
    [receipts80G, fy]
  );

  const fyTotal = useMemo(
    () => fyReceipts.reduce((s, r) => s + r.amount, 0),
    [fyReceipts]
  );

  const filtered = useMemo(() => {
    return fyReceipts
      .filter((r) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
          r.receipt80GId.toLowerCase().includes(q) ||
          r.receiptNo.toLowerCase().includes(q) ||
          r.donorId.toLowerCase().includes(q) ||
          r.donorName.toLowerCase().includes(q) ||
          r.pan.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [fyReceipts, search]);

  const getDonorAddress = (donorId: string) => donors.find((d) => d.donorId === donorId)?.city;

  const handleDownload = (receipt80GId: string) => {
    const r = generatedReceipts.find((x) => x.receipt80GId === receipt80GId);
    if (!r) return;
    try {
      download80GReceiptPdf(r, getDonorAddress(r.donorId));
      toast({ title: "80G receipt downloaded", description: `${r.receipt80GId}.pdf saved for IT submission` });
    } catch (e: unknown) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Download failed", variant: "destructive" });
    }
  };

  const handleDownloadDonationReceipt = (donationId: string, receiptNo: string) => {
    const donation = donations.find((d) => d.donationId === donationId);
    const donor = donation ? donors.find((d) => d.donorId === donation.donorId) : undefined;
    if (!donation) {
      toast({ title: "Not found", description: "Donation record not found", variant: "destructive" });
      return;
    }
    try {
      downloadReceiptPdf({
        receiptNo: donation.receiptNo,
        date: donation.date,
        donorName: donation.donorName,
        donorPan: donor?.pan && donor.pan !== "-" ? donor.pan : undefined,
        donorAddress: donor?.city && donor.city !== "-" ? donor.city : undefined,
        amount: donation.amount,
        mode: donation.mode || donation.channel,
        donationType: (donation.purpose || "").toLowerCase().includes("corpus") ? "Corpus" : "General",
        remarks: donation.remarks,
        is80G: donation.is80G,
      });
      toast({ title: "Donation receipt downloaded", description: `${receiptNo}.pdf saved` });
    } catch (e: unknown) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Download failed", variant: "destructive" });
    }
  };

  const handleBulkDownload = async () => {
    if (fyReceipts.length === 0) {
      toast({ title: "No certificates", description: `No 80G receipts for FY ${fy}`, variant: "destructive" });
      return;
    }
    setBulkLoading(true);
    try {
      const zip = new JSZip();
      fyReceipts.forEach((c) => {
        const safe = c.donorName.replace(/[^a-z0-9]+/gi, "_");
        zip.file(`80G_${c.receiptNo}_${safe}.pdf`, build80GReceiptPdfBlob(c, getDonorAddress(c.donorId)));
      });
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `80G_Receipts_FY${fy}_IT_Submission.zip`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "ZIP downloaded", description: `${fyReceipts.length} 80G receipts ready for Income Tax portal` });
    } catch (e: unknown) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "ZIP failed", variant: "destructive" });
    } finally {
      setBulkLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">80G Certificates</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Auto-generated when an eligible donation is saved · Download receipts for donor IT return filing.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 shrink-0"
          onClick={() => {
            download80GBlankTemplatePdf();
            toast({ title: "Blank template downloaded", description: "80G format PDF with empty fields — fill manually or use as reference." });
          }}
        >
          <FileText className="h-4 w-4" />
          Download blank 80G template
        </Button>
      </div>

      {/* Horizontal Step Flow — same pattern as Form 10BD */}
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="relative border-primary/30">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">1</div>
                <div className="flex items-center gap-2 font-semibold"><Calendar className="h-4 w-4" /> Select Financial Year</div>
              </div>
              <p className="text-xs text-muted-foreground">Choose the FY to view and download 80G receipts.</p>
              <Select value={fy} onValueChange={setFy}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {fyOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>FY {o.value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="relative border-primary/30">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">2</div>
                <div className="flex items-center gap-2 font-semibold"><Award className="h-4 w-4" /> Review 80G Receipts</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 rounded bg-muted/40">
                  <p className="text-[10px] text-muted-foreground">Generated</p>
                  <p className="text-lg font-bold">{fyReceipts.length}</p>
                </div>
                <div className="p-2 rounded bg-green-50">
                  <p className="text-[10px] text-muted-foreground">Total All FY</p>
                  <p className="text-lg font-bold text-green-700">{generatedReceipts.length}</p>
                </div>
                <div className="p-2 rounded bg-amber-50">
                  <p className="text-[10px] text-muted-foreground">PAN Missing</p>
                  <p className="text-lg font-bold text-amber-700">{panMissingCount}</p>
                </div>
                <div className="p-2 rounded bg-blue-50">
                  <p className="text-[10px] text-muted-foreground">FY Amount</p>
                  <p className="text-sm font-bold text-blue-700">
                    {fyTotal >= 100000 ? `₹${(fyTotal / 100000).toFixed(1)}L` : formatCurrency(fyTotal)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative border-primary/30">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">3</div>
                <div className="flex items-center gap-2 font-semibold"><FileCheck2 className="h-4 w-4" /> Download PDFs</div>
              </div>
              <p className="text-xs text-muted-foreground">Download all 80G receipts for the selected FY as a ZIP for IT portal submission.</p>
              <Button onClick={handleBulkDownload} disabled={bulkLoading || fyReceipts.length === 0} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                {bulkLoading ? "Preparing..." : "Download 80G ZIP"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="hidden md:flex absolute top-1/2 left-1/3 -translate-y-1/2 -translate-x-1/2 text-primary/40 text-2xl pointer-events-none select-none">›</div>
        <div className="hidden md:flex absolute top-1/2 left-2/3 -translate-y-1/2 -translate-x-1/2 text-primary/40 text-2xl pointer-events-none select-none">›</div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="h-4 w-4" />
            80G Receipts (FY {fy})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-3 rounded-lg border bg-muted/30 text-xs">
            <p className="font-semibold mb-1">How donors use 80G receipts for Income Tax filing:</p>
            <ol className="list-decimal list-inside space-y-0.5 text-muted-foreground">
              <li>Each donation has two documents: <strong>Donation Receipt</strong> (proof of payment) and <strong>80G Certificate</strong> (for tax deduction).</li>
              <li>Download either PDF from the table below, or use Step 3 for bulk 80G ZIP.</li>
              <li>Donors attach the certificate when filing ITR under Section 80G.</li>
              <li>For annual temple filing, also export <Link to="/temple/donations/form-10bd" className="text-primary underline">Form 10BD</Link> from the IT e-filing portal.</li>
            </ol>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search donor, donor ID or PAN..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-9" />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs">Donor</TableHead>
                <TableHead className="text-xs">Donor ID</TableHead>
                <TableHead className="text-xs">PAN</TableHead>
                <TableHead className="text-xs text-right">Amount</TableHead>
                <TableHead className="text-xs">Date</TableHead>
                <TableHead className="text-xs">Payment</TableHead>
                <TableHead className="text-xs">Type</TableHead>
                <TableHead className="text-xs text-center">Download</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-8">
                    No 80G receipts yet. Save a donation with 80G enabled and PAN — the certificate is created automatically.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((r) => (
                  <TableRow key={r.receipt80GId}>
                    <TableCell className="text-sm font-medium">{r.donorName}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{r.donorId}</TableCell>
                    <TableCell className="font-mono text-xs">{r.pan}</TableCell>
                    <TableCell className="text-right font-medium text-sm">{formatCurrency(r.amount)}</TableCell>
                    <TableCell className="text-xs">{r.date}</TableCell>
                    <TableCell className="text-xs">{r.mode}</TableCell>
                    <TableCell className="text-xs">{r.donationType}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="link"
                          size="sm"
                          className="h-7 text-xs px-2"
                          onClick={() => handleDownloadDonationReceipt(r.donationId, r.receiptNo)}
                        >
                          <Receipt className="h-3 w-3 mr-1" />
                          Receipt
                        </Button>
                        <span className="text-muted-foreground/50">|</span>
                        <Button
                          variant="link"
                          size="sm"
                          className="h-7 text-xs px-2 text-green-700"
                          onClick={() => handleDownload(r.receipt80GId)}
                        >
                          <Award className="h-3 w-3 mr-1" />
                          80G
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Section80G;
