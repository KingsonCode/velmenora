"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChallengeLifecycleService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ChallengeLifecycleService {
    async apply(input) {
        const email = input.email.trim().toLowerCase();
        const fullName = input.fullName.trim();
        if (!email)
            throw new Error("Email is required");
        if (!fullName)
            throw new Error("fullName is required");
        if (!input.planSlug)
            throw new Error("planSlug is required");
        return prisma.$transaction(async (tx) => {
            const challenge = await tx.fundedChallenge.findUnique({
                where: { slug: input.planSlug },
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
                    status: client_1.ChallengeStatus.pending_payment,
                    paymentStatus: client_1.PaymentStatus.pending,
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
                    provider: client_1.PaymentProvider.manual,
                    amount: challenge.feeAmount,
                    currency: challenge.currency,
                    status: client_1.PaymentStatus.pending,
                    rawPayloadJson: {
                        source: "funded_apply",
                        planSlug: challenge.slug,
                    },
                },
            });
            await tx.auditLog.create({
                data: {
                    actorUserId: user.id,
                    entityType: client_1.AuditEntityType.challenge_account,
                    entityId: challengeAccount.id,
                    eventType: client_1.AuditEventType.user_applied,
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
exports.ChallengeLifecycleService = ChallengeLifecycleService;
//# sourceMappingURL=ChallengeLifecycleService.js.map