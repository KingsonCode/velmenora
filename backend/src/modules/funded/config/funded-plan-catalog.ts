import { BadRequestException } from "@nestjs/common";

export type FundedPlanSlug = "instant-10k" | "instant-25k" | "instant-50k";

export type FundedPlanDefinition = {
  slug: FundedPlanSlug;
  displayName: string;
  initialBalance: number;
  feeUsd: number;
  rewardUsd: number;
};

export const FUNDED_PLAN_CATALOG: Record<FundedPlanSlug, FundedPlanDefinition> = {
  "instant-10k": {
    slug: "instant-10k",
    displayName: "10K Challenge",
    initialBalance: 10000,
    feeUsd: 35,
    rewardUsd: 100,
  },
  "instant-25k": {
    slug: "instant-25k",
    displayName: "25K Challenge",
    initialBalance: 25000,
    feeUsd: 79,
    rewardUsd: 150,
  },
  "instant-50k": {
    slug: "instant-50k",
    displayName: "50K Challenge",
    initialBalance: 50000,
    feeUsd: 149,
    rewardUsd: 250,
  },
};

export const ALLOWED_FUNDED_PLAN_SLUGS = Object.keys(
  FUNDED_PLAN_CATALOG,
) as FundedPlanSlug[];

export function getFundedPlanOrThrow(value: unknown): FundedPlanDefinition {
  if (typeof value !== "string") {
    throw new BadRequestException({
      ok: false,
      code: "INVALID_FUNDED_PLAN",
      message: "Invalid funded challenge plan.",
      allowedPlans: ALLOWED_FUNDED_PLAN_SLUGS,
    });
  }

  const normalized = value.trim().toLowerCase();

  if (!ALLOWED_FUNDED_PLAN_SLUGS.includes(normalized as FundedPlanSlug)) {
    throw new BadRequestException({
      ok: false,
      code: "UNSUPPORTED_FUNDED_PLAN",
      message:
        "Unsupported funded challenge plan. Only 10K, 25K and 50K plans are allowed.",
      allowedPlans: ALLOWED_FUNDED_PLAN_SLUGS,
    });
  }

  return FUNDED_PLAN_CATALOG[normalized as FundedPlanSlug];
}

export function assertNoClientPlanTampering(input: Record<string, unknown>) {
  const forbiddenClientFields = [
    "amount",
    "price",
    "fee",
    "feeUsd",
    "initialBalance",
    "balance",
    "virtualBalance",
    "rewardAmount",
    "rewardUsd",
    "currency",
    "maxLotSize",
    "maxRiskPerTradePct",
    "maxDailyProfitPct",
    "maxDailyLossPct",
    "maxOverallDrawdownPct",
    "profitTargetPct",
    "minTradingDays",
  ];

  for (const field of forbiddenClientFields) {
    if (Object.prototype.hasOwnProperty.call(input, field)) {
      throw new BadRequestException({
        ok: false,
        code: "CLIENT_PLAN_TAMPERING_DETECTED",
        message: `Field "${field}" is not allowed. Plan pricing, balances, rewards and rules are controlled by Velmenora.`,
      });
    }
  }
}
