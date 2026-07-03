import {
  ONBOARDING_KEYS,
  isSubscriptionComplete,
  isFinanceSetupComplete,
} from "./templeConfig";

export const SUBSCRIPTION_PROMPT_DISMISSED = "subscriptionPromptDismissed";
export const FINANCE_SETUP_PROMPT_DISMISSED = "financeSetupPromptDismissed";

/** Clear onboarding flags so the post-login demo flow runs again. */
export function resetTempleOnboarding(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ONBOARDING_KEYS.subscriptionComplete);
  localStorage.removeItem(ONBOARDING_KEYS.financeSetupComplete);
  localStorage.removeItem(FINANCE_SETUP_PROMPT_DISMISSED);
  localStorage.removeItem(SUBSCRIPTION_PROMPT_DISMISSED);
}

export function dismissSubscriptionPrompt(): void {
  localStorage.setItem(SUBSCRIPTION_PROMPT_DISMISSED, "1");
}

export function shouldShowSubscriptionPrompt(): boolean {
  return (
    !isSubscriptionComplete() &&
    localStorage.getItem(SUBSCRIPTION_PROMPT_DISMISSED) !== "1"
  );
}

export function getPostLoginRoute(): "/temple-hub" {
  return "/temple-hub";
}

/** Call on login — re-show prompts for any step not yet completed */
export function preparePostLoginOnboarding(): void {
  if (typeof window === "undefined") return;
  if (!isSubscriptionComplete()) {
    localStorage.removeItem(SUBSCRIPTION_PROMPT_DISMISSED);
  }
  if (!isFinanceSetupComplete()) {
    localStorage.removeItem(FINANCE_SETUP_PROMPT_DISMISSED);
  }
}

export function dismissFinanceSetupPrompt(): void {
  localStorage.setItem(FINANCE_SETUP_PROMPT_DISMISSED, "1");
}

export function shouldShowFinanceSetupPrompt(): boolean {
  return (
    !isFinanceSetupComplete() &&
    localStorage.getItem(FINANCE_SETUP_PROMPT_DISMISSED) !== "1"
  );
}
