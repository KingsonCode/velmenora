import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type AdminAction = "review" | "approve" | "reject" | "pay";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const token = req.headers.get("x-admin-token");

  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return unauthorized();
  }

  const { id } = await context.params;
  const body = await req.json();
  const action = body.action as AdminAction;

  const payout = await prisma.payoutRequest.findUnique({
    where: { id },
  });

  if (!payout) {
    return NextResponse.json({ error: "Payout not found" }, { status: 404 });
  }

  let nextStatus = payout.status;

  if (action === "review" && payout.status === "requested") {
    nextStatus = "under_review";
  } else if (action === "approve" && payout.status === "under_review") {
    nextStatus = "approved";
  } else if (action === "reject" && payout.status === "under_review") {
    nextStatus = "rejected";
  } else if (action === "pay" && payout.status === "approved") {
    nextStatus = "paid";
  } else {
    return NextResponse.json(
      {
        error: "Invalid payout transition",
        currentStatus: payout.status,
        action,
      },
      { status: 400 }
    );
  }

  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.payoutRequest.update({
      where: { id },
      data: {
        status: nextStatus,
        reviewedAt:
          action === "approve" || action === "reject" ? new Date() : undefined,
        paidAt: action === "pay" ? new Date() : undefined,
      },
    });

    await tx.auditLog.create({
      data: {
        eventType:
          action === "review"
            ? "admin_action"
            : action === "approve"
              ? "payout_approved"
              : action === "reject"
                ? "payout_rejected"
                : "payout_paid",
        entityType: "payout_request",
        entityId: id,
        metadataJson: {
          source: "admin_dashboard",
          action,
          previousStatus: payout.status,
          nextStatus,
          challengeAccountId: payout.challengeAccountId,
        },
      },
    });

    return result;
  });

  return NextResponse.json({ ok: true, updated });
}
