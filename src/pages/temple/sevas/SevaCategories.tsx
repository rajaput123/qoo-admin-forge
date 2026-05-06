import { motion } from "framer-motion";
import { Plus, Search, Filter, MoreVertical, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const categories = [
  { id: 1, name: "Daily Sevas", sevaCount: 5, status: "Active", color: "bg-green-500" },
  { id: 2, name: "Special Sevas", sevaCount: 8, status: "Active", color: "bg-blue-500" },
  { id: 3, name: "Festival Sevas", sevaCount: 4, status: "Active", color: "bg-purple-500" },
  { id: 4, name: "VIP Darshan", sevaCount: 3, status: "Active", color: "bg-amber-500" },
  { id: 5, name: "Prasadam", sevaCount: 6, status: "Active", color: "bg-pink-500" },
];

const SevaCategories = () => {
  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">Seva Categories</h1>
            <p className="text-muted-foreground">Organize your sevas into categories</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search categories..." className="pl-9" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              whileHover={{ y: -2 }}
              className="glass-card rounded-xl p-4 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center`}>
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{category.name}</h3>
                    <p className="text-xs text-muted-foreground">{category.sevaCount} sevas</p>
                  </div>
                </div>
                <button className="p-1 hover:bg-muted rounded">
                  <MoreVertical className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50 text-xs">
                {category.status}
              </Badge>
            </motion.div>
          ))}
        </div>

        {/* Summary Table */}
        <div className="glass-card rounded-xl">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">All Categories</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category Name</TableHead>
                <TableHead>Sevas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${category.color}`} />
                      <span className="font-medium">{category.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{category.sevaCount}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50 text-xs">
                      {category.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">Jan 15, 2024</TableCell>
                  <TableCell>
                    <button className="p-1 hover:bg-muted rounded">
                      <MoreVertical className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </div>
  );
};

export default SevaCategories;
