import { getDonationsState } from "@/modules/donations/donationsStore";
import { financeActions, financeSelectors } from "./financeStore";
import { eventExpenses } from "@/data/eventData";
import { getEvents } from "@/modules/events/eventStore";
import { projects } from "@/data/projectData";
import { sevaSelectors } from "@/modules/sevas/sevaStore";
import type { DonationPurpose } from "@/modules/donations/types";

// ─── Donation Purpose → Finance Category ───
const purposeToCategoryMap: Record<string, string> = {
  "General / Hundi": "Hundi Collection",
  "Annadanam Sponsorship": "General Donation",
  "Prasadam Sponsorship": "General Donation",
  "Seva Sponsorship": "Seva Revenue",
  "Project-linked": "Project Donation",
  "Event-linked": "Event Collection",
  "Corpus Fund": "General Donation",
};

function mapDonationCategory(purpose: DonationPurpose | string, nature: string): string {
  if (nature === "Non-Cash") return "Non-Cash Donation";
  return purposeToCategoryMap[purpose] || "General Donation";
}

function mapDonationAccount(channel: string, nature: string) {
  if (nature === "Non-Cash") {
    return { account: "ACC-010", accountName: "Donation Income", paymentMethod: "Cash" as const };
  }
  switch (channel) {
    case "Bank Transfer":
    case "Online":
      return { account: "ACC-002", accountName: "SBI Main Account", paymentMethod: "Bank" as const };
    case "UPI":
      return { account: "ACC-004", accountName: "UPI Wallet", paymentMethod: "UPI" as const };
    case "Cheque":
      return { account: "ACC-002", accountName: "SBI Main Account", paymentMethod: "Cheque" as const };
    default:
      return { account: "ACC-001", accountName: "Cash on Hand", paymentMethod: "Cash" as const };
  }
}

function buildDonationDescription(d: {
  nature: string; donorName: string; purpose: string; receiptNo: string;
  channel: string; mode: string;
  nonCashDetails?: { assetName: string; quantity: number; unit: string; estimatedValue: number };
}): string {
  const parts: string[] = [];
  if (d.nature === "Non-Cash") parts.push("[Non-Cash]");
  parts.push(`Donation from ${d.donorName}`);
  parts.push(`• ${d.purpose}`);
  parts.push(`• Receipt: ${d.receiptNo}`);
  if (d.nature === "Non-Cash" && d.nonCashDetails) {
    const nd = d.nonCashDetails;
    parts.push(`• In-Kind: ${nd.assetName} (${nd.quantity} ${nd.unit}, Est. ₹${nd.estimatedValue.toLocaleString()})`);
  } else {
    parts.push(`• ${d.channel}${d.mode !== d.channel ? ` (${d.mode})` : ""}`);
  }
  return parts.join(" ");
}

// ─── Seva Payment → Account mapping ───
function mapSevaAccount(method: string) {
  switch (method) {
    case "UPI":
      return { account: "ACC-004", accountName: "UPI Wallet", paymentMethod: "UPI" as const };
    case "Bank":
    case "Online":
      return { account: "ACC-002", accountName: "SBI Main Account", paymentMethod: "Bank" as const };
    default:
      return { account: "ACC-001", accountName: "Cash on Hand", paymentMethod: "Cash" as const };
  }
}

// ─── Event Expense Category → Finance Category ───
function mapEventExpenseCategory(cat: string): string {
  if (cat.includes("Kitchen") || cat.includes("Annadanam")) return "Annadanam";
  if (cat.includes("Material")) return "Pooja Supplies";
  if (cat.includes("Freelancer")) return "Festival Expenses";
  if (cat.includes("Sound") || cat.includes("Lighting")) return "Festival Expenses";
  if (cat.includes("Decoration")) return "Festival Expenses";
  if (cat.includes("Transport")) return "Administration";
  return "Festival Expenses";
}

// ─── Project Expense Category → Finance Category ───
function mapProjectExpenseCategory(cat: string): string {
  if (cat === "Materials" || cat === "Equipment") return "Construction";
  if (cat === "Labor") return "Construction";
  return "Maintenance";
}

