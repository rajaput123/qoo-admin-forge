import { useSyncExternalStore } from "react";
import { donationSelectors, getDonationsState, subscribeDonationsStore, getSettlements } from "./donationsStore";

export function useDonationsState() {
  return useSyncExternalStore(subscribeDonationsStore, getDonationsState, getDonationsState);
}

export function useDonors() {
  const result = useSyncExternalStore(subscribeDonationsStore, donationSelectors.getDonors, donationSelectors.getDonors);
  return Array.isArray(result) ? result : [];
}

export function useDonations() {
  const result = useSyncExternalStore(subscribeDonationsStore, donationSelectors.getDonations, donationSelectors.getDonations);
  return Array.isArray(result) ? result : [];
}

export function useAllocations() {
  const result = useSyncExternalStore(subscribeDonationsStore, donationSelectors.getAllocations, donationSelectors.getAllocations);
  return Array.isArray(result) ? result : [];
}

export function useCertificates80G() {
  const result = useSyncExternalStore(subscribeDonationsStore, donationSelectors.getCertificates, donationSelectors.getCertificates);
  return Array.isArray(result) ? result : [];
}

export function useDonationAudit() {
  const result = useSyncExternalStore(subscribeDonationsStore, donationSelectors.getAudit, donationSelectors.getAudit);
  return Array.isArray(result) ? result : [];
}

export function useFunds() {
  const result = useSyncExternalStore(subscribeDonationsStore, donationSelectors.getFunds, donationSelectors.getFunds);
  return Array.isArray(result) ? result : [];
}

export function useFundExpenses() {
  const result = useSyncExternalStore(subscribeDonationsStore, donationSelectors.getFundExpenses, donationSelectors.getFundExpenses);
  return Array.isArray(result) ? result : [];
}

export function useSettlements() {
  return useSyncExternalStore(subscribeDonationsStore, getSettlements, getSettlements);
}