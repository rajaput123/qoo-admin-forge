import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { IndianRupee, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const AddDonationDialog = ({ open, onOpenChange }: Props) => {
  const navigate = useNavigate();

  const handleSelect = (nature: "Cash" | "Non-Cash") => {
    onOpenChange(false);
    navigate("/temple/donations/add", { state: { nature } });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add Donation</DialogTitle>
          <DialogDescription>Select the type of donation to proceed.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mt-2">
          {/* Cash */}
          <button
            onClick={() => handleSelect("Cash")}
            className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-border bg-card hover:border-emerald-500 hover:bg-emerald-50 p-6 text-center transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <div className="h-14 w-14 rounded-2xl bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
              <IndianRupee className="h-7 w-7 text-emerald-700" />
            </div>
            <div>
              <p className="font-semibold text-sm">Cash Donation</p>
              <p className="text-xs text-muted-foreground mt-0.5">Cash · UPI · Cheque · NEFT</p>
            </div>
          </button>

          {/* Non-Cash */}
          <button
            onClick={() => handleSelect("Non-Cash")}
            className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-border bg-card hover:border-blue-500 hover:bg-blue-50 p-6 text-center transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Package className="h-7 w-7 text-blue-700" />
            </div>
            <div>
              <p className="font-semibold text-sm">Non-Cash Donation</p>
              <p className="text-xs text-muted-foreground mt-0.5">Gold · Grain · Cloth · Kind</p>
            </div>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddDonationDialog;