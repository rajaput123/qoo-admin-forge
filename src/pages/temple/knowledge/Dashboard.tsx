import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText, Users, FolderTree, TrendingUp, Clock, Eye, Search } from "lucide-react";

const stats = [
  { label: "Total Documents", value: "248", icon: FileText, change: "+12 this month" },
  { label: "Categories", value: "18", icon: FolderTree, change: "3 new" },
  { label: "Published Files", value: "182", icon: BookOpen, change: "+8 this week" },
  { label: "Approved Documents", value: "156", icon: Search, change: "+5 this month" },
];

const recentDocuments = [
  { title: "Temple Opening & Closing SOP", category: "Daily Operations", updatedBy: "Ramesh Kumar", updatedAt: "2 hours ago", views: 156 },
  { title: "Festival Preparation Checklist", category: "Events", updatedBy: "Priest Kumar", updatedAt: "1 day ago", views: 89 },
  { title: "Donation Receipt Guidelines", category: "Finance", updatedBy: "Finance Manager", updatedAt: "2 days ago", views: 234 },
  { title: "Volunteer Training Manual", category: "HR & People", updatedBy: "Ramesh Kumar", updatedAt: "3 days ago", views: 67 },
  { title: "Emergency Response Protocol", category: "Safety", updatedBy: "Ramesh Kumar", updatedAt: "5 days ago", views: 312 },
];

const topCategories = [
  { name: "Daily Operations", docs: 45, color: "bg-primary/10 text-primary" },
  { name: "Finance & Accounts", docs: 38, color: "bg-amber-100 text-amber-700" },
  { name: "Events & Festivals", docs: 32, color: "bg-emerald-100 text-emerald-700" },
  { name: "HR & People", docs: 28, color: "bg-blue-100 text-blue-700" },
  { name: "Safety & Compliance", docs: 22, color: "bg-red-100 text-red-700" },
];

const KnowledgeDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Knowledge Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your temple's knowledge base</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="h-5 w-5 text-muted-foreground" />
                <Badge variant="secondary" className="text-[10px]">{stat.change}</Badge>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Documents */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" /> Recently Updated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentDocuments.map((doc) => (
                <div key={doc.title} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{doc.title}</p>
                      <p className="text-xs text-muted-foreground">{doc.category} · {doc.updatedBy} · {doc.updatedAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                    <Eye className="h-3 w-3" /> {doc.views}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Top Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topCategories.map((cat, i) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-muted-foreground w-4">{i + 1}</span>
                    <span className="text-sm font-medium">{cat.name}</span>
                  </div>
                  <Badge variant="secondary" className={cat.color}>{cat.docs} docs</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KnowledgeDashboard;
