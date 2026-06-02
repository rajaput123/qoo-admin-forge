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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Crown,
  Sparkles,
  ShieldCheck,
  ArrowUpRight,
  Gauge,
  Users,
  Star,
  IndianRupee,
  HeartHandshake,
  Gem,
  Trophy,
  BellRing,
  CheckCircle2,
  Calendar,
  HandHelping,
} from "lucide-react";
import { toast } from "sonner";
import { VipPageShell, SectionHeader, VipKpiCard } from "@/components/vip/VipPageShell";
import { devoteesData, Devotee } from "@/data/devotees";

/* ---------- Rule engine ---------- */

type Tier = "Silver" | "Gold" | "Platinum" | "Diamond";

type DonationRule = { silver: number; gold: number; platinum: number; diamond: number };
type MembershipRule = { silverYears: number; goldYears: number; platinumYears: number; diamondYears: number };
type SponsorRule = { minEvents: number; tier: Tier };
type TrusteeRule = { tags: string[]; tier: Tier };

type RuleConfig = {
  donation: DonationRule;
  membership: MembershipRule;
  sponsor: SponsorRule;
  trustee: TrusteeRule;
  requireApproval: boolean;
  notifyDevotee: boolean;
  notifyAdmin: boolean;
};

const DEFAULT_RULES: RuleConfig = {
  donation: { silver: 25000, gold: 100000, platinum: 500000, diamond: 1000000 },
  membership: { silverYears: 2, goldYears: 5, platinumYears: 10, diamondYears: 15 },
  sponsor: { minEvents: 1, tier: "Gold" },
  trustee: { tags: ["Trustee", "Trustee Family", "Honorary"], tier: "Platinum" },
  requireApproval: true,
  notifyDevotee: true,
  notifyAdmin: true,
};

const TIER_ORDER: Tier[] = ["Silver", "Gold", "Platinum", "Diamond"];
const tierRank = (t: Tier | null) => (t ? TIER_ORDER.indexOf(t) : -1);
const maxTier = (a: Tier | null, b: Tier | null): Tier | null =>
  tierRank(a) >= tierRank(b) ? a : b;

/* ---------- Metric helpers ---------- */

const tenureYears = (d: Devotee): number => {
  const dates: string[] = [
    ...(d.donations?.map((x) => x.date) ?? []),
    ...(d.visits?.map((x) => x.date) ?? []),
  ].filter(Boolean);
  if (!dates.length) return 1;
  const earliest = new Date(dates.sort()[0]).getTime();
  return Math.max(1, Math.round((Date.now() - earliest) / (365.25 * 24 * 3600 * 1000)));
};

const sponsorEventCount = (d: Devotee) =>
  d.donations?.filter((x) =>
    /festival|brahmots|annadan|kalyan|abhishek|sponsor/i.test(x.purpose ?? ""),
  ).length ?? 0;

/* ---------- Rule evaluators ---------- */

type MatchedRule = {
  type: "Donation" | "Membership" | "Sponsor" | "Trustee";
  tier: Tier;
  reason: string;
};

const evalDonation = (d: Devotee, r: DonationRule): MatchedRule | null => {
  const amt = d.totalDonations || 0;
  let tier: Tier | null = null;
  if (amt >= r.diamond) tier = "Diamond";
  else if (amt >= r.platinum) tier = "Platinum";
  else if (amt >= r.gold) tier = "Gold";
  else if (amt >= r.silver) tier = "Silver";
  if (!tier) return null;
  return {
    type: "Donation",
    tier,
    reason: `₹${amt.toLocaleString("en-IN")} lifetime donation`,
  };
};

const evalMembership = (d: Devotee, r: MembershipRule): MatchedRule | null => {
  const yrs = tenureYears(d);
  let tier: Tier | null = null;
  if (yrs >= r.diamondYears) tier = "Diamond";
  else if (yrs >= r.platinumYears) tier = "Platinum";
  else if (yrs >= r.goldYears) tier = "Gold";
  else if (yrs >= r.silverYears) tier = "Silver";
  if (!tier) return null;
  return { type: "Membership", tier, reason: `${yrs} years as active devotee` };
};

const evalSponsor = (d: Devotee, r: SponsorRule): MatchedRule | null => {
  const count = sponsorEventCount(d);
  if (count < r.minEvents) return null;
  return {
    type: "Sponsor",
    tier: r.tier,
    reason: `Sponsored ${count} event${count > 1 ? "s" : ""} (festival/annadanam/seva)`,
  };
};

