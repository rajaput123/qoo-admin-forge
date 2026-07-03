import { Dialog, DialogContent } from "@/components/ui/dialog";
import demoVideo from "@/assets/demo-video.mp4";

interface DemoVideoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DemoVideoModal = ({ open, onOpenChange }: DemoVideoModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-none">
        <video
          src={demoVideo}
          controls
          autoPlay
          className="w-full h-auto max-h-[80vh] rounded-lg"
        />
      </DialogContent>
    </Dialog>
  );
};

export default DemoVideoModal;
