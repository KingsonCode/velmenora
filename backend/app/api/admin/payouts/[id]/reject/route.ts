import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
  const { reason } = await req.json();

  if (!reason) {
    return NextResponse.json(
      { error: "Reject reason required" },
      { status: 400 }
    );
  }

  const payout = await prisma.payoutRequest.findUnique({
    where: { id },
  });

  if (!payout) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (payout.status !== "under_review") {
    return NextResponse.json(
      { error: "Only under_review payouts can be rejected" },
      { status: 400 }
    );
  }

  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.payoutRequest.update({
      where: { id },
      data: {
        status: "rejected",
        rejectionReason: reason,
        reviewedAt: new Date(),
      },
    });

    await tx.auditLog.create({
      data: {
        eventType: "payout_rejected",
        entityType: "payout_request",
        entityId: id,
        metadataJson: {
          reason,
          previousStatus: payout.status,
          nextStatus: "rejected",
        },
      },
    });

    return result;
  });

  return NextResponse.json({ ok: true, updated });
}
