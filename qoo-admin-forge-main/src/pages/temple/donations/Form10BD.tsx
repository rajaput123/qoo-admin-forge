import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileSpreadsheet, Download, AlertTriangle, CheckCircle2, Calendar, Users, FileCheck2 } from "lucide-react";
import { useDonations, useDonors } from "@/modules/donations/hooks";
import { useToast } from "@/hooks/use-toast";
import { downloadCsv } from "@/lib/csvExport";

// Dummy data for preview / demo
const dummyDonations = [
  { donationId: "D1", donorId: "DR1", donorName: "Rajesh Kumar Sharma", date: "2024-06-15", amount: 25000, mode: "Cash", purpose: "General" },
  { donationId: "D2", donorId: "DR1", donorName: "Rajesh Kumar Sharma", date: "2024-11-02", amount: 15000, mode: "UPI", purpose: "Corpus" },
  { donationId: "D3", donorId: "DR2", donorName: "Lakshmi Devi Agarwal", date: "2024-07-20", amount: 50000, mode: "Bank Transfer", purpose: "General" },
  { donationId: "D4", donorId: "DR3", donorName: "Suresh Iyer", date: "2024-08-05", amount: 10000, mode: "Cash", purpose: "General" },
  { donationId: "D5", donorId: "DR4", donorName: "Anita Reddy", date: "2024-09-12", amount: 75000, mode: "Cheque", purpose: "Corpus" },
  { donationId: "D6", donorId: "DR5", donorName: "Mohammed Ali Khan", date: "2024-10-30", amount: 12000, mode: "UPI", purpose: "General" },
  { donationId: "D7", donorId: "DR2", donorName: "Lakshmi Devi Agarwal", date: "2025-01-10", amount: 30000, mode: "Bank Transfer", purpose: "Corpus" },
  { donationId: "D8", donorId: "DR6", donorName: "Priya Nair", date: "2024-12-25", amount: 18000, mode: "Cash", purpose: "General" },
  { donationId: "D9", donorId: "DR7", donorName: "Venkatesh Murthy", date: "2025-02-14", amount: 60000, mode: "Cheque", purpose: "Corpus" },
  { donationId: "D10", donorId: "DR8", donorName: "Deepak Choudhary", date: "2024-11-28", amount: 9000, mode: "UPI", purpose: "General" },
  { donationId: "D11", donorId: "DR3", donorName: "Suresh Iyer", date: "2025-03-05", amount: 20000, mode: "Cash", purpose: "General" },
  { donationId: "D12", donorId: "DR9", donorName: "Sunita Patel", date: "2024-06-30", amount: 45000, mode: "Bank Transfer", purpose: "Corpus" },
];

const dummyDonors = [
  { donorId: "DR1", name: "Rajesh Kumar Sharma", pan: "ABCDE1234F", city: "Bengaluru, Karnataka" },
  { donorId: "DR2", name: "Lakshmi Devi Agarwal", pan: "FGHIJ5678K", city: "Mumbai, Maharashtra" },
  { donorId: "DR3", name: "Suresh Iyer", pan: "KLMNO9012P", city: "Chennai, Tamil Nadu" },
  { donorId: "DR4", name: "Anita Reddy", pan: "PQRST3456U", city: "Hyderabad, Telangana" },
  { donorId: "DR5", name: "Mohammed Ali Khan", pan: "UVWXY7890Z", city: "Delhi" },
  { donorId: "DR6", name: "Priya Nair", pan: "", city: "Kochi, Kerala" },
  { donorId: "DR7", name: "Venkatesh Murthy", pan: "BCDEF2345G", city: "Mysuru, Karnataka" },
  { donorId: "DR8", name: "Deepak Choudhary", pan: "-", city: "Jaipur, Rajasthan" },
  { donorId: "DR9", name: "Sunita Patel", pan: "CDEFG3456H", city: "Ahmedabad, Gujarat" },
];

