export type FundedPlanSlug = "instant-10k" | "instant-25k" | "instant-50k";

export type FundedPlan = {
  badge: string;
  name: string;
  shortName: string;
  slug: FundedPlanSlug;
  fee: string;
  feeAmount: number;
  balance: string;
  balanceAmount: number;
  reward: string;
  rewardAmount: number;
  target: string;
  dailyLoss: string;
  drawdown: string;
  tradingDays: string;
  consistency: string;
  risk: string;
  lot: string;
  featured: boolean;
  description: string;
};

export const fundedPlans = [
  {
    badge: "Starter",
    name: "Instant 10K",
    shortName: "10K",
    slug: "instant-10k",
    fee: "$35",
    feeAmount: 35,
    balance: "$10,000",
    balanceAmount: 10000,
    reward: "$100",
    rewardAmount: 100,
    target: "10%",
    dailyLoss: "5%",
    drawdown: "10%",
    tradingDays: "7 days",
    consistency: "35%",
    risk: "1.5%",
    lot: "1.00",
    featured: false,
    description:
      "Best for disciplined traders who want a lower-cost path into the Velmenora challenge system.",
  },
  {
    badge: "Most Popular",
    name: "Instant 25K",
    shortName: "25K",
    slug: "instant-25k",
    fee: "$79",
    feeAmount: 79,
    balance: "$25,000",
    balanceAmount: 25000,
    reward: "$150",
    rewardAmount: 150,
    target: "10%",
    dailyLoss: "5%",
    drawdown: "10%",
    tradingDays: "7 days",
    consistency: "35%",
    risk: "1.5%",
    lot: "2.00",
    featured: true,
    description:
      "The strongest balance between entry fee, account size, and fixed reward potential.",
  },
  {
    badge: "High Ticket",
    name: "Instant 50K",
    shortName: "50K",
    slug: "instant-50k",
    fee: "$149",
    feeAmount: 149,
    balance: "$50,000",
    balanceAmount: 50000,
    reward: "$250",
    rewardAmount: 250,
    target: "10%",
    dailyLoss: "5%",
    drawdown: "10%",
    tradingDays: "7 days",
    consistency: "35%",
    risk: "1.5%",
    lot: "3.00",
    featured: false,
    description:
      "Built for serious traders who want a larger simulated account and higher fixed reward ceiling.",
  },
] as const satisfies readonly FundedPlan[];

export const defaultFundedPlanSlug: FundedPlanSlug = "instant-25k";

export function getFundedPlan(slug: string | null | undefined): FundedPlan | null {
  return fundedPlans.find((plan) => plan.slug === slug) ?? null;
}

export function getDefaultFundedPlan(): FundedPlan {
  return fundedPlans.find((plan) => plan.slug === defaultFundedPlanSlug) ?? fundedPlans[0];
}

export const fundedFaqs = [
  {
    q: "Is Velmenora Funded Challenge a real-money trading account?",
    a: "No. It is a simulated funded challenge. Traders use a virtual balance and may qualify for fixed rewards after meeting the rules and passing review.",
  },
  {
    q: "What are the main rules?",
    a: "Each plan uses a 10% profit target, 5% daily loss limit, 10% overall drawdown limit, 7 minimum trading days, consistency rule, and maximum risk or lot-size controls.",
  },
  {
    q: "How does the consistency rule work?",
    a: "No single trading day should contribute more than 35% of the total profit used to pass the challenge. This discourages lucky spikes and high-risk gambling behavior.",
  },
  {
    q: "When can I request a reward?",
    a: "After hitting the profit target, completing the minimum trading days, staying within risk limits, and passing manual review.",
  },
  {
    q: "What happens if I fail?",
    a: "Failed accounts are not eligible for reward review. A retry discount system may be offered to eligible traders in a later release.",
  },
] as const;

export const fundedSocialProof = [
  {
    label: "Challenge plans live",
    value: "3",
    note: "10K, 25K, and 50K simulated accounts",
  },
  {
    label: "Rules enforced",
    value: "5",
    note: "Target, drawdown, days, consistency, and risk cap",
  },
  {
    label: "Review-first rewards",
    value: "Manual",
    note: "Eligible accounts are reviewed before reward approval",
  },
] as const;
