import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X, ImageIcon, Video } from "lucide-react";
import { eventTypes } from "@/data/eventData";
import type { BasicInfoData } from "@/pages/temple/events/CreateEvent";
import type { TempleEvent } from "@/data/eventData";

interface Props {
  data: BasicInfoData;
  onChange: (data: BasicInfoData) => void;
  errors?: string[];
}

const BasicInfoStep = ({ data, onChange, errors }: Props) => {
  const bannerRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef<HTMLInputElement>(null);
  const videosRef = useRef<HTMLInputElement>(null);

  const update = (patch: Partial<BasicInfoData>) => onChange({ ...data, ...patch });

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      update({ bannerFile: file, bannerPreview: url });
    }
  };

  const removeBanner = () => {
    if (data.bannerPreview) URL.revokeObjectURL(data.bannerPreview);
    update({ bannerFile: null, bannerPreview: "" });
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    update({
      imageFiles: [...data.imageFiles, ...files],
      imagePreviews: [...data.imagePreviews, ...newPreviews],
    });
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(data.imagePreviews[index]);
    update({
      imageFiles: data.imageFiles.filter((_, i) => i !== index),
      imagePreviews: data.imagePreviews.filter((_, i) => i !== index),
    });
  };

  const handleVideosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    update({
      videoFiles: [...data.videoFiles, ...files],
      videoPreviews: [...data.videoPreviews, ...newPreviews],
    });
    e.target.value = "";
  };

  const removeVideo = (index: number) => {
    URL.revokeObjectURL(data.videoPreviews[index]);
    update({
      videoFiles: data.videoFiles.filter((_, i) => i !== index),
      videoPreviews: data.videoPreviews.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
        <p className="text-sm text-muted-foreground mt-1">Enter the core details of the event</p>
      </div>

      {errors && errors.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 space-y-1">
          {errors.map((err, i) => (
            <p key={i} className="text-xs text-destructive flex items-center gap-1.5">• {err}</p>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl">
        {/* Event Title - full width */}
        <div className="md:col-span-2 space-y-1.5">
          <Label>Event Title <span className="text-destructive">*</span></Label>
          <Input value={data.name} onChange={(e) => update({ name: e.target.value })} placeholder="e.g., Brahmotsavam 2026" />
        </div>

        <div className="space-y-1.5">
          <Label>Event Type <span className="text-destructive">*</span></Label>
          <Select value={data.type} onValueChange={(v) => update({ type: v as TempleEvent["type"] })}>
            <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-popover">
              {eventTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              <SelectItem value="Fundraiser">Fundraiser</SelectItem>
              <SelectItem value="Special Occasion">Special Occasion</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Location <span className="text-destructive">*</span></Label>
          <Input
            value={data.location}
            onChange={(e) => update({ location: e.target.value })}
            placeholder="e.g., Main Temple Hall"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Start Date & Time <span className="text-destructive">*</span></Label>
          <div className="flex gap-2">
            <Input type="date" value={data.startDate} onChange={(e) => update({ startDate: e.target.value })} className="flex-1" />
            <Input type="time" value={data.startTime} onChange={(e) => update({ startTime: e.target.value })} className="w-32" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>End Date & Time <span className="text-destructive">*</span></Label>
          <div className="flex gap-2">
            <Input type="date" value={data.endDate} onChange={(e) => update({ endDate: e.target.value })} className="flex-1" />
            <Input type="time" value={data.endTime} onChange={(e) => update({ endTime: e.target.value })} className="w-32" />
          </div>
          {data.endDate < data.startDate && (
            <p className="text-xs text-destructive">End date cannot be before start date</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Event Visibility</Label>
          <Select value={data.visibility} onValueChange={(v: any) => update({ visibility: v })}>
            <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="Public">Public</SelectItem>
              <SelectItem value="Private">Private</SelectItem>
              <SelectItem value="Internal">Internal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Event Status</Label>
          <Select value={data.status} onValueChange={(v: any) => update({ status: v })}>
            <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Published">Published</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Banner Upload */}
        <div className="md:col-span-2 space-y-1.5">
          <Label>Event Banner</Label>
          {data.bannerPreview ? (
            <div className="relative rounded-lg overflow-hidden border h-40 bg-muted">
              <img src={data.bannerPreview} alt="Banner" className="w-full h-full object-cover" />
              <Button size="icon" variant="destructive" className="absolute top-2 right-2 h-7 w-7" onClick={removeBanner}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <button
              onClick={() => bannerRef.current?.click()}
              className="w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary/50 hover:text-primary/70 transition-colors"
            >
              <ImageIcon className="h-8 w-8" />
              <span className="text-sm">Click to upload event banner</span>
              <span className="text-xs">PNG, JPG up to 5MB</span>
            </button>
          )}
          <input ref={bannerRef} type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />
        </div>

        {/* Multiple Images Upload */}
        <div className="md:col-span-2 space-y-1.5">
          <Label>Event Images</Label>
          <div className="flex flex-wrap gap-3">
            {data.imagePreviews.map((src, i) => (
              <div key={i} className="relative w-28 h-28 rounded-lg overflow-hidden border bg-muted">
                <img src={src} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                <Button size="icon" variant="destructive" className="absolute top-1 right-1 h-6 w-6" onClick={() => removeImage(i)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            <button
              onClick={() => imagesRef.current?.click()}
              className="w-28 h-28 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary/50 hover:text-primary/70 transition-colors"
            >
              <ImageIcon className="h-6 w-6" />
              <span className="text-xs">Add Images</span>
            </button>
          </div>
          <input ref={imagesRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImagesChange} />
        </div>

        {/* Multiple Videos Upload */}
        <div className="md:col-span-2 space-y-1.5">
          <Label>Event Videos</Label>
          <div className="flex flex-wrap gap-3">
            {data.videoPreviews.map((src, i) => (
              <div key={i} className="relative w-44 h-28 rounded-lg overflow-hidden border bg-muted">
                <video src={src} className="w-full h-full object-cover" muted />
                <Button size="icon" variant="destructive" className="absolute top-1 right-1 h-6 w-6" onClick={() => removeVideo(i)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            <button
              onClick={() => videosRef.current?.click()}
              className="w-44 h-28 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary/50 hover:text-primary/70 transition-colors"
            >
              <Video className="h-6 w-6" />
              <span className="text-xs">Add Videos</span>
            </button>
          </div>
          <input ref={videosRef} type="file" accept="video/*" multiple className="hidden" onChange={handleVideosChange} />
        </div>

        {/* Description - full width */}
        <div className="md:col-span-2 space-y-1.5">
          <Label>Description</Label>
          <Textarea
            value={data.description}
            onChange={(e) => update({ description: e.target.value })}
            placeholder="Event description and objectives..."
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;
