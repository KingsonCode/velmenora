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
    const planSlug = input.planSlug?.trim();
    const rawRef = input.ref?.trim().toLowerCase().slice(0, 80) || null;
    let ref: string | null = null;

    const password = String(input.password || "");

    if (!email) throw new BadRequestException("Email is required");
    if (!fullName) throw new BadRequestException("fullName is required");
    if (!planSlug) throw new BadRequestException("planSlug is required");
    if (password.length < 8) {
      throw new BadRequestException("Password must be at least 8 characters");
    }

    return this.prisma.$transaction(async (tx) => {
      const challenge = await tx.fundedChallenge.findUnique({
        where: { slug: planSlug },
      });

      if (!challenge || !challenge.isActive) {
        throw new Error("Funded challenge not found or inactive");
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
          initialBalance: challenge.virtualBalance,
          dayStartBalance: challenge.virtualBalance,
          currentBalance: challenge.virtualBalance,
          currentEquity: challenge.virtualBalance,
          peakEquity: challenge.virtualBalance,
        },
      });

      const payment = await tx.payment.create({
        data: {
          userId: user.id,
          challengeAccountId: challengeAccount.id,
          provider: PaymentProvider.manual,
          amount: challenge.feeAmount,
          currency: challenge.currency,
          status: PaymentStatus.pending,
          rawPayloadJson: {
            source: "funded_apply",
            planSlug: challenge.slug,
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
