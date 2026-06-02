import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Crown,
  Sparkles,
  Calculator,
  TrendingUp,
  ShieldCheck,
  ArrowUpRight,
  Gauge,
  Users,
  Star,
  IndianRupee,
} from "lucide-react";
import { toast } from "sonner";
import { VipPageShell, SectionHeader, VipKpiCard } from "@/components/vip/VipPageShell";
import { devoteesData, Devotee } from "@/data/devotees";

type Rules = {
  pointsPerThousandDonated: number;
  pointsPerBooking: number;
  pointsPerVisit: number;
  volunteerBonus: number;
  festivalSponsorBonus: number; // applied if any donation purpose includes Festival/Brahmotsavam/Annadanam
  pointsPerTenureYear: number;
  requireAdminApproval: boolean;
  silver: number;
  gold: number;
  platinum: number;
};

const DEFAULT_RULES: Rules = {
  pointsPerThousandDonated: 10,
  pointsPerBooking: 5,
  pointsPerVisit: 2,
  volunteerBonus: 50,
  festivalSponsorBonus: 75,
  pointsPerTenureYear: 20,
  requireAdminApproval: true,
  silver: 100,
  gold: 500,
  platinum: 2000,
};

const tenureYears = (d: Devotee): number => {
  // Approximation: use earliest donation or visit date; fallback 1 year
  const dates: string[] = [
    ...(d.donations?.map((x) => x.date) ?? []),
    ...(d.visits?.map((x) => x.date) ?? []),
  ].filter(Boolean);
  if (!dates.length) return 1;
  const earliest = new Date(dates.sort()[0]).getTime();
  const years = (Date.now() - earliest) / (365.25 * 24 * 3600 * 1000);
  return Math.max(1, Math.round(years));
};

const hasFestivalSponsorship = (d: Devotee) =>
  d.donations?.some((x) =>
    /festival|brahmots|annadan|kalyan|abhishek/i.test(x.purpose ?? ""),
  ) ?? false;

const scoreDevotee = (d: Devotee, r: Rules) => {
  const donationPts = Math.floor((d.totalDonations || 0) / 1000) * r.pointsPerThousandDonated;
  const bookingPts = (d.totalBookings || 0) * r.pointsPerBooking;
  const visitPts = (d.visits?.length || 0) * r.pointsPerVisit;
  const volunteerPts = d.isVolunteer ? r.volunteerBonus : 0;
  const festivalPts = hasFestivalSponsorship(d) ? r.festivalSponsorBonus : 0;
  const tenurePts = tenureYears(d) * r.pointsPerTenureYear;
  const total = donationPts + bookingPts + visitPts + volunteerPts + festivalPts + tenurePts;
  const suggested =
    total >= r.platinum
      ? "Platinum"
      : total >= r.gold
      ? "Gold"
      : total >= r.silver
      ? "Silver"
      : null;
  return {
    total,
    suggested,
    breakdown: { donationPts, bookingPts, visitPts, volunteerPts, festivalPts, tenurePts },
  };
};

const levelTone: Record<string, string> = {
  Platinum: "bg-violet-500/10 text-violet-700 border-violet-200",
  Gold: "bg-amber-500/10 text-amber-700 border-amber-200",
  Silver: "bg-slate-500/10 text-slate-700 border-slate-200",
};

