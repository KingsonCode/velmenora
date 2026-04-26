import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  AuditEntityType,
  AuditEventType,
  ChallengeStatus,
} from "@prisma/client";

import { PrismaService } from "../../../prisma/prisma.service";
import { StateMachineService } from "./state-machine.service";

@Injectable()
export class ReviewDecisionService {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,

    @Inject(StateMachineService)
    private readonly stateMachine: StateMachineService,
  ) {}

  async pass(accountId: string, body: any) {
    const account = await this.prisma.challengeAccount.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new NotFoundException("Challenge account not found");
    }

    if (account.status !== ChallengeStatus.under_review) {
      throw new BadRequestException("Only under_review accounts can be passed");
    }

    const nextStatus = ChallengeStatus.passed;
    this.stateMachine.enforce(account.status, nextStatus);

    const saved = await this.prisma.$transaction(async (tx) => {
      const now = new Date();

      const updated = await tx.challengeAccount.update({
        where: { id: accountId },
        data: {
          status: nextStatus,
          passedAt: now,
          endedAt: now,
        },
      });

      await tx.auditLog.create({
        data: {
          actorUserId: body?.actorUserId ?? null,
          entityType: AuditEntityType.challenge_account,
          entityId: accountId,
          eventType: AuditEventType.challenge_passed,
          oldValuesJson: { status: account.status },
          newValuesJson: { status: nextStatus },
          metadataJson: {
            source: "review_decision_service",
            decision: "pass",
            note: body?.note ?? null,
          },
        },
      });

      return updated;
    });

    return {
      ok: true,
      challengeAccount: saved,
      decision: {
        previousStatus: account.status,
        nextStatus,
      },
    };
  }

  async fail(accountId: string, body: any) {
    const account = await this.prisma.challengeAccount.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new NotFoundException("Challenge account not found");
    }

    if (account.status !== ChallengeStatus.under_review) {
      throw new BadRequestException("Only under_review accounts can be failed");
    }

    const nextStatus = ChallengeStatus.failed;
    const failureReason = body?.reason ?? "manual_review_failed";

    this.stateMachine.enforce(account.status, nextStatus);

    const saved = await this.prisma.$transaction(async (tx) => {
      const now = new Date();

      const updated = await tx.challengeAccount.update({
        where: { id: accountId },
        data: {
          status: nextStatus,
          failedAt: now,
          endedAt: now,
          failureReason,
        },
      });

      await tx.auditLog.create({
        data: {
          actorUserId: body?.actorUserId ?? null,
          entityType: AuditEntityType.challenge_account,
          entityId: accountId,
          eventType: AuditEventType.challenge_failed,
          oldValuesJson: { status: account.status },
          newValuesJson: {
            status: nextStatus,
            failureReason,
          },
          metadataJson: {
            source: "review_decision_service",
            decision: "fail",
            reason: failureReason,
            note: body?.note ?? null,
          },
        },
      });

      return updated;
    });

    return {
      ok: true,
      challengeAccount: saved,
      decision: {
        previousStatus: account.status,
        nextStatus,
        failureReason,
      },
    };
  }
}
