import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { X, ImagePlus, DoorOpen, MapPin, Users, Camera } from "lucide-react";
import type { HallRoom, HallRoomType, Temple, ChildTemple } from "@/types/temple-structure";
import { hallRoomTypeLabels } from "@/types/temple-structure";

interface HallRoomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hallRoom?: HallRoom | null;
  temples?: Temple[];
  childTemples?: ChildTemple[];
  onSave: (data: Partial<HallRoom>) => void;
}

interface FormState {
  name: string;
  type: HallRoomType;
  description: string;
  status: 'active' | 'inactive';
  associatedTempleId: string;
  associatedTempleType: 'temple' | 'child_temple';
  capacity: string;
  floorNumber: string;
  facilities: string[];
  isBookable: boolean;
  hasAC: boolean;
  images: string[];
}

const defaultForm: FormState = {
  name: '',
  type: 'marriage_hall',
  description: '',
  status: 'active',
  associatedTempleId: '',
  associatedTempleType: 'temple',
  capacity: '',
  floorNumber: '',
  facilities: [],
  isBookable: false,
  hasAC: false,
  images: [],
};

export function HallRoomModal({ open, onOpenChange, hallRoom, temples = [], childTemples = [], onSave }: HallRoomModalProps) {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [newFacility, setNewFacility] = useState('');

  useEffect(() => {
    if (hallRoom) {
      setForm({
        name: hallRoom.name || '',
        type: hallRoom.type || 'marriage_hall',
        description: hallRoom.description || '',
        status: hallRoom.status || 'active',
        associatedTempleId: hallRoom.associatedTempleId || hallRoom.zoneId || '',
        associatedTempleType: hallRoom.associatedTempleType || 'temple',
        capacity: hallRoom.capacity?.toString() || '',
        floorNumber: hallRoom.floorNumber?.toString() || '',
        facilities: hallRoom.facilities || [],
        isBookable: hallRoom.isBookable || false,
        hasAC: hallRoom.hasAC || false,
        images: hallRoom.images || [],
      });
    } else {
      setForm(defaultForm);
    }
  }, [hallRoom, open]);

  const update = (field: keyof FormState, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const addFacility = () => {
    if (newFacility.trim() && !form.facilities.includes(newFacility.trim())) {
      update('facilities', [...form.facilities, newFacility.trim()]);
      setNewFacility('');
    }
  };

  const removeFacility = (f: string) => update('facilities', form.facilities.filter(x => x !== f));

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
      type: form.type,
      description: form.description,
      status: form.status,
      zoneId: form.associatedTempleId,
      associatedTempleId: form.associatedTempleId,
      associatedTempleType: form.associatedTempleType,
      capacity: form.capacity ? parseInt(form.capacity) : undefined,
      floorNumber: form.floorNumber ? parseInt(form.floorNumber) : undefined,
      facilities: form.facilities,
      isBookable: form.isBookable,
      hasAC: form.hasAC,
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
            <DoorOpen className="h-5 w-5 text-primary" />
            {hallRoom ? "Edit Hall / Room" : "Add Hall / Room"}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full mt-2">
          <TabsList className="w-full justify-start flex-wrap">
            <TabsTrigger value="basic">Basic Details</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="capacity">Capacity & Facilities</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>

          {/* ── Basic Details ── */}
          <TabsContent value="basic" className="mt-4 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Space Name <span className="text-destructive">*</span></Label>
                <Input
                  placeholder="e.g. Kalyana Mandapam"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Type <span className="text-destructive">*</span></Label>
                <Select value={form.type} onValueChange={v => update('type', v as HallRoomType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(hallRoomTypeLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Brief description of this space…"
                value={form.description}
                onChange={e => update('description', e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label className="text-base font-medium">Status</Label>
                <p className="text-sm text-muted-foreground">Is this space currently active?</p>
              </div>
              <Switch checked={form.status === 'active'} onCheckedChange={v => update('status', v ? 'active' : 'inactive')} />
            </div>
          </TabsContent>

          {/* ── Location ── */}
          <TabsContent value="location" className="mt-4 space-y-5">
            <div className="rounded-lg border bg-muted/20 p-4 mb-2">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Place this hall/room under an existing temple or sub-structure.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label>Floor Number</Label>
                <Input
                  type="number"
                  placeholder="e.g. 0 for ground floor"
                  value={form.floorNumber}
                  onChange={e => update('floorNumber', e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          {/* ── Capacity & Facilities ── */}
          <TabsContent value="capacity" className="mt-4 space-y-5">
            <div className="rounded-lg border bg-muted/20 p-4 mb-2">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Define the capacity and available facilities for this space.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Capacity (persons) <span className="text-destructive">*</span></Label>
                <Input
                  type="number"
                  placeholder="e.g. 200"
                  value={form.capacity}
                  onChange={e => update('capacity', e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label className="text-base font-medium">Air Conditioning</Label>
                <p className="text-sm text-muted-foreground">Does this space have AC?</p>
              </div>
              <Switch checked={form.hasAC} onCheckedChange={v => update('hasAC', v)} />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label className="text-base font-medium">Booking Availability</Label>
                <p className="text-sm text-muted-foreground">Can this space be booked for events?</p>
              </div>
              <Switch checked={form.isBookable} onCheckedChange={v => update('isBookable', v)} />
            </div>

            {/* Facilities */}
            <div className="space-y-3">
              <Label>Facilities</Label>
              {form.facilities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.facilities.map(f => (
                    <Badge key={f} variant="secondary" className="gap-1 px-3 py-1.5">
                      {f}
                      <button type="button" onClick={() => removeFacility(f)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. Projector, Sound System, Kitchen"
                  value={newFacility}
                  onChange={e => setNewFacility(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFacility())}
                />
                <Button type="button" variant="outline" onClick={addFacility}>Add</Button>
              </div>
            </div>
          </TabsContent>

          {/* ── Media ── */}
          <TabsContent value="media" className="mt-4 space-y-5">
            <div className="rounded-lg border bg-muted/20 p-4 mb-2">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Upload at least one photo of this space. Multiple images are supported.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Photos <span className="text-destructive">*</span></Label>
              {form.images.length > 0 && (
                <div className="grid grid-cols-4 gap-3 mb-3">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border group">
                      <img src={img} alt={`Space ${i + 1}`} className="w-full h-full object-cover" />
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
                <span className="text-sm text-muted-foreground">Click to upload photos</span>
                <span className="text-xs text-muted-foreground">JPG, PNG up to 10MB each</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!form.name || !form.associatedTempleId}>
            {hallRoom ? "Update" : "Add Hall / Room"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
