import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, ImagePlus, Monitor, MapPin, Camera } from "lucide-react";
import type { Counter, CounterType, HallRoom, Temple, ChildTemple } from "@/types/temple-structure";
import { counterTypeLabels } from "@/types/temple-structure";

interface CounterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  counter?: Counter | null;
  hallRooms?: HallRoom[];
  temples?: Temple[];
  childTemples?: ChildTemple[];
  onSave: (data: Partial<Counter>) => void;
}

interface FormState {
  name: string;
  counterType: CounterType;
  description: string;
  status: 'active' | 'inactive';
  hallRoomId: string;
  associatedTempleId: string;
  associatedTempleType: 'temple' | 'child_temple';
  images: string[];
}

const defaultForm: FormState = {
  name: '',
  counterType: 'seva',
  description: '',
  status: 'active',
  hallRoomId: '',
  associatedTempleId: '',
  associatedTempleType: 'temple',
  images: [],
};

export function CounterModal({ open, onOpenChange, counter, hallRooms = [], temples = [], childTemples = [], onSave }: CounterModalProps) {
  const [form, setForm] = useState<FormState>(defaultForm);

  useEffect(() => {
    if (counter) {
      setForm({
        name: counter.name || '',
        counterType: counter.counterType || 'seva',
        description: counter.description || '',
        status: counter.status || 'active',
        hallRoomId: counter.hallRoomId || '',
        associatedTempleId: counter.associatedTempleId || '',
        associatedTempleType: counter.associatedTempleType || 'temple',
        images: counter.images?.length ? counter.images : counter.image ? [counter.image] : [],
      });
    } else {
      setForm(defaultForm);
    }
  }, [counter, open]);

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
      counterType: form.counterType,
      description: form.description || undefined,
      status: form.status,
      hallRoomId: form.hallRoomId,
      associatedTempleId: form.associatedTempleId || undefined,
      associatedTempleType: form.associatedTempleType,
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
            <Monitor className="h-5 w-5 text-primary" />
            {counter ? "Edit Counter" : "Add Counter"}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full mt-2">
          <TabsList className="w-full justify-start flex-wrap">
            <TabsTrigger value="basic">Basic Details</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>

          {/* ── Basic Details ── */}
          <TabsContent value="basic" className="mt-4 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Counter Name <span className="text-destructive">*</span></Label>
                <Input
                  placeholder="e.g. Seva Booking Counter 1"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Counter Type <span className="text-destructive">*</span></Label>
                <Select value={form.counterType} onValueChange={v => update('counterType', v as CounterType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(counterTypeLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Brief description of this counter…"
                value={form.description}
                onChange={e => update('description', e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label className="text-base font-medium">Status</Label>
                <p className="text-sm text-muted-foreground">Is this counter currently active?</p>
              </div>
              <Switch checked={form.status === 'active'} onCheckedChange={v => update('status', v ? 'active' : 'inactive')} />
            </div>
          </TabsContent>

          {/* ── Location ── */}
          <TabsContent value="location" className="mt-4 space-y-5">
            <div className="rounded-lg border bg-muted/20 p-4 mb-2">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Assign this counter to a temple and optionally to a hall/room.
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
              <Label>Hall / Room</Label>
              <Select value={form.hallRoomId} onValueChange={v => update('hallRoomId', v)}>
                <SelectTrigger><SelectValue placeholder="Select hall or room (optional)" /></SelectTrigger>
                <SelectContent>
                  {hallRooms.map(h => (
                    <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Optionally link this counter to a specific hall or room.</p>
            </div>
          </TabsContent>

          {/* ── Media ── */}
          <TabsContent value="media" className="mt-4 space-y-5">
            <div className="rounded-lg border bg-muted/20 p-4 mb-2">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Upload photos of this counter.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Photos</Label>
              {form.images.length > 0 && (
                <div className="grid grid-cols-4 gap-3 mb-3">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border group">
                      <img src={img} alt={`Counter ${i + 1}`} className="w-full h-full object-cover" />
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
                <span className="text-sm text-muted-foreground">Click to upload counter photos</span>
                <span className="text-xs text-muted-foreground">JPG, PNG up to 10MB each</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!form.name}>
            {counter ? "Update Counter" : "Add Counter"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
