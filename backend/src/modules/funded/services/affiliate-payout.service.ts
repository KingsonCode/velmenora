import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { PrismaService } from "../../../prisma/prisma.service";

type RequestAffiliatePayoutInput = {
  ref: string;
  method?: string;
  notes?: string;
};

type AdminPayoutInput = {
  payoutId: string;
  reviewerId?: string;
  notes?: string;
};

type PayAffiliatePayoutInput = AdminPayoutInput & {
  method?: string;
  reference?: string;
};

function cleanString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function moneyString(value: Prisma.Decimal | null | undefined): string {
  return String(value ?? 0);
}

@Injectable()
export class AffiliatePayoutService {
  constructor(private readonly prisma: PrismaService) {}

  async myStats(ref: string) {
    const cleanRef = cleanString(ref);

    if (!cleanRef) {
      return {
        ok: false,
        error: "missing_ref",
      };
    }

    const affiliate = await this.prisma.affiliate.findUnique({
      where: { slug: cleanRef },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });

    if (!affiliate) {
      return {
        ok: false,
        error: "affiliate_not_found",
      };
    }

    const [
      pending,
      approved,
      payoutRequested,
      paid,
      rejected,
      payoutsRequested,
      payoutsApproved,
      payoutsPaid,
      conversions,
    ] = await Promise.all([
      this.prisma.affiliateCommission.aggregate({
        where: { affiliateId: affiliate.id, status: "pending" },
        _sum: { amount: true },
        _count: { id: true },
      }),
      this.prisma.affiliateCommission.aggregate({
        where: { affiliateId: affiliate.id, status: "approved" },
        _sum: { amount: true },
        _count: { id: true },
      }),
      this.prisma.affiliateCommission.aggregate({
        where: { affiliateId: affiliate.id, status: "payout_requested" },
        _sum: { amount: true },
        _count: { id: true },
      }),
      this.prisma.affiliateCommission.aggregate({
        where: { affiliateId: affiliate.id, status: "paid" },
        _sum: { amount: true },
        _count: { id: true },
      }),
      this.prisma.affiliateCommission.aggregate({
        where: { affiliateId: affiliate.id, status: "rejected" },
        _sum: { amount: true },
        _count: { id: true },
      }),
      this.prisma.affiliatePayout.aggregate({
        where: { affiliateId: affiliate.id, status: "requested" },
        _sum: { amount: true },
        _count: { id: true },
      }),
      this.prisma.affiliatePayout.aggregate({
        where: { affiliateId: affiliate.id, status: "approved" },
        _sum: { amount: true },
        _count: { id: true },
      }),
      this.prisma.affiliatePayout.aggregate({
        where: { affiliateId: affiliate.id, status: "paid" },
        _sum: { amount: true },
        _count: { id: true },
      }),
      this.prisma.affiliateCommission.count({
        where: { affiliateId: affiliate.id },
      }),
    ]);

    return {
      ok: true,
      affiliate: {
        id: affiliate.id,
        ref: affiliate.slug,
        isActive: affiliate.isActive,
        user: affiliate.user,
      },
      stats: {
        conversions,
        commissions: {
          pending: {
            amount: moneyString(pending._sum.amount),
            count: pending._count.id,
          },
          approved: {
            amount: moneyString(approved._sum.amount),
            count: approved._count.id,
          },
          payoutRequested: {
            amount: moneyString(payoutRequested._sum.amount),
            count: payoutRequested._count.id,
          },
          paid: {
            amount: moneyString(paid._sum.amount),
            count: paid._count.id,
          },
          rejected: {
            amount: moneyString(rejected._sum.amount),
            count: rejected._count.id,
          },
        },
        payouts: {
          requested: {
            amount: moneyString(payoutsRequested._sum.amount),
            count: payoutsRequested._count.id,
          },
          approved: {
            amount: moneyString(payoutsApproved._sum.amount),
            count: payoutsApproved._count.id,
          },
          paid: {
            amount: moneyString(payoutsPaid._sum.amount),
            count: payoutsPaid._count.id,
          },
        },
        referralLink: `/funded?ref=${encodeURIComponent(affiliate.slug)}`,
      },
    };
  }

