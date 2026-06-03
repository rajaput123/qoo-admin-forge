import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import AddDonation from "./AddDonation";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const AddDonationDialog = ({ open, onOpenChange }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Donation</DialogTitle>
          <DialogDescription>
            Complete each step — the next section opens automatically when valid.
          </DialogDescription>
        </DialogHeader>
        <AddDonation embedded onSaved={() => { /* keep dialog open to show receipt actions */ }} />
      </DialogContent>
    </Dialog>
  );
};

export default AddDonationDialog;