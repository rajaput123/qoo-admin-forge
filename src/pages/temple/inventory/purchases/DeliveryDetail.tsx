import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { getDelivery, getPurchaseOrder, getPOStatus } from "@/data/purchaseData";

const statusColor: Record<string, string> = {
  Accepted: "bg-green-50 text-green-700 border-green-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Partial: "bg-blue-50 text-blue-700 border-blue-200",
};

const poStatusColor: Record<string, string> = {
  Draft: "bg-gray-50 text-gray-700 border-gray-200",
  Ordered: "bg-blue-50 text-blue-700 border-blue-200",
  Partial: "bg-amber-50 text-amber-700 border-amber-200",
  Closed: "bg-green-50 text-green-700 border-green-200",
};

const DeliveryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const delivery = id ? getDelivery(id) : undefined;
  if (!delivery) return <div className="p-6">Delivery not found</div>;
  const po = getPurchaseOrder(delivery.poId);
  const poStatus = po ? getPOStatus(po.id) : "Draft";

  const totalAcceptedAmount = (delivery.lines || []).reduce((s, l) => s + (l.totalAmount || 0), 0);
  const totalAcceptedQty = (delivery.lines || []).reduce((s, l) => s + (l.acceptedQty || 0), 0);

  return (
    <div className="p-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4" /></Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold">{delivery.id}</h1>
                <Badge variant="outline" className={`text-xs ${statusColor[delivery.status]}`}>{delivery.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {delivery.supplier} • {delivery.receivedDate} • Invoice {delivery.invoiceNo || "—"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Accepted Qty</div>
            <div className="text-lg font-semibold">{totalAcceptedQty}</div>
            <div className="text-sm text-muted-foreground mt-1">Accepted Amount</div>
            <div className="text-lg font-semibold">₹{totalAcceptedAmount.toLocaleString()}</div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8">
              <div>
                <div className="text-xs text-muted-foreground">PO Number</div>
                <div className="text-sm font-medium font-mono">{delivery.poId}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Received By</div>
                <div className="text-sm font-medium">{delivery.receivedBy || "—"}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Invoice No</div>
                <div className="text-sm font-medium">{delivery.invoiceNo || "—"}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Notes</div>
                <div className="text-sm">{delivery.notes || "—"}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivered Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Ordered</TableHead>
                  <TableHead className="text-right">Delivered</TableHead>
                  <TableHead className="text-right">Accepted</TableHead>
                  <TableHead className="text-right">Rejected</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead className="text-right">Accepted Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(delivery.lines || []).map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium">{l.itemName}</TableCell>
                    <TableCell className="text-right">{l.orderedQty}</TableCell>
                    <TableCell className="text-right">{l.deliveredQty}</TableCell>
                    <TableCell className="text-right font-medium">{l.acceptedQty}</TableCell>
                    <TableCell className="text-right">{l.rejectedQty}</TableCell>
                    <TableCell className="text-right">₹{Number(l.unitPrice || 0).toFixed(2)}</TableCell>
                    <TableCell className="text-right font-medium">₹{Number(l.totalAmount || 0).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={6} className="text-right font-medium">Total Accepted</TableCell>
                  <TableCell className="text-right font-bold">₹{totalAcceptedAmount.toLocaleString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {po && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Related Purchase Order
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{po.id}</div>
                <div className="text-sm text-muted-foreground">{po.supplier} • Expected {po.expectedDate}</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`text-xs ${poStatusColor[poStatus]}`}>{poStatus}</Badge>
                <Button variant="outline" onClick={() => navigate(`/temple/inventory/purchases/${po.id}`)}>View PO</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default DeliveryDetail;

