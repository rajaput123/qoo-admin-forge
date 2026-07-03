import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, Plus, X, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { projectTypes, projectCategories } from "@/data/projectData";

const CreateProject = () => {
    const navigate = useNavigate();

    // Basic Details
    const [title, setTitle] = useState("");
    const [type, setType] = useState("");
    const [customType, setCustomType] = useState("");
    const [category, setCategory] = useState("");
    const [customCategory, setCustomCategory] = useState("");
    const [priority, setPriority] = useState("");
    const [status, setStatus] = useState<"Active" | "Inactive">("Active");
    const [shortDescription, setShortDescription] = useState("");
    const [description, setDescription] = useState("");
    const [religiousSignificance, setReligiousSignificance] = useState("");

    // Timeline
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Funding
    const [estimatedCost, setEstimatedCost] = useState("");

    // Donations
    const [donationsEnabled, setDonationsEnabled] = useState(false);
    const [financeAccount, setFinanceAccount] = useState("");

    // Media
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState("");
    const [galleryImages, setGalleryImages] = useState<File[]>([]);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

    // Sample finance accounts (would come from settings)
    const financeAccounts = [
        { id: "acc-1", name: "Temple Main Account" },
        { id: "acc-2", name: "Donation Trust Account" },
        { id: "acc-3", name: "Construction Fund" },
    ];

    const handleCoverImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverImage(file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    const handleGalleryImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setGalleryImages(prev => [...prev, ...files]);
        setGalleryPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    };

    const removeGalleryImage = (index: number) => {
        setGalleryImages(prev => prev.filter((_, i) => i !== index));
        setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = (publish: boolean) => {
        if (!title) {
            toast.error("Project title is required");
            return;
        }
        if (!type || (type === "Other" && !customType)) {
            toast.error("Project type is required");
            return;
        }
        if (!category || (category === "Other" && !customCategory)) {
            toast.error("Project category is required");
            return;
        }
        if (!priority) {
            toast.error("Priority is required");
            return;
        }
        if (!description) {
            toast.error("Description is required");
            return;
        }
        if (!startDate) {
            toast.error("Start date is required");
            return;
        }

        const newId = `PRJ-${String(Date.now()).slice(-3).padStart(3, "0")}`;
        toast.success(`Project ${publish ? "published" : "saved as draft"} successfully`);
        navigate(`/temple/projects/${newId}`);
    };

    return (
        <div className="p-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/temple/projects/all")}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Create Project</h1>
                        <p className="text-muted-foreground">Start a new temple project or initiative</p>
                    </div>
                </div>

                <div className="max-w-2xl space-y-6">
                    {/* ─── Basic Details ─── */}
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold mb-4">Basic Details</h2>
                        <div className="space-y-5">
                            {/* Title */}
                            <div>
                                <Label className="text-sm font-medium">Title *</Label>
                                <Input
                                    placeholder="e.g., New Gopuram Construction"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className="mt-1.5"
                                />
                            </div>

                            {/* Type */}
                            <div>
                                <Label className="text-sm font-medium">Type (What work) *</Label>
                                <Select value={type} onValueChange={setType}>
                                    <SelectTrigger className="mt-1.5 bg-background">
                                        <SelectValue placeholder="Select project type" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover">
                                        {projectTypes.map(t => (
                                            <SelectItem key={t} value={t}>{t}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {type === "Other" && (
                                    <Input
                                        placeholder="Please specify project type"
                                        value={customType}
                                        onChange={e => setCustomType(e.target.value)}
                                        className="mt-2"
                                    />
                                )}
                            </div>

                            {/* Category */}
                            <div>
                                <Label className="text-sm font-medium">Category (Where / purpose) *</Label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger className="mt-1.5 bg-background">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover">
                                        {projectCategories.map(c => (
                                            <SelectItem key={c} value={c}>{c}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {category === "Other" && (
                                    <Input
                                        placeholder="Please specify category"
                                        value={customCategory}
                                        onChange={e => setCustomCategory(e.target.value)}
                                        className="mt-2"
                                    />
                                )}
                            </div>

                            {/* Priority */}
                            <div>
                                <Label className="text-sm font-medium">Priority (Urgency / importance) *</Label>
                                <Select value={priority} onValueChange={setPriority}>
                                    <SelectTrigger className="mt-1.5 bg-background">
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover">
                                        <SelectItem value="High">High</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Low">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Status */}
                            <div>
                                <Label className="text-sm font-medium">Status</Label>
                                <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                                    <SelectTrigger className="mt-1.5 bg-background">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover">
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground mt-1.5">
                                    Active projects are ongoing. Inactive pauses visibility and workflows. Projects past their expected end date show as Completed automatically in lists.
                                </p>
                            </div>

                            {/* Short Description */}
                            <div>
                                <Label className="text-sm font-medium">Short Description</Label>
                                <Input
                                    placeholder="Brief summary (optional)"
                                    value={shortDescription}
                                    onChange={e => setShortDescription(e.target.value)}
                                    className="mt-1.5"
                                />
                                <p className="text-xs text-muted-foreground mt-1.5">
                                    Purpose: a concise line or two for project cards, lists, and previews so people see the gist at a glance. Optional.
                                </p>
                            </div>

                            {/* Description */}
                            <div>
                                <Label className="text-sm font-medium">Description *</Label>
                                <Textarea
                                    placeholder="Describe the project or initiative..."
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    className="mt-1.5 min-h-[100px]"
                                />
                                <p className="text-xs text-muted-foreground mt-1.5">
                                    Purpose: the full narrative—what this initiative is, why it matters, and what will be done. Shown on the public project page and to donors.
                                </p>
                            </div>

                            {/* Religious Significance */}
                            <div>
                                <Label className="text-sm font-medium">Religious Significance</Label>
                                <Textarea
                                    placeholder="Explain the religious or spiritual importance (optional)"
                                    value={religiousSignificance}
                                    onChange={e => setReligiousSignificance(e.target.value)}
                                    className="mt-1.5 min-h-[80px]"
                                />
                                <p className="text-xs text-muted-foreground mt-1.5">
                                    Purpose: optional context for devotees—deity or tradition, scripture or festival link, and why this work is spiritually meaningful.
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* ─── Timeline ─── */}
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold mb-4">Timeline</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm font-medium">Start Date *</Label>
                                <Input
                                    type="date"
                                    value={startDate}
                                    onChange={e => setStartDate(e.target.value)}
                                    className="mt-1.5"
                                />
                            </div>
                            <div>
                                <Label className="text-sm font-medium">End Date</Label>
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={e => setEndDate(e.target.value)}
                                    className="mt-1.5"
                                />
                                <p className="text-xs text-muted-foreground mt-1.5">
                                    Leave blank for initiatives/projects without a planned end date.
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* ─── Funding ─── */}
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold mb-4">Funding</h2>
                        <div>
                            <Label className="text-sm font-medium">Estimated Cost ₹</Label>
                            <Input
                                type="number"
                                placeholder="Enter estimated cost"
                                value={estimatedCost}
                                onChange={e => setEstimatedCost(e.target.value)}
                                className="mt-1.5"
                            />
                            <p className="text-xs text-muted-foreground mt-1.5">Currency: INR (₹)</p>
                        </div>
                    </Card>

                    {/* ─── Donations ─── */}
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold mb-4">Donations</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium">Enable Donations</Label>
                                <Switch checked={donationsEnabled} onCheckedChange={setDonationsEnabled} />
                            </div>

                            {donationsEnabled && (
                                <div>
                                    <Label className="text-sm font-medium">Finance Account</Label>
                                    {financeAccounts.length > 0 ? (
                                        <Select value={financeAccount} onValueChange={setFinanceAccount}>
                                            <SelectTrigger className="mt-1.5 bg-background">
                                                <SelectValue placeholder="Select finance account" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-popover">
                                                {financeAccounts.map(acc => (
                                                    <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <p className="text-sm text-amber-600 mt-1.5 p-3 bg-amber-50 border border-amber-200 rounded-md">
                                            No finance accounts found. Add accounts in Settings → Finance to see them here.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* ─── Media ─── */}
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold mb-4">Media</h2>
                        <div className="space-y-5">
                            {/* Cover Image */}
                            <div>
                                <Label className="text-sm font-medium">Cover Image</Label>
                                <p className="text-xs text-muted-foreground mt-0.5 mb-2">Upload cover image</p>
                                {coverPreview ? (
                                    <div className="relative w-full h-40 rounded-lg overflow-hidden border">
                                        <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 h-7 w-7"
                                            onClick={() => { setCoverImage(null); setCoverPreview(""); }}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                                        <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                                        <span className="text-sm text-muted-foreground">Choose Image</span>
                                        <input type="file" accept="image/*" className="hidden" onChange={handleCoverImage} />
                                    </label>
                                )}
                            </div>

                            {/* Gallery Images */}
                            <div>
                                <Label className="text-sm font-medium">Gallery Images</Label>
                                <p className="text-xs text-muted-foreground mt-0.5 mb-2">Add gallery images</p>
                                <div className="flex flex-wrap gap-3">
                                    {galleryPreviews.map((preview, idx) => (
                                        <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border">
                                            <img src={preview} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-1 right-1 h-5 w-5"
                                                onClick={() => removeGalleryImage(idx)}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                    <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                                        <Plus className="h-5 w-5 text-muted-foreground" />
                                        <span className="text-[10px] text-muted-foreground mt-1">Add Images</span>
                                        <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryImages} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* ─── Actions ─── */}
                    <div className="flex items-center gap-3 pb-6">
                        <Button variant="outline" onClick={() => navigate("/temple/projects/all")}>
                            Cancel
                        </Button>
                        <Button variant="outline" onClick={() => handleSave(false)}>
                            Save Draft
                        </Button>
                        <Button onClick={() => handleSave(true)}>
                            Publish Project
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CreateProject;
