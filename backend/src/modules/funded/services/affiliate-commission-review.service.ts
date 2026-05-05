import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { PrismaService } from "../../../prisma/prisma.service";
import { AdminGuardService } from "./admin-guard.service";

type ListInput = {
  status?: string;
  fraudFlag?: string;
  ref?: string;
  take?: number;
};

type ReviewInput = {
  commissionId: string;
  reviewerId: string;
  notes?: string;
};

type RejectInput = ReviewInput & {
  rejectionReason?: string;
};

function cleanString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function toTake(value: unknown): number {
  const n = Number(value ?? 50);
  if (!Number.isFinite(n)) return 50;
  return Math.min(Math.max(Math.floor(n), 1), 100);
}

function moneyString(value: Prisma.Decimal | null | undefined): string {
  return String(value ?? 0);
}

@Injectable()
export class AffiliateCommissionReviewService {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
    @Inject(AdminGuardService)
    private readonly adminGuard: AdminGuardService,
  ) {}

  async list(input: ListInput) {
    const status = cleanString(input.status);
    const fraudFlag = cleanString(input.fraudFlag);
    const ref = cleanString(input.ref);
    const take = toTake(input.take);

    const where: Prisma.AffiliateCommissionWhereInput = {};

    if (status && status !== "all") {
      where.status =
        status as Prisma.EnumAffiliateCommissionStatusFilter["equals"];
    }

    if (fraudFlag && fraudFlag !== "all") {
      where.fraudFlag = fraudFlag;
    }

    if (ref) {
      where.ref = ref;
    }

    const [commissions, summary] = await Promise.all([
      this.prisma.affiliateCommission.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take,
        include: {
          affiliate: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  fullName: true,
                },
              },
            },
          },
          challengeAccount: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  fullName: true,
                },
              },
              challenge: {
                select: {
                  id: true,
                  slug: true,
                  name: true,
                },
              },
            },
          },
          payment: {
            select: {
              id: true,
              status: true,
              amount: true,
              currency: true,
              paidAt: true,
              createdAt: true,
            },
          },
        },
      }),
      this.prisma.affiliateCommission.groupBy({
        by: ["status", "fraudFlag"],
        _sum: { amount: true },
        _count: { id: true },
      }),
    ]);

    return {
      ok: true,
      filters: {
        status: status ?? "all",
        fraudFlag: fraudFlag ?? "all",
        ref: ref ?? null,
        take,
      },
      summary: summary.map((row) => ({
        status: row.status,
        fraudFlag: row.fraudFlag,
        amount: moneyString(row._sum.amount),
        count: row._count.id,
      })),
      commissions: commissions.map((commission) => ({
        id: commission.id,
        affiliateId: commission.affiliateId,
        affiliateRef: commission.ref,
        affiliateUser: commission.affiliate.user,
        buyerUser: commission.challengeAccount.user,
        challengeAccountId: commission.challengeAccountId,
        paymentId: commission.paymentId,
        planSlug: commission.planSlug,
        challenge: commission.challengeAccount.challenge,
        amount: String(commission.amount),
        currency: commission.currency,
        status: commission.status,
        fraudFlag: commission.fraudFlag,
        fraudReason: commission.fraudReason,
        fraudCheckedAt: commission.fraudCheckedAt,
        fraudMetadataJson: commission.fraudMetadataJson,
        applicationIpAddress: commission.challengeAccount.applicationIpAddress,
        applicationUserAgent: commission.challengeAccount.applicationUserAgent,
        payment: {
          ...commission.payment,
          amount: String(commission.payment.amount),
        },
        createdAt: commission.createdAt,
        updatedAt: commission.updatedAt,
      })),
    };
  }

  async approve(input: ReviewInput) {
    const commissionId = cleanString(input.commissionId);
    const reviewerId = cleanString(input.reviewerId);
    const notes = cleanString(input.notes);

    if (!commissionId) {
      throw new BadRequestException({
        ok: false,
        reason: "commission_id_required",
      });
    }

    if (!reviewerId) {
      throw new BadRequestException({
        ok: false,
        reason: "reviewer_id_required",
      });
    }

    await this.adminGuard.assertAdminUser(reviewerId);

    const commission = await this.prisma.affiliateCommission.findUnique({
      where: { id: commissionId },
    });

    if (!commission) {
      throw new NotFoundException("affiliate_commission_not_found");
    }

    if (commission.status !== "pending") {
      throw new BadRequestException({
        ok: false,
        reason: "commission_not_pending",
        currentStatus: commission.status,
      });
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.affiliateCommission.update({
        where: { id: commission.id },
        data: {
          status: "approved",
          fraudFlag: "none",
          fraudReason: notes ?? "admin_approved_review",
          fraudCheckedAt: new Date(),
          fraudMetadataJson: {
            ...(typeof commission.fraudMetadataJson === "object" &&
            commission.fraudMetadataJson !== null &&
            !Array.isArray(commission.fraudMetadataJson)
              ? commission.fraudMetadataJson
              : {}),
            adminReview: {
              action: "approved",
              reviewerId,
              notes: notes ?? null,
              reviewedAt: new Date().toISOString(),
              previousStatus: commission.status,
              previousFraudFlag: commission.fraudFlag,
              previousFraudReason: commission.fraudReason,
            },
          },
        },
      });

      await tx.auditLog.create({
        data: {
          actorUserId: reviewerId,
          eventType: "admin_action",
          entityType: "payment",
          entityId: commission.paymentId,
          metadataJson: {
            source: "affiliate_commission_review_service",
            action: "affiliate_commission_approved",
            affiliateCommissionId: commission.id,
            affiliateId: commission.affiliateId,
            challengeAccountId: commission.challengeAccountId,
            paymentId: commission.paymentId,
            ref: commission.ref,
            amount: String(commission.amount),
            currency: commission.currency,
            previousStatus: commission.status,
            nextStatus: updated.status,
            previousFraudFlag: commission.fraudFlag,
            nextFraudFlag: updated.fraudFlag,
            notes: notes ?? null,
          },
        },
      });

      return {
        ok: true,
        commission: {
          id: updated.id,
          status: updated.status,
          fraudFlag: updated.fraudFlag,
          fraudReason: updated.fraudReason,
          amount: String(updated.amount),
          currency: updated.currency,
        },
      };
    });
  }

  async reject(input: RejectInput) {
    const commissionId = cleanString(input.commissionId);
    const reviewerId = cleanString(input.reviewerId);
    const rejectionReason = cleanString(input.rejectionReason ?? input.notes);

    if (!commissionId) {
      throw new BadRequestException({
        ok: false,
        reason: "commission_id_required",
      });
    }

    if (!reviewerId) {
      throw new BadRequestException({
        ok: false,
        reason: "reviewer_id_required",
      });
    }

    if (!rejectionReason) {
      throw new BadRequestException({
        ok: false,
        reason: "rejection_reason_required",
      });
    }

    await this.adminGuard.assertAdminUser(reviewerId);

    const commission = await this.prisma.affiliateCommission.findUnique({
      where: { id: commissionId },
    });

    if (!commission) {
      throw new NotFoundException("affiliate_commission_not_found");
    }

    if (commission.status !== "pending") {
      throw new BadRequestException({
        ok: false,
        reason: "commission_not_pending",
        currentStatus: commission.status,
      });
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.affiliateCommission.update({
        where: { id: commission.id },
        data: {
          status: "rejected",
          fraudFlag: "blocked",
          fraudReason: rejectionReason,
          fraudCheckedAt: new Date(),
          fraudMetadataJson: {
            ...(typeof commission.fraudMetadataJson === "object" &&
            commission.fraudMetadataJson !== null &&
            !Array.isArray(commission.fraudMetadataJson)
              ? commission.fraudMetadataJson
              : {}),
            adminReview: {
              action: "rejected",
              reviewerId,
              rejectionReason,
              reviewedAt: new Date().toISOString(),
              previousStatus: commission.status,
              previousFraudFlag: commission.fraudFlag,
              previousFraudReason: commission.fraudReason,
            },
          },
        },
      });

      await tx.auditLog.create({
        data: {
          actorUserId: reviewerId,
          eventType: "admin_action",
          entityType: "payment",
          entityId: commission.paymentId,
          metadataJson: {
            source: "affiliate_commission_review_service",
            action: "affiliate_commission_rejected",
            affiliateCommissionId: commission.id,
            affiliateId: commission.affiliateId,
            challengeAccountId: commission.challengeAccountId,
            paymentId: commission.paymentId,
            ref: commission.ref,
            amount: String(commission.amount),
            currency: commission.currency,
            previousStatus: commission.status,
            nextStatus: updated.status,
            previousFraudFlag: commission.fraudFlag,
            nextFraudFlag: updated.fraudFlag,
            rejectionReason,
          },
        },
      });

      return {
        ok: true,
        commission: {
          id: updated.id,
          status: updated.status,
          fraudFlag: updated.fraudFlag,
          fraudReason: updated.fraudReason,
          amount: String(updated.amount),
          currency: updated.currency,
        },
      };
    });
  }
}
