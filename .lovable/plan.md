## VIP Devotee Management — Enterprise Screen Wireframe Spec

Target route: `/temple/vip/devotees` (redesign of existing `src/pages/temple/vip/Devotees.tsx`)
Stack: shadcn/ui + Tailwind, Saffron temple theme, mobile-first. **No code in this phase — wireframe only.**

Data already wired: `src/data/devotees.ts` (`Devotee` + `VipInfo` overlay: status, category, level, validFrom, validTill, sensitive, approvedBy, notes). VIP-eligible = devotees with `vip` object present.

---

### 1. Screen Layout (top to bottom)

```text
┌──────────────────────────────────────────────────────────────────────┐
│  HEADER BAR                                                          │
│  👑 VIP Devotee Management         [Export ▾] [+ Add VIP Devotee]    │
│  Manage VIP profiles, renewals, privileges                           │
├──────────────────────────────────────────────────────────────────────┤
│  KPI STRIP (5 cards, 1 col mobile · 2 col tablet · 5 col desktop)    │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐              │
│  │ Total  │ │ Active │ │Expiring│ │Pending │ │Lifetime│              │
│  │ VIPs   │ │ VIPs   │ │ <30d   │ │Approval│ │  ₹ Val │              │
│  │  24    │ │  18    │ │   4    │ │   2    │ │ ₹42.5L │              │
│  │ ▲ +3 mo│ │ 75%    │ │ amber  │ │ orange │ │ ▲ 12%  │              │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘              │
├──────────────────────────────────────────────────────────────────────┤
│  FILTER / SEARCH BAR (sticky on scroll)                              │
│  [🔍 Search name / phone / VIP ID........]  [Level ▾] [Category ▾]   │
│  [Status ▾] [Validity ▾] [Sensitive ▾] [More filters] [Clear]        │
│  Active chips: × Platinum  × Expiring 30d                            │
├──────────────────────────────────────────────────────────────────────┤
│  VIEW TOGGLE / BULK BAR                                              │
│  [▦ Table] [▥ Cards] [⊞ Kanban by Level]   3 selected → [⇪ Renew]   │
│                                              [⬆ Upgrade] [⬇ Down] ⋯  │
├──────────────────────────────────────────────────────────────────────┤
│  DATA TABLE (default view)                                           │
│  ☐ │Devotee │Lvl│Category│Valid Till│Donations│Last Visit│Status│⋯  │
│  ──┼────────┼───┼────────┼──────────┼─────────┼──────────┼──────┼─  │
│  ☐ │● Ramesh│Plt│High Don│28 Feb 26 │₹1.25 L  │09 Feb 26 │Active│⋯  │
│  ☐ │● Lakshmi│Gld│Vol Donor│05 Mar 26│₹85,000 │08 Feb 26 │⚠ Exp │⋯  │
│  Row click → opens Profile Drawer                                    │
│  ⋯ menu: View · Edit · Renew · Upgrade · Downgrade · Deactivate     │
│  [Pagination · 10/25/50 per page · 1-10 of 24]                       │
└──────────────────────────────────────────────────────────────────────┘
```

---

### 2. Component Hierarchy

```text
<VipDevoteesPage>
├── <PageHeader title icon={Crown} actions={ExportMenu, AddVipButton} />
├── <VipKpiStrip>
│   └── <KpiCard variant=(primary|success|warning|orange|info)> ×5
├── <VipFilterBar sticky>
│   ├── <SearchInput />
│   ├── <Select Level | Category | Status | Validity | Sensitive />
│   ├── <Sheet "More filters"> (date range, donation min/max, tags, approved-by)
│   └── <ActiveFilterChips />
├── <ViewToggle modes=[table, cards, kanban] />
├── <BulkActionBar visible={selected>0}>
│   └── [Renew, Upgrade, Downgrade, Deactivate, Export selected]
├── <VipDataTable>
│   ├── Columns: checkbox, devotee(avatar+name+phone), level badge,
│   │            category, valid till (+countdown), donations,
│   │            last visit, status badge, row-actions menu
│   ├── Sortable headers · empty state · loading skeleton
│   └── <Pagination />
├── <VipCardsView> (alt layout) — same data, glanceable cards
├── <VipKanbanView> (alt) — columns by Level (Plt/Gold/Silver/Bronze)
│
├── <VipProfileDrawer side=right size=xl>      ← opens on row click
│   ├── <ProfileHeader avatar, name, VIP ID, level chip, sensitive lock>
│   │   Quick actions: [Edit] [Renew] [Upgrade] [Downgrade] [Deactivate]
│   ├── <Tabs defaultValue="overview">
│   │   ├── Overview     — contact, demographics, vip card, KPIs
│   │   ├── Benefits     — privileges granted by current level (checklist)
│   │   ├── History      — vertical timeline (joined→upgrades→renewals→notes)
│   │   ├── Bookings     — table of seva/darshan bookings
│   │   ├── Donations    — donation history + receipts
│   │   ├── Communication— SMS / WhatsApp / Email logs
│   │   └── Audit        — approval trail, role-based access log
│   └── Sticky footer: [Print VIP Card] [Close]
│
├── <AddVipDialog>                  (existing flow, retained)
├── <RenewVipDialog>                (NEW — pick new validTill, fee, payment)
├── <UpgradeDowngradeDialog>        (NEW — change level, requires admin)
├── <DeactivateConfirmDialog>       (NEW — reason required, audit logged)
└── <ApprovalQueueSheet>            (NEW — pending VIP nominations)
```

