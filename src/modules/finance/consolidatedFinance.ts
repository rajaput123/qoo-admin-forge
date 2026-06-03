/**
 * Consolidated Finance Aggregator
 * Pulls financial data from multiple sources for reporting.
 */

import { getDonationsState } from "@/modules/donations/donationsStore";
import { getEvents } from "@/modules/events/eventStore";
import { projects } from "@/data/projectData";
import { financeSelectors, getFinanceState } from "./financeStore";

// ---- Types ----
export interface FinanceSummary {
  totalRevenue: number;
  totalDonations: number;
  totalSevaIncome: number;
  totalEventCollections: number;
  totalExpenses: number;
  netBalance: number;
  fundBalance: number;
  bankBalance: number;
  pendingPayables: number;
}

export interface DonationBreakdown { purpose: string; amount: number; count: number; }
export interface EventFinanceSummary { eventId: string; eventName: string; type: string; status: string; estimatedBudget: number; actualSpend: number; linkedDonations: number; variance: number; }
export interface ProjectFinanceSummary { projectId: string; projectTitle: string; type: string; status: string; goalAmount: number; raisedAmount: number; spentAmount: number; balance: number; completion: number; }
export interface MonthlyTrend { month: string; income: number; expense: number; net: number; }
export interface ChannelBreakdown { channel: string; amount: number; count: number; }

// ---- Aggregation Functions ----
export function getConsolidatedSummary(filters?: { dateFrom?: string; dateTo?: string; category?: string }): FinanceSummary {
  const donationsState = getDonationsState();
  const events = getEvents();
  const financeState = getFinanceState();

  let donations = donationsState.donations;
  if (filters?.dateFrom) donations = donations.filter(d => d.date >= filters.dateFrom!);
  if (filters?.dateTo) donations = donations.filter(d => d.date <= filters.dateTo!);

  const totalDonations = donations.reduce((s, d) => s + d.amount, 0);
  const totalSevaIncome = donations.filter(d => d.purpose.includes("Seva") || d.sourceModule === "Booking" || d.sourceModule === "Seva").reduce((s, d) => s + d.amount, 0);
  const totalEventCollections = donations.filter(d => d.purpose === "Event-linked" || d.sourceModule === "Event").reduce((s, d) => s + d.amount, 0);
  const totalRevenue = totalDonations;

  const eventExpenses = events.reduce((s, e) => s + (e.actualSpend || 0), 0);
  const projectExpenses = projects.reduce((s, p) => s + p.spentAmount, 0);
  const fundExpenses = donationsState.fundExpenses.reduce((s, e) => s + e.amount, 0);
  const totalExpenses = eventExpenses + projectExpenses + fundExpenses;

  // Fund balances from store selectors
  const fundSummaries = financeSelectors.getFundSummaries();
  const fundBalance = fundSummaries.reduce((s, f) => s + f.balance, 0);

  // Bank balances from asset accounts
  const bankBalance = financeState.accounts.filter(a => a.type === "Asset" && a.accountCategory === "Bank").reduce((s, a) => s + a.currentBalance, 0);

  const pendingPayables = financeState.accounts.filter(a => a.type === "Liability").reduce((s, a) => s + a.currentBalance, 0);

  return {
    totalRevenue, totalDonations, totalSevaIncome, totalEventCollections,
    totalExpenses, netBalance: totalRevenue - totalExpenses,
    fundBalance, bankBalance, pendingPayables,
  };
}

export function getDonationBreakdown(filters?: { dateFrom?: string; dateTo?: string }): DonationBreakdown[] {
  let donations = getDonationsState().donations;
  if (filters?.dateFrom) donations = donations.filter(d => d.date >= filters.dateFrom!);
  if (filters?.dateTo) donations = donations.filter(d => d.date <= filters.dateTo!);

  const map = new Map<string, { amount: number; count: number }>();
  for (const d of donations) {
    const key = d.purpose || "Other";
    const prev = map.get(key) || { amount: 0, count: 0 };
    map.set(key, { amount: prev.amount + d.amount, count: prev.count + 1 });
  }
  return Array.from(map.entries()).map(([purpose, data]) => ({ purpose, ...data })).sort((a, b) => b.amount - a.amount);
}

export function getChannelBreakdown(filters?: { dateFrom?: string; dateTo?: string }): ChannelBreakdown[] {
  let donations = getDonationsState().donations;
  if (filters?.dateFrom) donations = donations.filter(d => d.date >= filters.dateFrom!);
  if (filters?.dateTo) donations = donations.filter(d => d.date <= filters.dateTo!);

  const map = new Map<string, { amount: number; count: number }>();
  for (const d of donations) {
    const prev = map.get(d.channel) || { amount: 0, count: 0 };
    map.set(d.channel, { amount: prev.amount + d.amount, count: prev.count + 1 });
  }
  return Array.from(map.entries()).map(([channel, data]) => ({ channel, ...data })).sort((a, b) => b.amount - a.amount);
}

export function getEventFinanceSummaries(): EventFinanceSummary[] {
  const events = getEvents();
  const donations = getDonationsState().donations;
  return events.map(e => {
    const linked = donations.filter(d => d.sourceRecordId === e.id || (d.purpose === "Event-linked" && d.sourceModule === "Event")).reduce((s, d) => s + d.amount, 0);
    return { eventId: e.id, eventName: e.name, type: e.type, status: e.status, estimatedBudget: e.estimatedBudget, actualSpend: e.actualSpend || 0, linkedDonations: linked, variance: e.estimatedBudget - (e.actualSpend || 0) };
  });
}

export function getProjectFinanceSummaries(): ProjectFinanceSummary[] {
  return projects.map(p => ({ projectId: p.id, projectTitle: p.title, type: p.type, status: p.status, goalAmount: p.goalAmount, raisedAmount: p.raisedAmount, spentAmount: p.spentAmount, balance: p.raisedAmount - p.spentAmount, completion: p.completion }));
}

export function getMonthlyTrends(): MonthlyTrend[] {
  const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
  const baseIncome = [3200000, 2800000, 4500000, 3800000, 4265000, 3900000];
  const baseExpense = [1800000, 1600000, 2200000, 1900000, 2100000, 1700000];
  return months.map((m, i) => ({ month: m, income: baseIncome[i], expense: baseExpense[i], net: baseIncome[i] - baseExpense[i] }));
}
