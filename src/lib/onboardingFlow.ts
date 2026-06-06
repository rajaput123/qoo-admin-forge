import {
  ONBOARDING_KEYS,
  isSubscriptionComplete,
  isFinanceSetupComplete,
} from "./templeConfig";

export const SUBSCRIPTION_PROMPT_DISMISSED = "subscriptionPromptDismissed";

/** Clear onboarding flags so the post-login demo flow runs again. */
export function resetTempleOnboarding(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ONBOARDING_KEYS.subscriptionComplete);
  localStorage.removeItem(ONBOARDING_KEYS.financeSetupComplete);
  localStorage.removeItem("financeSetupPromptDismissed");
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

export function getPostLoginRoute(): "/onboarding/subscription" | "/temple-hub" {
  return shouldShowSubscriptionPrompt() ? "/onboarding/subscription" : "/temple-hub";
}

export function shouldShowFinanceSetupPrompt(): boolean {
  return (
    !isFinanceSetupComplete() &&
    localStorage.getItem("financeSetupPromptDismissed") !== "1"
  );
}
