import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { AuditEntityType, AuditEventType, ChallengeStatus, PayoutStatus } from "../domain/enums";
import { AdminGuardService } from "./admin-guard.service";

type ReviewInput = {
  payoutRequestId: string;
  reviewerId: string;
};

type RejectInput = ReviewInput & {
  rejectionReason: string;
};

@Injectable()
export class PayoutReviewService {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
    @Inject(AdminGuardService)
    private readonly adminGuard: AdminGuardService,
  ) {}

  async startReview(input: ReviewInput) {
    if (!input.reviewerId?.trim()) {
      throw new BadRequestException({
        ok: false,
        reason: "reviewer_id_required",
      });
    }

    if (!input.payoutRequestId?.trim()) {
      throw new BadRequestException({
        ok: false,
        reason: "payout_request_id_required",
      });
    }

    await this.adminGuard.assertAdminUser(input.reviewerId);
    const payout = await this.prisma.payoutRequest.findUnique({
      where: { id: input.payoutRequestId },
    });

    if (!payout) {
      throw new NotFoundException("payout_request_not_found");
    }

    if (payout.status !== PayoutStatus.REQUESTED) {
      throw new BadRequestException({
        ok: false,
        reason: "payout_not_requested",
        currentStatus: payout.status,
      });
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedPayout = await tx.payoutRequest.update({
        where: { id: payout.id },
        data: {
          status: PayoutStatus.UNDER_REVIEW,
          reviewerId: input.reviewerId,
          reviewedAt: new Date(),
        },
      });

      const updatedAccount = await tx.challengeAccount.update({
        where: { id: payout.challengeAccountId },
        data: {
          status: ChallengeStatus.PAYOUT_UNDER_REVIEW,
        },
      });

      await tx.auditLog.create({
        data: {
          actorUserId: input.reviewerId,
          entityType: AuditEntityType.PAYOUT_REQUEST,
          entityId: payout.id,
          eventType: AuditEventType.ADMIN_ACTION,
          metadataJson: {
            source: "payout_review_service",
            action: "payout_review_started",
            challengeAccountId: payout.challengeAccountId,
            previousPayoutStatus: payout.status,
            nextPayoutStatus: PayoutStatus.UNDER_REVIEW,
            nextAccountStatus: ChallengeStatus.PAYOUT_UNDER_REVIEW,
          },
        },
      });

      return {
        ok: true,
        payoutRequest: updatedPayout,
        challengeAccount: updatedAccount,
      };
    });
  }

  async approve(input: ReviewInput) {
    if (!input.reviewerId?.trim()) {
      throw new BadRequestException({
        ok: false,
        reason: "reviewer_id_required",
      });
    }

    if (!input.payoutRequestId?.trim()) {
      throw new BadRequestException({
        ok: false,
        reason: "payout_request_id_required",
      });
    }

    await this.adminGuard.assertAdminUser(input.reviewerId);
    const payout = await this.prisma.payoutRequest.findUnique({
      where: { id: input.payoutRequestId },
    });

    if (!payout) {
      throw new NotFoundException("payout_request_not_found");
    }

    if (payout.status !== PayoutStatus.UNDER_REVIEW) {
      throw new BadRequestException({
        ok: false,
        reason: "payout_not_under_review",
        currentStatus: payout.status,
      });
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedPayout = await tx.payoutRequest.update({
        where: { id: payout.id },
        data: {
          status: PayoutStatus.APPROVED,
          reviewerId: input.reviewerId,
          reviewedAt: new Date(),
        },
      });

      const updatedAccount = await tx.challengeAccount.update({
        where: { id: payout.challengeAccountId },
        data: {
          status: ChallengeStatus.PAYOUT_APPROVED,
        },
      });

      await tx.auditLog.create({
        data: {
          actorUserId: input.reviewerId,
          entityType: AuditEntityType.PAYOUT_REQUEST,
          entityId: payout.id,
          eventType: AuditEventType.PAYOUT_APPROVED,
          metadataJson: {
            source: "payout_review_service",
            challengeAccountId: payout.challengeAccountId,
            requestedAmount: payout.requestedAmount,
            previousPayoutStatus: payout.status,
            nextPayoutStatus: PayoutStatus.APPROVED,
            nextAccountStatus: ChallengeStatus.PAYOUT_APPROVED,
          },
        },
      });

      return {
        ok: true,
        payoutRequest: updatedPayout,
        challengeAccount: updatedAccount,
      };
    });
  }

  async reject(input: RejectInput) {
    if (!input.reviewerId?.trim()) {
      throw new BadRequestException({
        ok: false,
        reason: "reviewer_id_required",
      });
    }

    if (!input.payoutRequestId?.trim()) {
      throw new BadRequestException({
        ok: false,
        reason: "payout_request_id_required",
      });
    }

    if (!input.rejectionReason?.trim()) {
      throw new BadRequestException({
        ok: false,
        reason: "rejection_reason_required",
      });
    }

    await this.adminGuard.assertAdminUser(input.reviewerId);

    const payout = await this.prisma.payoutRequest.findUnique({
      where: { id: input.payoutRequestId },
    });

    if (!payout) {
      throw new NotFoundException("payout_request_not_found");
    }

    if (payout.status !== "requested" && payout.status !== "under_review") {
      throw new BadRequestException({
        ok: false,
        reason: "payout_not_rejectable",
        currentStatus: payout.status,
      });
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedPayout = await tx.payoutRequest.update({
        where: { id: payout.id },
        data: {
          status: PayoutStatus.REJECTED,
          reviewerId: input.reviewerId,
          reviewedAt: new Date(),
          rejectionReason: input.rejectionReason,
        },
      });

      const updatedAccount = await tx.challengeAccount.update({
        where: { id: payout.challengeAccountId },
        data: {
          status: ChallengeStatus.PAYOUT_REJECTED,
        },
      });

      await tx.auditLog.create({
        data: {
          actorUserId: input.reviewerId,
          entityType: AuditEntityType.PAYOUT_REQUEST,
          entityId: payout.id,
          eventType: AuditEventType.PAYOUT_REJECTED,
          metadataJson: {
            source: "payout_review_service",
            challengeAccountId: payout.challengeAccountId,
            rejectionReason: input.rejectionReason,
            previousPayoutStatus: payout.status,
            nextPayoutStatus: PayoutStatus.REJECTED,
            nextAccountStatus: ChallengeStatus.PAYOUT_REJECTED,
          },
        },
      });

      return {
        ok: true,
        payoutRequest: updatedPayout,
        challengeAccount: updatedAccount,
      };
    });
  }
}
