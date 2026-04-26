import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { AuditEntityType, AuditEventType, ChallengeStatus, PayoutStatus } from "../domain/enums";
import { AdminGuardService } from "./admin-guard.service";

type MarkPaidInput = {
  payoutRequestId: string;
  actorUserId: string;
  paymentReference?: string;
};

@Injectable()
export class PayoutExecutionService {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
    @Inject(AdminGuardService)
    private readonly adminGuard: AdminGuardService,
  ) {}

  async markPaid(input: MarkPaidInput) {
    await this.adminGuard.assertAdminUser(input.actorUserId);
    const payout = await this.prisma.payoutRequest.findUnique({
      where: { id: input.payoutRequestId },
    });

    if (!payout) {
      throw new NotFoundException("payout_request_not_found");
    }

    if (payout.status !== PayoutStatus.APPROVED) {
      throw new BadRequestException({
        ok: false,
        reason: "payout_not_approved",
        currentStatus: payout.status,
      });
    }

    return this.prisma.$transaction(async (tx) => {
      const paidAt = new Date();

      const updatedPayout = await tx.payoutRequest.update({
        where: { id: payout.id },
        data: {
          status: PayoutStatus.PAID,
          paidAt,
          reviewerId: payout.reviewerId ?? input.actorUserId,
          reviewedAt: payout.reviewedAt ?? paidAt,
        },
      });

      const updatedAccount = await tx.challengeAccount.update({
        where: { id: payout.challengeAccountId },
        data: {
          status: ChallengeStatus.PAYOUT_PAID,
        },
      });

      await tx.auditLog.create({
        data: {
          actorUserId: input.actorUserId,
          entityType: AuditEntityType.PAYOUT_REQUEST,
          entityId: payout.id,
          eventType: AuditEventType.PAYOUT_PAID,
          metadataJson: {
            source: "payout_execution_service",
            action: "payout_marked_paid",
            challengeAccountId: payout.challengeAccountId,
            requestedAmount: payout.requestedAmount,
            currency: payout.currency,
            paymentReference: input.paymentReference ?? null,
            previousPayoutStatus: payout.status,
            nextPayoutStatus: PayoutStatus.PAID,
            nextAccountStatus: ChallengeStatus.PAYOUT_PAID,
            paidAt: paidAt.toISOString(),
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
