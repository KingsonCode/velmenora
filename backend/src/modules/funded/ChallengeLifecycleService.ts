import { Injectable } from "@nestjs/common";
import {
    AuditEntityType,
    AuditEventType,
    ChallengeStatus,
    PaymentProvider,
    PaymentStatus,
} from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";

type ApplyInput = {
    email: string;
    fullName: string;
    phone?: string;
    planSlug: string;
};

@Injectable()
export class ChallengeLifecycleService {
    constructor(private readonly prisma: PrismaService) { }

    async apply(input: ApplyInput) {
        const email = input.email?.trim().toLowerCase();
        const fullName = input.fullName?.trim();
        const planSlug = input.planSlug?.trim();

        if (!email) throw new Error("Email is required");
        if (!fullName) throw new Error("fullName is required");
        if (!planSlug) throw new Error("planSlug is required");

        return this.prisma.$transaction(async (tx) => {
            const challenge = await tx.fundedChallenge.findUnique({
                where: { slug: planSlug },
            });

            if (!challenge || !challenge.isActive) {
                throw new Error("Funded challenge not found or inactive");
            }

            const user = await tx.user.upsert({
                where: { email },
                update: {
                    fullName,
                    phone: input.phone ?? undefined,
                },
                create: {
                    email,
                    fullName,
                    phone: input.phone ?? null,
                    passwordHash: "pending_external_auth",
                },
            });

            const challengeAccount = await tx.challengeAccount.create({
                data: {
                    userId: user.id,
                    challengeId: challenge.id,
                    status: ChallengeStatus.pending_payment,
                    paymentStatus: PaymentStatus.pending,
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
                    },
                    metadataJson: {
                        source: "POST /api/funded/apply",
                        planSlug: challenge.slug,
                        challengeId: challenge.id,
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