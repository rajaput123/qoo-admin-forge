import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckCircle, Trash2, Package, Building2, AlertTriangle } from "lucide-react";
import { templeStructures } from "@/data/templeData";
import { stockItems } from "@/data/inventoryData";
import { dummyHallRooms } from "@/data/temple-structure-data";

// Resource types that map to real data sources
type ResourceCategory = "venue" | "material";

interface ResourceItem {
  id: string;
  category: ResourceCategory;
  refId: string; // linked structure/item/freelancer ID
  name: string;
  quantity: number;
  startTime: string;
  endTime: string;
  // live data
  availableStock?: number;
  unit?: string;
  status?: string;
  hasConflict: boolean;
}

interface ResourceAllocationSectionProps {
  onResourcesChange?: (resources: ResourceItem[]) => void;
}

const CATEGORY_META: Record<ResourceCategory, { label: string; color: string; icon: typeof Building2 }> = {
  venue: { label: "Venue / Hall", color: "bg-indigo-100 text-indigo-700 border-indigo-300", icon: Building2 },
  material: { label: "Material / Item", color: "bg-amber-100 text-amber-700 border-amber-300", icon: Package },
};

const ResourceAllocationSection = ({ onResourcesChange }: ResourceAllocationSectionProps) => {
  const [resources, setResources] = useState<ResourceItem[]>([]);

  // Build lookup lists from real data
  const venueOptions = useMemo(() => {
    const structures = templeStructures
      .filter(s => ["Hall", "Main"].includes(s.type))
      .map(s => ({ id: s.id, name: s.name, type: s.type }));
    const halls = dummyHallRooms.map(h => ({ id: h.id, name: h.name, type: "Hall/Room" }));
    return [...structures, ...halls];
  }, []);

  const materialOptions = useMemo(() =>
    stockItems.map(item => ({
      id: item.id,
      name: `${item.name} (${item.code})`,
      currentStock: item.currentStock,
      unit: item.unit,
      status: item.status,
      category: item.category,
    })),
  []);


  const update = (list: ResourceItem[]) => {
    setResources(list);
    onResourcesChange?.(list);
  };

  const addResource = (category: ResourceCategory) => {
    const newRes: ResourceItem = {
      id: `res-${Date.now()}`,
      category,
      refId: "",
      name: "",
      quantity: 1,
      startTime: "09:00",
      endTime: "18:00",
      hasConflict: false,
    };
    update([...resources, newRes]);
  };

  const removeResource = (id: string) => update(resources.filter(r => r.id !== id));

  const updateField = (id: string, field: keyof ResourceItem, value: any) => {
    update(resources.map(r => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const selectRef = (resId: string, category: ResourceCategory, refId: string) => {
    update(resources.map(r => {
      if (r.id !== resId) return r;
      if (category === "venue") {
        const v = venueOptions.find(o => o.id === refId);
        return { ...r, refId, name: v?.name || "" };
      }
      if (category === "material") {
        const m = materialOptions.find(o => o.id === refId);
        return {
          ...r,
          refId,
          name: m?.name || "",
          availableStock: m?.currentStock,
          unit: m?.unit,
          status: m?.status,
          hasConflict: m ? (r.quantity > m.currentStock) : false,
        };
      }
      return r;
    }));
  };

  const updateMaterialQty = (resId: string, qty: number) => {
    update(resources.map(r => {
      if (r.id !== resId) return r;
      const stock = r.availableStock ?? Infinity;
      return { ...r, quantity: qty, hasConflict: qty > stock };
    }));
  };

  const venueCount = resources.filter(r => r.category === "venue").length;
  const materialCount = resources.filter(r => r.category === "material").length;
  const shortages = resources.filter(r => r.hasConflict).length;

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4 bg-muted/30">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium">Resource Allocation</p>
            <p className="text-xs text-muted-foreground mt-1">
              Select venues from Structure and materials from Inventory
            </p>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            {venueCount > 0 && <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-300">{venueCount} venues</Badge>}
            {materialCount > 0 && <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">{materialCount} materials</Badge>}
            
            {shortages > 0 && <Badge variant="destructive" className="gap-1"><AlertTriangle className="h-3 w-3" />{shortages} shortage</Badge>}
          </div>
        </div>

        {/* Add buttons */}
        <div className="flex gap-2 mb-4">
          <Button size="sm" variant="outline" onClick={() => addResource("venue")} className="gap-1.5">
            <Building2 className="h-3.5 w-3.5" /> Add Venue
          </Button>
          <Button size="sm" variant="outline" onClick={() => addResource("material")} className="gap-1.5">
            <Package className="h-3.5 w-3.5" /> Add Material
          </Button>
        </div>

        {resources.length === 0 ? (
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <p className="text-sm text-muted-foreground mb-1">No resources added yet</p>
            <p className="text-xs text-muted-foreground">Add venues, inventory materials, or freelancers for this event</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {resources.map((res) => {
              const meta = CATEGORY_META[res.category];
              return (
                <div
                  key={res.id}
                  className={`border rounded-lg p-4 bg-background hover:shadow-sm transition-shadow ${res.hasConflict ? "border-destructive/50 bg-destructive/5" : ""}`}
                >
                  {/* Row header */}
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className={`text-xs ${meta.color}`}>{meta.label}</Badge>
                    <div className="flex items-center gap-2">
                      {!res.hasConflict && res.refId && <CheckCircle className="h-3.5 w-3.5 text-green-600" />}
                      {res.hasConflict && <AlertCircle className="h-3.5 w-3.5 text-destructive" />}
                      <Button size="sm" variant="ghost" onClick={() => removeResource(res.id)} className="h-7 w-7 p-0 text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Category-specific fields */}
                  {res.category === "venue" && (
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs">Select Venue / Hall</Label>
                        <Select value={res.refId} onValueChange={(v) => selectRef(res.id, "venue", v)}>
                          <SelectTrigger className="h-8 text-xs mt-1 bg-background"><SelectValue placeholder="Choose..." /></SelectTrigger>
                          <SelectContent className="bg-popover">
                            {venueOptions.map(v => (
                              <SelectItem key={v.id} value={v.id} className="text-xs">
                                {v.name} <span className="text-muted-foreground">({v.type})</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Start Time</Label>
                        <Input type="time" value={res.startTime} onChange={e => updateField(res.id, "startTime", e.target.value)} className="h-8 text-xs mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs">End Time</Label>
                        <Input type="time" value={res.endTime} onChange={e => updateField(res.id, "endTime", e.target.value)} className="h-8 text-xs mt-1" />
                      </div>
                    </div>
                  )}

                  {res.category === "material" && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2">
                          <Label className="text-xs">Select Inventory Item</Label>
                          <Select value={res.refId} onValueChange={(v) => selectRef(res.id, "material", v)}>
                            <SelectTrigger className="h-8 text-xs mt-1 bg-background"><SelectValue placeholder="Choose item..." /></SelectTrigger>
                            <SelectContent className="bg-popover max-h-60">
                              {materialOptions.map(m => (
                                <SelectItem key={m.id} value={m.id} className="text-xs">
                                  <div className="flex items-center gap-2">
                                    <span>{m.name}</span>
                                    <span className={`text-[10px] px-1 rounded ${m.status === "Low Stock" ? "bg-amber-100 text-amber-700" : m.status === "Out of Stock" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                                      {m.currentStock} {m.unit}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">Required Qty {res.unit && `(${res.unit})`}</Label>
                          <Input
                            type="number"
                            value={res.quantity}
                            onChange={e => updateMaterialQty(res.id, parseInt(e.target.value) || 0)}
                            className="h-8 text-xs mt-1"
                            min={1}
                          />
                        </div>
                      </div>
                      {res.refId && (
                        <div className={`flex items-center gap-2 text-xs px-2 py-1.5 rounded ${res.hasConflict ? "bg-destructive/10 text-destructive" : "bg-green-50 text-green-700"}`}>
                          {res.hasConflict ? (
                            <>
                              <AlertTriangle className="h-3 w-3" />
                              <span>Shortage: Need {res.quantity} {res.unit}, only {res.availableStock} {res.unit} in stock. Raise a PO.</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-3 w-3" />
                              <span>Available: {res.availableStock} {res.unit} in stock (requesting {res.quantity})</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>Note:</strong> Material stock levels are checked live from Inventory. Shortages flagged here should be resolved via Purchase Orders before event execution.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResourceAllocationSection;
