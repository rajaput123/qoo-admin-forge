import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileSpreadsheet, Download, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useDonations, useDonors } from "@/modules/donations/hooks";
import { useToast } from "@/hooks/use-toast";

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
  const donations = useDonations();
  const donors = useDonors();
  const { toast } = useToast();
  const fyOptions = useMemo(() => generateFYOptions(), []);
  const [fy, setFy] = useState(fyOptions[0].value);

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
    // Form 10BD exact column order per Income Tax e-filing portal
    const headers = [
      "Sr. No.",
      "Pre Acknowledgement Number",
      "ID Code (PAN/Aadhaar/Other)",
      "Unique Identification Number",
      "Section Code",
      "Donor Name",
      "Address",
      "Donation Type",
      "Mode of Receipt",
      "Amount (₹)",
    ];
    const lines = [headers.join(",")];
    validRows.forEach((r, i) => {
      const donationType = r.hasCorpus && r.hasGeneral ? "Mixed" : r.hasCorpus ? "Corpus" : "General";
      const mode = Array.from(r.modes).join("/");
      const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
      lines.push([
        i + 1,
        "",
        "PAN",
        r.pan,
        "Section 80G",
        esc(r.name),
        esc(r.address),
        donationType,
        mode,
        r.total,
      ].join(","));
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Form10BD_FY${fy}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Select Financial Year</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-4">
          <div className="space-y-2">
            <Label>Financial Year</Label>
            <Select value={fy} onValueChange={setFy}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                {fyOptions.map(o => (
                  <SelectItem key={o.value} value={o.value}>FY {o.value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleDownloadCSV} disabled={validRows.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Download Form 10BD CSV
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total Donors</p><p className="text-2xl font-bold">{rows.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Eligible (Valid PAN)</p><p className="text-2xl font-bold text-green-600">{validRows.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Excluded (Missing PAN)</p><p className="text-2xl font-bold text-amber-600">{invalidRows.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total Amount</p><p className="text-2xl font-bold">₹{totalAmount.toLocaleString("en-IN")}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Preview — Donor-wise Aggregation (FY {fy})
          </CardTitle>
        </CardHeader>
        <CardContent>
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