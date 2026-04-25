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
  await prisma.fundedChallenge.upsert({
    where: { slug: "instant-10k" },
    update: {
      name: "Instant 10K Challenge",
      feeAmount: "49.00",
      currency: "USD",
      virtualBalance: "10000.00",
      profitTargetPct: "10.00",
      maxDailyLossPct: "5.00",
      maxOverallDrawdownPct: "10.00",
      minTradingDays: 5,
      maxDurationDays: 30,
      payoutRatioPct: "80.00",
      isActive: true,
    },
    create: {
      slug: "instant-10k",
      name: "Instant 10K Challenge",
      feeAmount: "49.00",
      currency: "USD",
      virtualBalance: "10000.00",
      profitTargetPct: "10.00",
      maxDailyLossPct: "5.00",
      maxOverallDrawdownPct: "10.00",
      minTradingDays: 5,
      maxDurationDays: 30,
      payoutRatioPct: "80.00",
      isActive: true,
    },
  });

  await prisma.fundedChallenge.upsert({
    where: { slug: "instant-25k" },
    update: {
      name: "Instant 25K Challenge",
      feeAmount: "99.00",
      currency: "USD",
      virtualBalance: "25000.00",
      profitTargetPct: "10.00",
      maxDailyLossPct: "5.00",
      maxOverallDrawdownPct: "10.00",
      minTradingDays: 5,
      maxDurationDays: 30,
      payoutRatioPct: "80.00",
      isActive: true,
    },
    create: {
      slug: "instant-25k",
      name: "Instant 25K Challenge",
      feeAmount: "99.00",
      currency: "USD",
      virtualBalance: "25000.00",
      profitTargetPct: "10.00",
      maxDailyLossPct: "5.00",
      maxOverallDrawdownPct: "10.00",
      minTradingDays: 5,
      maxDurationDays: 30,
      payoutRatioPct: "80.00",
      isActive: true,
    },
  });

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
