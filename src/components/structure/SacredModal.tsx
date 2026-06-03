import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Upload, ImagePlus, User, MapPin, Camera, Sparkles } from "lucide-react";
import type { Sacred, SacredType, Temple, ChildTemple } from "@/types/temple-structure";
import { sacredTypeLabels } from "@/types/temple-structure";

interface SacredModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sacred?: Sacred | null;
  temples?: Temple[];
  childTemples?: ChildTemple[];
  onSave: (data: Partial<Sacred>) => void;
}

interface FormState {
  name: string;
  sacredType: SacredType;
  description: string;
  status: 'active' | 'inactive';
  associatedTempleId: string;
  associatedTempleType: 'temple' | 'child_temple';
  image: string;
  images: string[];
  saintName: string;
  saintTitle: string;
  samadhiDate: string;
  mathAffiliation: string;
  historicalNotes: string;
  saintImage: string;
}

const defaultForm: FormState = {
  name: '',
  sacredType: 'samadhi',
  description: '',
  status: 'active',
  associatedTempleId: '',
  associatedTempleType: 'temple',
  image: '',
  images: [],
  saintName: '',
  saintTitle: '',
  samadhiDate: '',
  mathAffiliation: '',
  historicalNotes: '',
  saintImage: '',
};

export function SacredModal({ open, onOpenChange, sacred, temples = [], childTemples = [], onSave }: SacredModalProps) {
  const [form, setForm] = useState<FormState>(defaultForm);

  useEffect(() => {
    if (sacred) {
      setForm({
        name: sacred.name || '',
        sacredType: sacred.sacredType || 'samadhi',
        description: sacred.description || '',
        status: sacred.status || 'active',
        associatedTempleId: sacred.associatedTempleId || '',
        associatedTempleType: sacred.associatedTempleType || 'temple',
        image: sacred.image || '',
        images: sacred.images || [],
        saintName: sacred.saintName || '',
        saintTitle: sacred.saintTitle || '',
        samadhiDate: sacred.samadhiDate || '',
        mathAffiliation: sacred.mathAffiliation || '',
        historicalNotes: sacred.historicalNotes || '',
        saintImage: sacred.saintImage || '',
      });
    } else {
      setForm(defaultForm);
    }
  }, [sacred, open]);

  const update = (field: keyof FormState, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'images' | 'saintImage' | 'image') => {
    const files = e.target.files;
    if (!files) return;
    if (field === 'images') {
      const newImages = Array.from(files).map(f => URL.createObjectURL(f));
      update('images', [...form.images, ...newImages]);
    } else if (field === 'saintImage') {
      update('saintImage', URL.createObjectURL(files[0]));
    } else {
      update('image', URL.createObjectURL(files[0]));
    }
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    update('images', form.images.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave({
      name: form.name,
      sacredType: form.sacredType,
      description: form.description,
      status: form.status,
      associatedTempleId: form.associatedTempleId,
      associatedTempleType: form.associatedTempleType,
      image: form.images[0] || form.image || '',
      images: form.images,
      saintName: form.saintName,
      saintTitle: form.saintTitle,
      samadhiDate: form.samadhiDate,
      mathAffiliation: form.mathAffiliation,
      historicalNotes: form.historicalNotes,
      saintImage: form.saintImage,
    });
    onOpenChange(false);
  };

  const isShrineType = ['samadhi', 'brindavana', 'adhisthana', 'memorial'].includes(form.sacredType);

  const allLocations = [
    ...temples.map(t => ({ id: t.id, name: t.name, type: 'temple' as const })),
    ...childTemples.map(t => ({ id: t.id, name: t.name, type: 'child_temple' as const })),
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-primary" />
            {sacred ? "Edit Sacred Shrine" : "Add Sacred Shrine"}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="shrine" className="w-full mt-2">
          <TabsList className="w-full justify-start flex-wrap">
            <TabsTrigger value="shrine">Shrine Details</TabsTrigger>
            {isShrineType && <TabsTrigger value="saint">Saint Information</TabsTrigger>}
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>

          {/* ── Shrine Details ── */}
          <TabsContent value="shrine" className="mt-4 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Shrine Name <span className="text-destructive">*</span></Label>
                <Input
                  placeholder="e.g. Sri Raghavendra Brindavana"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Shrine Type <span className="text-destructive">*</span></Label>
                <Select value={form.sacredType} onValueChange={v => update('sacredType', v as SacredType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(sacredTypeLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Short description of this shrine…"
                value={form.description}
                onChange={e => update('description', e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label className="text-base font-medium">Status</Label>
                <p className="text-sm text-muted-foreground">Is this shrine currently active?</p>
              </div>
              <Switch checked={form.status === 'active'} onCheckedChange={v => update('status', v ? 'active' : 'inactive')} />
            </div>
          </TabsContent>

          {/* ── Saint Information ── */}
          {isShrineType && (
            <TabsContent value="saint" className="mt-4 space-y-5">
              <div className="rounded-lg border bg-muted/20 p-4 mb-2">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Details of the Jagadguru, saint, or spiritual leader associated with this shrine.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Saint / Jagadguru Name <span className="text-destructive">*</span></Label>
                  <Input
                    placeholder="e.g. Sri Raghavendra Swamy"
                    value={form.saintName}
                    onChange={e => update('saintName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title / Honorific</Label>
                  <Input
                    placeholder="e.g. Paramahamsa, Jagadguru"
                    value={form.saintTitle}
                    onChange={e => update('saintTitle', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date / Year of Samadhi <span className="text-destructive">*</span></Label>
                  <Input
                    type="date"
                    value={form.samadhiDate}
                    onChange={e => update('samadhiDate', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">If exact date unknown, enter approximate year (Jan 1 of that year)</p>
                </div>
                <div className="space-y-2">
                  <Label>Math / Peetha Affiliation</Label>
                  <Input
                    placeholder="e.g. Mantralayam, Sringeri"
                    value={form.mathAffiliation}
                    onChange={e => update('mathAffiliation', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Historical Notes</Label>
                <Textarea
                  placeholder="Brief history, significance, or lineage information…"
                  value={form.historicalNotes}
                  onChange={e => update('historicalNotes', e.target.value)}
                  rows={3}
                />
              </div>

              {/* Saint Photo */}
              <div className="space-y-2">
                <Label>Saint Photo</Label>
                {form.saintImage ? (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border group">
                    <img src={form.saintImage} alt="Saint" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => update('saintImage', '')}
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center gap-2 cursor-pointer border border-dashed rounded-lg p-4 hover:bg-muted/30 transition-colors w-fit">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Upload saint photo</span>
                    <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'saintImage')} />
                  </label>
                )}
              </div>
            </TabsContent>
          )}

          {/* ── Location ── */}
          <TabsContent value="location" className="mt-4 space-y-5">
            <div className="rounded-lg border bg-muted/20 p-4 mb-2">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Place this shrine under an existing temple or sub-structure.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Parent Location <span className="text-destructive">*</span></Label>
              <Select
                value={form.associatedTempleId ? `${form.associatedTempleType}::${form.associatedTempleId}` : ''}
                onValueChange={v => {
                  const [type, id] = v.split('::');
                  update('associatedTempleType', type as 'temple' | 'child_temple');
                  update('associatedTempleId', id);
                }}
              >
                <SelectTrigger><SelectValue placeholder="Select parent temple or structure" /></SelectTrigger>
                <SelectContent>
                  {allLocations.length > 0 ? (
                    <>
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
                    </>
                  ) : (
                    <SelectItem value="none" disabled>No temples available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          {/* ── Media ── */}
          <TabsContent value="media" className="mt-4 space-y-5">
            <div className="rounded-lg border bg-muted/20 p-4 mb-2">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Upload at least one photo of the shrine. Multiple images are supported.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Shrine Photos <span className="text-destructive">*</span></Label>
              {form.images.length > 0 && (
                <div className="grid grid-cols-4 gap-3 mb-3">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border group">
                      <img src={img} alt={`Shrine ${i + 1}`} className="w-full h-full object-cover" />
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
                <span className="text-sm text-muted-foreground">Click to upload shrine photos</span>
                <span className="text-xs text-muted-foreground">JPG, PNG up to 10MB each</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={e => handleImageUpload(e, 'images')} />
              </label>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!form.name || !form.associatedTempleId}>
            {sacred ? "Update Shrine" : "Add Shrine"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