const evalTrustee = (d: Devotee, r: TrusteeRule): MatchedRule | null => {
  const matched = d.tags?.find((t) =>
    r.tags.some((rt) => rt.toLowerCase() === t.toLowerCase()),
  );
  if (!matched) return null;
  return { type: "Trustee", tier: r.tier, reason: `Tagged as "${matched}"` };
};

const evaluate = (d: Devotee, c: RuleConfig) => {
  const matches = [
    evalDonation(d, c.donation),
    evalMembership(d, c.membership),
    evalSponsor(d, c.sponsor),
    evalTrustee(d, c.trustee),
  ].filter(Boolean) as MatchedRule[];
  const finalTier = matches.reduce<Tier | null>((acc, m) => maxTier(acc, m.tier), null);
  return { matches, finalTier };
};

/* ---------- Tier benefits ---------- */

const TIER_BENEFITS: Record<Tier, string[]> = {
  Silver: ["Priority darshan queue", "5% discount on paid sevas", "Festival invitation card"],
  Gold: [
    "Reserved seating (2 seats)",
    "10% discount on paid sevas",
    "Annual prasadam hamper",
    "Quarterly newsletter",
  ],
  Platinum: [
    "Reserved seating (6 seats)",
    "Darshan fast-track pass",
    "20% discount on paid sevas",
    "Personal coordinator on visits",
    "Trustee meet invitation",
  ],
  Diamond: [
    "Private darshan slot",
    "Reserved seating (10 seats)",
    "Full waiver on sevas",
    "Dedicated coordinator + driver pickup",
    "Board / Trustee inner-circle access",
    "Annual honour ceremony",
  ],
};

const tierTone: Record<Tier, string> = {
  Silver: "bg-slate-500/10 text-slate-700 border-slate-200",
  Gold: "bg-amber-500/10 text-amber-700 border-amber-200",
  Platinum: "bg-violet-500/10 text-violet-700 border-violet-200",
  Diamond: "bg-sky-500/10 text-sky-700 border-sky-200",
};

const tierIcon: Record<Tier, typeof Crown> = {
  Silver: Star,
  Gold: Trophy,
  Platinum: Crown,
  Diamond: Gem,
};

/* ---------- Component ---------- */

