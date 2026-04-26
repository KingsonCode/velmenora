import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const token = req.headers.get("x-admin-token");

  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return unauthorized();
  }

  const { id } = await context.params;

  const payout = await prisma.payoutRequest.findUnique({
    where: { id },
    include: {
      user: true,
      challengeAccount: true,
    },
  });

  if (!payout) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const snapshot = payout.eligibilitySnapshotJson || {};

  // 🔍 FRAUD CHECKS (simple MVP heuristics)
  const fraudFlags = {
    suspiciousProfit: Number(snapshot.profit || 0) > 5000,
    equityMismatch:
      Number(snapshot.currentEquity || 0) !==
      Number(snapshot.currentBalance || 0),
    tooFastPass: Number(snapshot.tradingDaysCount || 0) < 2,
  };

  return NextResponse.json({
    payout: {
      id: payout.id,
      status: payout.status,
      amount: payout.requestedAmount,
      requestedAt: payout.requestedAt,
    },
    user: {
      email: payout.user.email,
    },
    account: {
      id: payout.challengeAccount.id,
      initialBalance: payout.challengeAccount.initialBalance,
      currentBalance: payout.challengeAccount.currentBalance,
      currentEquity: payout.challengeAccount.currentEquity,
      tradingDaysCount: payout.challengeAccount.tradingDaysCount,
    },
    snapshot,
    fraudFlags,
  });
}