export const financeIntegration = {
  // ─── Sync Donations ───
  syncDonationsToLedger: () => {
    const allDonations = getDonationsState().donations;
    const processedIds = new Set(financeSelectors.getTransactions().map(t => t.referenceId));

    const newDonations = allDonations.filter(d =>
      d.status === "Recorded" && !processedIds.has(d.donationId)
    );
    if (newDonations.length === 0) return 0;

    let count = 0;
    newDonations.forEach(donation => {
      const category = mapDonationCategory(donation.purpose, donation.nature);
      const { account, accountName, paymentMethod } = mapDonationAccount(donation.channel, donation.nature);
      const suggestedFund = financeSelectors.getSuggestedFund(category);

      financeActions.createTransaction({
        type: "Income",
        amount: donation.amount,
        date: donation.date,
        category,
        subCategory: donation.nature === "Non-Cash" ? "In-Kind" : donation.mode,
        paymentMethod,
        account, accountName,
        fund: suggestedFund.id, fundName: suggestedFund.name,
        referenceId: donation.donationId,
        referenceType: "Donation",
        externalReference: donation.referenceNo || "",
        status: "Completed",
        description: buildDonationDescription(donation),
        notes: donation.remarks || "",
        createdBy: "System Integration",
        source: "Donation",
      });
      count++;
    });
    return count;
  },

  // ─── Sync Seva Bookings ───
  syncSevaBookings: () => {
    const bookings = sevaSelectors.getCompletedBookings();
    const processedIds = new Set(financeSelectors.getTransactions().map(t => t.referenceId));

    const newBookings = bookings.filter(b => !processedIds.has(b.id));
    if (newBookings.length === 0) return 0;

    let count = 0;
    newBookings.forEach(booking => {
      const { account, accountName, paymentMethod } = mapSevaAccount(booking.paymentMethod);
      const suggestedFund = financeSelectors.getSuggestedFund("Seva Revenue");

      financeActions.createTransaction({
        type: "Income",
        amount: booking.amount,
        date: booking.date,
        category: "Seva Revenue",
        subCategory: booking.sevaCategory,
        paymentMethod,
        account, accountName,
        fund: suggestedFund.id, fundName: suggestedFund.name,
        referenceId: booking.id,
        referenceType: "Seva",
        externalReference: booking.referenceNo || "",
        status: "Completed",
        description: `${booking.sevaName} — ${booking.devoteeName} • ${booking.paymentMode}`,
        notes: `Source: ${booking.sourceModule}${booking.counterId ? ` (${booking.counterId})` : ""}`,
        createdBy: "System Integration",
        source: "Seva",
      });
      count++;
    });
    return count;
  },

  // ─── Sync Event Expenses ───
  syncEventExpenses: () => {
    const processedIds = new Set(financeSelectors.getTransactions().map(t => t.referenceId));

    const paidExpenses = eventExpenses.filter(e =>
      (e.status === "Paid" || e.status === "Approved") && !processedIds.has(e.id)
    );
    if (paidExpenses.length === 0) return 0;

    let count = 0;
    paidExpenses.forEach(exp => {
      const category = mapEventExpenseCategory(exp.category);
      const suggestedFund = financeSelectors.getSuggestedFund(category);
      const isPaid = exp.status === "Paid";

      financeActions.createTransaction({
        type: "Expense",
        amount: exp.amount,
        date: exp.date,
        category,
        subCategory: exp.category,
        paymentMethod: "Bank",
        account: "ACC-002", accountName: "SBI Main Account",
        fund: suggestedFund.id, fundName: suggestedFund.name,
        referenceId: exp.id,
        referenceType: "Event",
        externalReference: exp.linkedId || "",
        status: isPaid ? "Completed" : "Pending",
        description: `[${exp.eventName}] ${exp.description}`,
        notes: exp.vendor ? `Vendor: ${exp.vendor}` : "",
        createdBy: "System Integration",
        source: "Event",
      });
      count++;
    });
    return count;
  },

  // ─── Sync Project Donations & Expenses ───
  syncProjects: () => {
    const processedIds = new Set(financeSelectors.getTransactions().map(t => t.referenceId));
    let count = 0;

    projects.forEach(project => {
      if (project.status === "Draft" || project.status === "Cancelled") return;

      // Project Donations (Income)
      project.donations.forEach(donation => {
        const refId = `${project.id}-${donation.id}`;
        if (processedIds.has(refId)) return;

        const paymentMethod = donation.paymentMode === "UPI" ? "UPI" as const
          : donation.paymentMode === "Cash" ? "Cash" as const
          : donation.paymentMode === "Cheque" ? "Cheque" as const
          : "Bank" as const;

        const accountMap = mapSevaAccount(paymentMethod);
        const suggestedFund = financeSelectors.getSuggestedFund("Project Donation");

        financeActions.createTransaction({
          type: "Income",
          amount: donation.amount,
          date: donation.date,
          category: "Project Donation",
          subCategory: project.type,
          paymentMethod: accountMap.paymentMethod,
          account: accountMap.account, accountName: accountMap.accountName,
          fund: suggestedFund.id, fundName: suggestedFund.name,
          referenceId: refId,
          referenceType: "Project",
          status: "Completed",
          description: `[${project.title}] Donation from ${donation.anonymous ? "Anonymous" : donation.donorName} • ${donation.paymentMode}`,
          notes: donation.milestoneLinked ? `Milestone: ${donation.milestoneLinked}` : "",
          createdBy: "System Integration",
          source: "System",
        });
        count++;
      });

      // Project Expenses
      project.expenses.forEach(expense => {
        const refId = `${project.id}-${expense.id}`;
        if (processedIds.has(refId)) return;

        const category = mapProjectExpenseCategory(expense.category);
        const suggestedFund = financeSelectors.getSuggestedFund(category);
        const isPaid = expense.paidStatus === "Paid";

        financeActions.createTransaction({
          type: "Expense",
          amount: expense.amount,
          date: expense.date,
          category,
          subCategory: expense.category,
          paymentMethod: "Bank",
          account: "ACC-002", accountName: "SBI Main Account",
          fund: suggestedFund.id, fundName: suggestedFund.name,
          referenceId: refId,
          referenceType: "Project",
          status: isPaid ? "Completed" : "Pending",
          description: `[${project.title}] ${expense.title}`,
          notes: expense.vendor ? `Vendor: ${expense.vendor}${expense.approvedBy ? ` • Approved by: ${expense.approvedBy}` : ""}` : "",
          createdBy: "System Integration",
          source: "System",
        });
        count++;
      });
    });

    return count;
  },

  // ─── Sync All ───
  syncAll: () => {
    let total = 0;
    try { total += financeIntegration.syncDonationsToLedger(); } catch (e) { console.error("Donation sync failed", e); }
    try { total += financeIntegration.syncSevaBookings(); } catch (e) { console.error("Seva sync failed", e); }
    try { total += financeIntegration.syncEventExpenses(); } catch (e) { console.error("Event sync failed", e); }
    try { total += financeIntegration.syncProjects(); } catch (e) { console.error("Project sync failed", e); }
    return total;
  },
};