const Eligibility = () => {
  const navigate = useNavigate();
  const [rules, setRules] = useState<RuleConfig>(DEFAULT_RULES);
  const [search, setSearch] = useState("");
  const [promoting, setPromoting] = useState<{
    devotee: Devotee;
    tier: Tier;
    matches: MatchedRule[];
  } | null>(null);

  const scored = useMemo(
    () => devoteesData.map((d) => ({ d, ...evaluate(d, rules) })),
    [rules],
  );

  const eligible = scored
    .filter((s) => !s.d.vip && s.finalTier)
    .sort((a, b) => tierRank(b.finalTier) - tierRank(a.finalTier));

  const filtered = eligible.filter((s) =>
    !search
      ? true
      : s.d.name.toLowerCase().includes(search.toLowerCase()) ||
        s.d.phone.includes(search) ||
        s.d.id.toLowerCase().includes(search.toLowerCase()),
  );

  const counts: Record<Tier, number> = {
    Silver: 0, Gold: 0, Platinum: 0, Diamond: 0,
  };
  eligible.forEach((s) => s.finalTier && counts[s.finalTier]++);

  const confirmPromote = () => {
    if (!promoting) return;
    const { devotee, tier } = promoting;
    const msgs: string[] = [];
    if (rules.requireApproval) msgs.push("Sent to admin for approval");
    else msgs.push(`Assigned ${tier} tier`);
    if (rules.notifyDevotee) msgs.push("Devotee notified");
    if (rules.notifyAdmin) msgs.push("Admin notified");
    toast.success(`${devotee.name}: ${msgs.join(" · ")}`);
    setPromoting(null);
    navigate(`/temple/devotees?devoteeId=${devotee.id}`);
  };

  return (
    <VipPageShell
      eyebrow="VIP ELIGIBILITY ENGINE"
      title="Rule-based VIP Promotion"
      description="Auto-evaluates every devotee against Donation, Membership, Sponsor and Trustee rules. The highest matching tier is suggested with benefits and notifications."
      icon={Sparkles}
    >
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <VipKpiCard label="Silver Candidates" value={String(counts.Silver)} sub="Entry-level VIP" icon={Star} accent="blue" />
        <VipKpiCard label="Gold Candidates" value={String(counts.Gold)} sub="Recurring contributors" icon={Trophy} accent="amber" />
        <VipKpiCard label="Platinum Candidates" value={String(counts.Platinum)} sub="Major patrons" icon={Crown} accent="rose" />
        <VipKpiCard label="Diamond Candidates" value={String(counts.Diamond)} sub="Inner circle" icon={Gem} accent="primary" />
      </div>

      {/* Rules */}
      <Card>
        <CardContent className="p-5 space-y-5">
          <SectionHeader
            eyebrow="CRITERIA RULES"
            title="Configure VIP tier thresholds"
            trailing={
              <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                <label className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Admin approval
                  <Switch checked={rules.requireApproval} onCheckedChange={(v) => setRules((r) => ({ ...r, requireApproval: v }))} />
                </label>
                <label className="flex items-center gap-2">
                  <BellRing className="h-3.5 w-3.5" />
                  Notify
                  <Switch checked={rules.notifyDevotee} onCheckedChange={(v) => setRules((r) => ({ ...r, notifyDevotee: v }))} />
                </label>
              </div>
            }
          />

          {/* Donation rule */}
          <div className="rounded-lg border bg-muted/20 p-4">
            <div className="flex items-center gap-2 mb-3">
              <IndianRupee className="h-4 w-4 text-emerald-700" />
              <h3 className="text-sm font-semibold">Donation Rule</h3>
              <span className="text-[11px] text-muted-foreground">— lifetime donation thresholds (₹)</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {TIER_ORDER.map((t) => (
                <div key={t}>
                  <Label className="text-[11px] text-muted-foreground">{t}</Label>
                  <Input
                    type="number"
                    value={rules.donation[t.toLowerCase() as keyof DonationRule]}
                    onChange={(e) =>
                      setRules((r) => ({
                        ...r,
                        donation: { ...r.donation, [t.toLowerCase()]: Number(e.target.value) || 0 } as DonationRule,
                      }))
                    }
                    className="h-9 mt-1"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Membership rule */}
          <div className="rounded-lg border bg-muted/20 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-sky-700" />
              <h3 className="text-sm font-semibold">Membership Rule</h3>
              <span className="text-[11px] text-muted-foreground">— minimum years as active devotee</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(["silverYears", "goldYears", "platinumYears", "diamondYears"] as const).map((k, i) => (
                <div key={k}>
                  <Label className="text-[11px] text-muted-foreground">{TIER_ORDER[i]} (years)</Label>
                  <Input
                    type="number"
                    value={rules.membership[k]}
                    onChange={(e) =>
                      setRules((r) => ({ ...r, membership: { ...r.membership, [k]: Number(e.target.value) || 0 } }))
                    }
                    className="h-9 mt-1"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Sponsor rule */}
          <div className="rounded-lg border bg-muted/20 p-4">
            <div className="flex items-center gap-2 mb-3">
              <HeartHandshake className="h-4 w-4 text-rose-700" />
              <h3 className="text-sm font-semibold">Sponsor Rule</h3>
              <span className="text-[11px] text-muted-foreground">— event / festival / annadanam sponsorship</span>
            </div>
            <div className="grid grid-cols-2 gap-3 max-w-md">
              <div>
                <Label className="text-[11px] text-muted-foreground">Min sponsored events</Label>
                <Input type="number" value={rules.sponsor.minEvents}
                  onChange={(e) => setRules((r) => ({ ...r, sponsor: { ...r.sponsor, minEvents: Number(e.target.value) || 0 } }))}
                  className="h-9 mt-1" />
              </div>
              <div>
                <Label className="text-[11px] text-muted-foreground">Granted tier</Label>
                <select
                  className="h-9 mt-1 w-full rounded-md border bg-background px-2 text-sm"
                  value={rules.sponsor.tier}
                  onChange={(e) => setRules((r) => ({ ...r, sponsor: { ...r.sponsor, tier: e.target.value as Tier } }))}
                >
                  {TIER_ORDER.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Trustee rule */}
          <div className="rounded-lg border bg-muted/20 p-4">
            <div className="flex items-center gap-2 mb-3">
              <HandHelping className="h-4 w-4 text-violet-700" />
              <h3 className="text-sm font-semibold">Trustee / Honorary Rule</h3>
              <span className="text-[11px] text-muted-foreground">— auto-promote devotees with these tags</span>
            </div>
            <div className="grid grid-cols-2 gap-3 max-w-xl">
              <div>
                <Label className="text-[11px] text-muted-foreground">Tags (comma separated)</Label>
                <Input
                  value={rules.trustee.tags.join(", ")}
                  onChange={(e) => setRules((r) => ({ ...r, trustee: { ...r.trustee, tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) } }))}
                  className="h-9 mt-1"
                />
              </div>
              <div>
                <Label className="text-[11px] text-muted-foreground">Granted tier</Label>
                <select
                  className="h-9 mt-1 w-full rounded-md border bg-background px-2 text-sm"
                  value={rules.trustee.tier}
                  onChange={(e) => setRules((r) => ({ ...r, trustee: { ...r.trustee, tier: e.target.value as Tier } }))}
                >
                  {TIER_ORDER.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={() => setRules(DEFAULT_RULES)}>Reset to defaults</Button>
          </div>
        </CardContent>
      </Card>

      {/* Eligible list */}
      <Card>
        <CardContent className="p-0">
          <div className="flex items-center justify-between p-3 border-b">
            <Input
              placeholder="Search devotee by name, mobile or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 max-w-sm"
            />
            <p className="text-[11px] text-muted-foreground">
              {filtered.length} of {eligible.length} eligible
            </p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Devotee</TableHead>
                  <TableHead>Matched Rules</TableHead>
                  <TableHead className="text-center">Suggested Tier</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(({ d, matches, finalTier }) => {
                  const Icon = finalTier ? tierIcon[finalTier] : Crown;
                  return (
                    <motion.tr key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b hover:bg-muted/40">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-[11px] font-semibold text-amber-900">
                            {d.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                          </div>
                          <div>
                            <p className="text-sm font-medium leading-tight">{d.name}</p>
                            <p className="text-[11px] text-muted-foreground">{d.id} · {d.city}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {matches.map((m, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-[11px]">
                              <Badge variant="outline" className={`text-[10px] ${tierTone[m.tier]}`}>{m.type} → {m.tier}</Badge>
                              <span className="text-muted-foreground">{m.reason}</span>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {finalTier && (
                          <Badge variant="outline" className={`text-[11px] gap-1 ${tierTone[finalTier]}`}>
                            <Icon className="h-3 w-3" />
                            {finalTier}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" className="h-7 gap-1" onClick={() => finalTier && setPromoting({ devotee: d, tier: finalTier, matches })}>
                          <ArrowUpRight className="h-3 w-3" />
                          {rules.requireApproval ? "Request" : "Promote"}
                        </Button>
                      </TableCell>
                    </motion.tr>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-10">
                      No devotees match the current rules. Lower the thresholds or check the tag list.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Promote confirm dialog with benefits + notification preview */}
      <Dialog open={!!promoting} onOpenChange={(o) => !o && setPromoting(null)}>
        <DialogContent className="max-w-lg bg-background">
          {promoting && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {(() => {
                    const Icon = tierIcon[promoting.tier];
                    return <Icon className="h-5 w-5 text-primary" />;
                  })()}
                  Assign {promoting.tier} VIP — {promoting.devotee.name}
                </DialogTitle>
                <DialogDescription>
                  Matched {promoting.matches.length} rule{promoting.matches.length > 1 ? "s" : ""}. Highest tier wins.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3">
                <div className="rounded-md border bg-muted/30 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Rules matched</p>
                  <div className="space-y-1.5">
                    {promoting.matches.map((m, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <Badge variant="outline" className={`text-[10px] ${tierTone[m.tier]}`}>{m.type}</Badge>
                        <span>{m.reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-md border bg-amber-50 dark:bg-amber-950/20 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300 mb-2">{promoting.tier} benefits</p>
                  <ul className="space-y-1">
                    {TIER_BENEFITS[promoting.tier].map((b) => (
                      <li key={b} className="flex items-start gap-2 text-xs">
                        <Sparkles className="h-3 w-3 mt-0.5 text-amber-700" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <BellRing className="h-3.5 w-3.5" />
                  Will notify:
                  {rules.notifyDevotee && <Badge variant="secondary" className="text-[10px]">Devotee (SMS + Email)</Badge>}
                  {rules.notifyAdmin && <Badge variant="secondary" className="text-[10px]">Admin</Badge>}
                  {!rules.notifyDevotee && !rules.notifyAdmin && <span>none</span>}
                </div>

                {rules.requireApproval && (
                  <p className="text-[11px] text-amber-700 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    Admin approval required before tier becomes active.
                  </p>
                )}
              </div>

              <DialogFooter className="mt-2">
                <Button variant="outline" onClick={() => setPromoting(null)}>Cancel</Button>
                <Button onClick={confirmPromote} className="gap-1">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  {rules.requireApproval ? "Send for approval" : `Assign ${promoting.tier}`}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </VipPageShell>
  );
};

export default Eligibility;