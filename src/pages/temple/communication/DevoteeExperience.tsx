import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search, Star, MessageSquare, ThumbsUp, Eye, EyeOff,
  TrendingUp, Image as ImageIcon, Send, Filter, Clock, User, MapPin
} from "lucide-react";
import { toast } from "sonner";
import CustomFieldsSection from "@/components/CustomFieldsSection";

type ExperienceStatus = "pending" | "approved" | "hidden" | "featured";

interface ExperiencePost {
  id: string;
  devoteeName: string;
  devoteePhone: string;
  date: string;
  category: string;
  linkedOffering: string;
  linkedStructure: string;
  rating: number;
  title: string;
  content: string;
  images: string[];
  tags: string[];
  status: ExperienceStatus;
  likes: number;
  views: number;
  adminResponse: string;
  adminRespondedAt: string;
  isTrending: boolean;
  customFields?: Record<string, string>;
}

const CATEGORIES = ["Darshan", "Seva / Offering", "Festival", "Prasadam", "Volunteer Work", "General Visit", "Annadanam"];
const STRUCTURES = ["Main Temple", "Sanctum Sanctorum", "Assembly Hall", "Community Hall", "Shrine - Ganesh", "Shrine - Navagraha"];
const OFFERINGS = ["Morning Abhishekam", "Evening Aarti", "Special Puja", "Maha Shivaratri Puja", "Ganapathi Homam", "Sahasranama Archana"];

const initialPosts: ExperiencePost[] = [
  {
    id: "EXP-001", devoteeName: "Srinivas R.", devoteePhone: "9876543210", date: "2024-02-10",
    category: "Seva / Offering", linkedOffering: "Morning Abhishekam", linkedStructure: "Sanctum Sanctorum",
    rating: 5, title: "Unforgettable Abhishekam Experience",
    content: "The morning abhishekam was beautifully conducted. The priest explained every step with devotion. The entire atmosphere was divine. I felt truly blessed to witness such a sacred ritual. The temple management ensured everything was smooth and well-organized.",
    images: ["abhishekam1.jpg", "abhishekam2.jpg"], tags: ["peaceful", "divine", "well-organized"],
    status: "featured", likes: 48, views: 312, adminResponse: "Thank you for your beautiful words, Srinivas ji. We are glad our priests could make your experience memorable. 🙏",
    adminRespondedAt: "2024-02-10 14:30", isTrending: true,
  },
  {
    id: "EXP-002", devoteeName: "Lakshmi K.", devoteePhone: "9876543211", date: "2024-02-09",
    category: "Festival", linkedOffering: "Maha Shivaratri Puja", linkedStructure: "Main Temple",
    rating: 3, title: "Long Wait but Worth It",
    content: "Maha Shivaratri celebrations were grand but the queue management needs improvement. Waited over 2 hours beyond my scheduled slot. However, the actual darshan and the decorations were breathtaking. Prasadam quality was excellent.",
    images: ["shivaratri1.jpg"], tags: ["crowded", "beautiful-decorations", "long-wait"],
    status: "approved", likes: 15, views: 189, adminResponse: "",
    adminRespondedAt: "", isTrending: false,
  },
  {
    id: "EXP-003", devoteeName: "Anonymous", devoteePhone: "", date: "2024-02-10",
    category: "General Visit", linkedOffering: "", linkedStructure: "Main Temple",
    rating: 4, title: "Clean and Peaceful Temple",
    content: "Very clean premises, good parking facilities. The information desk was helpful. Prasadam counter was well-stocked. Only suggestion: more signage for first-time visitors.",
    images: [], tags: ["clean", "good-facilities", "suggestion"],
    status: "pending", likes: 0, views: 0, adminResponse: "",
    adminRespondedAt: "", isTrending: false,
  },
  {
    id: "EXP-004", devoteeName: "Priya M.", devoteePhone: "9876543213", date: "2024-02-09",
    category: "Seva / Offering", linkedOffering: "Special Puja", linkedStructure: "Shrine - Ganesh",
    rating: 2, title: "Booking Issues Dampened the Experience",
    content: "Online booking system was confusing. Payment failed twice. When I reached the temple, my booking was not showing. Staff had to manually verify. The puja itself was good but the pre-experience was stressful.",
    images: [], tags: ["booking-issue", "payment-problem", "needs-improvement"],
    status: "approved", likes: 8, views: 142, adminResponse: "We sincerely apologize for the inconvenience, Priya ji. Our IT team is working on improving the booking system. Your feedback is valuable.",
    adminRespondedAt: "2024-02-10 09:15", isTrending: false,
  },
  {
    id: "EXP-005", devoteeName: "Venkat S.", devoteePhone: "9876543214", date: "2024-02-08",
    category: "Darshan", linkedOffering: "Evening Aarti", linkedStructure: "Sanctum Sanctorum",
    rating: 5, title: "Evening Aarti - A Must Experience",
    content: "The new sound system makes the evening aarti truly immersive. The lighting and the chanting create an atmosphere of pure devotion. I come here every week and it never gets old. Highly recommend the evening slot.",
    images: ["aarti1.jpg", "aarti2.jpg", "aarti3.jpg"], tags: ["must-visit", "evening-aarti", "devotional"],
    status: "featured", likes: 72, views: 456, adminResponse: "Thank you Venkat ji! We recently upgraded our audio system and your appreciation means a lot. See you every week! 🕉️",
    adminRespondedAt: "2024-02-09 11:00", isTrending: true,
  },
  {
    id: "EXP-006", devoteeName: "Harish G.", devoteePhone: "9876543215", date: "2024-02-10",
    category: "Annadanam", linkedOffering: "", linkedStructure: "Community Hall",
    rating: 4, title: "Heartwarming Annadanam Service",
    content: "Volunteered for annadanam today. The kitchen team is incredibly organized. Food quality is top-notch. Served over 500 devotees. The joy of service is unmatched. More shade in the seating area would help during summers.",
    images: ["annadanam1.jpg"], tags: ["volunteer", "service", "gratitude"],
    status: "approved", likes: 34, views: 201, adminResponse: "",
    adminRespondedAt: "", isTrending: true,
  },
];

