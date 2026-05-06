import { motion } from "framer-motion";

const Reports = () => {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="border rounded-lg p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">Purchase Reports</h3>
          <p className="text-sm text-muted-foreground">Supplier-wise purchases, order summaries, and delivery tracking reports will be available here</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Reports;
