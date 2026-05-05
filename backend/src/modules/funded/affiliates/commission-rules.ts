export function calculateFundedAffiliateCommission(planSlug: string): number {
  switch (planSlug) {
    case "instant-10k":
      return 7;
    case "instant-25k":
      return 15;
    case "instant-50k":
      return 30;
    default:
      return 0;
  }
}
