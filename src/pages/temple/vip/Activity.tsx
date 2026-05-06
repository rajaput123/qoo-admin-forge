import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Calendar, IndianRupee, Users, Activity as ActivityIcon, Plus } from "lucide-react";
import { toast } from "sonner";

type VipActivity = {
  id: string;
  date: string;
  vipName: string;
  module: "Bookings" | "Donations" | "Events" | "CRM";
  activity: string;
  amount?: number;
  notes: string;
};

const mockActivity: VipActivity[] = [
  {
    id: "A1",
    date: "2026-02-09",
    vipName: "Ramesh Kumar",
    module: "Bookings",
    activity: "VIP Darshan booking (Override applied)",
    amount: 300,
    notes: "Capacity override used for morning slot",
  },
  {
    id: "A2",
    date: "2026-02-08",
    vipName: "Lakshmi Devi",
    module: "Donations",
    activity: "Annadanam sponsorship",
    amount: 25000,
    notes: "Eligible for upgrade recommendation",
  },
  {
    id: "A3",
    date: "2026-02-07",
    vipName: "Anand Verma",
    module: "Events",
    activity: "VIP seating reserved for festival",
    notes: "4 seats blocked in front row",
  },
];

const Activity = () => {
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState<string>("all");
  const [showManual, setShowManual] = useState(false);

  const filtered = mockActivity.filter((a) => {
    if (
      search &&
      !a.vipName.toLowerCase().includes(search.toLowerCase()) &&
      !a.activity.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    if (moduleFilter !== "all" && a.module !== moduleFilter) return false;
    return true;
  });

  const handleAddManual = () => {
    toast.success("Manual VIP activity logged (demo)");
    setShowManual(false);
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
              <ActivityIcon className="h-6 w-6 text-primary" />
              VIP Activity & Engagement
            </h1>
            <p className="text-muted-foreground">
              Read-heavy view of bookings, donations, visit logs and special arrangements for VIP
              devotees.
            </p>
          </div>
          <Button variant="outline" className="gap-2" onClick={() => setShowManual(true)}>
            <Plus className="h-4 w-4" />
            Log Manual Activity
          </Button>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Activities", value: mockActivity.length.toString(), icon: ActivityIcon },
            { label: "Unique VIPs", value: "3", icon: Users },
            { label: "Donation Logged", value: "₹27,800", icon: IndianRupee },
            { label: "Bookings Logged", value: "1", icon: Calendar },
          ].map((kpi, i) => (
            <Card key={i} className="group hover:shadow-md transition-all duration-200">
              <CardContent className="p-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-muted group-hover:bg-primary group-hover:shadow-lg transition-all duration-200 mb-2">
                  <kpi.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary-foreground transition-colors duration-200" />
                </div>
                <p className="text-xl font-bold">{kpi.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{kpi.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by VIP name or activity..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button
            variant={moduleFilter === "all" ? "default" : "outline"}
            size="sm"
            className="gap-1"
            onClick={() => setModuleFilter("all")}
          >
            <Filter className="h-3 w-3" />
            All Modules
          </Button>
          {["Bookings", "Donations", "Events", "CRM"].map((m) => (
            <Button
              key={m}
              variant={moduleFilter === m ? "default" : "outline"}
              size="sm"
              onClick={() => setModuleFilter(m)}
            >
              {m}
            </Button>
          ))}
        </div>

        {/* Activity Table */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <ActivityIcon className="h-4 w-4 text-primary" />
              VIP Activity Log
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>VIP Devotee</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="text-xs flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {a.date}
                      </TableCell>
                      <TableCell className="text-sm">{a.vipName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px]">
                          {a.module}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-md">
                        {a.activity}
                        {a.notes && (
                          <span className="block text-[11px] text-muted-foreground/80 mt-0.5">
                            {a.notes}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium">
                        {a.amount ? `₹${a.amount.toLocaleString()}` : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-sm text-muted-foreground"
                      >
                        No VIP activity found for the selected filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Manual Activity Dialog */}
        <Dialog open={showManual} onOpenChange={setShowManual}>
          <DialogContent className="max-w-lg bg-background">
            <DialogHeader>
              <DialogTitle>Log Manual VIP Activity</DialogTitle>
              <DialogDescription>
                Use this only for visit logs, personal meetings or special arrangements. All booking,
                donation and event activities should be auto-logged by the system.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">VIP Devotee</Label>
                  <Input placeholder="Search / select VIP devotee" className="h-9" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Activity Type</Label>
                  <Input
                    placeholder="e.g., Personal meeting, Special arrangement"
                    className="h-9"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Module</Label>
                  <Input placeholder="CRM / Events" className="h-9" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Date</Label>
                  <Input type="date" className="h-9" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Amount (optional)</Label>
                <Input type="number" min={0} className="h-9" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Notes</Label>
                <Textarea
                  rows={3}
                  placeholder="Context of the meeting / visit / arrangement..."
                />
              </div>
            </div>
            <DialogFooter className="mt-2 flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowManual(false)}>
                Cancel
              </Button>
              <Button size="sm" className="gap-1" onClick={handleAddManual}>
                <Plus className="h-3 w-3" />
                Save Activity
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default Activity;

