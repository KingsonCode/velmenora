import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(req: Request) {
  const token = req.headers.get("x-admin-token");

  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return unauthorized();
  }

  const payouts = await prisma.payoutRequest.findMany({
    orderBy: { requestedAt: "desc" },
    include: {
      user: true,
    },
  });

  return NextResponse.json(
    payouts.map((p) => ({
      id: p.id,
      userEmail: p.user.email,
      challengeAccountId: p.challengeAccountId,
      amount: p.requestedAmount.toString(),
      status: p.status,
      requestedAt: p.requestedAt,
    }))
  );
}