const statusConfig: Record<ExperienceStatus, { label: string; class: string }> = {
  pending: { label: "Pending Review", class: "text-amber-700 bg-amber-50 border-amber-200" },
  approved: { label: "Approved", class: "text-green-700 bg-green-50 border-green-200" },
  hidden: { label: "Hidden", class: "text-muted-foreground bg-muted border-border" },
  featured: { label: "Featured", class: "text-primary bg-primary/10 border-primary/30" },
};

const DevoteeExperience = () => {
  const [posts, setPosts] = useState<ExperiencePost[]>(initialPosts);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selected, setSelected] = useState<ExperiencePost | null>(null);
  const [adminReply, setAdminReply] = useState("");
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [customStructures, setCustomStructures] = useState<string[]>([]);
  const [customOfferings, setCustomOfferings] = useState<string[]>([]);
  const [newCat, setNewCat] = useState("");
  const [newStruct, setNewStruct] = useState("");
  const [newOff, setNewOff] = useState("");
  const [showAddCat, setShowAddCat] = useState(false);
  const [showAddStruct, setShowAddStruct] = useState(false);
  const [showAddOff, setShowAddOff] = useState(false);

  const allCategories = [...CATEGORIES, ...customCategories];
  const allStructures = [...STRUCTURES, ...customStructures];
  const allOfferings = [...OFFERINGS, ...customOfferings];

  const filtered = posts
    .filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.devoteeName.toLowerCase().includes(search.toLowerCase()) || p.content.toLowerCase().includes(search.toLowerCase()))
    .filter(p => statusFilter === "all" || p.status === statusFilter)
    .filter(p => categoryFilter === "all" || p.category === categoryFilter);

  const trending = posts.filter(p => p.isTrending && (p.status === "approved" || p.status === "featured"));
  const pendingCount = posts.filter(p => p.status === "pending").length;
  const avgRating = posts.length > 0 ? (posts.reduce((s, p) => s + p.rating, 0) / posts.length).toFixed(1) : "0";
  const totalLikes = posts.reduce((s, p) => s + p.likes, 0);

  const updateStatus = (id: string, status: ExperienceStatus) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    setSelected(prev => prev?.id === id ? { ...prev, status } : prev);
    toast.success(`Post marked as ${statusConfig[status].label}`);
  };

  const toggleTrending = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, isTrending: !p.isTrending } : p));
    setSelected(prev => prev?.id === id ? { ...prev, isTrending: !prev.isTrending } : prev);
    toast.success("Trending status updated");
  };

  const submitAdminResponse = (id: string) => {
    if (!adminReply.trim()) return;
    const now = new Date().toISOString().slice(0, 16).replace("T", " ");
    setPosts(prev => prev.map(p => p.id === id ? { ...p, adminResponse: adminReply, adminRespondedAt: now } : p));
    setSelected(prev => prev?.id === id ? { ...prev, adminResponse: adminReply, adminRespondedAt: now } : prev);
    setAdminReply("");
    toast.success("Response posted");
  };

  const renderStars = (rating: number, size = "h-3.5 w-3.5") => (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`${size} ${i < rating ? "text-amber-500 fill-amber-500" : "text-muted-foreground/30"}`} />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total Experiences", value: String(posts.length), icon: MessageSquare },
          { label: "Avg Rating", value: avgRating, icon: Star },
          { label: "Pending Review", value: String(pendingCount), icon: Clock },
          { label: "Trending", value: String(trending.length), icon: TrendingUp },
          { label: "Total Likes", value: totalLikes.toLocaleString(), icon: ThumbsUp },
        ].map(kpi => (
          <Card key={kpi.label}>
            <CardContent className="p-4">
              <kpi.icon className="h-5 w-5 text-muted-foreground mb-2" />
              <p className="text-2xl font-bold">{kpi.value}</p>
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trending Experiences */}
      {trending.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" />Trending Experiences</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trending.slice(0, 3).map(post => (
              <Card key={post.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => { setSelected(post); setAdminReply(""); }}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <Badge variant="outline" className={statusConfig[post.status].class}>{statusConfig[post.status].label}</Badge>
                    {renderStars(post.rating)}
                  </div>
                  <h4 className="font-medium text-sm line-clamp-1">{post.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">{post.content}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                    <span className="flex items-center gap-1"><User className="h-3 w-3" />{post.devoteeName}</span>
                    <span className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" />{post.likes}</span>
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{post.views}</span>
                    </span>
                  </div>
                  {post.images.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground"><ImageIcon className="h-3 w-3" />{post.images.length} photo(s)</div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search experiences..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]"><Filter className="h-3.5 w-3.5 mr-1" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="hidden">Hidden</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {allCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Feed List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <Card><CardContent className="p-8 text-center text-muted-foreground">No experiences found</CardContent></Card>
        ) : (
          filtered.map(post => (
            <Card key={post.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => { setSelected(post); setAdminReply(""); }}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  {/* Left: Avatar area */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  {/* Right: Content */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm">{post.devoteeName}</span>
                          <span className="text-xs text-muted-foreground">· {post.date}</span>
                          <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                          {post.isTrending && <Badge variant="outline" className="text-primary bg-primary/10 border-primary/30 text-xs">🔥 Trending</Badge>}
                        </div>
                        {post.linkedOffering && <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" />{post.linkedOffering} · {post.linkedStructure}</span>}
                      </div>
                      <Badge variant="outline" className={`${statusConfig[post.status].class} text-xs flex-shrink-0`}>{statusConfig[post.status].label}</Badge>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-1">{post.title}</h4>
                      {renderStars(post.rating)}
                    </div>

                    <p className="text-sm text-foreground/80 line-clamp-2">{post.content}</p>

                    {post.images.length > 0 && (
                      <div className="flex gap-2 mt-1">
                        {post.images.map((img, i) => (
                          <div key={i} className="w-16 h-16 rounded-md bg-muted flex items-center justify-center border">
                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                          </div>
                        ))}
                      </div>
                    )}

                    {post.tags.length > 0 && (
                      <div className="flex gap-1.5 flex-wrap">
                        {post.tags.map(tag => <span key={tag} className="text-xs text-primary bg-primary/5 px-2 py-0.5 rounded-full">#{tag}</span>)}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" />{post.likes} likes</span>
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{post.views} views</span>
                      {post.adminResponse && <span className="flex items-center gap-1 text-primary"><MessageSquare className="h-3 w-3" />Admin responded</span>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Experience Details</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              {/* Moderation Actions */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <Badge variant="outline" className={`${statusConfig[selected.status].class} text-sm px-3 py-1`}>{statusConfig[selected.status].label}</Badge>
                <div className="flex gap-2 flex-wrap">
                  {selected.status === "pending" && (
                    <>
                      <Button size="sm" onClick={() => updateStatus(selected.id, "approved")}>Approve</Button>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(selected.id, "hidden")}><EyeOff className="h-3.5 w-3.5 mr-1" />Hide</Button>
                    </>
                  )}
                  {selected.status === "approved" && (
                    <>
                      <Button size="sm" onClick={() => updateStatus(selected.id, "featured")}><TrendingUp className="h-3.5 w-3.5 mr-1" />Feature</Button>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(selected.id, "hidden")}><EyeOff className="h-3.5 w-3.5 mr-1" />Hide</Button>
                    </>
                  )}
                  {selected.status === "featured" && (
                    <Button size="sm" variant="outline" onClick={() => updateStatus(selected.id, "approved")}>Remove from Featured</Button>
                  )}
                  {selected.status === "hidden" && (
                    <Button size="sm" onClick={() => updateStatus(selected.id, "approved")}>Restore</Button>
                  )}
                  <Button size="sm" variant={selected.isTrending ? "destructive" : "outline"} onClick={() => toggleTrending(selected.id)}>
                    {selected.isTrending ? "Remove Trending" : "🔥 Mark Trending"}
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="post">
                <TabsList className="w-full">
                  <TabsTrigger value="post" className="flex-1">Post</TabsTrigger>
                  <TabsTrigger value="devotee" className="flex-1">Devotee Info</TabsTrigger>
                  <TabsTrigger value="response" className="flex-1">Admin Response</TabsTrigger>
                  <TabsTrigger value="custom" className="flex-1">Custom Fields</TabsTrigger>
                </TabsList>

                <TabsContent value="post" className="space-y-4 mt-4">
                  <div>
                    <h3 className="font-semibold text-base">{selected.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      {renderStars(selected.rating, "h-4 w-4")}
                      <span className="text-sm text-muted-foreground">{selected.rating}/5</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground block text-xs mb-0.5">Category</span>
                      <Select value={selected.category} onValueChange={v => {
                        const updated = { ...selected, category: v };
                        setSelected(updated);
                        setPosts(prev => prev.map(p => p.id === updated.id ? updated : p));
                      }}>
                        <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {allCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                          {!showAddCat ? (
                            <div className="px-2 py-1.5">
                              <Button variant="ghost" size="sm" className="w-full justify-start text-xs h-7" onClick={e => { e.stopPropagation(); setShowAddCat(true); }}>+ Add New</Button>
                            </div>
                          ) : (
                            <div className="px-2 py-1.5 flex gap-1">
                              <Input className="h-7 text-xs" value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="New category" onClick={e => e.stopPropagation()} />
                              <Button size="sm" className="h-7 text-xs px-2" onClick={e => { e.stopPropagation(); if (newCat.trim()) { setCustomCategories(p => [...p, newCat.trim()]); setNewCat(""); setShowAddCat(false); } }}>Add</Button>
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-xs mb-0.5">Linked Offering</span>
                      <Select value={selected.linkedOffering || "none"} onValueChange={v => {
                        const updated = { ...selected, linkedOffering: v === "none" ? "" : v };
                        setSelected(updated);
                        setPosts(prev => prev.map(p => p.id === updated.id ? updated : p));
                      }}>
                        <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {allOfferings.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                          {!showAddOff ? (
                            <div className="px-2 py-1.5">
                              <Button variant="ghost" size="sm" className="w-full justify-start text-xs h-7" onClick={e => { e.stopPropagation(); setShowAddOff(true); }}>+ Add New</Button>
                            </div>
                          ) : (
                            <div className="px-2 py-1.5 flex gap-1">
                              <Input className="h-7 text-xs" value={newOff} onChange={e => setNewOff(e.target.value)} placeholder="New offering" onClick={e => e.stopPropagation()} />
                              <Button size="sm" className="h-7 text-xs px-2" onClick={e => { e.stopPropagation(); if (newOff.trim()) { setCustomOfferings(p => [...p, newOff.trim()]); setNewOff(""); setShowAddOff(false); } }}>Add</Button>
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-xs mb-0.5">Linked Structure</span>
                      <Select value={selected.linkedStructure || "none"} onValueChange={v => {
                        const updated = { ...selected, linkedStructure: v === "none" ? "" : v };
                        setSelected(updated);
                        setPosts(prev => prev.map(p => p.id === updated.id ? updated : p));
                      }}>
                        <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {allStructures.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          {!showAddStruct ? (
                            <div className="px-2 py-1.5">
                              <Button variant="ghost" size="sm" className="w-full justify-start text-xs h-7" onClick={e => { e.stopPropagation(); setShowAddStruct(true); }}>+ Add New</Button>
                            </div>
                          ) : (
                            <div className="px-2 py-1.5 flex gap-1">
                              <Input className="h-7 text-xs" value={newStruct} onChange={e => setNewStruct(e.target.value)} placeholder="New structure" onClick={e => e.stopPropagation()} />
                              <Button size="sm" className="h-7 text-xs px-2" onClick={e => { e.stopPropagation(); if (newStruct.trim()) { setCustomStructures(p => [...p, newStruct.trim()]); setNewStruct(""); setShowAddStruct(false); } }}>Add</Button>
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-xs mb-0.5">Date Posted</span>
                      <span>{selected.date}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-muted-foreground block text-xs mb-1">Experience</span>
                    <div className="border rounded-lg p-3 bg-muted/30 text-sm whitespace-pre-wrap">{selected.content}</div>
                  </div>

                  {selected.images.length > 0 && (
                    <div>
                      <span className="text-muted-foreground block text-xs mb-1">Photos ({selected.images.length})</span>
                      <div className="flex gap-2 flex-wrap">
                        {selected.images.map((img, i) => (
                          <div key={i} className="w-20 h-20 rounded-md bg-muted flex items-center justify-center border">
                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selected.tags.length > 0 && (
                    <div>
                      <span className="text-muted-foreground block text-xs mb-1">Tags</span>
                      <div className="flex gap-1.5 flex-wrap">{selected.tags.map(t => <Badge key={t} variant="secondary">#{t}</Badge>)}</div>
                    </div>
                  )}

                  <div className="flex gap-6 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><ThumbsUp className="h-4 w-4" />{selected.likes} likes</span>
                    <span className="flex items-center gap-1"><Eye className="h-4 w-4" />{selected.views} views</span>
                  </div>
                </TabsContent>

                <TabsContent value="devotee" className="space-y-3 mt-4 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div><span className="text-muted-foreground block text-xs mb-0.5">Name</span>{selected.devoteeName}</div>
                    <div><span className="text-muted-foreground block text-xs mb-0.5">Phone</span>{selected.devoteePhone || "Not provided"}</div>
                    <div><span className="text-muted-foreground block text-xs mb-0.5">Post ID</span><span className="font-mono">{selected.id}</span></div>
                    <div><span className="text-muted-foreground block text-xs mb-0.5">Posted On</span>{selected.date}</div>
                  </div>
                </TabsContent>

                <TabsContent value="response" className="space-y-4 mt-4">
                  {selected.adminResponse ? (
                    <div className="border rounded-lg p-4 bg-primary/5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-primary">Admin Response</span>
                        <span className="text-xs text-muted-foreground">{selected.adminRespondedAt}</span>
                      </div>
                      <p className="text-sm">{selected.adminResponse}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No admin response yet.</p>
                  )}
                  <div className="space-y-2 pt-2 border-t">
                    <Label className="text-xs text-muted-foreground">{selected.adminResponse ? "Update Response" : "Write Response"}</Label>
                    <Textarea rows={3} value={adminReply} onChange={e => setAdminReply(e.target.value)} placeholder="Write your response to this devotee's experience..." />
                    <div className="flex justify-end">
                      <Button size="sm" onClick={() => submitAdminResponse(selected.id)} disabled={!adminReply.trim()}>
                        <Send className="h-3.5 w-3.5 mr-1" />Post Response
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="custom" className="mt-4">
                  <CustomFieldsSection fields={selected.customFields ? Object.entries(selected.customFields).map(([name]) => ({ name, value: "", type: "text" as const })) : []} onFieldsChange={(fields) => {
                    const cf: Record<string, string> = {};
                    fields.forEach(f => { cf[f.name] = f.value || ""; });
                    const updated = { ...selected, customFields: cf };
                    setSelected(updated);
                    setPosts(prev => prev.map(p => p.id === updated.id ? updated : p));
                  }} />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DevoteeExperience;