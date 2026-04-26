import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { ChallengeStatus, AuditEntityType, AuditEventType, PayoutStatus } from "../domain/enums";

type RequestPayoutInput = {
  challengeAccountId: string;
  requestedAmount?: number;
};

@Injectable()
export class PayoutRequestService {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  async requestPayout(input: RequestPayoutInput) {
    const account = await this.prisma.challengeAccount.findUnique({
      where: { id: input.challengeAccountId },
      include: {
        challenge: true,
        user: true,
      },
    });

    if (!account) {
      throw new NotFoundException("challenge_account_not_found");
    }

    if (account.status !== ChallengeStatus.PAYOUT_PENDING) {
      throw new BadRequestException({
        ok: false,
        reason: "account_not_payout_pending",
        currentStatus: account.status,
      });
    }

    if (account.dailyLossBreached || account.overallDrawdownBreached) {
      throw new BadRequestException({
        ok: false,
        reason: "account_has_rule_breach",
        dailyLossBreached: account.dailyLossBreached,
        overallDrawdownBreached: account.overallDrawdownBreached,
      });
    }

    if (account.failedAt || account.failureReason) {
      throw new BadRequestException({
        ok: false,
        reason: "account_has_failure_record",
        failedAt: account.failedAt,
        failureReason: account.failureReason,
      });
    }

    if (!account.passedAt) {
      throw new BadRequestException({
        ok: false,
        reason: "account_not_marked_passed",
      });
    }

    const currentBalance = Number(account.currentBalance);
    const initialBalance = Number(account.initialBalance);
    const profit = Math.max(0, currentBalance - initialBalance);
    const rewardAmount = Number(account.challenge.rewardAmount);
    const maxWithdrawable = Number(rewardAmount.toFixed(2));

    const requestedAmount = input.requestedAmount ?? maxWithdrawable;

    if (requestedAmount <= 0) {
      throw new BadRequestException({
        ok: false,
        reason: "invalid_requested_amount",
      });
    }

    if (requestedAmount > maxWithdrawable) {
      throw new BadRequestException({
        ok: false,
        reason: "requested_amount_exceeds_fixed_reward",
        requestedAmount,
        maxWithdrawable,
      });
    }

    return this.prisma.$transaction(async (tx) => {
      const existingOpenPayout = await tx.payoutRequest.findFirst({
        where: {
          challengeAccountId: account.id,
          status: {
            in: [
              PayoutStatus.REQUESTED,
              PayoutStatus.UNDER_REVIEW,
              PayoutStatus.APPROVED,
            ],
          },
        },
      });

      if (existingOpenPayout) {
        throw new BadRequestException({
          ok: false,
          reason: "open_payout_already_exists",
          payoutRequestId: existingOpenPayout.id,
          status: existingOpenPayout.status,
        });
      }

      const eligibilitySnapshotJson = {
        source: "payout_request_service",
        accountStatus: account.status,
        initialBalance,
        currentBalance,
        currentEquity: Number(account.currentEquity),
        profit,
        maxWithdrawable,
        requestedAmount,
        rewardAmount,
        payoutModel: "fixed_reward",
        currency: "USD",
        checkedAt: new Date().toISOString(),
      };

      const payoutRequest = await tx.payoutRequest.create({
        data: {
          challengeAccountId: account.id,
          userId: account.userId,
          requestedAmount,
          currency: "USD",
          status: PayoutStatus.REQUESTED,
          eligibilitySnapshotJson,
        },
      });

      const updatedAccount = await tx.challengeAccount.update({
        where: { id: account.id },
        data: {
          status: ChallengeStatus.PAYOUT_REQUESTED,
        },
      });

      await tx.auditLog.create({
        data: {
          actorUserId: account.userId,
          entityType: AuditEntityType.CHALLENGE_ACCOUNT,
          entityId: account.id,
          eventType: AuditEventType.PAYOUT_REQUESTED,
          metadataJson: {
            source: "payout_request_service",
            payoutRequestId: payoutRequest.id,
            requestedAmount,
            maxWithdrawable,
            rewardAmount,
            payoutModel: "fixed_reward",
            previousStatus: account.status,
            nextStatus: ChallengeStatus.PAYOUT_REQUESTED,
          },
        },
      });

      return {
        ok: true,
        payoutRequest,
        challengeAccount: updatedAccount,
      };
    });
  }
}