  async listPayouts(ref: string) {
    const cleanRef = cleanString(ref);

    if (!cleanRef) {
      return {
        ok: false,
        error: "missing_ref",
      };
    }

    const affiliate = await this.prisma.affiliate.findUnique({
      where: { slug: cleanRef },
      select: { id: true, slug: true },
    });

    if (!affiliate) {
      return {
        ok: false,
        error: "affiliate_not_found",
      };
    }

    const payouts = await this.prisma.affiliatePayout.findMany({
      where: { affiliateId: affiliate.id },
      orderBy: { requestedAt: "desc" },
      include: {
        commissions: {
          select: {
            id: true,
            amount: true,
            currency: true,
            status: true,
            planSlug: true,
            paymentId: true,
            challengeAccountId: true,
            createdAt: true,
          },
        },
      },
      take: 50,
    });

    return {
      ok: true,
      ref: affiliate.slug,
      payouts: payouts.map((payout) => ({
        id: payout.id,
        amount: String(payout.amount),
        currency: payout.currency,
        status: payout.status,
        method: payout.method,
        reference: payout.reference,
        notes: payout.notes,
        requestedAt: payout.requestedAt,
        approvedAt: payout.approvedAt,
        rejectedAt: payout.rejectedAt,
        paidAt: payout.paidAt,
        commissions: payout.commissions.map((commission) => ({
          ...commission,
          amount: String(commission.amount),
        })),
      })),
    };
  }

