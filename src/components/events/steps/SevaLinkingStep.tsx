import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface SevaItem {
  name: string;
  category: "Ritual" | "Darshan" | "Special";
  defaultPrice: number;
  status: "Active" | "Inactive";
  selected: boolean;
}

const AVAILABLE_SEVAS: Omit<SevaItem, "selected">[] = [
  { name: "Suprabhatam", category: "Ritual", defaultPrice: 500, status: "Active" },
  { name: "Abhishekam", category: "Ritual", defaultPrice: 1000, status: "Active" },
  { name: "Archana", category: "Ritual", defaultPrice: 100, status: "Active" },
  { name: "Special Darshan", category: "Darshan", defaultPrice: 300, status: "Active" },
  { name: "VIP Darshan", category: "Darshan", defaultPrice: 600, status: "Inactive" },
  { name: "Kalyanotsavam", category: "Special", defaultPrice: 5000, status: "Active" },
  { name: "Sahasranama", category: "Ritual", defaultPrice: 1500, status: "Active" },
  { name: "Rudra Abhishekam", category: "Ritual", defaultPrice: 2000, status: "Inactive" },
];

const categoryColors: Record<string, string> = {
  Ritual: "bg-purple-100 text-purple-700 border-purple-200",
  Darshan: "bg-blue-100 text-blue-700 border-blue-200",
  Special: "bg-amber-100 text-amber-700 border-amber-200",
};

const SevaLinkingStep = () => {
  const [enabled, setEnabled] = useState(false);
  const [sevas, setSevas] = useState<SevaItem[]>(
    AVAILABLE_SEVAS.map((s) => ({ ...s, selected: false }))
  );

  const toggleSeva = (idx: number) => {
    const updated = [...sevas];
    updated[idx].selected = !updated[idx].selected;
    setSevas(updated);
  };

  const selectedCount = sevas.filter((s) => s.selected).length;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Seva Linking</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Select existing sevas to make them available for this event.
        </p>
      </div>

      <div className="flex items-center justify-between py-4 px-4 border rounded-lg bg-muted/30">
        <div>
          <Label className="text-sm font-medium">Enable Event Sevas?</Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            Link sevas and darshan from Seva Management
          </p>
        </div>
        <Switch checked={enabled} onCheckedChange={setEnabled} />
      </div>

      {!enabled && (
        <div className="text-center py-8 border border-dashed rounded-lg">
          <p className="text-sm text-muted-foreground">
            No sevas will be available for this event.
          </p>
        </div>
      )}

      {enabled && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {selectedCount} seva{selectedCount !== 1 ? "s" : ""} selected
            </p>
            {selectedCount > 0 && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 text-xs">
                {selectedCount} linked
              </Badge>
            )}
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center px-4 py-2.5 bg-muted/50 border-b text-xs font-medium text-muted-foreground">
              <span className="w-5" />
              <span>Seva Name</span>
              <span>Category</span>
              <span className="text-right">Price (₹)</span>
              <span className="text-center">Status</span>
            </div>

            <div className="divide-y max-h-[400px] overflow-y-auto">
              {sevas.map((seva, idx) => (
                <label
                  key={seva.name}
                  className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center px-4 py-3 cursor-pointer hover:bg-muted/20 transition-colors"
                >
                  <Checkbox
                    checked={seva.selected}
                    onCheckedChange={() => toggleSeva(idx)}
                  />
                  <span className="text-sm font-medium text-foreground">{seva.name}</span>
                  <Badge variant="outline" className={`text-[10px] ${categoryColors[seva.category]}`}>
                    {seva.category}
                  </Badge>
                  <span className="text-sm text-muted-foreground text-right tabular-nums">
                    ₹{seva.defaultPrice.toLocaleString("en-IN")}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${
                      seva.status === "Active"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {seva.status}
                  </Badge>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SevaLinkingStep;
