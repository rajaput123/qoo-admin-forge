import { useState } from "react";
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
import {
  Search,
  Calendar,
  IndianRupee,
  Users,
  Activity as ActivityIcon,
  Plus,
  BookOpen,
  HeartHandshake,
  PartyPopper,
  UserCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { VipPageShell, SectionHeader, VipKpiCard } from "@/components/vip/VipPageShell";

const moduleStyle: Record<
  string,
  { icon: typeof BookOpen; chip: string; ring: string }
> = {
  Bookings: { icon: BookOpen, chip: "bg-sky-500/10 text-sky-700 border-sky-200", ring: "ring-sky-200" },
  Donations: {
    icon: HeartHandshake,
    chip: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
    ring: "ring-emerald-200",
  },
  Events: {
    icon: PartyPopper,
    chip: "bg-amber-500/10 text-amber-700 border-amber-200",
    ring: "ring-amber-200",
  },
  CRM: {
    icon: UserCircle2,
    chip: "bg-violet-500/10 text-violet-700 border-violet-200",
    ring: "ring-violet-200",
  },
};

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
    <VipPageShell
      icon={ActivityIcon}
      eyebrow="VIP · ACTIVITY"
      title="VIP Activity & Engagement"
      description="Read-heavy view of bookings, donations, visit logs and special arrangements for VIP devotees."
      actions={
        <Button
          className="gap-2 bg-primary hover:bg-primary/90 shadow-sm"
          onClick={() => setShowManual(true)}
        >
          <Plus className="h-4 w-4" />
          Log Manual Activity
        </Button>
      }
    >
      {/* KPI Row */}
      <section>
        <SectionHeader eyebrow="ENGAGEMENT" title="Activity totals" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <VipKpiCard
            label="Total Activities"
            value={mockActivity.length.toString()}
            icon={ActivityIcon}
            accent="primary"
          />
          <VipKpiCard label="Unique VIPs" value="3" icon={Users} accent="amber" />
          <VipKpiCard
            label="Donation Logged"
            value="₹27,800"
            icon={IndianRupee}
            accent="green"
          />
          <VipKpiCard label="Bookings Logged" value="1" icon={Calendar} accent="blue" />
        </div>
      </section>

      {/* Filters + Table */}
      <section>
        <SectionHeader eyebrow="LOG" title="Activity stream" />

        <div className="flex flex-wrap items-center gap-2 mb-3 p-3 rounded-xl border border-border/70 bg-card shadow-sm">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by VIP name or activity..."
              className="pl-9 h-9 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <Button
              variant={moduleFilter === "all" ? "default" : "outline"}
              size="sm"
              className="h-8 rounded-full"
              onClick={() => setModuleFilter("all")}
            >
              All
            </Button>
            {(Object.keys(moduleStyle) as (keyof typeof moduleStyle)[]).map((m) => {
              const M = moduleStyle[m];
              const active = moduleFilter === m;
              return (
                <Button
                  key={m}
                  variant={active ? "default" : "outline"}
                  size="sm"
                  className="h-8 rounded-full gap-1.5"
                  onClick={() => setModuleFilter(m)}
                >
                  <M.icon className="h-3.5 w-3.5" />
                  {m}
                </Button>
              );
            })}
          </div>
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <ActivityIcon className="h-4 w-4 text-primary" />
              VIP Activity Log
              <Badge variant="outline" className="ml-auto text-[10px]">
                {filtered.length} entries
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>VIP Devotee</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((a) => {
                    const M = moduleStyle[a.module];
                    return (
                    <TableRow key={a.id} className="hover:bg-amber-50/30">
                      <TableCell className="text-xs flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {a.date}
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary/90 to-[hsl(16_75%_22%)] text-primary-foreground text-[11px] font-semibold flex items-center justify-center">
                            {a.vipName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </div>
                          <span className="font-medium">{a.vipName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[10px] gap-1 ${M.chip}`}
                        >
                          <M.icon className="h-3 w-3" />
                          {a.module}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-md">
                        <span className="text-foreground">{a.activity}</span>
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
                    );
                  })}
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
      </section>

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
    </VipPageShell>
  );
};

export default Activity;