const Eligibility = () => {
  const navigate = useNavigate();
  const [rules, setRules] = useState<Rules>(DEFAULT_RULES);
  const [search, setSearch] = useState("");

  const scored = useMemo(
    () =>
      devoteesData.map((d) => ({ d, ...scoreDevotee(d, rules) })),
    [rules],
  );

  const eligible = scored
    .filter((s) => !s.d.vip && s.suggested)
    .sort((a, b) => b.total - a.total);

  const existing = scored
    .filter((s) => s.d.vip)
    .map((s) => {
      const currentRank = ["Silver", "Gold", "Platinum"].indexOf(s.d.vip!.level);
      const suggestedRank = s.suggested
        ? ["Silver", "Gold", "Platinum"].indexOf(s.suggested)
        : -1;
      const recommendation =
        suggestedRank > currentRank
          ? "Upgrade"
          : suggestedRank < currentRank && suggestedRank >= 0
          ? "Downgrade"
          : suggestedRank === -1
          ? "Review"
          : "Maintain";
      return { ...s, recommendation };
    });

  const filteredEligible = eligible.filter((s) =>
    !search
      ? true
      : s.d.name.toLowerCase().includes(search.toLowerCase()) ||
        s.d.phone.includes(search) ||
        s.d.id.toLowerCase().includes(search.toLowerCase()),
  );

  const promote = (id: string) => {
    if (rules.requireAdminApproval) {
      toast.success("Promotion suggestion sent to admin for approval");
    } else {
      toast.success("Devotee promoted to VIP");
    }
    navigate(`/temple/devotees?devoteeId=${id}`);
  };

  const totalEligible = eligible.length;
  const platinumCount = eligible.filter((s) => s.suggested === "Platinum").length;
  const goldCount = eligible.filter((s) => s.suggested === "Gold").length;
  const silverCount = eligible.filter((s) => s.suggested === "Silver").length;

  return (
    <VipPageShell
      eyebrow="VIP ELIGIBILITY ENGINE"
      title="VIP Eligibility & Promotion"
      description="Configure scoring rules and auto-detect devotees who qualify for VIP based on donations, sevas, visits, tenure and special contributions."
      icon={Sparkles}
    >
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <VipKpiCard label="Total Eligible" value={String(totalEligible)} sub="Across all tiers" icon={Users} accent="primary" />
        <VipKpiCard label="Platinum Candidates" value={String(platinumCount)} sub={`≥ ${rules.platinum} pts`} icon={Crown} accent="rose" />
        <VipKpiCard label="Gold Candidates" value={String(goldCount)} sub={`≥ ${rules.gold} pts`} icon={Star} accent="amber" />
        <VipKpiCard label="Silver Candidates" value={String(silverCount)} sub={`≥ ${rules.silver} pts`} icon={Gauge} accent="blue" />
      </div>

      {/* Rules + Thresholds */}
      <Card>
        <CardContent className="p-5">
          <SectionHeader
            eyebrow="CRITERIA ENGINE"
            title="Scoring rules & level thresholds"
            trailing={
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" />
                Admin approval
                <Switch
                  checked={rules.requireAdminApproval}
                  onCheckedChange={(v) => setRules((r) => ({ ...r, requireAdminApproval: v }))}
                />
              </div>
            }
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { key: "pointsPerThousandDonated", label: "Pts / ₹1,000 donated" },
              { key: "pointsPerBooking", label: "Pts / seva booking" },
              { key: "pointsPerVisit", label: "Pts / visit" },
              { key: "volunteerBonus", label: "Volunteer bonus" },
              { key: "festivalSponsorBonus", label: "Festival sponsor bonus" },
              { key: "pointsPerTenureYear", label: "Pts / tenure year" },
            ].map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label className="text-[11px] text-muted-foreground">{f.label}</Label>
                <Input
                  type="number"
                  min={0}
                  value={(rules as any)[f.key]}
                  onChange={(e) =>
                    setRules((r) => ({ ...r, [f.key]: Number(e.target.value) || 0 }))
                  }
                  className="h-9"
                />
              </div>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { key: "silver", label: "Silver threshold", tone: "from-slate-400 to-slate-600" },
              { key: "gold", label: "Gold threshold", tone: "from-amber-400 to-amber-600" },
              { key: "platinum", label: "Platinum threshold", tone: "from-violet-400 to-violet-600" },
            ].map((t) => (
              <div
                key={t.key}
                className="relative overflow-hidden rounded-lg border bg-muted/30 p-3 flex items-center gap-3"
              >
                <div className={`h-9 w-9 rounded-md bg-gradient-to-br ${t.tone} flex items-center justify-center`}>
                  <Crown className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <Label className="text-[11px] text-muted-foreground">{t.label}</Label>
                  <Input
                    type="number"
                    min={0}
                    value={(rules as any)[t.key]}
                    onChange={(e) =>
                      setRules((r) => ({ ...r, [t.key]: Number(e.target.value) || 0 }))
                    }
                    className="h-8 mt-1"
                  />
                </div>
                <span className="text-[10px] text-muted-foreground">points</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Calculator className="h-3 w-3" />
              Rules apply nightly. Honorary / Trustee promotions remain manual.
            </p>
            <Button variant="outline" size="sm" onClick={() => setRules(DEFAULT_RULES)}>
              Reset to defaults
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lists */}
      <Tabs defaultValue="eligible">
        <TabsList>
          <TabsTrigger value="eligible" className="gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> Eligible for VIP
            <Badge variant="secondary" className="ml-1 text-[10px]">{eligible.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="existing" className="gap-1.5">
            <Crown className="h-3.5 w-3.5" /> Existing VIP Review
            <Badge variant="secondary" className="ml-1 text-[10px]">{existing.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="eligible" className="mt-3">
          <Card>
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-3 border-b">
                <Input
                  placeholder="Search devotee by name, mobile or ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 max-w-sm"
                />
                <p className="text-[11px] text-muted-foreground hidden md:block">
                  Showing {filteredEligible.length} of {eligible.length} candidates
                </p>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Devotee</TableHead>
                      <TableHead className="text-right">Donations</TableHead>
                      <TableHead className="text-center">Sevas</TableHead>
                      <TableHead className="text-center">Visits</TableHead>
                      <TableHead>Signals</TableHead>
                      <TableHead className="text-right">Score</TableHead>
                      <TableHead className="text-center">Suggested</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEligible.map(({ d, total, suggested, breakdown }) => (
                      <motion.tr
                        key={d.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b hover:bg-muted/40"
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-[11px] font-semibold text-amber-900">
                              {d.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                            </div>
                            <div>
                              <p className="text-sm font-medium leading-tight">{d.name}</p>
                              <p className="text-[11px] text-muted-foreground">{d.id} · {d.city}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          <span className="inline-flex items-center gap-0.5 font-medium">
                            <IndianRupee className="h-3 w-3" />
                            {(d.totalDonations || 0).toLocaleString("en-IN")}
                          </span>
                        </TableCell>
                        <TableCell className="text-center text-sm">{d.totalBookings}</TableCell>
                        <TableCell className="text-center text-sm">{d.visits?.length || 0}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {d.isVolunteer && (
                              <Badge variant="outline" className="text-[10px]">+{breakdown.volunteerPts} volunteer</Badge>
                            )}
                            {hasFestivalSponsorship(d) && (
                              <Badge variant="outline" className="text-[10px]">+{breakdown.festivalPts} festival</Badge>
                            )}
                            <Badge variant="outline" className="text-[10px]">+{breakdown.tenurePts} tenure</Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-sm font-bold">{total}</span>
                          <span className="text-[10px] text-muted-foreground ml-0.5">pts</span>
                        </TableCell>
                        <TableCell className="text-center">
                          {suggested && (
                            <Badge variant="outline" className={`text-[10px] ${levelTone[suggested]}`}>
                              <Crown className="h-3 w-3 mr-1" />
                              {suggested}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" className="h-7 gap-1" onClick={() => promote(d.id)}>
                            <ArrowUpRight className="h-3 w-3" />
                            Promote
                          </Button>
                        </TableCell>
                      </motion.tr>
                    ))}
                    {filteredEligible.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-10">
                          No devotees meet the current criteria. Try lowering the thresholds.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="existing" className="mt-3">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>VIP Devotee</TableHead>
                      <TableHead className="text-center">Current Level</TableHead>
                      <TableHead className="text-right">Score</TableHead>
                      <TableHead className="text-center">Suggested</TableHead>
                      <TableHead className="text-center">Recommendation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {existing.map(({ d, total, suggested, recommendation }) => (
                      <TableRow key={d.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Crown className="h-3.5 w-3.5 text-amber-600" />
                            <div>
                              <p className="text-sm font-medium">{d.name}</p>
                              <p className="text-[11px] text-muted-foreground">{d.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={`text-[10px] ${levelTone[d.vip!.level] ?? ""}`}>
                            {d.vip!.level}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-sm font-semibold">{total} pts</TableCell>
                        <TableCell className="text-center">
                          {suggested ? (
                            <Badge variant="outline" className={`text-[10px] ${levelTone[suggested]}`}>
                              {suggested}
                            </Badge>
                          ) : (
                            <span className="text-[11px] text-muted-foreground">Below Silver</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className={`text-[10px] gap-1 ${
                              recommendation === "Upgrade"
                                ? "bg-emerald-500/10 text-emerald-700 border-emerald-200"
                                : recommendation === "Downgrade"
                                ? "bg-rose-500/10 text-rose-700 border-rose-200"
                                : recommendation === "Review"
                                ? "bg-amber-500/10 text-amber-700 border-amber-200"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <TrendingUp className="h-3 w-3" />
                            {recommendation}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </VipPageShell>
  );
};

export default Eligibility;