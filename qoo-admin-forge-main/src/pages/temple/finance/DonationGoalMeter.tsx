import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Target, Heart, TrendingUp, Plus, Trophy, Star, Package } from "lucide-react";
import { useDonations } from "@/modules/donations/hooks";
import { toast } from "sonner";

interface DonationGoal {
  id: string;
  name: string;
  target: number;
  collected: number;
  linkedTo: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Achieved" | "Expired";
}

const dummyGoals: DonationGoal[] = [
  { id: "G-001", name: "Gopuram Renovation Fund", target: 8000000, collected: 5450000, linkedTo: "Project", startDate: "2024-06-01", endDate: "2025-12-31", status: "Active" },
  { id: "G-002", name: "Annadanam Corpus Fund", target: 5000000, collected: 5000000, linkedTo: "General", startDate: "2024-01-01", endDate: "2025-03-31", status: "Achieved" },
  { id: "G-003", name: "Brahmotsavam 2025 Fund", target: 2500000, collected: 1250000, linkedTo: "Event", startDate: "2025-01-01", endDate: "2025-04-15", status: "Active" },
  { id: "G-004", name: "School Building Extension", target: 3500000, collected: 890000, linkedTo: "Project", startDate: "2025-02-01", endDate: "2026-01-31", status: "Active" },
];

const formatCurrency = (val: number) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
  return `₹${val.toLocaleString("en-IN")}`;
};

const DonationGoalMeter = () => {
  const [goals] = useState<DonationGoal[]>(dummyGoals);
  const [showCreate, setShowCreate] = useState(false);
  const donations = useDonations();

  // Combine cash + non-cash totals from actual donations
  const cashTotal = donations.filter(d => (d.nature || "Cash") === "Cash").reduce((s, d) => s + d.amount, 0);
  const nonCashTotal = donations.filter(d => d.nature === "Non-Cash").reduce((s, d) => s + d.amount, 0);
  const combinedDonationTotal = cashTotal + nonCashTotal;

  const totalTarget = goals.filter(g => g.status === "Active").reduce((s, g) => s + g.target, 0);
  const totalCollected = goals.filter(g => g.status === "Active").reduce((s, g) => s + g.collected, 0);
  const overallPct = totalTarget > 0 ? Math.round((totalCollected / totalTarget) * 100) : 0;

  const getMilestones = (pct: number) => {
    const milestones = [25, 50, 75, 100];
    return milestones.filter(m => pct >= m);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" /> Donation Goal Tracker
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Visual progress towards fundraising targets</p>
        </div>
        <Button onClick={() => setShowCreate(!showCreate)} className="gap-2">
          <Plus className="h-4 w-4" /> New Goal
        </Button>
      </div>

      {/* Overall Progress */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-32 h-32 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" strokeWidth="8" stroke="hsl(var(--muted))" fill="none" />
                <circle cx="50" cy="50" r="42" strokeWidth="8" stroke="hsl(var(--primary))" fill="none"
                  strokeDasharray={`${overallPct * 2.64} ${264 - overallPct * 2.64}`}
                  strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">{overallPct}%</span>
                <span className="text-[10px] text-muted-foreground">Overall</span>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left space-y-2">
              <h2 className="text-xl font-bold">Active Campaign Progress</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Target</p>
                  <p className="text-lg font-bold">{formatCurrency(totalTarget)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Collected</p>
                  <p className="text-lg font-bold text-green-700">{formatCurrency(totalCollected)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Remaining</p>
                  <p className="text-lg font-bold text-amber-600">{formatCurrency(totalTarget - totalCollected)}</p>
                </div>
              </div>
              {/* Cash vs Non-Cash breakdown */}
              <div className="flex items-center gap-4 pt-2 justify-center md:justify-start">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Cash:</span>
                  <span className="font-semibold">{formatCurrency(cashTotal)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <Package className="h-3 w-3 text-amber-600" />
                  <span className="text-muted-foreground">Non-Cash:</span>
                  <span className="font-semibold">{formatCurrency(nonCashTotal)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-muted-foreground">Total Raised:</span>
                  <span className="font-bold text-green-700">{formatCurrency(combinedDonationTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Form */}
      {showCreate && (
        <Card className="border-primary/20">
          <CardHeader className="pb-3"><CardTitle className="text-base">Create New Goal</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><Label>Goal Name</Label><Input placeholder="e.g., Temple Renovation" className="mt-1" /></div>
              <div><Label>Target Amount (₹)</Label><Input type="number" placeholder="Enter target" className="mt-1" /></div>
              <div><Label>Link To</Label>
                <Select><SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {["Event", "Project", "General"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Start Date</Label><Input type="date" className="mt-1" /></div>
              <div><Label>End Date</Label><Input type="date" className="mt-1" /></div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button onClick={() => { setShowCreate(false); toast.success("Goal created"); }}>Create Goal</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Individual Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {goals.map(goal => {
          const pct = Math.min(Math.round((goal.collected / goal.target) * 100), 100);
          const remaining = Math.max(goal.target - goal.collected, 0);
          const milestones = getMilestones(pct);
          const isAchieved = goal.status === "Achieved" || pct >= 100;

          return (
            <Card key={goal.id} className={isAchieved ? "border-green-200 bg-green-50/20" : ""}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-sm flex items-center gap-1.5">
                      {isAchieved && <Trophy className="h-4 w-4 text-amber-500" />}
                      {goal.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-[10px]">{goal.linkedTo}</Badge>
                      <Badge variant="outline" className={`text-[10px] ${isAchieved ? "bg-green-50 text-green-700 border-green-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}>
                        {isAchieved ? "Achieved" : "Active"}
                      </Badge>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-primary">{pct}%</span>
                </div>

                <Progress value={pct} className="h-3 mb-3" />

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-muted/30 rounded p-2">
                    <p className="text-muted-foreground">Target</p>
                    <p className="font-bold">{formatCurrency(goal.target)}</p>
                  </div>
                  <div className="bg-green-50 rounded p-2">
                    <p className="text-green-600">Collected</p>
                    <p className="font-bold text-green-700">{formatCurrency(goal.collected)}</p>
                  </div>
                  <div className="bg-amber-50 rounded p-2">
                    <p className="text-amber-600">Remaining</p>
                    <p className="font-bold text-amber-700">{formatCurrency(remaining)}</p>
                  </div>
                </div>

                {/* Milestones */}
                <div className="flex items-center gap-1 mt-3">
                  {[25, 50, 75, 100].map(m => (
                    <div key={m} className={`flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded ${milestones.includes(m) ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                      <Star className={`h-2.5 w-2.5 ${milestones.includes(m) ? "fill-primary" : ""}`} />
                      {m}%
                    </div>
                  ))}
                </div>

                <p className="text-[10px] text-muted-foreground mt-2">
                  {new Date(goal.startDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })} — {new Date(goal.endDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DonationGoalMeter;
