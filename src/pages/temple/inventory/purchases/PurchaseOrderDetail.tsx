import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { getDeliveriesForPO, getPOStatus, purchaseOrders } from "@/data/purchaseData";

const statusColor: Record<string, string> = {
  Draft: "bg-gray-50 text-gray-700 border-gray-200",
  Ordered: "bg-blue-50 text-blue-700 border-blue-200",
  Partial: "bg-amber-50 text-amber-700 border-amber-200",
  Closed: "bg-green-50 text-green-700 border-green-200",
};

const deliveryStatusColor: Record<string, string> = {
  Accepted: "bg-green-50 text-green-700 border-green-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Partial: "bg-blue-50 text-blue-700 border-blue-200",
};

const PurchaseOrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const po = purchaseOrders.find((p) => p.id === id);
  if (!po) return <div className="p-6">Purchase Order not found</div>;
  const status = getPOStatus(po.id);
  const deliveries = getDeliveriesForPO(po.id);

  return (
    <div className="p-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4" /></Button>
            <div>
              <h1 className="text-2xl font-semibold">{po.id}</h1>
              <p className="text-sm text-muted-foreground">{po.supplier} • Expected {po.expectedDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`text-xs ${statusColor[status]}`}>{status}</Badge>
            <div className="text-sm text-muted-foreground">{po.createdDate}</div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Material List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Line</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {po.lines.map((l: any, i: number) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-mono text-xs">{i+1}</TableCell>
                    <TableCell>{l.itemName}</TableCell>
                    <TableCell className="text-right">{l.qty}</TableCell>
                    <TableCell className="text-right">₹{l.unitPrice}</TableCell>
                    <TableCell className="text-right">₹{l.total.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={4} className="text-right font-medium">Total</TableCell>
                  <TableCell className="text-right font-bold">₹{po.totalAmount.toLocaleString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              Deliveries
              <Badge variant="outline" className="text-xs">{deliveries.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Received Date</TableHead>
                  <TableHead>Received By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deliveries.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-6">No deliveries recorded</TableCell></TableRow>
                ) : deliveries.map(d => (
                  <TableRow key={d.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/temple/inventory/purchases/deliveries/${d.id}`)}>
                    <TableCell className="text-sm">{d.receivedDate}</TableCell>
                    <TableCell className="text-sm">{d.receivedBy || "—"}</TableCell>
                    <TableCell><Badge variant="outline" className={`text-xs ${deliveryStatusColor[d.status]}`}>{d.status}</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{d.notes || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PurchaseOrderDetail;

