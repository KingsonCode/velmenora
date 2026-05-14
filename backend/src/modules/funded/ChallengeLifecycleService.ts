import { BadRequestException, Injectable } from "@nestjs/common";
import {
  AuditEntityType,
  AuditEventType,
  ChallengeStatus,
  PaymentProvider,
  PaymentStatus,
} from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { hashPassword } from "../../auth/auth-utils";
import { assertNoClientPlanTampering, getFundedPlanOrThrow } from "./config/funded-plan-catalog";

type ApplyInput = {
  email: string;
  fullName: string;
  phone?: string;
  password?: string;
  planSlug: string;
  ref?: string;
  ipAddress?: string;
  userAgent?: string;
};

@Injectable()
export class ChallengeLifecycleService {
  constructor(private readonly prisma: PrismaService) {}

  async apply(input: ApplyInput) {
    const email = input.email?.trim().toLowerCase();
    const fullName = input.fullName?.trim();
    assertNoClientPlanTampering(input as unknown as Record<string, unknown>);

    const selectedPlan = getFundedPlanOrThrow(input.planSlug);
    const planSlug = selectedPlan.slug;
    const rawRef = input.ref?.trim().toLowerCase().slice(0, 80) || null;
    let ref: string | null = null;

    const password = String(input.password || "");

    if (!email) throw new BadRequestException("Email is required");
    if (!fullName) throw new BadRequestException("fullName is required");
    if (password.length < 8) {
      throw new BadRequestException("Password must be at least 8 characters");
    }

    return this.prisma.$transaction(async (tx) => {
      const challenge = await tx.fundedChallenge.findUnique({
        where: { slug: planSlug },
      });

      if (!challenge || !challenge.isActive) {
        throw new BadRequestException({
          ok: false,
          code: "FUNDED_PLAN_NOT_CONFIGURED",
          message: "Selected funded challenge plan is not configured or inactive.",
          planSlug,
        });
      }

      if (rawRef) {
        const affiliate = await tx.affiliate.findFirst({
          where: {
            slug: rawRef,
            isActive: true,
          },
          select: {
            slug: true,
          },
        });

        ref = affiliate?.slug ?? null;
      }

      const existingUser = await tx.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new BadRequestException({
          ok: false,
          reason: "account_exists_sign_in_required",
          message:
            "This email already has a Velmenora account. Sign in to continue.",
        });
      }

      const user = await tx.user.create({
        data: {
          email,
          fullName,
          phone: input.phone ?? null,
          passwordHash: await hashPassword(password),
        },
      });

      const challengeAccount = await tx.challengeAccount.create({
        data: {
          userId: user.id,
          challengeId: challenge.id,
          status: ChallengeStatus.pending_payment,
          paymentStatus: PaymentStatus.pending,
          ref,
          applicationIpAddress: input.ipAddress ?? null,
          applicationUserAgent: input.userAgent ?? null,
          initialBalance: selectedPlan.initialBalance,
          dayStartBalance: selectedPlan.initialBalance,
          currentBalance: selectedPlan.initialBalance,
          currentEquity: selectedPlan.initialBalance,
          peakEquity: selectedPlan.initialBalance,
        },
      });

      const payment = await tx.payment.create({
        data: {
          userId: user.id,
          challengeAccountId: challengeAccount.id,
          provider: PaymentProvider.manual,
          amount: selectedPlan.feeUsd,
          currency: "USD",
          status: PaymentStatus.pending,
          rawPayloadJson: {
            source: "funded_apply",
            planSlug: challenge.slug,
            lockedPlan: selectedPlan,
          },
        },
      });

      await tx.auditLog.create({
        data: {
          actorUserId: user.id,
          entityType: AuditEntityType.challenge_account,
          entityId: challengeAccount.id,
          eventType: AuditEventType.user_applied,
          newValuesJson: {
            status: challengeAccount.status,
            paymentStatus: challengeAccount.paymentStatus,
            paymentId: payment.id,
            ref,
            ipAddress: input.ipAddress ?? null,
            userAgent: input.userAgent ?? null,
          },
          metadataJson: {
            source: "POST /api/funded/apply",
            planSlug: challenge.slug,
            challengeId: challenge.id,
            lockedPlan: selectedPlan,
            ref,
            ipAddress: input.ipAddress ?? null,
            userAgent: input.userAgent ?? null,
          },
        },
      });

      return {
        ok: true,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        },
        challengeAccount: {
          id: challengeAccount.id,
          status: challengeAccount.status,
          paymentStatus: challengeAccount.paymentStatus,
          initialBalance: challengeAccount.initialBalance,
          currentBalance: challengeAccount.currentBalance,
          currentEquity: challengeAccount.currentEquity,
        },
        payment: {
          id: payment.id,
          provider: payment.provider,
          status: payment.status,
          amount: payment.amount,
          currency: payment.currency,
        },
      };
    });
  }
}
