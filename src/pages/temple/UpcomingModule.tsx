import { Button } from "@/components/ui/button";
import { Clock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UpcomingModule({
  moduleTitle = "This module",
  note,
}: {
  moduleTitle?: string;
  note?: string;
}) {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="max-w-lg w-full rounded-2xl border bg-card p-6">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
            <Clock className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-foreground">
              {moduleTitle} is upcoming
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              This area is not enabled yet. We’ll make it available in a future
              update.
            </p>
            {note ? (
              <p className="text-sm text-muted-foreground mt-2">{note}</p>
            ) : null}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/temple-hub")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Temple Hub
          </Button>
        </div>
      </div>
    </div>
  );
}

