import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, FileText, Download, Eye, Upload, Filter, File, FileImage, FileVideo } from "lucide-react";
import { toast } from "sonner";

interface Document {
  id: string;
  title: string;
  category: string;
  type: "pdf" | "doc" | "image" | "video" | "sop";
  author: string;
  updatedAt: string;
  size: string;
  views: number;
  status: "published" | "draft" | "archived";
}

const documents: Document[] = [
  { id: "DOC-001", title: "Temple Opening & Closing SOP", category: "Daily Operations", type: "sop", author: "Ramesh Kumar", updatedAt: "2024-01-15", size: "2.4 MB", views: 156, status: "published" },
  { id: "DOC-002", title: "Festival Preparation Checklist", category: "Events", type: "doc", author: "Priest Kumar", updatedAt: "2024-01-14", size: "1.8 MB", views: 89, status: "published" },
  { id: "DOC-003", title: "Donation Receipt Guidelines", category: "Finance", type: "pdf", author: "Finance Manager", updatedAt: "2024-01-13", size: "3.1 MB", views: 234, status: "published" },
  { id: "DOC-004", title: "Volunteer Training Video", category: "HR & People", type: "video", author: "Ramesh Kumar", updatedAt: "2024-01-12", size: "45 MB", views: 67, status: "published" },
  { id: "DOC-005", title: "Emergency Response Protocol", category: "Safety", type: "pdf", author: "Ramesh Kumar", updatedAt: "2024-01-10", size: "4.2 MB", views: 312, status: "published" },
  { id: "DOC-006", title: "Annual Budget Template", category: "Finance", type: "doc", author: "Finance Manager", updatedAt: "2024-01-09", size: "1.2 MB", views: 45, status: "draft" },
  { id: "DOC-007", title: "Temple Floor Plan", category: "Daily Operations", type: "image", author: "Ramesh Kumar", updatedAt: "2024-01-08", size: "8.5 MB", views: 198, status: "published" },
  { id: "DOC-008", title: "Puja Procedure Guide", category: "Rituals", type: "sop", author: "Priest Kumar", updatedAt: "2024-01-07", size: "5.6 MB", views: 421, status: "published" },
];

const typeIcons: Record<string, typeof FileText> = {
  pdf: FileText,
  doc: File,
  image: FileImage,
  video: FileVideo,
  sop: FileText,
};

const KnowledgeLibrary = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredDocs = documents.filter(doc => {
    const matchSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || doc.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = categoryFilter === "all" || doc.category === categoryFilter;
    const matchStatus = statusFilter === "all" || doc.status === statusFilter;
    return matchSearch && matchCategory && matchStatus;
  });

  const categories = [...new Set(documents.map(d => d.category))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Knowledge Library</h1>
        <p className="text-sm text-muted-foreground mt-1">Browse and manage all documents, SOPs, and resources</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search documents..." className="pl-9" />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Button size="sm"><Upload className="h-4 w-4 mr-2" /> Upload Document</Button>
      </div>

      {/* Documents Table */}
      <Card>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocs.map((doc) => {
                const TypeIcon = typeIcons[doc.type] || FileText;
                return (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TypeIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="font-medium text-sm">{doc.title}</span>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="secondary" className="text-[10px]">{doc.category}</Badge></TableCell>
                    <TableCell className="text-sm">{doc.author}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{doc.updatedAt}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{doc.size}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{doc.views}</TableCell>
                    <TableCell>
                      <Badge variant={doc.status === "published" ? "default" : doc.status === "draft" ? "secondary" : "outline"} className="capitalize text-[10px]">
                        {doc.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Eye className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => toast.success("Download started")}><Download className="h-3.5 w-3.5" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default KnowledgeLibrary;
