import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { stockItems } from "@/data/inventoryData";

const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const item = stockItems.find(i => i.id === id);
  if (!item) return <div className="p-6">Item not found</div>;

  return (
    <div className="p-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4" /></Button>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{item.name}</h1>
              <p className="text-muted-foreground text-sm">{item.code} • {item.category}</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">{item.status}</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Basic</p>
              <p className="font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.code}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Supplier</p>
              <p className="font-medium">{item.supplier}</p>
              <p className="text-xs text-muted-foreground">Price ₹{item.pricePerUnit}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Stock</p>
              <p className="text-xl font-bold">{item.currentStock} {item.unit}</p>
              <p className="text-xs text-muted-foreground">Last Restocked: {item.lastRestocked}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="font-medium">{item.storageLocation}</p>
              <p className="text-xs text-muted-foreground">Default: {item.defaultStructure}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ItemDetail;

