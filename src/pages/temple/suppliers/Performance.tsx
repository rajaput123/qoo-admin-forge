import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Star, ThumbsUp, ThumbsDown } from "lucide-react";

const ratings = [
  { id: 1, supplier: "Sri Lakshmi Flowers", poId: "PO-2026-001", rating: 5, quality: "Excellent fresh flowers, consistent quality", timeliness: "Always on time", rehire: true, date: "2026-02-06" },
  { id: 2, supplier: "Annapurna Grocery", poId: "PO-2026-002", rating: 4, quality: "Good quality, 1 damaged dal bag", timeliness: "On time", rehire: true, date: "2026-02-10" },
  { id: 3, supplier: "Shiva Pooja Stores", poId: "PO-2026-004", rating: 5, quality: "Premium camphor and kumkum quality", timeliness: "Early delivery", rehire: true, date: "2026-02-09" },
  { id: 4, supplier: "Nandi Oil & Ghee", poId: "PO-2026-003", rating: 4, quality: "Good ghee quality, oil meets standards", timeliness: "On time", rehire: true, date: "2026-02-12" },
  { id: 5, supplier: "Devi Decorations", poId: "PO-2026-005", rating: 4, quality: "Creative arrangements, good materials", timeliness: "Slight delay (1 hour)", rehire: true, date: "2026-02-14" },
  { id: 6, supplier: "Balaji Print Works", poId: "PO-2025-088", rating: 2, quality: "Poor print quality, color mismatch", timeliness: "2 days late", rehire: false, date: "2025-08-20" },
  { id: 7, supplier: "Surya Milk Dairy", poId: "PO-2026-006", rating: 3, quality: "Acceptable quality", timeliness: "Partial delivery only", rehire: true, date: "2026-02-09" },
];

const supplierSummary = [
  { name: "Sri Lakshmi Flowers", avgRating: 4.8, totalReviews: 24, quality: "Excellent", timeliness: "Excellent", rehireRate: "100%" },
  { name: "Shiva Pooja Stores", avgRating: 4.7, totalReviews: 15, quality: "Excellent", timeliness: "Excellent", rehireRate: "100%" },
  { name: "Devi Decorations", avgRating: 4.6, totalReviews: 8, quality: "Good", timeliness: "Good", rehireRate: "100%" },
  { name: "Annapurna Grocery", avgRating: 4.5, totalReviews: 18, quality: "Good", timeliness: "Good", rehireRate: "94%" },
  { name: "Surya Milk Dairy", avgRating: 4.4, totalReviews: 30, quality: "Good", timeliness: "Average", rehireRate: "90%" },
  { name: "Nandi Oil & Ghee", avgRating: 4.3, totalReviews: 12, quality: "Good", timeliness: "Good", rehireRate: "92%" },
  { name: "Ravi Electricals", avgRating: 3.8, totalReviews: 5, quality: "Average", timeliness: "Average", rehireRate: "60%" },
  { name: "Balaji Print Works", avgRating: 2.1, totalReviews: 4, quality: "Poor", timeliness: "Poor", rehireRate: "0%" },
];

const ratingStars = (r: number) => "⭐".repeat(r) + "☆".repeat(5 - r);

const Performance = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");

  const filteredSummary = supplierSummary.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Performance & Rating</h1>
            <p className="text-muted-foreground">Track supplier quality and reliability</p>
          </div>
          <Button size="sm" onClick={() => setShowAdd(true)}><Plus className="h-4 w-4 mr-2" />Add Rating</Button>
        </div>

        {/* Supplier Performance Summary */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2"><Star className="h-4 w-4 text-amber-500" />Supplier Performance Summary</CardTitle>
              <div className="relative max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier</TableHead>
                  <TableHead className="text-center">Avg Rating</TableHead>
                  <TableHead className="text-center">Reviews</TableHead>
                  <TableHead>Quality</TableHead>
                  <TableHead>Timeliness</TableHead>
                  <TableHead className="text-center">Rehire Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSummary.map((s, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium text-sm">{s.name}</TableCell>
                    <TableCell className="text-center"><Badge variant="outline" className="text-xs">⭐ {s.avgRating}</Badge></TableCell>
                    <TableCell className="text-center text-sm">{s.totalReviews}</TableCell>
                    <TableCell><Badge variant="secondary" className={`text-xs ${s.quality === "Excellent" ? "bg-green-100 text-green-700" : s.quality === "Good" ? "bg-blue-100 text-blue-700" : s.quality === "Poor" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{s.quality}</Badge></TableCell>
                    <TableCell><Badge variant="secondary" className={`text-xs ${s.timeliness === "Excellent" ? "bg-green-100 text-green-700" : s.timeliness === "Good" ? "bg-blue-100 text-blue-700" : s.timeliness === "Poor" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{s.timeliness}</Badge></TableCell>
                    <TableCell className="text-center text-sm font-medium">{s.rehireRate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Ratings */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">Recent Ratings</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier</TableHead>
                  <TableHead>PO Ref</TableHead>
                  <TableHead className="text-center">Rating</TableHead>
                  <TableHead>Quality Feedback</TableHead>
                  <TableHead>Rehire</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ratings.map(r => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium text-sm">{r.supplier}</TableCell>
                    <TableCell className="font-mono text-xs">{r.poId}</TableCell>
                    <TableCell className="text-center text-xs">{ratingStars(r.rating)}</TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate">{r.quality}</TableCell>
                    <TableCell>{r.rehire ? <ThumbsUp className="h-4 w-4 text-green-600" /> : <ThumbsDown className="h-4 w-4 text-red-600" />}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Add Rating Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Add Supplier Rating</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-xs">Supplier</Label><Select><SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger><SelectContent><SelectItem value="s1">Sri Lakshmi Flowers</SelectItem><SelectItem value="s2">Annapurna Grocery</SelectItem><SelectItem value="s3">Shiva Pooja Stores</SelectItem><SelectItem value="s4">Nandi Oil & Ghee</SelectItem></SelectContent></Select></div>
            <div><Label className="text-xs">PO Reference</Label><Input placeholder="PO-2026-XXX" /></div>
            <div><Label className="text-xs">Rating (1–5)</Label><Select><SelectTrigger><SelectValue placeholder="Select rating" /></SelectTrigger><SelectContent><SelectItem value="5">⭐⭐⭐⭐⭐ (5)</SelectItem><SelectItem value="4">⭐⭐⭐⭐ (4)</SelectItem><SelectItem value="3">⭐⭐⭐ (3)</SelectItem><SelectItem value="2">⭐⭐ (2)</SelectItem><SelectItem value="1">⭐ (1)</SelectItem></SelectContent></Select></div>
            <div><Label className="text-xs">Quality Feedback</Label><Textarea placeholder="Quality observations" rows={2} /></div>
            <div><Label className="text-xs">Timeliness Feedback</Label><Textarea placeholder="Delivery timeliness notes" rows={2} /></div>
            <div><Label className="text-xs">Rehire Recommended?</Label><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent></Select></div>
            <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button><Button onClick={() => setShowAdd(false)}>Submit Rating</Button></div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Performance;
