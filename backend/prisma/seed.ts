import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const plans = [
    {
      slug: "instant-10k",
      name: "Instant 10K Challenge",
      feeAmount: "35.00",
      currency: "USD",
      virtualBalance: "10000.00",
      rewardAmount: "100.00",
      profitTargetPct: "10.00",
      maxDailyLossPct: "5.00",
      maxOverallDrawdownPct: "10.00",
      maxDailyProfitPct: "35.00",
      maxRiskPerTradePct: "2.00",
      maxLotSize: "1.00",
      minTradingDays: 7,
      maxDurationDays: 30,
      payoutRatioPct: "80.00",
      isActive: true,
    },
    {
      slug: "instant-25k",
      name: "Instant 25K Challenge",
      feeAmount: "79.00",
      currency: "USD",
      virtualBalance: "25000.00",
      rewardAmount: "150.00",
      profitTargetPct: "10.00",
      maxDailyLossPct: "5.00",
      maxOverallDrawdownPct: "10.00",
      maxDailyProfitPct: "35.00",
      maxRiskPerTradePct: "2.00",
      maxLotSize: "2.00",
      minTradingDays: 7,
      maxDurationDays: 30,
      payoutRatioPct: "80.00",
      isActive: true,
    },
    {
      slug: "instant-50k",
      name: "Instant 50K Challenge",
      feeAmount: "149.00",
      currency: "USD",
      virtualBalance: "50000.00",
      rewardAmount: "250.00",
      profitTargetPct: "10.00",
      maxDailyLossPct: "5.00",
      maxOverallDrawdownPct: "10.00",
      maxDailyProfitPct: "35.00",
      maxRiskPerTradePct: "1.50",
      maxLotSize: "3.00",
      minTradingDays: 7,
      maxDurationDays: 30,
      payoutRatioPct: "80.00",
      isActive: true,
    },
  ];

  for (const plan of plans) {
    await prisma.fundedChallenge.upsert({
      where: { slug: plan.slug },
      update: plan,
      create: plan,
    });
  }

  console.log("Seeded funded challenge plans.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