  async requestPayout(input: RequestAffiliatePayoutInput) {
    const ref = cleanString(input.ref);
    const method = cleanString(input.method);
    const notes = cleanString(input.notes);

    if (!ref) {
      return {
        ok: false,
        error: "missing_ref",
      };
    }

    return this.prisma.$transaction(async (tx) => {
      const affiliate = await tx.affiliate.findUnique({
        where: { slug: ref },
        select: {
          id: true,
          slug: true,
          isActive: true,
        },
      });

      if (!affiliate || !affiliate.isActive) {
        return {
          ok: false,
          error: "affiliate_not_found_or_inactive",
        };
      }

      const eligibleCommissions = await tx.affiliateCommission.findMany({
        where: {
          affiliateId: affiliate.id,
          status: "approved",
          affiliatePayoutId: null,
        },
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          amount: true,
          currency: true,
        },
      });

      if (eligibleCommissions.length === 0) {
        return {
          ok: false,
          error: "no_approved_commissions_available",
        };
      }

      const currencies = Array.from(
        new Set(eligibleCommissions.map((commission) => commission.currency)),
      );

      if (currencies.length !== 1) {
        return {
          ok: false,
          error: "multiple_currencies_not_supported_for_single_payout",
          currencies,
        };
      }

      const currency = currencies[0] ?? "USD";
      const amount = eligibleCommissions.reduce(
        (sum, commission) => sum.plus(commission.amount),
        new Prisma.Decimal(0),
      );

      if (amount.lessThanOrEqualTo(0)) {
        return {
          ok: false,
          error: "non_positive_payout_amount",
        };
      }

      const payout = await tx.affiliatePayout.create({
        data: {
          affiliateId: affiliate.id,
          amount,
          currency,
          status: "requested",
          method,
          notes,
        },
      });

      const commissionIds = eligibleCommissions.map(
        (commission) => commission.id,
      );

      const updateResult = await tx.affiliateCommission.updateMany({
        where: {
          id: { in: commissionIds },
          affiliateId: affiliate.id,
          status: "approved",
          affiliatePayoutId: null,
        },
        data: {
          status: "payout_requested",
          affiliatePayoutId: payout.id,
        },
      });

      if (updateResult.count !== commissionIds.length) {
        throw new Error("affiliate_payout_race_detected");
      }

      await tx.auditLog.create({
        data: {
          eventType: "payout_requested",
          entityType: "affiliate_payout",
          entityId: payout.id,
          metadataJson: {
            source: "affiliate_payout_service",
            affiliateId: affiliate.id,
            ref: affiliate.slug,
            commissionIds,
            commissionCount: commissionIds.length,
            amount: String(amount),
            currency,
          },
        },
      });

      return {
        ok: true,
        payout: {
          id: payout.id,
          affiliateId: payout.affiliateId,
          ref: affiliate.slug,
          amount: String(payout.amount),
          currency: payout.currency,
          status: payout.status,
          method: payout.method,
          notes: payout.notes,
          requestedAt: payout.requestedAt,
          commissionCount: commissionIds.length,
        },
      };
    });
  }

  async approvePayout(input: AdminPayoutInput) {
    const payoutId = cleanString(input.payoutId);
    const reviewerId = cleanString(input.reviewerId);
    const notes = cleanString(input.notes);

    if (!payoutId) {
      return {
        ok: false,
        error: "missing_payout_id",
      };
    }

    return this.prisma.$transaction(async (tx) => {
      const payout = await tx.affiliatePayout.findUnique({
        where: { id: payoutId },
        include: {
          affiliate: { select: { id: true, slug: true } },
          commissions: { select: { id: true, status: true } },
        },
      });

      if (!payout) {
        return {
          ok: false,
          error: "payout_not_found",
        };
      }

      if (payout.status !== "requested") {
        return {
          ok: false,
          error: "invalid_payout_status",
          currentStatus: payout.status,
          expectedStatus: "requested",
        };
      }

      const invalidCommission = payout.commissions.find(
        (commission) => commission.status !== "payout_requested",
      );

      if (invalidCommission) {
        return {
          ok: false,
          error: "invalid_commission_status_for_approval",
          commissionId: invalidCommission.id,
          commissionStatus: invalidCommission.status,
        };
      }

      const updated = await tx.affiliatePayout.update({
        where: { id: payout.id },
        data: {
          status: "approved",
          approvedAt: new Date(),
          reviewerId,
          notes: notes ?? payout.notes,
        },
      });

      await tx.auditLog.create({
        data: {
          actorUserId: reviewerId,
          eventType: "payout_approved",
          entityType: "affiliate_payout",
          entityId: updated.id,
          metadataJson: {
            source: "affiliate_payout_service",
            affiliateId: payout.affiliateId,
            ref: payout.affiliate.slug,
            amount: String(payout.amount),
            currency: payout.currency,
            commissionCount: payout.commissions.length,
          },
        },
      });

      return {
        ok: true,
        payout: {
          id: updated.id,
          affiliateId: updated.affiliateId,
          ref: payout.affiliate.slug,
          amount: String(updated.amount),
          currency: updated.currency,
          status: updated.status,
          approvedAt: updated.approvedAt,
        },
      };
    });
  }

  async payPayout(input: PayAffiliatePayoutInput) {
    const payoutId = cleanString(input.payoutId);
    const reviewerId = cleanString(input.reviewerId);
    const method = cleanString(input.method);
    const reference = cleanString(input.reference);
    const notes = cleanString(input.notes);

    if (!payoutId) {
      return {
        ok: false,
        error: "missing_payout_id",
      };
    }

    return this.prisma.$transaction(async (tx) => {
      const payout = await tx.affiliatePayout.findUnique({
        where: { id: payoutId },
        include: {
          affiliate: { select: { id: true, slug: true } },
          commissions: { select: { id: true, status: true } },
        },
      });

      if (!payout) {
        return {
          ok: false,
          error: "payout_not_found",
        };
      }

      if (payout.status !== "approved") {
        return {
          ok: false,
          error: "invalid_payout_status",
          currentStatus: payout.status,
          expectedStatus: "approved",
        };
      }

      const commissionIds = payout.commissions.map(
        (commission) => commission.id,
      );

      if (commissionIds.length === 0) {
        return {
          ok: false,
          error: "payout_has_no_commissions",
        };
      }

      const updateResult = await tx.affiliateCommission.updateMany({
        where: {
          id: { in: commissionIds },
          affiliatePayoutId: payout.id,
          status: "payout_requested",
        },
        data: {
          status: "paid",
        },
      });

      if (updateResult.count !== commissionIds.length) {
        throw new Error("affiliate_commission_payment_state_mismatch");
      }

      const updated = await tx.affiliatePayout.update({
        where: { id: payout.id },
        data: {
          status: "paid",
          paidAt: new Date(),
          reviewerId,
          method: method ?? payout.method,
          reference,
          notes: notes ?? payout.notes,
        },
      });

      await tx.auditLog.create({
        data: {
          actorUserId: reviewerId,
          eventType: "payout_paid",
          entityType: "affiliate_payout",
          entityId: updated.id,
          metadataJson: {
            source: "affiliate_payout_service",
            affiliateId: payout.affiliateId,
            ref: payout.affiliate.slug,
            amount: String(payout.amount),
            currency: payout.currency,
            commissionIds,
            commissionCount: commissionIds.length,
            method: updated.method,
            reference: updated.reference,
          },
        },
      });

      return {
        ok: true,
        payout: {
          id: updated.id,
          affiliateId: updated.affiliateId,
          ref: payout.affiliate.slug,
          amount: String(updated.amount),
          currency: updated.currency,
          status: updated.status,
          method: updated.method,
          reference: updated.reference,
          paidAt: updated.paidAt,
          commissionCount: commissionIds.length,
        },
      };
    });
  }

  async rejectPayout(input: AdminPayoutInput) {
    const payoutId = cleanString(input.payoutId);
    const reviewerId = cleanString(input.reviewerId);
    const notes = cleanString(input.notes);

    if (!payoutId) {
      return {
        ok: false,
        error: "missing_payout_id",
      };
    }

    return this.prisma.$transaction(async (tx) => {
      const payout = await tx.affiliatePayout.findUnique({
        where: { id: payoutId },
        include: {
          affiliate: { select: { id: true, slug: true } },
          commissions: { select: { id: true, status: true } },
        },
      });

      if (!payout) {
        return {
          ok: false,
          error: "payout_not_found",
        };
      }

      if (payout.status !== "requested" && payout.status !== "approved") {
        return {
          ok: false,
          error: "invalid_payout_status",
          currentStatus: payout.status,
          expectedStatus: "requested_or_approved",
        };
      }

      const commissionIds = payout.commissions.map(
        (commission) => commission.id,
      );

      await tx.affiliateCommission.updateMany({
        where: {
          id: { in: commissionIds },
          affiliatePayoutId: payout.id,
          status: "payout_requested",
        },
        data: {
          status: "approved",
          affiliatePayoutId: null,
        },
      });

      const updated = await tx.affiliatePayout.update({
        where: { id: payout.id },
        data: {
          status: "rejected",
          rejectedAt: new Date(),
          reviewerId,
          notes,
        },
      });

      await tx.auditLog.create({
        data: {
          actorUserId: reviewerId,
          eventType: "payout_rejected",
          entityType: "affiliate_payout",
          entityId: updated.id,
          metadataJson: {
            source: "affiliate_payout_service",
            affiliateId: payout.affiliateId,
            ref: payout.affiliate.slug,
            amount: String(payout.amount),
            currency: payout.currency,
            commissionIds,
            commissionCount: commissionIds.length,
            reason: notes ?? null,
          },
        },
      });

      return {
        ok: true,
        payout: {
          id: updated.id,
          affiliateId: updated.affiliateId,
          ref: payout.affiliate.slug,
          amount: String(updated.amount),
          currency: updated.currency,
          status: updated.status,
          rejectedAt: updated.rejectedAt,
        },
      };
    });
  }
}
