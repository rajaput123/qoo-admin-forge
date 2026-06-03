import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { stockTransactions } from "@/data/inventoryData";

const TransactionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const txn = stockTransactions.find(t => t.id === id);
  if (!txn) return <div className="p-6">Transaction not found</div>;

  return (
    <div className="p-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4" /></Button>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{txn.id} · {txn.itemName}</h1>
              <p className="text-muted-foreground text-sm">{txn.date} • {txn.time}</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">{txn.transactionType}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">Quantity</p>
            <p className="font-medium">{txn.quantity}</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">Balance After</p>
            <p className="font-medium">{txn.balanceAfter}</p>
          </div>
        </div>

        <div className="p-3 bg-muted/50 rounded-lg mt-4">
          <p className="text-xs text-muted-foreground">Notes</p>
          <p className="text-sm">{txn.notes || "—"}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default TransactionDetail;

