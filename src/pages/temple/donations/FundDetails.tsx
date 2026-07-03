import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, Wallet, FileDown } from "lucide-react";
import { useDonations, useFunds, useDonors } from "@/modules/donations/hooks";
import { downloadReceipt } from "@/lib/receiptGenerator";
import { useToast } from "@/hooks/use-toast";

const formatCurrency = (val: number) => {
  return `₹${val.toLocaleString('en-IN')}`;
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const FundDetails = () => {
  const { fundId } = useParams<{ fundId: string }>();
  const navigate = useNavigate();
  const donations = useDonations();
  const funds = useFunds();
  const donors = useDonors();
  const { toast } = useToast();

  const fund = funds.find(f => f.id === fundId);
  const fundDonations = donations.filter(d => d.purpose === fund?.name);

  if (!fund) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate("/temple/donations/funds")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Funds
        </Button>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Fund not found
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalReceived = fundDonations.reduce((sum, d) => sum + d.amount, 0);
  const openingBalance = fund.openingBalance ?? 0;
  const availableBalance = openingBalance + totalReceived;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/temple/donations/funds")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{fund.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {fund.description || "No description"}
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Received</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalReceived)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {fundDonations.length} donation{fundDonations.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(availableBalance)}
            </div>
            {openingBalance > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Opening: {formatCurrency(openingBalance)}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Donations List */}
      <Card>
        <CardHeader>
          <CardTitle>Donations</CardTitle>
        </CardHeader>
        <CardContent>
          {fundDonations.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No donations recorded for this fund yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Donor</TableHead>
                    <TableHead>Receipt No</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fundDonations
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((donation) => (
                      <TableRow key={donation.donationId}>
                        <TableCell>{formatDate(donation.date)}</TableCell>
                        <TableCell className="font-medium">{donation.donorName}</TableCell>
                        <TableCell>
                          {donation.receiptNo ? (
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto p-0 font-mono text-sm text-primary hover:underline"
                              onClick={() => {
                                const donor = donors.find(d => d.donorId === donation.donorId);
                                try {
                                  downloadReceipt(donation, donor || null, donation.is80G || false);
                                  toast({ title: "Success", description: "Receipt download initiated" });
                                } catch (error: any) {
                                  toast({ title: "Error", description: error.message || "Failed to download receipt", variant: "destructive" });
                                }
                              }}
                            >
                              <FileDown className="h-3 w-3 mr-1" />
                              {donation.receiptNo}
                            </Button>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{donation.channel}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(donation.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FundDetails;