---

### 3. Sub-screen Wireframes

**3a. Profile Drawer (right side, ~520px desktop · full-screen mobile)**
```text
┌──────────────────────────────── ✕ ─┐
│ [👤]  Ramesh Kumar   [👑 Platinum] │
│ VIP-0001 · 🔒 Sensitive            │
│ +91 98765 43210 · Bangalore        │
│ [Edit] [Renew] [⬆] [⬇] [Deactivate]│
├────────────────────────────────────┤
│ Overview│Benefits│History│Book│Don │
├────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐         │
│  │Total Don │ │Visits 12m│         │
│  │ ₹1.25 L  │ │   28     │         │
│  └──────────┘ └──────────┘         │
│  Validity ─────────────●──         │
│  01 Mar 25         28 Feb 26       │
│  19 days left (amber)              │
│                                    │
│  Personal · Address · Tags · Notes │
└────────────────────────────────────┘
```

**3b. History Timeline (Tab)**
```text
●─ 01 Mar 2025  Joined VIP · Platinum     by Admin
│
●─ 15 Jun 2025  Donation ₹50,000          RCP-0012
│
●─ 10 Jan 2026  Renewed                   by Trustee
│
○─ 28 Feb 2026  Expiry (upcoming)
```

**3c. Benefits Tab (per-level checklist, driven by `vip/Levels.tsx`)**
```text
Platinum benefits
  ✓ Priority darshan slot (skip queue)
  ✓ Reserved seating during festivals
  ✓ Personalized prasad delivery
  ✓ Annual temple calendar + medallion
  ✓ Direct line to trustee office
```

**3d. Renew Dialog**
```text
Renew VIP — Ramesh Kumar
  Current valid till: 28 Feb 2026
  New validity:       [01 Mar 2026] → [28 Feb 2027]
  Renewal fee:        [₹ 25,000]
  Payment mode:       (Cash · UPI · Bank · Waived)
  Notes:              [_____________]
  [Cancel]                       [Confirm Renewal]
```

---

### 4. Status / Level Badge System

| Item | Color token | Use |
|---|---|---|
| Active | green | VIP currently valid |
| Expiring (≤30d) | amber | Triggers renewal CTA |
| Expired | red | Read-only, requires reactivation |
| Pending approval | orange | Awaiting admin sign-off |
| Inactive | gray | Manually deactivated |
| Platinum | purple gradient | Level chip |
| Gold | amber gradient | Level chip |
| Silver | slate gradient | Level chip |
| Bronze | bronze/brown | Level chip |
| 🔒 Sensitive | red outline | Restricted profile |

---

### 5. Role-Based Actions

| Action | Super Admin | Trustee | Manager | Staff |
|---|:-:|:-:|:-:|:-:|
| View VIPs (non-sensitive) | ✓ | ✓ | ✓ | ✓ |
| View sensitive VIPs | ✓ | ✓ | — | — |
| Add VIP | ✓ | ✓ | request | — |
| Renew | ✓ | ✓ | ✓ | — |
| Upgrade / Downgrade | ✓ | ✓ | — | — |
| Deactivate | ✓ | ✓ | — | — |
| Approve pending | ✓ | ✓ | — | — |
| Export PII | ✓ | — | — | — |

Hook into existing `usePermissions` (`checkWriteAccess('vip')`).

---

### 6. Responsive Behavior (mobile-first per project core)

- **<640px**: KPI strip → horizontal scroll snap; table → swap to Cards view automatically; filters collapse into a Sheet; drawer → full-screen modal.
- **640–1024px**: 2-col KPI grid; table shows 4 priority columns (Devotee, Level, Valid Till, Status); other columns in row expand.
- **≥1024px**: full 5-col KPI, full table, drawer pinned right at 520px.

---

### 7. Empty / Edge States

- No VIPs yet → centered crown illustration + "Designate first VIP devotee" CTA.
- All expired → red-tinted banner above table with "Renew all" bulk action.
- Filter returns 0 → "No matches — clear filters" link.
- Sensitive profile without permission → masked name "● ● ● ●" + lock badge.

---

### 8. Data Bindings (no schema change)

| UI element | Source |
|---|---|
| KPI Total | `devoteesData.filter(d=>d.vip)` |
| KPI Active | `vip.status==='Active'` |
| Expiring | `vip.validTill - today ≤ 30d` |
| Pending | new `vip.status==='Pending'` (add to enum) |
| Lifetime ₹ | sum of `totalDonations` for VIPs |
| Benefits checklist | from `vip/Levels.tsx` level config |
| History timeline | derive from donations + audit (future: `vipAuditLog[]`) |

Only enum extension needed: add `'Pending'` to `VipInfo.status`. No table/route changes.

---

### 9. Out of Scope (this phase)

- Actual implementation (wireframe-only per your choice).
- New backend tables; everything sources from existing `devoteesData` mock.
- Multi-temple switching UI — handled by tenant layout shell already.

---

### Next step
Approve this wireframe and I'll implement the redesigned `src/pages/temple/vip/Devotees.tsx` plus the three new dialogs and the profile drawer, reusing the existing data layer and permission hook.