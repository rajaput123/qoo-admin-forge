import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PurchaseOrders from "./purchases/PurchaseOrders";
import Deliveries from "./purchases/Deliveries";
import PurchaseReports from "./purchases/Reports";

const Purchases = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Purchases</h1>
        <p className="text-muted-foreground text-sm">POs, Goods Receipt and procurement reporting</p>
      </div>

      <Tabs defaultValue="po" className="space-y-6">
        <TabsList>
          <TabsTrigger value="po">Purchase Orders</TabsTrigger>
          <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="po"><PurchaseOrders /></TabsContent>
        <TabsContent value="deliveries"><Deliveries /></TabsContent>
        <TabsContent value="reports"><PurchaseReports /></TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Purchases;
