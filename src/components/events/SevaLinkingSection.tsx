import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface SevaConfig {
    name: string;
    type: "Ritual" | "Darshan" | "Special";
    defaultPrice: number;
    defaultSlots: number;
    selected: boolean;
    slots: number;
    price: number;
    vipOption: boolean;
    timeSlot: string;
}

const AVAILABLE_SEVAS: Omit<SevaConfig, "selected" | "slots" | "price" | "vipOption" | "timeSlot">[] = [
    { name: "Suprabhatam", type: "Ritual", defaultPrice: 500, defaultSlots: 50 },
    { name: "Abhishekam", type: "Ritual", defaultPrice: 1000, defaultSlots: 100 },
    { name: "Archana", type: "Ritual", defaultPrice: 100, defaultSlots: 200 },
    { name: "Special Darshan", type: "Darshan", defaultPrice: 300, defaultSlots: 500 },
    { name: "VIP Darshan", type: "Darshan", defaultPrice: 600, defaultSlots: 200 },
    { name: "Kalyanotsavam", type: "Special", defaultPrice: 5000, defaultSlots: 50 },
    { name: "Sahasranama", type: "Ritual", defaultPrice: 1500, defaultSlots: 75 },
    { name: "Rudra Abhishekam", type: "Ritual", defaultPrice: 2000, defaultSlots: 50 },
    { name: "Ekadashi Special", type: "Special", defaultPrice: 2500, defaultSlots: 100 },
    { name: "Pavitrotsavam", type: "Special", defaultPrice: 3000, defaultSlots: 75 },
];

interface SevaLinkingSectionProps {
    onSevasChange?: (sevas: SevaConfig[]) => void;
}

const SevaLinkingSection = ({ onSevasChange }: SevaLinkingSectionProps) => {
    const [sevaConfigs, setSevaConfigs] = useState<SevaConfig[]>(
        AVAILABLE_SEVAS.map((seva) => ({
            ...seva,
            selected: false,
            slots: seva.defaultSlots,
            price: seva.defaultPrice,
            vipOption: false,
            timeSlot: "06:00",
        }))
    );

    const handleToggleSeva = (index: number) => {
        const updated = [...sevaConfigs];
        updated[index].selected = !updated[index].selected;
        setSevaConfigs(updated);
        onSevasChange?.(updated);
    };

    const handleFieldChange = (index: number, field: keyof SevaConfig, value: any) => {
        const updated = [...sevaConfigs];
        updated[index] = { ...updated[index], [field]: value };
        setSevaConfigs(updated);
        onSevasChange?.(updated);
    };

    const selectedCount = sevaConfigs.filter((s) => s.selected).length;

    const getSevaTypeBadge = (type: "Ritual" | "Darshan" | "Special") => {
        const colors = {
            Ritual: "bg-purple-100 text-purple-700 border-purple-300",
            Darshan: "bg-blue-100 text-blue-700 border-purple-300",
            Special: "bg-amber-100 text-amber-700 border-amber-300",
        };
        return colors[type];
    };

    return (
        <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-muted/30">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-sm font-medium">Configure Event Sevas & Darshan</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Select sevas/darshan types and configure booking settings for each
                        </p>
                    </div>
                    {selectedCount > 0 && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                            {selectedCount} selected
                        </Badge>
                    )}
                </div>

                {/* Seva Configuration List */}
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {sevaConfigs.map((seva, idx) => (
                        <div key={idx} className="border rounded-lg p-3 bg-background hover:shadow-sm transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <Switch checked={seva.selected} onCheckedChange={() => handleToggleSeva(idx)} />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium">{seva.name}</p>
                                            <Badge variant="outline" className={`text-xs ${getSevaTypeBadge(seva.type)}`}>
                                                {seva.type}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Default: {seva.defaultSlots} slots · ₹{seva.defaultPrice}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {seva.selected && (
                                <div className="grid grid-cols-4 gap-3 pt-3 border-t">
                                    <div>
                                        <Label className="text-xs">Slot Count</Label>
                                        <Input
                                            type="number"
                                            value={seva.slots}
                                            onChange={(e) => handleFieldChange(idx, "slots", parseInt(e.target.value) || 0)}
                                            className="h-8 text-xs mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs">Price (₹)</Label>
                                        <Input
                                            type="number"
                                            value={seva.price}
                                            onChange={(e) => handleFieldChange(idx, "price", parseInt(e.target.value) || 0)}
                                            className="h-8 text-xs mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs">Time Slot</Label>
                                        <Input
                                            type="time"
                                            value={seva.timeSlot}
                                            onChange={(e) => handleFieldChange(idx, "timeSlot", e.target.value)}
                                            className="h-8 text-xs mt-1"
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={seva.vipOption}
                                                onCheckedChange={(checked) => handleFieldChange(idx, "vipOption", checked)}
                                                className="scale-75"
                                            />
                                            <Label className="text-xs">VIP Option</Label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {selectedCount > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-blue-800">
                            <strong>Note:</strong> After creating the event, you can refine details, assign priests, and manage bookings in the "Sevas & Darshan" tab of the event detail page.
                        </p>
                    </div>
                )}

                {selectedCount === 0 && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
                        <p className="text-xs text-amber-800">
                            No sevas selected yet. Toggle any seva above to configure it for this event.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SevaLinkingSection;
