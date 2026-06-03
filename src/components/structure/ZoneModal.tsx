import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, ImagePlus, MapPin, Users, Camera } from "lucide-react";
import type { Zone, ZoneType, Temple, ChildTemple } from "@/types/temple-structure";
import { zoneTypeLabels } from "@/types/temple-structure";

interface ZoneModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  zone?: Zone | null;
  temples?: Temple[];
  childTemples?: ChildTemple[];
  onSave: (data: Partial<Zone>) => void;
}

interface FormState {
  name: string;
  zoneType: ZoneType;
  description: string;
  status: 'active' | 'inactive';
  associatedTempleId: string;
  associatedTempleType: 'temple' | 'child_temple';
  capacity: string;
  mapReference: string;
  images: string[];
}

const defaultForm: FormState = {
  name: '',
  zoneType: 'worship',
  description: '',
  status: 'active',
  associatedTempleId: '',
  associatedTempleType: 'temple',
  capacity: '',
  mapReference: '',
  images: [],
};

export function ZoneModal({ open, onOpenChange, zone, temples = [], childTemples = [], onSave }: ZoneModalProps) {
  const [form, setForm] = useState<FormState>(defaultForm);

  useEffect(() => {
    if (zone) {
      setForm({
        name: zone.name || '',
        zoneType: zone.zoneType || 'worship',
        description: zone.description || '',
        status: zone.status || 'active',
        associatedTempleId: zone.associatedTempleId || '',
        associatedTempleType: zone.associatedTempleType || 'temple',
        capacity: zone.capacity?.toString() || '',
        mapReference: zone.mapReference || '',
        images: zone.images?.length ? zone.images : zone.image ? [zone.image] : [],
      });
    } else {
      setForm(defaultForm);
    }
  }, [zone, open]);

  const update = (field: keyof FormState, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages = Array.from(files).map(f => URL.createObjectURL(f));
    update('images', [...form.images, ...newImages]);
    e.target.value = '';
  };

  const removeImage = (index: number) => update('images', form.images.filter((_, i) => i !== index));

  const handleSave = () => {
    onSave({
      name: form.name,
      zoneType: form.zoneType,
      description: form.description,
      status: form.status,
      associatedTempleId: form.associatedTempleId,
      associatedTempleType: form.associatedTempleType,
      capacity: form.capacity ? parseInt(form.capacity) : undefined,
      mapReference: form.mapReference || undefined,
      image: form.images[0] || '',
      images: form.images,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MapPin className="h-5 w-5 text-primary" />
            {zone ? "Edit Zone" : "Add Zone"}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full mt-2">
          <TabsList className="w-full justify-start flex-wrap">
            <TabsTrigger value="basic">Basic Details</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="capacity">Capacity</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>

          {/* ── Basic Details ── */}
          <TabsContent value="basic" className="mt-4 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Zone Name <span className="text-destructive">*</span></Label>
                <Input
                  placeholder="e.g. Main Worship Zone"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Zone Type</Label>
                <Select value={form.zoneType} onValueChange={v => update('zoneType', v as ZoneType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(zoneTypeLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Brief description of this zone…"
                value={form.description}
                onChange={e => update('description', e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label className="text-base font-medium">Status</Label>
                <p className="text-sm text-muted-foreground">Is this zone currently active?</p>
              </div>
              <Switch checked={form.status === 'active'} onCheckedChange={v => update('status', v ? 'active' : 'inactive')} />
            </div>
          </TabsContent>

          {/* ── Location ── */}
          <TabsContent value="location" className="mt-4 space-y-5">
            <div className="rounded-lg border bg-muted/20 p-4 mb-2">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Assign this zone to a temple in the hierarchy.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Parent Temple <span className="text-destructive">*</span></Label>
              <Select
                value={form.associatedTempleId ? `${form.associatedTempleType}::${form.associatedTempleId}` : ''}
                onValueChange={v => {
                  const [type, id] = v.split('::');
                  update('associatedTempleType', type as 'temple' | 'child_temple');
                  update('associatedTempleId', id);
                }}
              >
                <SelectTrigger><SelectValue placeholder="Select parent temple" /></SelectTrigger>
                <SelectContent>
                  {temples.length > 0 && (
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Main Temples</div>
                  )}
                  {temples.map(t => (
                    <SelectItem key={t.id} value={`temple::${t.id}`}>{t.name}</SelectItem>
                  ))}
                  {childTemples.length > 0 && (
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Child Temples</div>
                  )}
                  {childTemples.map(t => (
                    <SelectItem key={t.id} value={`child_temple::${t.id}`}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Map Reference</Label>
              <Input
                placeholder="e.g. Grid A3, Block 2, or a map URL"
                value={form.mapReference}
                onChange={e => update('mapReference', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Optional reference to locate this zone on a campus map.</p>
            </div>
          </TabsContent>

          {/* ── Capacity ── */}
          <TabsContent value="capacity" className="mt-4 space-y-5">
            <div className="rounded-lg border bg-muted/20 p-4 mb-2">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Define the maximum capacity for this zone.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Maximum Capacity (persons)</Label>
              <Input
                type="number"
                placeholder="e.g. 500"
                value={form.capacity}
                onChange={e => update('capacity', e.target.value)}
              />
            </div>
          </TabsContent>

          {/* ── Media ── */}
          <TabsContent value="media" className="mt-4 space-y-5">
            <div className="rounded-lg border bg-muted/20 p-4 mb-2">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Upload photos of this zone.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Photos</Label>
              {form.images.length > 0 && (
                <div className="grid grid-cols-4 gap-3 mb-3">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border group">
                      <img src={img} alt={`Zone ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <label className="flex flex-col items-center justify-center gap-2 cursor-pointer border-2 border-dashed rounded-lg p-8 hover:bg-muted/30 transition-colors">
                <ImagePlus className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Click to upload zone photos</span>
                <span className="text-xs text-muted-foreground">JPG, PNG up to 10MB each</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!form.name || !form.associatedTempleId}>
            {zone ? "Update Zone" : "Add Zone"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