// Generate FY options (current + previous 4 years)
const generateFYOptions = () => {
  const curr = new Date();
  const year = curr.getMonth() >= 3 ? curr.getFullYear() : curr.getFullYear() - 1;
  return Array.from({ length: 5 }, (_, i) => {
    const y = year - i;
    return { value: `${y}-${String(y + 1).slice(2)}`, start: `${y}-04-01`, end: `${y + 1}-03-31` };
  });
};

const Form10BD = () => {
  const realDonations = useDonations();
  const realDonors = useDonors();
  const { toast } = useToast();
  const fyOptions = useMemo(() => generateFYOptions(), []);
  const [fy, setFy] = useState(fyOptions[0].value);

  // Merge dummy data with real data
  const donations = useMemo(() => realDonations.length > 0 ? realDonations : dummyDonations, [realDonations]);
  const donors = useMemo(() => realDonors.length > 0 ? realDonors : dummyDonors, [realDonors]);

  const selectedFy = fyOptions.find(f => f.value === fy)!;

  const fyDonations = useMemo(() => {
    return donations.filter(d => d.date >= selectedFy.start && d.date <= selectedFy.end);
  }, [donations, selectedFy]);

  // Aggregate per donor (Form 10BD is donor-level, not transaction-level)
  const rows = useMemo(() => {
    const map = new Map<string, {
      donorId: string;
      name: string;
      pan: string;
      address: string;
      total: number;
      modes: Set<string>;
      hasCorpus: boolean;
      hasGeneral: boolean;
    }>();
    fyDonations.forEach(d => {
      const donor = donors.find(x => x.donorId === d.donorId);
      const key = d.donorId;
      if (!map.has(key)) {
        map.set(key, {
          donorId: d.donorId,
          name: d.donorName,
          pan: donor?.pan || "-",
          address: donor?.city || "-",
          total: 0,
          modes: new Set(),
          hasCorpus: false,
          hasGeneral: false,
        });
      }
      const r = map.get(key)!;
      r.total += d.amount;
      r.modes.add(d.mode);
      if (d.purpose?.toLowerCase().includes("corpus")) r.hasCorpus = true;
      else r.hasGeneral = true;
    });
    return Array.from(map.values());
  }, [fyDonations, donors]);

  const validRows = rows.filter(r => r.pan && r.pan !== "-" && /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(r.pan));
  const invalidRows = rows.filter(r => !validRows.includes(r));

  const totalAmount = validRows.reduce((s, r) => s + r.total, 0);

  const handleDownloadCSV = () => {
    if (validRows.length === 0) {
      toast({ title: "No data", description: "No donor records with valid PAN for this FY", variant: "destructive" });
      return;
    }
    // Form 10BD exact column order per Income Tax e-filing portal (Papa Parse)
    const rows = validRows.map((r, i) => {
      const donationType = r.hasCorpus && r.hasGeneral ? "Mixed" : r.hasCorpus ? "Corpus" : "General";
      return {
        "S.No": i + 1,
        "Donor Name": r.name,
        PAN: r.pan,
        Address: r.address,
        Amount: r.total,
        "Donation Type": donationType,
        "Mode of Payment": Array.from(r.modes).join("/"),
        Section: "80G(5)(viii)",
      };
    });
    downloadCsv(rows, `Form10BD_FY${fy}.csv`);
    toast({ title: "Form 10BD CSV downloaded", description: `${validRows.length} donor records exported for FY ${fy}` });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Form 10BD — Statement of Donations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Compile and download donation records in the exact column format required by the Income Tax e-filing portal.
          </p>
        </div>
      </div>

      {/* Horizontal Step Flow */}
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1 — Select FY */}
          <Card className="relative border-primary/30">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">1</div>
                <div className="flex items-center gap-2 font-semibold"><Calendar className="h-4 w-4" /> Select Financial Year</div>
              </div>
              <p className="text-xs text-muted-foreground">Choose the FY for which Form 10BD needs to be filed.</p>
              <Select value={fy} onValueChange={setFy}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {fyOptions.map(o => (
                    <SelectItem key={o.value} value={o.value}>FY {o.value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Step 2 — Review */}
          <Card className="relative border-primary/30">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">2</div>
                <div className="flex items-center gap-2 font-semibold"><Users className="h-4 w-4" /> Review Donor Records</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 rounded bg-muted/40">
                  <p className="text-[10px] text-muted-foreground">Total Donors</p>
                  <p className="text-lg font-bold">{rows.length}</p>
                </div>
                <div className="p-2 rounded bg-green-50">
                  <p className="text-[10px] text-muted-foreground">Eligible</p>
                  <p className="text-lg font-bold text-green-700">{validRows.length}</p>
                </div>
                <div className="p-2 rounded bg-amber-50">
                  <p className="text-[10px] text-muted-foreground">Excluded</p>
                  <p className="text-lg font-bold text-amber-700">{invalidRows.length}</p>
                </div>
                <div className="p-2 rounded bg-blue-50">
                  <p className="text-[10px] text-muted-foreground">Amount</p>
                  <p className="text-sm font-bold text-blue-700">₹{(totalAmount / 100000).toFixed(1)}L</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 3 — Download */}
          <Card className="relative border-primary/30">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">3</div>
                <div className="flex items-center gap-2 font-semibold"><FileCheck2 className="h-4 w-4" /> Download CSV</div>
              </div>
              <p className="text-xs text-muted-foreground">Generate the CSV in the exact column format required by the IT e-filing portal.</p>
              <Button onClick={handleDownloadCSV} disabled={validRows.length === 0} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Form 10BD CSV
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Connecting arrows (desktop) */}
        <div className="hidden md:flex absolute top-1/2 left-1/3 -translate-y-1/2 -translate-x-1/2 text-primary/40 text-2xl pointer-events-none select-none">›</div>
        <div className="hidden md:flex absolute top-1/2 left-2/3 -translate-y-1/2 -translate-x-1/2 text-primary/40 text-2xl pointer-events-none select-none">›</div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Preview — Donor-wise Aggregation (FY {fy})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Upload instructions */}
          <div className="mb-4 p-3 rounded-lg border bg-muted/30 text-xs">
            <p className="font-semibold mb-1">How to file Form 10BD with the Income Tax Department:</p>
            <ol className="list-decimal list-inside space-y-0.5 text-muted-foreground">
              <li>Download this CSV using the button above.</li>
              <li>Login to <span className="font-mono">incometax.gov.in</span></li>
              <li>Go to e-File → Income Tax Forms → Form 10BD</li>
              <li>Upload the CSV file</li>
            </ol>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Donor Name</TableHead>
                <TableHead>PAN</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Donation Type</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No donations for selected FY</TableCell></TableRow>
              ) : rows.map((r, i) => {
                const valid = validRows.includes(r);
                const donationType = r.hasCorpus && r.hasGeneral ? "Mixed" : r.hasCorpus ? "Corpus" : "General";
                return (
                  <TableRow key={r.donorId}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell className="font-mono text-xs">{r.pan}</TableCell>
                    <TableCell className="text-xs">{r.address}</TableCell>
                    <TableCell><Badge variant="outline">{donationType}</Badge></TableCell>
                    <TableCell className="text-xs">{Array.from(r.modes).join(", ")}</TableCell>
                    <TableCell className="text-right font-semibold">₹{r.total.toLocaleString("en-IN")}</TableCell>
                    <TableCell>
                      {valid ? (
                        <Badge className="bg-green-100 text-green-700"><CheckCircle2 className="h-3 w-3 mr-1" />Eligible</Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-700"><AlertTriangle className="h-3 w-3 mr-1" />Invalid PAN</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Form10BD;